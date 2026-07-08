// Bajka wprowadzająca — dziecko przylatuje balonem na wyspę Esperantio
// i wybiera swoją postać. Krótkie, melodyjne zdania; obraz niesie sens,
// mowa niesie język.
//
// Pole `scene` to identyfikator ilustracji z js/art.js (sceneArt) —
// pełnoprawne malowane sceny zamiast dawnych emoji.

export const STORY = [
  { scene: "balloon", text: "Saluton, amiko!" },
  { scene: "balloon-sea", text: "Vi flugas per balono super la granda maro." },
  { scene: "island", text: "Jen insulo! Ĝi nomiĝas Esperantio." },
  {
    scene: "fox",
    text: "Saluton! Mi estas Vulpo! Bonvenon!",
    voice: { rate: 1.05, pitch: 1.4 },
  },
  { scene: "star-book", text: "Kolektu stelojn kaj lernu vortojn!" },
];
