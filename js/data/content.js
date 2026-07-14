// Wybór wersji językowej treści gry (eo/pl/en) — zapisany w localStorage,
// wczytywany dynamicznie, żeby main.js/story.js/map.js nie musiały na sztywno
// importować jednego zestawu danych.

import { LANGS } from "./i18n.js";

const LANG_KEY = "esperanta-aventuro-lang";

export function getLang() {
  const saved = localStorage.getItem(LANG_KEY);
  return LANGS.includes(saved) ? saved : "eo";
}

export function setLang(lang) {
  if (LANGS.includes(lang)) localStorage.setItem(LANG_KEY, lang);
}

const LOADERS = {
  eo: () => Promise.all([import("./zones.js"), import("./story.js")]),
  pl: () => Promise.all([import("./zones.pl.js"), import("./story.pl.js")]),
  en: () => Promise.all([import("./zones.en.js"), import("./story.en.js")]),
};

export async function loadContent(lang = getLang()) {
  const [zonesMod, storyMod] = await LOADERS[lang]();
  return { ZONES: zonesMod.ZONES, ZONE_ORDER: zonesMod.ZONE_ORDER, STORY: storyMod.STORY };
}
