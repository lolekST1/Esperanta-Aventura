// Silnik gry: pętla NPC-instrukcja → interakcja dziecka → reakcja świata → nagroda.
// Silnik nie zna żadnych konkretnych słówek — wszystko pochodzi z js/data/zones.js.
//
// Tempo gry jest sterowane mową: każda kwestia NPC wybrzmiewa do końca,
// a celebracje mają czas na animacje. `session` unieważnia trwające
// sekwencje async, gdy dziecko wyjdzie do mapy w połowie zadania.

import { speak, playSuccess, playRetry, playTap, wait, NARRATOR } from "./audio.js";

const SAVE_KEY = "esperanta-aventuro-save-v1";

const el = (id) => document.getElementById(id);

const CONFETTI = ["⭐", "🎉", "✨", "🌟", "💛"];

function loadSave() {
  let save;
  try {
    save = JSON.parse(localStorage.getItem(SAVE_KEY)) ?? {};
  } catch {
    save = {};
  }
  save.stars ??= 0;
  save.words ??= [];
  save.zones ??= {};
  save.avatar ??= null;
  save.mapPosition ??= null;
  save.storiesSeen ??= {};
  return save;
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
  constructor() {
    this.save = loadSave();
    this.zone = null;
    this.active = false;
    this.session = 0;
    this.onWin = null; // ustawiane przez main.js (nawigacja)
    this.updateHud();
    this.renderVortaro();
  }

  get voice() {
    return this.zone?.npc.voice ?? NARRATOR;
  }

  get task() {
    return this.zone?.tasks[this.taskIndex];
  }

  setAvatar(avatar) {
    this.save.avatar = avatar;
    persist(this.save);
    this.updateHud();
  }

  // Wywoływane, gdy awatar dojdzie do strefy na mapie — żeby po powrocie
  // z gry stał dokładnie tam, gdzie dziecko go zostawiło.
  setMapPosition(zoneId) {
    this.save.mapPosition = zoneId;
    persist(this.save);
  }

  loadZone(zone) {
    this.zone = zone;
    this.taskIndex = 0;
    this.sessionStars = 0;
    this.locked = true;
    this.active = true;
    this.session++;
    el("npc").textContent = zone.npc.emoji;
  }

  // Wywoływane przy wyjściu do mapy — unieważnia trwające sekwencje.
  deactivate() {
    this.active = false;
    this.session++;
  }

  stale(session) {
    return session !== this.session || !this.active;
  }

  // Wejście do strefy: NPC wskakuje na scenę i wita się do końca, a przy
  // pierwszej wizycie opowiada krótko, po co prosi o pomoc (zone.story) —
  // przy kolejnych wejściach ta część jest pomijana.
  async intro() {
    const s = this.session;
    const npc = el("npc");
    npc.className = "npc enter";
    el("instruction").textContent = this.zone.npc.greeting;
    el("objects").innerHTML = "";
    await speak(this.zone.npc.greeting, this.voice);
    if (this.stale(s)) return;
    await wait(500);
    if (this.stale(s)) return;

    if (this.zone.story && !this.save.storiesSeen[this.zone.id]) {
      for (const line of this.zone.story) {
        el("instruction").textContent = line;
        await speak(line, this.voice);
        if (this.stale(s)) return;
        await wait(600);
        if (this.stale(s)) return;
      }
      this.save.storiesSeen[this.zone.id] = true;
      persist(this.save);
    }

    this.showTask();
  }

  async showTask() {
    const s = this.session;
    if (this.stale(s)) return;
    const task = this.task;
    if (!task) return this.finishZone();

    el("instruction").textContent = task.instruction;
    el("npc").className = "npc";

    const box = el("objects");
    box.innerHTML = "";
    for (const obj of shuffle(task.objects)) {
      const btn = document.createElement("button");
      btn.className = "object-button";
      btn.dataset.id = obj.id;

      const emoji = document.createElement("span");
      emoji.className = "obj-emoji" + (obj.anim ? ` anim-${obj.anim}` : "");
      emoji.textContent = obj.emoji;
      if (obj.scale) emoji.style.fontSize = `${obj.scale}em`;
      btn.appendChild(emoji);

      if (obj.badge) {
        const badge = document.createElement("span");
        badge.className = "obj-badge";
        badge.textContent = obj.badge;
        btn.appendChild(badge);
      }

      btn.addEventListener("pointerdown", () => this.onTap(btn, obj));
      box.appendChild(btn);
    }

    this.locked = false;
    await speak(task.instruction, this.voice);
  }

  onTap(btn, obj) {
    if (this.locked || !this.active) return;
    playTap();
    if (obj.id === this.task.correct) {
      this.onCorrect(btn);
    } else {
      this.onWrong(btn);
    }
  }

  async onCorrect(btn) {
    const s = this.session;
    this.locked = true;
    const reward = this.task.reward;

    // Celebracja: taniec NPC, konfetti, fanfary, pochwała do końca.
    btn.classList.add("correct");
    el("npc").className = "npc dance";
    playSuccess();
    this.dropConfetti();
    this.addStar();

    const praise = randomOf(this.zone.successPhrases);
    el("instruction").textContent = praise;
    await speak(praise, this.voice);
    if (this.stale(s)) return;

    // Nagroda: słówko pokazuje się i jest wyraźnie wypowiadane.
    this.showReward(reward);
    await speak(reward.word, { rate: 0.7, pitch: 1.15 });
    if (this.stale(s)) return;
    await wait(1200);
    if (this.stale(s)) return;

    this.hideReward();
    this.taskIndex++;
    this.showTask();
  }

  async onWrong(btn) {
    const s = this.session;
    this.locked = true;
    btn.classList.add("wrong");
    el("npc").className = "npc thinking";

    const phrase = randomOf(this.zone.retryPhrases);
    el("instruction").textContent = phrase;
    playRetry();
    await speak(phrase, this.voice);
    if (this.stale(s)) return;
    await wait(500);
    if (this.stale(s)) return;

    // Łagodna próba ponowna — ta sama instrukcja wraca, zero kary.
    btn.classList.remove("wrong");
    el("npc").className = "npc";
    el("instruction").textContent = this.task.instruction;
    this.locked = false;
    speak(this.task.instruction, this.voice);
  }

  addStar() {
    this.save.stars++;
    this.sessionStars++;
    persist(this.save);
    this.updateHud();
  }

  updateHud() {
    el("star-count").textContent = this.save.stars;
    el("avatar-chip").textContent = this.save.avatar ?? "";
  }

  showReward(reward) {
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

  dropConfetti() {
    for (let i = 0; i < 12; i++) {
      const piece = document.createElement("div");
      piece.className = "falling-star";
      piece.textContent = randomOf(CONFETTI);
      piece.style.left = `${5 + Math.random() * 90}vw`;
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2400);
    }
  }

  async finishZone() {
    if (!this.active) return;
    const prev = this.save.zones[this.zone.id] ?? { done: false, stars: 0 };
    this.save.zones[this.zone.id] = {
      done: true,
      stars: Math.max(prev.stars, this.sessionStars),
    };
    persist(this.save);

    el("win-npc").textContent = `${this.save.avatar ?? "🧒"} 🎉 ${this.zone.npc.emoji}`;
    el("win-text").textContent = this.zone.winText;
    el("win-stars").textContent = "⭐".repeat(Math.min(this.sessionStars, 10));
    playSuccess();
    this.dropConfetti();
    this.onWin?.();
    speak(`Bonege! ${this.zone.winText}`, this.voice);
  }

  replay() {
    this.taskIndex = 0;
    this.sessionStars = 0;
    this.active = true;
    this.session++;
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
      item.addEventListener("pointerdown", () => speak(w.word, { rate: 0.7, pitch: 1.15 }));
      grid.appendChild(item);
    }
  }
}
