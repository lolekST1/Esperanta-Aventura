// Intro fabularne: slajdy bajki + wybór własnej postaci (awatara).
// Uruchamiane przy pierwszym wejściu do gry; można powtórzyć z mapy (📜).

import { STORY, AVATARS } from "./data/story.js";
import { speak, playTap, playSuccess, NARRATOR } from "./audio.js";

const el = (id) => document.getElementById(id);

export function runIntro(game, onDone) {
  let idx = 0;
  const nextBtn = el("btn-story-next");
  const grid = el("avatar-grid");

  function showSlide() {
    const slide = STORY[idx];
    el("story-scene").textContent = slide.scene;
    el("story-text").textContent = slide.text;
    speak(slide.text, slide.voice ?? NARRATOR);
  }

  function showAvatarPick() {
    nextBtn.classList.add("hidden");
    el("story-scene").textContent = "✨";
    el("story-text").textContent = "Kiu vi estas? Elektu!";
    speak("Kiu vi estas? Elektu!");
    grid.innerHTML = "";
    grid.classList.remove("hidden");
    for (const avatar of AVATARS) {
      const btn = document.createElement("button");
      btn.className = "avatar-option";
      btn.textContent = avatar;
      btn.addEventListener("pointerdown", () => pick(avatar), { once: true });
      grid.appendChild(btn);
    }
  }

  async function pick(avatar) {
    playSuccess();
    game.setAvatar(avatar);
    grid.classList.add("hidden");
    el("story-scene").textContent = `${avatar} 🎈`;
    el("story-text").textContent = "Bonege! Ek al la aventuro!";
    await speak("Bonege! Ek al la aventuro!");
    cleanup();
    onDone();
  }

  function onNext() {
    playTap();
    idx++;
    if (idx < STORY.length) showSlide();
    else showAvatarPick();
  }

  function cleanup() {
    nextBtn.removeEventListener("click", onNext);
    nextBtn.classList.remove("hidden");
    grid.classList.add("hidden");
  }

  nextBtn.addEventListener("click", onNext);
  showSlide();
}
