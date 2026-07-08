// Intro fabularne: slajdy bajki (ilustrowane sceny SVG) + kreator własnej
// postaci: dziecko wybiera KTO to jest (typ awatara), a potem JAKI ma kolor
// włosów/sierści/grzywy — podgląd przemalowuje się na żywo przy każdym
// stuknięciu. Uruchamiane przy pierwszym wejściu; można powtórzyć z mapy (📜).

import { STORY } from "./data/story.js";
import { speak, playTap, playSuccess, NARRATOR } from "./audio.js";
import { sceneArt, avatarArt, AVATAR_TYPES, AVATAR_COLORS } from "./art.js";

const el = (id) => document.getElementById(id);

// Wybór koloru to mini-lekcja: każde stuknięcie wypowiada nazwę koloru
// po esperancku, a wybór typu — nazwę postaci.

export function runIntro(game, onDone) {
  let idx = 0;
  let chosen = null; // { type, color } w trakcie budowania

  // Przy ponownym uruchomieniu intro (📜 w połowie poprzedniego) na
  // przyciskach mogłyby wisieć stare nasłuchy — klon czyści je wszystkie.
  for (const id of ["btn-story-next", "btn-avatar-ok"]) {
    const btn = el(id);
    btn.replaceWith(btn.cloneNode(true));
  }
  const nextBtn = el("btn-story-next");
  const okBtn = el("btn-avatar-ok");
  const grid = el("avatar-grid");
  const colors = el("color-grid");

  function showSlide() {
    const slide = STORY[idx];
    el("story-scene").innerHTML = sceneArt(slide.scene);
    el("story-text").textContent = slide.text;
    speak(slide.text, slide.voice ?? NARRATOR);
  }

  function showTypePick() {
    nextBtn.classList.add("hidden");
    el("story-scene").innerHTML = sceneArt("sparkle");
    el("story-text").textContent = "Kiu vi estas? Elektu!";
    speak("Kiu vi estas? Elektu!");
    grid.innerHTML = "";
    grid.classList.remove("hidden");
    for (const type of AVATAR_TYPES) {
      const btn = document.createElement("button");
      btn.className = "avatar-option";
      btn.innerHTML = avatarArt({ type: type.id, color: type.defaultColor });
      btn.addEventListener(
        "pointerdown",
        () => {
          playTap();
          speak(type.name);
          chosen = { type: type.id, color: type.defaultColor };
          showColorPick();
        },
        { once: true },
      );
      grid.appendChild(btn);
    }
  }

  function showColorPick() {
    grid.classList.add("hidden");
    el("story-scene").innerHTML = avatarArt(chosen);
    el("story-text").textContent = "Elektu la koloron!";
    speak("Elektu la koloron!");
    colors.innerHTML = "";
    colors.classList.remove("hidden");
    okBtn.classList.remove("hidden");
    for (const color of AVATAR_COLORS) {
      const dot = document.createElement("button");
      dot.className = "color-dot" + (color.hex === chosen.color ? " active" : "");
      dot.style.background = color.hex;
      dot.setAttribute("aria-label", color.id);
      dot.addEventListener("pointerdown", () => {
        playTap();
        speak(color.id);
        chosen = { ...chosen, color: color.hex };
        el("story-scene").innerHTML = avatarArt(chosen);
        for (const d of colors.children) d.classList.remove("active");
        dot.classList.add("active");
      });
      colors.appendChild(dot);
    }
    okBtn.addEventListener("pointerdown", pick, { once: true });
  }

  async function pick() {
    playSuccess();
    game.setAvatar(chosen);
    colors.classList.add("hidden");
    okBtn.classList.add("hidden");
    // Nagroda za wybór: własna postać leci balonem na wyspę.
    el("story-scene").innerHTML = sceneArt("flight", chosen);
    el("story-text").textContent = "Bonege! Ek al la aventuro!";
    await speak("Bonege! Ek al la aventuro!");
    cleanup();
    onDone();
  }

  function onNext() {
    playTap();
    idx++;
    if (idx < STORY.length) showSlide();
    else showTypePick();
  }

  function cleanup() {
    nextBtn.removeEventListener("click", onNext);
    nextBtn.classList.remove("hidden");
    grid.classList.add("hidden");
    colors.classList.add("hidden");
    okBtn.classList.add("hidden");
  }

  nextBtn.addEventListener("click", onNext);
  showSlide();
}
