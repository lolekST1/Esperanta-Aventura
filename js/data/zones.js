// Strefy i zadania — silnik gry jest w pełni sterowany tymi danymi.
// Nowa strefa = nowy wpis tutaj, bez zmian w kodzie silnika.
//
// Zadanie:
//   type        — "tap" (domyślnie: stuknij poprawny obiekt)
//                 "drag"     — przeciągnij poprawny obiekt NA NPC
//                              ("Donu la panon al Urso!")
//                 "sequence" — stuknij obiekty w kolejności z pola
//                              `sequence` ("Unue... poste...")
//   instruction — tekst, który mówi NPC (zawsze po esperancku)
//   objects     — obiekty na scenie: id, emoji, opcjonalnie:
//                   scale — mnożnik rozmiaru (nauka granda/malgranda)
//                   anim  — animacja: "jump" | "fly" (czasowniki ruchu)
//                   badge — mała nakładka, np. 💤 (dormanta)
//   correct     — id poprawnego obiektu (tap/drag)
//   sequence    — lista id w wymaganej kolejności (tylko type "sequence")
//   reward      — słówko odblokowywane po sukcesie (trafia do Vortaro)
//
// Umiejętność-słowo (zone.skill) — zebrane słówko odblokowuje akcję
// w świecie (np. "akvo" → podlewanie drzewka). Na scenie wisi przycisk:
// zamknięty pokazuje ❓, po nauczeniu się słowa `word` — `emoji`.
//   word / emoji     — wymagane słówko i wygląd przycisku akcji
//   before / after   — scenka przemiany (🌱 → 🌳)
//   line / praise    — co NPC mówi przy akcji i po niej
//   lockedLine       — łagodna zachęta, gdy słówko jeszcze nieznane
//   reward           — słówko-nagroda za pierwsze użycie akcji
//
// NPC mają osobowości słyszalne we frazach ORAZ w głosie (voice: rate/pitch
// dla TTS): Vulpo jest szybki i wysoki, Urso powolny i niski, Papago
// wysoki, skrzekliwy i wszystko powtarza dwa razy, Strigo mądry i spokojny,
// Kankro żywiołowy i mówi z charakterystycznym "Klik-klik!".

