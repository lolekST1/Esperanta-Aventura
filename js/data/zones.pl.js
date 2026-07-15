// Polska wersja treści gry — ta sama struktura co zones.js (id/emoji/scale/
// anim/badge/sequence bez zmian, bo silnik i grafika ich używają), tylko
// teksty (nazwy, kwestie, słówka-nagrody) przetłumaczone na polski.
// Zobacz zones.js po pełny opis struktury danych.

export const ZONES = {
  fruktejo: {
    id: "fruktejo",
    name: "Sad",
    mapEmoji: "🍎",
    map: { x: 22, y: 74 },
    npc: {
      id: "vulpo",
      emoji: "🦊",
      name: "Lis",
      greeting: "Cześć! Jestem Lis! Pobawmy się razem!",
      voice: { rate: 1.05, pitch: 1.4 },
    },
    story: [
      "Chcę zrobić koszyk owoców dla moich przyjaciół.",
      "Czy pomożesz mi znaleźć owoce?",
    ],
    winText: "Dziękuję! Teraz mój koszyk jest pełen owoców!",
    skill: {
      word: "woda",
      emoji: "🪣",
      before: "🌱",
      after: "🌳",
      line: "Znasz słowo woda! Podlej drzewko!",
      praise: "Patrz! Drzewko urosło!",
      lockedLine: "Ciii... to sekret. Naucz się więcej słówek!",
      reward: { word: "drzewo", emoji: "🌳" },
    },
    retryPhrases: [
      "Hmm... spróbuj jeszcze raz!",
      "Nie do końca! Spróbuj ponownie!",
      "Prawie! Popatrz dobrze!",
    ],
    successPhrases: ["Świetnie!", "Bardzo dobrze!", "Perfekcyjnie!", "Hura!"],
    tasks: [
      {
        instruction: "Znajdź jabłko!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "pomo",
        reward: { word: "jabłko", emoji: "🍎" },
      },
      {
        instruction: "Znajdź banana!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "banano",
        reward: { word: "banan", emoji: "🍌" },
      },
      {
        instruction: "Znajdź gruszkę!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "piro",
        reward: { word: "gruszka", emoji: "🍐" },
      },
      {
        instruction: "Dotknij czerwonego owocu!",
        objects: [
          { id: "banano", emoji: "🍌" },
          { id: "pomo", emoji: "🍎" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "pomo",
        reward: { word: "czerwony", emoji: "🔴" },
      },
      {
        instruction: "Dotknij żółtego owocu!",
        objects: [
          { id: "piro", emoji: "🍐" },
          { id: "banano", emoji: "🍌" },
          { id: "pomo", emoji: "🍎" },
        ],
        correct: "banano",
        reward: { word: "żółty", emoji: "🟡" },
      },
      {
        instruction: "Dotknij zielonego owocu!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "piro", emoji: "🍐" },
          { id: "banano", emoji: "🍌" },
        ],
        correct: "piro",
        reward: { word: "zielony", emoji: "🟢" },
      },
      {
        type: "sequence",
        instruction: "Najpierw dotknij jabłka, potem banana!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        sequence: ["pomo", "banano"],
        reward: { word: "koszyk", emoji: "🧺" },
      },
    ],
  },

  vilago: {
    id: "vilago",
    name: "Wioska",
    mapEmoji: "🏡",
    map: { x: 48, y: 50 },
    npc: {
      id: "urso",
      emoji: "🐻",
      name: "Miś",
      greeting: "Cześć, drogi przyjacielu... Jestem Miś. Witaj.",
      voice: { rate: 0.68, pitch: 0.6 },
    },
    story: [
      "Szukam jedzenia do mojego domu...",
      "Czy pomożesz mi znaleźć je w wiosce?",
    ],
    winText: "Dziękuję, kochanie! Teraz mam wszystko, czego potrzebowałem!",
    skill: {
      word: "czerwony",
      emoji: "🚪",
      before: "🚪",
      after: "🎁",
      line: "Znasz słowo czerwony! Otwórz czerwone drzwi!",
      praise: "Drzwi się otworzyły! Oto prezent dla ciebie!",
      lockedLine: "Hmm... drzwi są zamknięte, kochanie. Naucz się więcej słówek.",
      reward: { word: "prezent", emoji: "🎁" },
    },
    retryPhrases: [
      "Hmm... spróbuj jeszcze raz, kochanie.",
      "Nie do końca... spokojnie, spróbuj ponownie!",
      "Prawie, przyjacielu... popatrz dobrze!",
    ],
    successPhrases: ["Bardzo dobrze, kochanie!", "Świetnie!", "Mmm... perfekcyjnie!", "Brawo, przyjacielu!"],
    tasks: [
      {
        instruction: "Znajdź dom!",
        objects: [
          { id: "domo", emoji: "🏠" },
          { id: "arbo", emoji: "🌳" },
          { id: "floro", emoji: "🌻" },
        ],
        correct: "domo",
        reward: { word: "dom", emoji: "🏠" },
      },
      {
        instruction: "Znajdź drzwi!",
        objects: [
          { id: "domo", emoji: "🏠" },
          { id: "pordo", emoji: "🚪" },
          { id: "fenestro", emoji: "🪟" },
        ],
        correct: "pordo",
        reward: { word: "drzwi", emoji: "🚪" },
      },
      {
        instruction: "Znajdź okno!",
        objects: [
          { id: "pordo", emoji: "🚪" },
          { id: "fenestro", emoji: "🪟" },
          { id: "domo", emoji: "🏠" },
        ],
        correct: "fenestro",
        reward: { word: "okno", emoji: "🪟" },
      },
      {
        instruction: "Znajdź chleb!",
        objects: [
          { id: "pano", emoji: "🍞" },
          { id: "lakto", emoji: "🥛" },
          { id: "kuko", emoji: "🍰" },
        ],
        correct: "pano",
        reward: { word: "chleb", emoji: "🍞" },
      },
      {
        instruction: "Znajdź mleko!",
        objects: [
          { id: "kuko", emoji: "🍰" },
          { id: "pano", emoji: "🍞" },
          { id: "lakto", emoji: "🥛" },
        ],
        correct: "lakto",
        reward: { word: "mleko", emoji: "🥛" },
      },
      {
        instruction: "Znajdź ciastko!",
        objects: [
          { id: "lakto", emoji: "🥛" },
          { id: "kuko", emoji: "🍰" },
          { id: "pano", emoji: "🍞" },
        ],
        correct: "kuko",
        reward: { word: "ciastko", emoji: "🍰" },
      },
      {
        instruction: "Dotknij dużego domu!",
        objects: [
          { id: "granda-domo", emoji: "🏠", scale: 1.35 },
          { id: "eta-domo", emoji: "🏠", scale: 0.6 },
        ],
        correct: "granda-domo",
        reward: { word: "duży", emoji: "🐘" },
      },
      {
        instruction: "Dotknij małego chleba!",
        objects: [
          { id: "granda-pano", emoji: "🍞", scale: 1.35 },
          { id: "eta-pano", emoji: "🍞", scale: 0.6 },
        ],
        correct: "eta-pano",
        reward: { word: "mały", emoji: "🐭" },
      },
      {
        type: "drag",
        instruction: "Daj chleb Misiowi!",
        objects: [
          { id: "pano", emoji: "🍞" },
          { id: "floro", emoji: "🌻" },
          { id: "lakto", emoji: "🥛" },
        ],
        correct: "pano",
        reward: { word: "dawać", emoji: "🤲" },
      },
    ],
  },

  arbaro: {
    id: "arbaro",
    name: "Las",
    mapEmoji: "🌳",
    map: { x: 75, y: 26 },
    npc: {
      id: "papago",
      emoji: "🦜",
      name: "Papuga",
      greeting: "Cześć! Cześć! Jestem Papuga! Papuga!",
      voice: { rate: 1.15, pitch: 1.8 },
    },
    story: [
      "Zwierzęta schowały się w lesie! Schowały się!",
      "Znajdźmy je razem! Razem!",
    ],
    winText: "Znaleźliśmy wszystkie! Dziękuję! Dziękuję!",
    skill: {
      word: "chleb",
      emoji: "🍞",
      before: "🐦",
      after: "🐦🐤🐥",
      line: "Znasz słowo chleb! Daj chleb ptakom! Ptakom!",
      praise: "Ptaki śpiewają dla ciebie! Śpiewają!",
      lockedLine: "Ptaki są głodne... Naucz się więcej słówek! Więcej słówek!",
      reward: { word: "śpiewać", emoji: "🎶" },
    },
    retryPhrases: [
      "Spróbuj jeszcze raz! Spróbuj jeszcze raz!",
      "Nie, nie! Jeszcze! Jeszcze!",
      "Patrz! Patrz dobrze!",
    ],
    successPhrases: ["Brawo! Brawo!", "Świetnie! Świetnie!", "Hura! Hura!", "Perfekcyjnie! Perfekcyjnie!"],
    tasks: [
      {
        instruction: "Znajdź królika!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "birdo", emoji: "🐦" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "kuniklo",
        reward: { word: "królik", emoji: "🐰" },
      },
      {
        instruction: "Znajdź ptaka!",
        objects: [
          { id: "rano", emoji: "🐸" },
          { id: "birdo", emoji: "🐦" },
          { id: "kuniklo", emoji: "🐰" },
        ],
        correct: "birdo",
        reward: { word: "ptak", emoji: "🐦" },
      },
      {
        instruction: "Znajdź żabę!",
        objects: [
          { id: "birdo", emoji: "🐦" },
          { id: "kuniklo", emoji: "🐰" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "rano",
        reward: { word: "żaba", emoji: "🐸" },
      },
      {
        instruction: "Znajdź wiewiórkę!",
        objects: [
          { id: "sciuro", emoji: "🐿️" },
          { id: "papilio", emoji: "🦋" },
          { id: "kuniklo", emoji: "🐰" },
        ],
        correct: "sciuro",
        reward: { word: "wiewiórka", emoji: "🐿️" },
      },
      {
        instruction: "Znajdź motyla!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "sciuro", emoji: "🐿️" },
          { id: "papilio", emoji: "🦋" },
        ],
        correct: "papilio",
        reward: { word: "motyl", emoji: "🦋" },
      },
      {
        instruction: "Dotknij skaczącego zwierzęcia!",
        objects: [
          { id: "saltanta", emoji: "🐰", anim: "jump" },
          { id: "birdo", emoji: "🐦" },
          { id: "sciuro", emoji: "🐿️" },
        ],
        correct: "saltanta",
        reward: { word: "skakać", emoji: "🦘" },
      },
      {
        instruction: "Dotknij latającego zwierzęcia!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "fluganta", emoji: "🐦", anim: "fly" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "fluganta",
        reward: { word: "latać", emoji: "🕊️" },
      },
      {
        instruction: "Dotknij śpiącego zwierzęcia!",
        objects: [
          { id: "saltanta", emoji: "🐰", anim: "jump" },
          { id: "dormanta", emoji: "🐿️", badge: "💤" },
          { id: "fluganta", emoji: "🐦", anim: "fly" },
        ],
        correct: "dormanta",
        reward: { word: "spać", emoji: "😴" },
      },
    ],
  },

  monto: {
    id: "monto",
    name: "Góra",
    mapEmoji: "🏔️",
    map: { x: 40, y: 30 },
    npc: {
      id: "strigo",
      emoji: "🦉",
      name: "Sowa",
      greeting: "Hu-hu! Jestem Sowa, mądry ptak góry.",
      voice: { rate: 0.85, pitch: 0.9 },
    },
    story: [
      "Na górze zapada noc, a ja kocham zagadki.",
      "Lubisz zagadki? Pobawmy się, hu-hu!",
    ],
    winText: "Hu-hu! Rozwiązałeś wszystkie moje zagadki! Jesteś bardzo mądry!",
    retryPhrases: [
      "Hu... pomyśl jeszcze!",
      "Nie do końca... popatrz dobrze, hu-hu!",
      "Prawie! Mądrala próbuje jeszcze raz!",
    ],
    successPhrases: ["Mądrze!", "Hu-hu! Świetnie!", "Bardzo mądrze!", "Perfekcyjnie, hu-hu!"],
    skill: {
      word: "latać",
      emoji: "🪶",
      before: "🦉",
      after: "🌙🦉⭐",
      line: "Znasz słowo latać! Polećmy przez nocne niebo, hu-hu!",
      praise: "Hu-hu! Latamy między gwiazdami!",
      lockedLine: "Hu... żeby latać ze mną, naucz się więcej słówek.",
      reward: { word: "niebo", emoji: "🌌" },
    },
    tasks: [
      {
        instruction: "Znajdź księżyc!",
        objects: [
          { id: "luno", emoji: "🌙" },
          { id: "suno", emoji: "☀️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "luno",
        reward: { word: "księżyc", emoji: "🌙" },
      },
      {
        instruction: "Znajdź słońce!",
        objects: [
          { id: "stelo", emoji: "⭐" },
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "suno",
        reward: { word: "słońce", emoji: "☀️" },
      },
      {
        instruction: "Znajdź gwiazdę!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "nubo", emoji: "☁️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "stelo",
        reward: { word: "gwiazda", emoji: "⭐" },
      },
      {
        instruction: "Znajdź wodę!",
        objects: [
          { id: "akvo", emoji: "💧" },
          { id: "fajro", emoji: "🔥" },
          { id: "monto", emoji: "⛰️" },
        ],
        correct: "akvo",
        reward: { word: "woda", emoji: "💧" },
      },
      {
        instruction: "Zagadka! Jest duża i wysoka. Znajdź to!",
        objects: [
          { id: "monto", emoji: "⛰️" },
          { id: "floro", emoji: "🌸" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "monto",
        reward: { word: "góra", emoji: "⛰️" },
      },
      {
        type: "drag",
        instruction: "Daj wodę Sowie!",
        objects: [
          { id: "akvo", emoji: "💧" },
          { id: "fajro", emoji: "🔥" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "akvo",
        reward: { word: "pić", emoji: "🥤" },
      },
      {
        type: "sequence",
        instruction: "Najpierw dotknij słońca, potem księżyca!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        sequence: ["suno", "luno"],
        reward: { word: "noc", emoji: "🌃" },
      },
      {
        instruction: "Zagadka! Lata w nocy i mówi hu-hu. Znajdź to!",
        objects: [
          { id: "strigo", emoji: "🦉" },
          { id: "kuniklo", emoji: "🐰" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "strigo",
        reward: { word: "sowa", emoji: "🦉" },
      },
    ],
  },

  marbordo: {
    id: "marbordo",
    name: "Wybrzeże",
    mapEmoji: "🏖️",
    map: { x: 84, y: 66 },
    npc: {
      id: "kankro",
      emoji: "🦀",
      name: "Krab",
      greeting: "Klik-klik! Jestem Krab! Witaj na wybrzeżu!",
      voice: { rate: 0.95, pitch: 1.3 },
    },
    story: [
      "Pogoda tutaj zmienia się każdego dnia — i ja czuję wszystko!",
      "Pomożesz mi zrozumieć pogodę i moje uczucia?",
    ],
    winText: "Klik-klik! Dziękuję! Teraz rozumiem całą pogodę... i samego siebie!",
    retryPhrases: [
      "Klik... spróbuj jeszcze raz!",
      "Nie do końca... spróbuj ponownie, przyjacielu!",
      "Prawie! Popatrz dobrze!",
    ],
    successPhrases: ["Klik-klik! Świetnie!", "Perfekcyjnie!", "Hura, udało ci się!", "Bardzo dobrze, przyjacielu!"],
    skill: {
      word: "noc",
      emoji: "🔭",
      before: "🏖️",
      after: "🌌✨",
      line: "Znasz słowo noc! Spójrz na niebo nad morzem!",
      praise: "Klik-klik! Ile gwiazd nad morzem!",
      lockedLine: "Klik... to sekret na później. Naucz się więcej słówek!",
      reward: { word: "morze", emoji: "🌊" },
    },
    tasks: [
      {
        instruction: "Znajdź deszcz!",
        objects: [
          { id: "pluvo", emoji: "🌧️" },
          { id: "suno", emoji: "☀️" },
          { id: "nubo", emoji: "☁️" },
        ],
        correct: "pluvo",
        reward: { word: "deszcz", emoji: "🌧️" },
      },
      {
        instruction: "Znajdź wiatr!",
        objects: [
          { id: "vento", emoji: "💨" },
          { id: "nubo", emoji: "☁️" },
          { id: "pluvo", emoji: "🌧️" },
        ],
        correct: "vento",
        reward: { word: "wiatr", emoji: "💨" },
      },
      {
        instruction: "Znajdź chmurę!",
        objects: [
          { id: "nubo", emoji: "☁️" },
          { id: "vento", emoji: "💨" },
          { id: "suno", emoji: "☀️" },
        ],
        correct: "nubo",
        reward: { word: "chmura", emoji: "☁️" },
      },
      {
        instruction: "Znajdź tęczę!",
        objects: [
          { id: "cielarko", emoji: "🌈" },
          { id: "nubo", emoji: "☁️" },
          { id: "pluvo", emoji: "🌧️" },
        ],
        correct: "cielarko",
        reward: { word: "tęcza", emoji: "🌈" },
      },
      {
        instruction: "Dotknij szczęśliwej twarzy!",
        objects: [
          { id: "felica", emoji: "😊" },
          { id: "trista", emoji: "😢" },
          { id: "timigita", emoji: "😱" },
        ],
        correct: "felica",
        reward: { word: "szczęśliwy", emoji: "😊" },
      },
      {
        instruction: "Dotknij smutnej twarzy!",
        objects: [
          { id: "timigita", emoji: "😱" },
          { id: "felica", emoji: "😊" },
          { id: "trista", emoji: "😢" },
        ],
        correct: "trista",
        reward: { word: "smutny", emoji: "😢" },
      },
      {
        type: "drag",
        instruction: "Daj tęczę Krabowi!",
        objects: [
          { id: "cielarko", emoji: "🌈" },
          { id: "nubo", emoji: "☁️" },
          { id: "vento", emoji: "💨" },
        ],
        correct: "cielarko",
        reward: { word: "pomagać", emoji: "🤝" },
      },
      {
        type: "sequence",
        instruction: "Najpierw dotknij słońca, potem deszczu!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "pluvo", emoji: "🌧️" },
          { id: "vento", emoji: "💨" },
        ],
        sequence: ["suno", "pluvo"],
        reward: { word: "pogoda", emoji: "🌤️" },
      },
    ],
  },

  kastelo: {
    id: "kastelo",
    name: "Zamek",
    mapEmoji: "🏰",
    map: { x: 25, y: 45 },
    npc: {
      id: "drako",
      emoji: "🐉",
      name: "Smok",
      greeting: "Haaa! Jestem Smok, strażnik zamku!",
      voice: { rate: 0.75, pitch: 0.55 },
    },
    story: [
      "Strzegę tego zamku już bardzo, bardzo długo...",
      "Czy jesteś dość odważny, by mi pomóc?",
    ],
    winText: "Ha! Jesteś naprawdę odważny! Zamek jest teraz twoim przyjacielem!",
    retryPhrases: [
      "Ha... spróbuj jeszcze raz!",
      "Nie do końca, śmiałku! Spróbuj ponownie!",
      "Prawie! Popatrz dobrze!",
    ],
    successPhrases: ["Ha! Świetnie!", "Naprawdę odważnie!", "Perfekcyjnie, przyjacielu!", "Brawo!"],
    skill: {
      word: "pomagać",
      emoji: "🗝️",
      before: "🏯",
      after: "✨🏯",
      line: "Znasz słowo pomagać! Pomóż mi otworzyć sekretną komnatę!",
      praise: "Ha! Dziękuję za pomoc, odważny przyjacielu!",
      lockedLine: "Ha... to sekret. Najpierw naucz się więcej słówek!",
      reward: { word: "skarb", emoji: "💰" },
    },
    tasks: [
      {
        instruction: "Znajdź wieżę!",
        objects: [
          { id: "turo", emoji: "🗼" },
          { id: "slosilo", emoji: "🔑" },
          { id: "krono", emoji: "👑" },
        ],
        correct: "turo",
        reward: { word: "wieża", emoji: "🗼" },
      },
      {
        instruction: "Znajdź klucz!",
        objects: [
          { id: "krono", emoji: "👑" },
          { id: "slosilo", emoji: "🔑" },
          { id: "glavo", emoji: "⚔️" },
        ],
        correct: "slosilo",
        reward: { word: "klucz", emoji: "🔑" },
      },
      {
        instruction: "Znajdź koronę!",
        objects: [
          { id: "glavo", emoji: "⚔️" },
          { id: "turo", emoji: "🗼" },
          { id: "krono", emoji: "👑" },
        ],
        correct: "krono",
        reward: { word: "korona", emoji: "👑" },
      },
      {
        instruction: "Znajdź miecz!",
        objects: [
          { id: "sildo", emoji: "🛡️" },
          { id: "glavo", emoji: "⚔️" },
          { id: "slosilo", emoji: "🔑" },
        ],
        correct: "glavo",
        reward: { word: "miecz", emoji: "⚔️" },
      },
      {
        instruction: "Znajdź tarczę!",
        objects: [
          { id: "sildo", emoji: "🛡️" },
          { id: "krono", emoji: "👑" },
          { id: "turo", emoji: "🗼" },
        ],
        correct: "sildo",
        reward: { word: "tarcza", emoji: "🛡️" },
      },
      {
        instruction: "Dotknij wysokiej wieży!",
        objects: [
          { id: "alta-turo", emoji: "🗼", scale: 1.35 },
          { id: "malalta-turo", emoji: "🗼", scale: 0.6 },
        ],
        correct: "alta-turo",
        reward: { word: "wysoki", emoji: "📏" },
      },
      {
        instruction: "Dotknij niskiej wieży!",
        objects: [
          { id: "alta-turo2", emoji: "🗼", scale: 1.35 },
          { id: "malalta-turo2", emoji: "🗼", scale: 0.6 },
        ],
        correct: "malalta-turo2",
        reward: { word: "niski", emoji: "🔻" },
      },
      {
        type: "drag",
        instruction: "Daj klucz Smokowi!",
        objects: [
          { id: "slosilo", emoji: "🔑" },
          { id: "krono", emoji: "👑" },
          { id: "glavo", emoji: "⚔️" },
        ],
        correct: "slosilo",
        reward: { word: "otwierać", emoji: "🔓" },
      },
      {
        type: "sequence",
        instruction: "Najpierw dotknij klucza, potem drzwi, na końcu korony!",
        objects: [
          { id: "slosilo", emoji: "🔑" },
          { id: "pordo", emoji: "🚪" },
          { id: "krono", emoji: "👑" },
          { id: "glavo", emoji: "⚔️" },
        ],
        sequence: ["slosilo", "pordo", "krono"],
        reward: { word: "królestwo", emoji: "🏯" },
      },
    ],
  },

  cielo: {
    id: "cielo",
    name: "Niebo",
    mapEmoji: "☁️",
    map: { x: 60, y: 18 },
    npc: {
      id: "nubeto",
      emoji: "☁️",
      name: "Chmurka",
      greeting: "Cześć... Jestem Chmurka, mała chmurka! Puf-puf!",
      voice: { rate: 0.8, pitch: 1.65 },
    },
    story: [
      "Wysoko na niebie bawię się w chowanego z moimi przyjaciółmi...",
      "Chcesz się z nami pobawić? Uważaj — będzie trudno!",
    ],
    winText: "Puf-puf! Znalazłeś wszystko wśród chmur! Całe niebo ci dziękuje!",
    skill: {
      word: "skarb",
      emoji: "🌈",
      before: "☁️",
      after: "🌈✨",
      line: "Znasz słowo skarb! Znajdź skarb ukryty w chmurze!",
      praise: "Ho! Tęcza! Oto skarb nieba!",
      lockedLine: "Ciii... chmura coś ukrywa... Naucz się więcej słówek!",
      reward: { word: "przyjaciel", emoji: "🤗" },
    },
    retryPhrases: [
      "Puf... spróbuj jeszcze raz!",
      "Ho, nie do końca... spróbuj ponownie, kochanie!",
      "Prawie! Pomyśl dobrze!",
    ],
    successPhrases: ["Puf-puf! Świetnie!", "Cudownie!", "Perfekcyjnie, kochanie!", "Hura! Latasz wysoko!"],
    tasks: [
      {
        instruction: "Znajdź latawiec!",
        objects: [
          { id: "kajto", emoji: "🪁" },
          { id: "balono", emoji: "🎈" },
          { id: "nubo", emoji: "☁️" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "kajto",
        reward: { word: "latawiec", emoji: "🪁" },
      },
      {
        instruction: "Znajdź balon!",
        objects: [
          { id: "balono", emoji: "🎈" },
          { id: "kajto", emoji: "🪁" },
          { id: "aviadilo", emoji: "✈️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "balono",
        reward: { word: "balon", emoji: "🎈" },
      },
      {
        instruction: "Znajdź samolot!",
        objects: [
          { id: "birdo", emoji: "🐦" },
          { id: "aviadilo", emoji: "✈️" },
          { id: "kajto", emoji: "🪁" },
          { id: "balono", emoji: "🎈" },
        ],
        correct: "aviadilo",
        reward: { word: "samolot", emoji: "✈️" },
      },
      {
        instruction: "Znajdź błyskawicę!",
        objects: [
          { id: "fulmo", emoji: "⚡" },
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "fulmo",
        reward: { word: "błyskawica", emoji: "⚡" },
      },
      {
        type: "memory",
        instruction: "Zapamiętaj, gdzie jest słońce!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "suno",
        reward: { word: "chować", emoji: "🙈" },
      },
      {
        type: "memory",
        instruction: "Zapamiętaj, gdzie jest latawiec!",
        objects: [
          { id: "kajto", emoji: "🪁" },
          { id: "balono", emoji: "🎈" },
          { id: "aviadilo", emoji: "✈️" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "kajto",
        reward: { word: "znaleźć", emoji: "🔍" },
      },
      {
        type: "drag",
        instruction: "Daj gwiazdę Chmurce!",
        objects: [
          { id: "stelo", emoji: "⭐" },
          { id: "luno", emoji: "🌙" },
          { id: "fulmo", emoji: "⚡" },
        ],
        correct: "stelo",
        reward: { word: "błyszczeć", emoji: "✨" },
      },
      {
        type: "sequence",
        instruction: "Najpierw dotknij słońca, potem błyskawicy, na końcu księżyca!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "fulmo", emoji: "⚡" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        sequence: ["suno", "fulmo", "luno"],
        reward: { word: "dzień", emoji: "🌅" },
      },
      {
        type: "memory",
        instruction: "Zapamiętaj, gdzie jest błyskawica!",
        objects: [
          { id: "fulmo", emoji: "⚡" },
          { id: "suno", emoji: "☀️" },
          { id: "stelo", emoji: "⭐" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "fulmo",
        reward: { word: "sen", emoji: "💭" },
      },
    ],
  },
};

export const ZONE_ORDER = ["fruktejo", "vilago", "arbaro", "monto", "marbordo", "kastelo", "cielo"];
