// Silnik gry: pętla NPC-instrukcja → interakcja dziecka → reakcja świata → nagroda.
// Silnik nie zna żadnych konkretnych słówek — wszystko pochodzi z js/data/zones.js.

import { speak, playSuccess, playRetry, playTap } from "./audio.js";

const SAVE_KEY = "esperanta-aventuro-save-v1";

const el = (id) => document.getElementById(id);

function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY)) ?? { stars: 0, words: [] };
  } catch {
    return { stars: 0, words: [] };
  }
}

function persist(save) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomOf(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export class Game {
  constructor(zone) {
    this.zone = zone;
    this.save = loadSave();
    this.taskIndex = 0;
    this.locked = false;
    this.sessionStars = 0;
  }

  start() {
    el("npc").textContent = this.zone.npc.emoji;
    this.updateStars();
    this.renderVortaro();
    this.showTask();
  }

  get task() {
    return this.zone.tasks[this.taskIndex];
  }

  showTask() {
    const task = this.task;
    if (!task) return this.showWin();

    this.locked = false;
    el("instruction").textContent = task.instruction;
    el("npc").className = "npc";

    const box = el("objects");
    box.innerHTML = "";
    for (const obj of shuffle(task.objects)) {
      const btn = document.createElement("button");
      btn.className = "object-button";
      btn.textContent = obj.emoji;
      btn.dataset.id = obj.id;
      btn.addEventListener("pointerdown", () => this.onTap(btn, obj));
      box.appendChild(btn);
    }

    speak(task.instruction);
  }

  onTap(btn, obj) {
    if (this.locked) return;
    playTap();
    if (obj.id === this.task.correct) {
      this.onCorrect(btn);
    } else {
      this.onWrong(btn);
    }
  }

  onCorrect(btn) {
    this.locked = true;
    btn.classList.add("correct");
    el("npc").classList.add("happy");

    const praise = randomOf(this.zone.successPhrases);
    el("instruction").textContent = praise;
    playSuccess();
    speak(praise);

    this.addStar();
    this.dropStars();
    this.unlockWord(this.task.reward);

    setTimeout(() => {
      this.hideReward();
      this.taskIndex++;
      this.showTask();
    }, 2200);
  }

  onWrong(btn) {
    if (this.locked) return;
    this.locked = true;
    btn.classList.add("wrong");
    el("npc").classList.add("thinking");

    const phrase = randomOf(this.zone.retryPhrases);
    el("instruction").textContent = phrase;
    playRetry();
    speak(phrase);

    // Łagodna próba ponowna — ta sama instrukcja wraca, zero kary.
    setTimeout(() => {
      btn.classList.remove("wrong");
      el("npc").classList.remove("thinking");
      el("instruction").textContent = this.task.instruction;
      speak(this.task.instruction);
      this.locked = false;
    }, 1800);
  }

  addStar() {
    this.save.stars++;
    this.sessionStars++;
    persist(this.save);
    this.updateStars();
  }

  updateStars() {
    el("star-count").textContent = this.save.stars;
  }

  unlockWord(reward) {
    if (!reward) return;
    if (!this.save.words.some((w) => w.word === reward.word)) {
      this.save.words.push(reward);
      persist(this.save);
      this.renderVortaro();
    }
    el("reward-emoji").textContent = reward.emoji;
    el("reward-word").textContent = reward.word;
    el("reward-toast").classList.remove("hidden");
  }

  hideReward() {
    el("reward-toast").classList.add("hidden");
  }

  dropStars() {
    for (let i = 0; i < 6; i++) {
      const star = document.createElement("div");
      star.className = "falling-star";
      star.textContent = "⭐";
      star.style.left = `${10 + Math.random() * 80}vw`;
      star.style.animationDelay = `${Math.random() * 0.4}s`;
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 2000);
    }
  }

  showWin() {
    el("game-screen").classList.add("hidden");
    el("win-screen").classList.remove("hidden");
    el("win-text").textContent = this.zone.winText;
    el("win-stars").textContent = "⭐".repeat(Math.min(this.sessionStars, 10));
    playSuccess();
    speak(`Bonege! ${this.zone.winText}`);
  }

  replay() {
    this.taskIndex = 0;
    this.sessionStars = 0;
    el("win-screen").classList.add("hidden");
    el("game-screen").classList.remove("hidden");
    this.showTask();
  }

  renderVortaro() {
    const grid = el("vortaro-grid");
    grid.innerHTML = "";
    if (this.save.words.length === 0) {
      grid.innerHTML = `<p class="vortaro-empty">Ankoraŭ neniu vorto...</p>`;
      return;
    }
    for (const w of this.save.words) {
      const item = document.createElement("button");
      item.className = "vortaro-item";
      item.innerHTML = `<span class="emoji">${w.emoji}</span>${w.word}`;
      item.addEventListener("pointerdown", () => speak(w.word));
      grid.appendChild(item);
    }
  }
}
