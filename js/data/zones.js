// Strefy i zadania — silnik gry jest w pełni sterowany tymi danymi.
// Nowa strefa = nowy wpis tutaj, bez zmian w kodzie silnika.
//
// Zadanie:
//   instruction — tekst, który mówi NPC (zawsze po esperancku)
//   objects     — obiekty na scenie: id, emoji, opcjonalnie:
//                   scale — mnożnik rozmiaru (nauka granda/malgranda)
//                   anim  — animacja: "jump" | "fly" (czasowniki ruchu)
//                   badge — mała nakładka, np. 💤 (dormanta)
//   correct     — id poprawnego obiektu
//   reward      — słówko odblokowywane po sukcesie (trafia do Vortaro)
//
// NPC mają osobowości słyszalne we frazach ORAZ w głosie (voice: rate/pitch
// dla TTS): Vulpo jest szybki i wysoki, Urso powolny i niski, Papago
// wysoki, skrzekliwy i wszystko powtarza dwa razy.

export const ZONES = {
  fruktejo: {
    id: "fruktejo",
    name: "Fruktejo",
    mapEmoji: "🍎",
    npc: {
      id: "vulpo",
      emoji: "🦊",
      name: "Vulpo",
      greeting: "Saluton! Mi estas Vulpo! Ni ludu kune!",
      voice: { rate: 1.05, pitch: 1.4 },
    },
    winText: "Vi trovis ĉiujn fruktojn!",
    retryPhrases: [
      "Hmm... provu denove!",
      "Ne tute! Provu ankoraŭ!",
      "Preskaŭ! Rigardu bone!",
    ],
    successPhrases: ["Bonege!", "Tre bone!", "Perfekte!", "Hura!"],
    tasks: [
      {
        instruction: "Trovu la pomon!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "pomo",
        reward: { word: "pomo", emoji: "🍎" },
      },
      {
        instruction: "Trovu la bananon!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "banano",
        reward: { word: "banano", emoji: "🍌" },
      },
      {
        instruction: "Trovu la piron!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "piro",
        reward: { word: "piro", emoji: "🍐" },
      },
      {
        instruction: "Tuŝu la ruĝan frukton!",
        objects: [
          { id: "banano", emoji: "🍌" },
          { id: "pomo", emoji: "🍎" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "pomo",
        reward: { word: "ruĝa", emoji: "🔴" },
      },
      {
        instruction: "Tuŝu la flavan frukton!",
        objects: [
          { id: "piro", emoji: "🍐" },
          { id: "banano", emoji: "🍌" },
          { id: "pomo", emoji: "🍎" },
        ],
        correct: "banano",
        reward: { word: "flava", emoji: "🟡" },
      },
      {
        instruction: "Tuŝu la verdan frukton!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "piro", emoji: "🍐" },
          { id: "banano", emoji: "🍌" },
        ],
        correct: "piro",
        reward: { word: "verda", emoji: "🟢" },
      },
    ],
  },

  vilago: {
    id: "vilago",
    name: "Vilaĝo",
    mapEmoji: "🏡",
    npc: {
      id: "urso",
      emoji: "🐻",
      name: "Urso",
      greeting: "Saluton, kara amiko... Mi estas Urso. Bonvenon.",
      voice: { rate: 0.68, pitch: 0.6 },
    },
    winText: "Vi konas la vilaĝon!",
    retryPhrases: [
      "Hmm... provu denove, kara.",
      "Ne tute... trankvile, provu ankoraŭ!",
      "Preskaŭ, amiko... rigardu bone!",
    ],
    successPhrases: ["Tre bone, kara!", "Bonege!", "Mmm... perfekte!", "Brave, amiko!"],
    tasks: [
      {
        instruction: "Trovu la domon!",
        objects: [
          { id: "domo", emoji: "🏠" },
          { id: "arbo", emoji: "🌳" },
          { id: "floro", emoji: "🌻" },
        ],
        correct: "domo",
        reward: { word: "domo", emoji: "🏠" },
      },
      {
        instruction: "Trovu la pordon!",
        objects: [
          { id: "domo", emoji: "🏠" },
          { id: "pordo", emoji: "🚪" },
          { id: "fenestro", emoji: "🪟" },
        ],
        correct: "pordo",
        reward: { word: "pordo", emoji: "🚪" },
      },
      {
        instruction: "Trovu la fenestron!",
        objects: [
          { id: "pordo", emoji: "🚪" },
          { id: "fenestro", emoji: "🪟" },
          { id: "domo", emoji: "🏠" },
        ],
        correct: "fenestro",
        reward: { word: "fenestro", emoji: "🪟" },
      },
      {
        instruction: "Trovu la panon!",
        objects: [
          { id: "pano", emoji: "🍞" },
          { id: "lakto", emoji: "🥛" },
          { id: "kuko", emoji: "🍰" },
        ],
        correct: "pano",
        reward: { word: "pano", emoji: "🍞" },
      },
      {
        instruction: "Trovu la lakton!",
        objects: [
          { id: "kuko", emoji: "🍰" },
          { id: "pano", emoji: "🍞" },
          { id: "lakto", emoji: "🥛" },
        ],
        correct: "lakto",
        reward: { word: "lakto", emoji: "🥛" },
      },
      {
        instruction: "Trovu la kukon!",
        objects: [
          { id: "lakto", emoji: "🥛" },
          { id: "kuko", emoji: "🍰" },
          { id: "pano", emoji: "🍞" },
        ],
        correct: "kuko",
        reward: { word: "kuko", emoji: "🍰" },
      },
      {
        instruction: "Tuŝu la grandan domon!",
        objects: [
          { id: "granda-domo", emoji: "🏠", scale: 1.35 },
          { id: "eta-domo", emoji: "🏠", scale: 0.6 },
        ],
        correct: "granda-domo",
        reward: { word: "granda", emoji: "🐘" },
      },
      {
        instruction: "Tuŝu la malgrandan panon!",
        objects: [
          { id: "granda-pano", emoji: "🍞", scale: 1.35 },
          { id: "eta-pano", emoji: "🍞", scale: 0.6 },
        ],
        correct: "eta-pano",
        reward: { word: "malgranda", emoji: "🐭" },
      },
    ],
  },

  arbaro: {
    id: "arbaro",
    name: "Arbaro",
    mapEmoji: "🌳",
    npc: {
      id: "papago",
      emoji: "🦜",
      name: "Papago",
      greeting: "Saluton! Saluton! Mi estas Papago! Papago!",
      voice: { rate: 1.15, pitch: 1.8 },
    },
    winText: "Vi konas la arbaron!",
    retryPhrases: [
      "Provu denove! Provu denove!",
      "Ne, ne! Ankoraŭ! Ankoraŭ!",
      "Rigardu! Rigardu bone!",
    ],
    successPhrases: ["Brave! Brave!", "Bonege! Bonege!", "Hura! Hura!", "Perfekte! Perfekte!"],
    tasks: [
      {
        instruction: "Trovu la kuniklon!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "birdo", emoji: "🐦" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "kuniklo",
        reward: { word: "kuniklo", emoji: "🐰" },
      },
      {
        instruction: "Trovu la birdon!",
        objects: [
          { id: "rano", emoji: "🐸" },
          { id: "birdo", emoji: "🐦" },
          { id: "kuniklo", emoji: "🐰" },
        ],
        correct: "birdo",
        reward: { word: "birdo", emoji: "🐦" },
      },
      {
        instruction: "Trovu la ranon!",
        objects: [
          { id: "birdo", emoji: "🐦" },
          { id: "kuniklo", emoji: "🐰" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "rano",
        reward: { word: "rano", emoji: "🐸" },
      },
      {
        instruction: "Trovu la sciuron!",
        objects: [
          { id: "sciuro", emoji: "🐿️" },
          { id: "papilio", emoji: "🦋" },
          { id: "kuniklo", emoji: "🐰" },
        ],
        correct: "sciuro",
        reward: { word: "sciuro", emoji: "🐿️" },
      },
      {
        instruction: "Trovu la papilion!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "sciuro", emoji: "🐿️" },
          { id: "papilio", emoji: "🦋" },
        ],
        correct: "papilio",
        reward: { word: "papilio", emoji: "🦋" },
      },
      {
        instruction: "Tuŝu la saltantan beston!",
        objects: [
          { id: "saltanta", emoji: "🐰", anim: "jump" },
          { id: "birdo", emoji: "🐦" },
          { id: "sciuro", emoji: "🐿️" },
        ],
        correct: "saltanta",
        reward: { word: "salti", emoji: "🦘" },
      },
      {
        instruction: "Tuŝu la flugantan beston!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "fluganta", emoji: "🐦", anim: "fly" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "fluganta",
        reward: { word: "flugi", emoji: "🕊️" },
      },
      {
        instruction: "Tuŝu la dormantan beston!",
        objects: [
          { id: "saltanta", emoji: "🐰", anim: "jump" },
          { id: "dormanta", emoji: "🐿️", badge: "💤" },
          { id: "fluganta", emoji: "🐦", anim: "fly" },
        ],
        correct: "dormanta",
        reward: { word: "dormi", emoji: "😴" },
      },
    ],
  },
};

// Kolejność na mapie = kolejność odblokowywania (ukończ strefę,
// by otworzyć następną).
export const ZONE_ORDER = ["fruktejo", "vilago", "arbaro"];
