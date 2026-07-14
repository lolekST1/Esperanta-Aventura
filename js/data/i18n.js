// Słowniki dla trzech wersji językowych gry:
// - "eo" — oryginalna gra (treść po esperancku)
// - "pl" — treść po polsku (polskie słówka zamiast esperanckich)
// - "en" — treść po angielsku
//
// UI_STRINGS = interfejs RODZICA (ekran ⚙️ wyboru głosu) — zawsze był po
// polsku niezależnie od języka gry, więc "eo" i "pl" dzielą ten sam tekst;
// tylko "en" ma osobne tłumaczenie.
// CONTENT_STRINGS = wszystko, co widzi/słyszy DZIECKO poza js/data/zones.js
// i story.js (przyciski, kreator postaci, finał wyspy, słowniczek, zablokowana
// strefa) — te w oryginale były po ESPERANCKU (np. "Ludi!", "Mia Vortaro"),
// więc muszą mieć wpis dla wszystkich trzech języków.

export const UI_STRINGS = {
  pl: {
    voiceTitle: "Głos lektora",
    voiceHint: "Stuknij głos, aby posłuchać próbki. Wybór zostanie zapamiętany.",
    trickyHint: "Trudne słówka — testuj pojedynczo:",
    diagToggle: "🔧 Szczegóły techniczne",
    voiceClose: "✖ Zamknij",
    noVoices: "Ta przeglądarka nie udostępnia żadnych głosów 😢",
    autoVoice: "Automatycznie",
    diag: {
      version: "Wersja gry",
      synthYes: "✅ dostępne",
      synthNo: "❌ NIEDOSTĘPNE",
      synthLabel: "speechSynthesis",
      voiceCount: "Liczba głosów",
      browserLang: "Język przeglądarki",
      pwaMode: "Tryb PWA (standalone)",
      yes: "tak",
      no: "nie",
      audioCtx: "Dźwięk (AudioContext)",
      none: "brak",
      inAppWarning:
        "⚠️ To może być przeglądarka wbudowana w aplikację (np. Messenger/Instagram) — takie przeglądarki często blokują mowę. Spróbuj otworzyć link w Chrome lub Safari.",
    },
  },
  en: {
    voiceTitle: "Narrator voice",
    voiceHint: "Tap a voice to hear a sample. Your choice will be remembered.",
    trickyHint: "Tricky words — test them one by one:",
    diagToggle: "🔧 Technical details",
    voiceClose: "✖ Close",
    noVoices: "This browser doesn't offer any voices 😢",
    autoVoice: "Automatic",
    diag: {
      version: "Game version",
      synthYes: "✅ available",
      synthNo: "❌ UNAVAILABLE",
      synthLabel: "speechSynthesis",
      voiceCount: "Voice count",
      browserLang: "Browser language",
      pwaMode: "PWA mode (standalone)",
      yes: "yes",
      no: "no",
      audioCtx: "Audio (AudioContext)",
      none: "none",
      inAppWarning:
        "⚠️ This might be an in-app browser (e.g. Messenger/Instagram) — those often block speech. Try opening the link in Chrome or Safari.",
    },
  },
};

// "eo" reuses the Polish parent UI — unchanged behavior from before localization.
UI_STRINGS.eo = UI_STRINGS.pl;

export const CONTENT_STRINGS = {
  eo: {
    play: "▶ Ludi!",
    map: "Mapo",
    replay: "Denove",
    islandContinue: "Reen al la mapo",
    vortaroTitle: "Mia Vortaro",
    vortaroClose: "✖ Fermi",
    vortaroEmpty: "Ankoraŭ neniu vorto...",
    avatarPrompt: "Kiu vi estas? Elektu!",
    colorPrompt: "Elektu la koloron!",
    avatarChosen: "Bonege! Ek al la aventuro!",
    islandWinTitle: "Vi esploris la tutan Esperantion!",
    islandWinText: "Ĉiuj estas dankemaj al vi!<br>Pli da aventuroj venos baldaŭ...",
    islandWinSpoken: "Vi esploris la tutan Esperantion! Ĉiuj estas dankemaj al vi!",
    winTitle: "Bonege!",
    lockedZone: "Ankoraŭ ne! Unue finu la alian lokon!",
    avatarTypeNames: { knabo: "knabo", knabino: "knabino", kato: "kato", hundo: "hundo", unikorno: "unikorno", dino: "dino" },
    avatarColorNames: { bruna: "bruna", ora: "ora", "ruĝa": "ruĝa", rozkolora: "rozkolora", blua: "blua", verda: "verda" },
  },
  pl: {
    play: "▶ Graj!",
    map: "Mapa",
    replay: "Jeszcze raz",
    islandContinue: "Powrót do mapy",
    vortaroTitle: "Mój Słowniczek",
    vortaroClose: "✖ Zamknij",
    vortaroEmpty: "Jeszcze żadnego słówka...",
    avatarPrompt: "Kim jesteś? Wybierz!",
    colorPrompt: "Wybierz kolor!",
    avatarChosen: "Świetnie! Ruszamy na przygodę!",
    islandWinTitle: "Zwiedziłeś całą Esperantię!",
    islandWinText: "Wszyscy są ci wdzięczni!<br>Więcej przygód wkrótce...",
    islandWinSpoken: "Zwiedziłeś całą Esperantię! Wszyscy są ci wdzięczni!",
    winTitle: "Świetnie!",
    lockedZone: "Jeszcze nie! Najpierw skończ inne miejsce!",
    avatarTypeNames: { knabo: "chłopiec", knabino: "dziewczynka", kato: "kotek", hundo: "piesek", unikorno: "jednorożec", dino: "dinozaur" },
    avatarColorNames: { bruna: "brązowy", ora: "złoty", "ruĝa": "czerwony", rozkolora: "różowy", blua: "niebieski", verda: "zielony" },
  },
  en: {
    play: "▶ Play!",
    map: "Map",
    replay: "Again",
    islandContinue: "Back to the map",
    vortaroTitle: "My Dictionary",
    vortaroClose: "✖ Close",
    vortaroEmpty: "No words yet...",
    avatarPrompt: "Who are you? Choose!",
    colorPrompt: "Choose the color!",
    avatarChosen: "Great! Off to the adventure!",
    islandWinTitle: "You explored all of Esperantio!",
    islandWinText: "Everyone is grateful to you!<br>More adventures coming soon...",
    islandWinSpoken: "You explored all of Esperantio! Everyone is grateful to you!",
    winTitle: "Great job!",
    lockedZone: "Not yet! First finish the other place!",
    avatarTypeNames: { knabo: "boy", knabino: "girl", kato: "cat", hundo: "dog", unikorno: "unicorn", dino: "dino" },
    avatarColorNames: { bruna: "brown", ora: "golden", "ruĝa": "red", rozkolora: "pink", blua: "blue", verda: "green" },
  },
};

export const LANGS = ["eo", "pl", "en"];