export const ZONES = {
  fruktejo: {
    id: "fruktejo",
    name: "Fruktejo",
    mapEmoji: "🍎",
    map: { x: 22, y: 74 },
    npc: {
      id: "vulpo",
      emoji: "🦊",
      name: "Vulpo",
      greeting: "Saluton! Mi estas Vulpo! Ni ludu kune!",
      voice: { rate: 1.05, pitch: 1.4 },
    },
    // Krótka historyjka — gra się raz, przy pierwszym wejściu do strefy,
    // zaraz po powitaniu, zanim zaczną się zadania.
    story: [
      "Mi volas fari fruktokorbon por miaj amikoj.",
      "Ĉu vi helpos min trovi fruktojn?",
    ],
    winText: "Dankon! Nun mia korbo estas plena je fruktoj!",
    // Umiejętność-słowo: "akvo" uczy się dopiero u Strigo na Monto —
    // powód, by wrócić do Fruktejo po ukończeniu wyspy.
    skill: {
      word: "akvo",
      emoji: "🪣",
      before: "🌱",
      after: "🌳",
      line: "Vi konas la vorton akvo! Akvu la arbeton!",
      praise: "Rigardu! La arbeto kreskis!",
      lockedLine: "Ŝŝŝ... tio estas sekreto. Lernu pli da vortoj!",
      reward: { word: "arbo", emoji: "🌳" },
    },
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
      {
        type: "sequence",
        instruction: "Unue tuŝu la pomon, poste la bananon!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        sequence: ["pomo", "banano"],
        reward: { word: "korbo", emoji: "🧺" },
      },
    ],
  },

  vilago: {
    id: "vilago",
    name: "Vilaĝo",
    mapEmoji: "🏡",
    map: { x: 48, y: 50 },
    npc: {
      id: "urso",
      emoji: "🐻",
      name: "Urso",
      greeting: "Saluton, kara amiko... Mi estas Urso. Bonvenon.",
      voice: { rate: 0.68, pitch: 0.6 },
    },
    story: [
      "Mi serĉas manĝaĵojn por mia hejmo...",
      "Ĉu vi helpos min trovi ilin en la vilaĝo?",
    ],
    winText: "Dankon, kara! Nun mi havas ĉion, kion mi bezonis!",
    // "ruĝa" uczy się w Fruktejo — akcja dostępna od pierwszej wizyty.
    skill: {
      word: "ruĝa",
      emoji: "🚪",
      before: "🚪",
      after: "🎁",
      line: "Vi konas la vorton ruĝa! Malfermu la ruĝan pordon!",
      praise: "La pordo malfermiĝis! Jen donaco por vi!",
      lockedLine: "Hmm... la pordo estas ŝlosita, kara. Lernu pli da vortoj.",
      reward: { word: "donaco", emoji: "🎁" },
    },
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
      {
        type: "drag",
        instruction: "Donu la panon al Urso!",
        objects: [
          { id: "pano", emoji: "🍞" },
          { id: "floro", emoji: "🌻" },
          { id: "lakto", emoji: "🥛" },
        ],
        correct: "pano",
        reward: { word: "doni", emoji: "🤲" },
      },
    ],
  },

  arbaro: {
    id: "arbaro",
    name: "Arbaro",
    mapEmoji: "🌳",
    map: { x: 75, y: 26 },
    npc: {
      id: "papago",
      emoji: "🦜",
      name: "Papago",
      greeting: "Saluton! Saluton! Mi estas Papago! Papago!",
      voice: { rate: 1.15, pitch: 1.8 },
    },
    story: [
      "La bestoj kaŝiĝis en la arbaro! Kaŝiĝis!",
      "Ni trovu ilin kune! Kune!",
    ],
    winText: "Ni trovis ĉiujn! Dankon! Dankon!",
    // "pano" uczy się w Vilaĝo — akcja dostępna od pierwszej wizyty.
    skill: {
      word: "pano",
      emoji: "🍞",
      before: "🐦",
      after: "🐦🐤🐥",
      line: "Vi konas la vorton pano! Donu panon al la birdoj! Birdoj!",
      praise: "La birdoj kantas por vi! Kantas!",
      lockedLine: "La birdoj malsatas... Lernu pli da vortoj! Pli da vortoj!",
      reward: { word: "kanti", emoji: "🎶" },
    },
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

  monto: {
    id: "monto",
    name: "Monto",
    mapEmoji: "🏔️",
    map: { x: 40, y: 30 },
    npc: {
      id: "strigo",
      emoji: "🦉",
      name: "Strigo",
      greeting: "Hu-hu! Mi estas Strigo, la saĝa birdo de la monto.",
      voice: { rate: 0.85, pitch: 0.9 },
    },
    story: [
      "Sur la monto la nokto venas, kaj mi amas enigmojn.",
      "Ĉu vi ŝatas enigmojn? Ni ludu, hu-hu!",
    ],
    winText: "Hu-hu! Vi solvis ĉiujn miajn enigmojn! Vi estas tre saĝa!",
    retryPhrases: [
      "Hu... pensu ankoraŭ!",
      "Ne tute... rigardu bone, hu-hu!",
      "Preskaŭ! Saĝulo provas denove!",
    ],
    successPhrases: ["Saĝe!", "Hu-hu! Bonege!", "Tre saĝa!", "Perfekte, hu-hu!"],
    // "flugi" uczy się w Arbaro — akcja dostępna od pierwszej wizyty.
    skill: {
      word: "flugi",
      emoji: "🪶",
      before: "🦉",
      after: "🌙🦉⭐",
      line: "Vi konas la vorton flugi! Ni flugu tra la nokta ĉielo, hu-hu!",
      praise: "Hu-hu! Ni flugas inter la steloj!",
      lockedLine: "Hu... por flugi kun mi, lernu pli da vortoj.",
      reward: { word: "ĉielo", emoji: "🌌" },
    },
    tasks: [
      {
        instruction: "Trovu la lunon!",
        objects: [
          { id: "luno", emoji: "🌙" },
          { id: "suno", emoji: "☀️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "luno",
        reward: { word: "luno", emoji: "🌙" },
      },
      {
        instruction: "Trovu la sunon!",
        objects: [
          { id: "stelo", emoji: "⭐" },
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "suno",
        reward: { word: "suno", emoji: "☀️" },
      },
      {
        instruction: "Trovu la stelon!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "nubo", emoji: "☁️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "stelo",
        reward: { word: "stelo", emoji: "⭐" },
      },
      {
        instruction: "Trovu la akvon!",
        objects: [
          { id: "akvo", emoji: "💧" },
          { id: "fajro", emoji: "🔥" },
          { id: "monto", emoji: "⛰️" },
        ],
        correct: "akvo",
        reward: { word: "akvo", emoji: "💧" },
      },
      {
        // Zagadka Strigo: opisuje cechami (granda z Vilaĝo!), nie nazwą.
        instruction: "Enigmo! Ĝi estas granda kaj alta. Trovu ĝin!",
        objects: [
          { id: "monto", emoji: "⛰️" },
          { id: "floro", emoji: "🌸" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "monto",
        reward: { word: "monto", emoji: "⛰️" },
      },
      {
        type: "drag",
        instruction: "Donu la akvon al Strigo!",
        objects: [
          { id: "akvo", emoji: "💧" },
          { id: "fajro", emoji: "🔥" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "akvo",
        reward: { word: "trinki", emoji: "🥤" },
      },
      {
        type: "sequence",
        instruction: "Unue tuŝu la sunon, poste la lunon!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        sequence: ["suno", "luno"],
        reward: { word: "nokto", emoji: "🌃" },
      },
      {
        // Zagadka: flugi z Arbaro + własny odgłos Strigo.
        instruction: "Enigmo! Ĝi flugas nokte kaj diras hu-hu. Trovu ĝin!",
        objects: [
          { id: "strigo", emoji: "🦉" },
          { id: "kuniklo", emoji: "🐰" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "strigo",
        reward: { word: "strigo", emoji: "🦉" },
      },
    ],
  },

  marbordo: {
    id: "marbordo",
    name: "Marbordo",
    mapEmoji: "🏖️",
    map: { x: 68, y: 58 },
    npc: {
      id: "kankro",
      emoji: "🦀",
      name: "Kankro",
      greeting: "Klik-klik! Mi estas Kankro! Bonvenon al la marbordo!",
      voice: { rate: 0.95, pitch: 1.3 },
    },
    story: [
      "La vetero ĉi tie ŝanĝiĝas ĉiutage — kaj mi sentas ĉion!",
      "Ĉu vi helpos min kompreni la veteron kaj miajn sentojn?",
    ],
    winText: "Klik-klik! Dankon! Nun mi komprenas la tutan veteron... kaj min mem!",
    retryPhrases: [
      "Klik... provu denove!",
      "Ne tute... provu ankoraŭ, amiko!",
      "Preskaŭ! Rigardu bone!",
    ],
    successPhrases: ["Klik-klik! Bonege!", "Perfekte!", "Hura, vi faris!", "Tre bone, amiko!"],
    // "nokto" uczy się w Monto (nagroda za sekwencję) — akcja dostępna od pierwszej wizyty.
    skill: {
      word: "nokto",
      emoji: "🔭",
      before: "🏖️",
      after: "🌌✨",
      line: "Vi konas la vorton nokto! Rigardu la ĉielon super la maro!",
      praise: "Klik-klik! Kiom da steloj super la maro!",
      lockedLine: "Klik... tio estas sekreto por poste. Lernu pli da vortoj!",
      reward: { word: "maro", emoji: "🌊" },
    },
    tasks: [
      {
        instruction: "Trovu la pluvon!",
        objects: [
          { id: "pluvo", emoji: "🌧️" },
          { id: "suno", emoji: "☀️" },
          { id: "nubo", emoji: "☁️" },
        ],
        correct: "pluvo",
        reward: { word: "pluvo", emoji: "🌧️" },
      },
      {
        instruction: "Trovu la venton!",
        objects: [
          { id: "vento", emoji: "💨" },
          { id: "nubo", emoji: "☁️" },
          { id: "pluvo", emoji: "🌧️" },
        ],
        correct: "vento",
        reward: { word: "vento", emoji: "💨" },
      },
      {
        instruction: "Trovu la nubon!",
        objects: [
          { id: "nubo", emoji: "☁️" },
          { id: "vento", emoji: "💨" },
          { id: "suno", emoji: "☀️" },
        ],
        correct: "nubo",
        reward: { word: "nubo", emoji: "☁️" },
      },
      {
        instruction: "Trovu la ĉielarkon!",
        objects: [
          { id: "cielarko", emoji: "🌈" },
          { id: "nubo", emoji: "☁️" },
          { id: "pluvo", emoji: "🌧️" },
        ],
        correct: "cielarko",
        reward: { word: "ĉielarko", emoji: "🌈" },
      },
      {
        instruction: "Tuŝu la feliĉan vizaĝon!",
        objects: [
          { id: "felica", emoji: "😊" },
          { id: "trista", emoji: "😢" },
          { id: "timigita", emoji: "😱" },
        ],
        correct: "felica",
        reward: { word: "feliĉa", emoji: "😊" },
      },
      {
        instruction: "Tuŝu la tristan vizaĝon!",
        objects: [
          { id: "timigita", emoji: "😱" },
          { id: "felica", emoji: "😊" },
          { id: "trista", emoji: "😢" },
        ],
        correct: "trista",
        reward: { word: "trista", emoji: "😢" },
      },
      {
        type: "drag",
        instruction: "Donu la ĉielarkon al Kankro!",
        objects: [
          { id: "cielarko", emoji: "🌈" },
          { id: "nubo", emoji: "☁️" },
          { id: "vento", emoji: "💨" },
        ],
        correct: "cielarko",
        reward: { word: "helpi", emoji: "🤝" },
      },
      {
        type: "sequence",
        instruction: "Unue tuŝu la sunon, poste la pluvon!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "pluvo", emoji: "🌧️" },
          { id: "vento", emoji: "💨" },
        ],
        sequence: ["suno", "pluvo"],
        reward: { word: "vetero", emoji: "🌤️" },
      },
    ],
  },
};

// Kolejność na mapie = kolejność odblokowywania (ukończ strefę,
// by otworzyć następną).
export const ZONE_ORDER = ["fruktejo", "vilago", "arbaro", "monto", "marbordo"];
