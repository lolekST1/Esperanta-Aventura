// Generuje lektorskie nagrania mp3 (OpenAI TTS) dla wszystkich fraz NPC,
// słówek-nagród i tekstów narratora w grze — jednorazowo/offline, zgodnie
// z Fazą 2 roadmapy w README ("nagrania lektorskie zamiast TTS").
//
// Uruchomienie:
//   OPENAI_API_KEY=sk-... node scripts/generate-tts.mjs
//
// Efekt:
//   - pliki mp3 w assets/audio/<id-głosu>/<slug>.mp3
//   - js/data/audioManifest.js — mapa (id głosu)::(dokładny tekst) → plik,
//     wczytywana przez js/audio.js w przeglądarce
//   - assets/audio/manifest.json — płaska lista plików, do precache w sw.js
//
// Uruchamiać ponownie po KAŻDEJ zmianie fraz w js/data/zones.js,
// js/data/story.js albo listy NARRATOR_LINES niżej — skrypt generuje
// tylko brakujące pliki (już istniejące na dysku pomija), więc kolejne
// uruchomienia są tanie.

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ZONES, ZONE_ORDER } from "../js/data/zones.js";
import { STORY } from "../js/data/story.js";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const AUDIO_DIR = path.join(ROOT, "assets", "audio");
const MANIFEST_JS = path.join(ROOT, "js", "data", "audioManifest.js");
const MANIFEST_JSON = path.join(AUDIO_DIR, "manifest.json");

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error("Brak OPENAI_API_KEY w środowisku.");
  process.exit(1);
}

// Narratorskie linie żyją jako literały w main.js/map.js/story.js, a nie
// w danych — jest ich mało, więc wypisane tu ręcznie. Trzymać w zgodzie
// z faktycznym tekstem w kodzie (grep "speak(" pokaże wszystkie miejsca).
const NARRATOR_LINES = [
  "Vi esploris la tutan Esperantion! Ĉiuj estas dankemaj al vi!", // main.js — świętowanie wyspy
  "Ankoraŭ ne! Unue finu la alian lokon!", // map.js — zablokowana strefa
  "Kiu vi estas? Elektu!", // story.js — wybór awatara
  "Bonege! Ek al la aventuro!", // story.js — po wyborze awatara
];

// --- Głosy przypisane bohaterom (wszystkie sprawdzone ręcznie na próbkach
// "Trovu la sciuron!" z pełną instrukcją wymowy niżej — dobre: marin, nova,
// sage, coral; ZAKAZANE: shimmer, cedar, verse). ---
const VOICES = {
  vulpo: { voice: "nova", speed: 1.05, persona: "A quick, clever, playful fox, energetic and a little mischievous." },
  urso: { voice: "sage", speed: 0.8, persona: "A slow, gentle, warm bear, speaking calmly and affectionately." },
  papago: { voice: "coral", speed: 1.15, persona: "A chatty, high-pitched parrot that repeats things twice, cheerful and squawky." },
  narrator: { voice: "marin", speed: 0.95, persona: "A warm, friendly storyteller narrating a children's fairy tale calmly and clearly." },
  vocab: { voice: "marin", speed: 0.75, persona: "Clear, calm, deliberate pronunciation of a single vocabulary word for a child learning the language — slow and precise, like a patient teacher." },
};

const PRONUNCIATION_RULES = `You are reading text written in Esperanto.

Follow official Esperanto pronunciation strictly.

General rules:

* Pronounce every letter consistently according to Esperanto phonetics.
* Every letter always has exactly one sound.
* Stress always falls on the penultimate syllable.
* Never apply English, Polish, Italian, Spanish, French or other language pronunciation rules.
* Read naturally but articulate clearly, as if teaching beginners.

Consonants:

* c = "ts" (as in "cats")
* ĉ = "ch" (as in "church")
* ĝ = "j" (as in "judge")
* ĥ = voiceless velar fricative (similar to the "ch" in German "Bach")
* ĵ = "s" in "measure"
* ŝ = "sh"
* j = consonantal "y"
* ŭ = "w"-like glide, only in diphthongs (aŭ, eŭ)

Important consonant clusters:

* Pronounce every consonant separately.
* Never merge or soften consonant clusters.
* The sequence "sc" is ALWAYS pronounced as "s" followed by "c" ("sts"), never as "sh", "sj", "sch" or any similar sound.
* Examples:

  * sciuro → s-tsiuro
  * scio → s-tsio
  * scias → s-tsias
  * scienco → s-tsienco

Reading style:

* Speak slowly.
* Articulate each consonant clearly.
* Make short natural pauses after commas and full stops.
* Use a warm, friendly language teacher voice.
* Prioritize pronunciation accuracy over conversational speed.

If a word contains an unusual consonant cluster, pronounce each consonant individually rather than simplifying it.`;

// Rozbija trudne skupiska spółgłosek myślnikiem, żeby model nie zlewał
// ich w jeden obcy dźwięk (np. "sciuro" czytane jak angielskie "sh...").
// Działa WYŁĄCZNIE na tekst wysyłany do OpenAI — manifest w audio.js
// wciąż jest kluczowany oryginalnym tekstem z zones.js.
function preprocessEsperantoForTTS(text) {
  return text
    .replace(/SC/g, "S-TS")
    .replace(/Sc/g, "S-ts")
    .replace(/sc/g, "s-ts")
    .replace(/kn/g, "k-n")
    .replace(/Kn/g, "K-n")
    .replace(/gn/g, "g-n")
    .replace(/Gn/g, "G-n")
    .replace(/pn/g, "p-n")
    .replace(/Pn/g, "P-n")
    .replace(/ps/g, "p-s")
    .replace(/Ps/g, "P-s")
    .replace(/mn/g, "m-n")
    .replace(/Mn/g, "M-n")
    // W esperanto każda samogłoska jest osobną sylabą — nie ma dyftongów.
    // Model bywa skłonny czytać "io"/"iu" na końcu słowa jak angielski
    // sufiks ("papilio" → "papilyo"), więc wymuszamy rozdział myślnikiem
    // (ta sama reguła co dla polskiego głosu fallbackowego w audio.js).
    .replace(/i([aeou])/gi, "i-$1");
}

