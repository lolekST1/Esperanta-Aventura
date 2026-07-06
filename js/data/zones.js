// Strefy i zadania — silnik gry jest w pełni sterowany tymi danymi.
// Nowa strefa = nowy wpis tutaj, bez zmian w kodzie silnika.
//
// Zadanie:
//   instruction — tekst, który mówi NPC (zawsze po esperancku)
//   objects     — obiekty widoczne na scenie (id, emoji)
//   correct     — id poprawnego obiektu
//   reward      — słówko odblokowywane po sukcesie (trafia do Vortaro)

export const ZONES = {
  fruktejo: {
    id: "fruktejo",
    name: "Fruktejo",
    npc: { id: "vulpo", emoji: "🦊", name: "Vulpo" },
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
};

export const START_ZONE = "fruktejo";