const ESPERANTO_ASCII = {
  ĉ: "c", Ĉ: "C", ĝ: "g", Ĝ: "G", ĥ: "h", Ĥ: "H",
  ĵ: "j", Ĵ: "J", ŝ: "s", Ŝ: "S", ŭ: "u", Ŭ: "U",
};

function slugify(text) {
  const ascii = text.replace(/[ĉĈĝĜĥĤĵĴŝŜŭŬ]/g, (ch) => ESPERANTO_ASCII[ch] ?? ch);
  const slug = ascii
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const hash = createHash("sha1").update(text).digest("hex").slice(0, 8);
  return `${slug || "x"}-${hash}`;
}

// --- Zbieranie wszystkich fraz z danych gry ---

function collectEntries() {
  const entries = new Map(); // key `${id}::${text}` -> { id, text }

  const add = (id, text) => {
    if (!text) return;
    const key = `${id}::${text}`;
    if (!entries.has(key)) entries.set(key, { id, text });
  };

  for (const zoneId of ZONE_ORDER) {
    const zone = ZONES[zoneId];
    const npcId = zone.npc.id;
    add(npcId, zone.npc.greeting);
    for (const line of zone.story ?? []) add(npcId, line);
    for (const task of zone.tasks) {
      add(npcId, task.instruction);
      add("vocab", task.reward.word);
    }
    for (const phrase of zone.retryPhrases) add(npcId, phrase);
    for (const phrase of zone.successPhrases) add(npcId, phrase);
    add(npcId, `Bonege! ${zone.winText}`);
  }

  for (const slide of STORY) add(slide.voice?.id ?? "narrator", slide.text);
  for (const line of NARRATOR_LINES) add("narrator", line);

  return [...entries.values()];
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function ttsRequest(body, attempt = 1) {
  const res = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.ok) return Buffer.from(await res.arrayBuffer());
  if (res.status === 429 && attempt < 4) {
    const wait = 1000 * 2 ** attempt;
    console.warn(`  rate limited, czekam ${wait}ms...`);
    await new Promise((r) => setTimeout(r, wait));
    return ttsRequest(body, attempt + 1);
  }
  throw new Error(`OpenAI TTS ${res.status}: ${await res.text()}`);
}

async function generateFile(voiceCfg, text, outPath) {
  const instructions = `${PRONUNCIATION_RULES}\n\nCharacter voice: ${voiceCfg.persona}`;
  const audio = await ttsRequest({
    model: "gpt-4o-mini-tts",
    voice: voiceCfg.voice,
    input: preprocessEsperantoForTTS(text),
    instructions,
    speed: voiceCfg.speed,
  });
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, audio);
}

async function generateUnlockFile() {
  const outPath = path.join(AUDIO_DIR, "_unlock.mp3");
  if (await exists(outPath)) return;
  console.log("Generuję assets/audio/_unlock.mp3 (odblokowanie <audio> na telefonach)...");
  const audio = await ttsRequest({
    model: "gpt-4o-mini-tts",
    voice: "marin",
    input: ".",
  });
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, audio);
}

async function main() {
  const entries = collectEntries();
  console.log(`Zebrano ${entries.length} unikalnych fraz do wygenerowania.`);

  await generateUnlockFile();

  const manifest = {};
  let generated = 0;
  let skipped = 0;

  for (const { id, text } of entries) {
    const voiceCfg = VOICES[id];
    if (!voiceCfg) {
      console.warn(`Brak konfiguracji głosu dla id="${id}" (tekst: "${text}") — pomijam.`);
      continue;
    }
    const relPath = path.join("assets", "audio", id, `${slugify(text)}.mp3`);
    const outPath = path.join(ROOT, relPath);
    manifest[`${id}::${text}`] = relPath.split(path.sep).join("/");

    if (await exists(outPath)) {
      skipped++;
      continue;
    }
    process.stdout.write(`Generuję [${id}] "${text}"... `);
    try {
      await generateFile(voiceCfg, text, outPath);
      generated++;
      console.log("OK");
    } catch (err) {
      console.log("BŁĄD");
      console.error(err.message);
    }
  }

  const manifestJsSrc = `// Mapa (id głosu)::(dokładny tekst) → ścieżka do nagranego mp3.
// Generowane automatycznie przez scripts/generate-tts.mjs — NIE edytować
// ręcznie, uruchom skrypt ponownie po zmianie fraz w zones.js/story.js.
export const AUDIO_MANIFEST = ${JSON.stringify(manifest, null, 2)};
`;
  await writeFile(MANIFEST_JS, manifestJsSrc);

  const flatList = [
    "assets/audio/_unlock.mp3",
    ...Object.values(manifest),
  ];
  await writeFile(MANIFEST_JSON, JSON.stringify(flatList, null, 2));

  console.log(`\nGotowe: ${generated} nowych plików, ${skipped} już istniało, ${entries.length} fraz w manifeście.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
