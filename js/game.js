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
  save.islandCelebrated ??= false;
  save.skillsDone ??= {};
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
    el("btn-skill").addEventListener("pointerdown", () => this.onSkillTap());
    this.updateHud();
    this.renderVortaro();
  }

  hasWord(word) {
    return this.save.words.some((w) => w.word === word);
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

  markIslandCelebrated() {
    this.save.islandCelebrated = true;
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
    this.renderSkillSpot();
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

    this.seqIndex = 0;
    const isDrag = task.type === "drag";
    el("instruction").textContent = task.instruction;
    // Przy zadaniu "Donu..." NPC świeci się jako cel upuszczenia.
    el("npc").className = "npc" + (isDrag ? " drop-target" : "");

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

      if (isDrag) this.makeDraggable(btn, obj);
      else btn.addEventListener("pointerdown", () => this.onTap(btn, obj));
      box.appendChild(btn);
    }

    this.locked = false;
    await speak(task.instruction, this.voice);
  }

  onTap(btn, obj) {
    if (this.locked || !this.active) return;
    if (btn.classList.contains("seq-done")) return; // już zaliczony krok sekwencji
    playTap();
    if (this.task.type === "sequence") return this.onSeqTap(btn, obj);
    if (obj.id === this.task.correct) {
      this.onCorrect(btn);
    } else {
      this.onWrong(btn);
    }
  }

  // Sekwencja "Unue... poste...": obiekty stukane w zadanej kolejności.
  // Dobry krok zostaje podświetlony; pomyłka łagodnie zeruje postęp
  // (instrukcja i tak powtarza całą kolejność).
  onSeqTap(btn, obj) {
    const seq = this.task.sequence;
    if (obj.id === seq[this.seqIndex]) {
      btn.classList.add("seq-done");
      this.seqIndex++;
      if (this.seqIndex >= seq.length) this.onCorrect(btn);
    } else {
      this.seqIndex = 0;
      for (const b of el("objects").children) b.classList.remove("seq-done");
      this.onWrong(btn);
    }
  }

  // Zadanie "Donu la X al Y": obiekt ciągnie się palcem (pointer capture)
  // i upuszcza na NPC. Upuszczenie obok = ciche wślizgnięcie z powrotem,
  // zero kary; samo stuknięcie (bez ruchu) = powtórzenie instrukcji.
  makeDraggable(btn, obj) {
    btn.style.touchAction = "none";
    btn.addEventListener("pointerdown", (e) => {
      if (this.locked || !this.active) return;
      btn.setPointerCapture(e.pointerId);
      const startX = e.clientX;
      const startY = e.clientY;
      let moved = false;
      const npc = el("npc");

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!moved && Math.hypot(dx, dy) > 6) {
          moved = true;
          btn.classList.add("dragging");
        }
        if (moved) {
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
          npc.classList.toggle("drop-hot", this.overNpc(btn));
        }
      };
      const onUp = () => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerup", onUp);
        btn.removeEventListener("pointercancel", onUp);
        npc.classList.remove("drop-hot");
        if (!moved) {
          playTap();
          speak(this.task.instruction, this.voice);
          return;
        }
        if (this.overNpc(btn)) this.onDrop(btn, obj);
        else this.snapBack(btn);
      };

      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerup", onUp);
      btn.addEventListener("pointercancel", onUp);
    });
  }

  overNpc(btn) {
    const a = btn.getBoundingClientRect();
    const b = el("npc").getBoundingClientRect();
    const pad = 12; // margines dobroci dla małych palców
    return (
      a.left < b.right + pad &&
      a.right > b.left - pad &&
      a.top < b.bottom + pad &&
      a.bottom > b.top - pad
    );
  }

  snapBack(btn) {
    btn.classList.remove("dragging");
    btn.classList.add("snap-back");
    btn.style.transform = "";
    setTimeout(() => btn.classList.remove("snap-back"), 400);
  }

  onDrop(btn, obj) {
    if (this.locked || !this.active) return;
    if (obj.id === this.task.correct) {
      playTap();
      // Wręczony obiekt znika w łapkach NPC (maleje i gaśnie na miejscu).
      const at = btn.style.transform;
      btn.classList.remove("dragging");
      btn.classList.add("given");
      btn.style.transform = `${at} scale(0.15)`;
      btn.style.opacity = "0";
      this.onCorrect(btn, { skipPop: true });
    } else {
      this.snapBack(btn);
      this.onWrong(btn);
    }
  }

  async onCorrect(btn, { skipPop = false } = {}) {
    const s = this.session;
    this.locked = true;
    const reward = this.task.reward;

    // Celebracja: taniec NPC, konfetti, fanfary, pochwała do końca.
    if (!skipPop) btn.classList.add("correct");
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
      this.renderSkillSpot(); // nowe słówko mogło właśnie odblokować akcję
    }
    el("reward-emoji").textContent = reward.emoji;
    el("reward-word").textContent = reward.word;
    el("reward-toast").classList.remove("hidden");
  }

  // ---------- Słowa jako umiejętności (zone.skill) ----------
  // Na scenie wisi przycisk akcji: ❓ dopóki dziecko nie zna wymaganego
  // słówka, potem emoji akcji (pulsuje). Pierwsze użycie daje gwiazdkę
  // i słówko-nagrodę; kolejne stuknięcia powtarzają samą scenkę.

  renderSkillSpot() {
    const spot = el("btn-skill");
    const sk = this.zone?.skill;
    if (!sk) {
      spot.classList.add("hidden");
      return;
    }
    const unlocked = this.hasWord(sk.word);
    spot.classList.remove("hidden");
    spot.classList.toggle("locked", !unlocked);
    spot.textContent = unlocked ? sk.emoji : "❓";
  }

  async onSkillTap() {
    if (this.locked || !this.active || !this.zone?.skill || !this.task) return;
    const s = this.session;
    const sk = this.zone.skill;
    this.locked = true;
    playTap();

    // Słówko jeszcze nieznane: tajemnicza, łagodna zachęta i powrót do zadania.
    if (!this.hasWord(sk.word)) {
      el("npc").className = "npc thinking";
      el("instruction").textContent = sk.lockedLine;
      await speak(sk.lockedLine, this.voice);
      if (this.stale(s)) return;
      await wait(400);
      if (this.stale(s)) return;
      el("npc").className = "npc";
      el("instruction").textContent = this.task.instruction;
      this.locked = false;
      return;
    }

    // Scenka przemiany: before → after, z konfetti i pochwałą NPC.
    el("instruction").textContent = sk.line;
    el("npc").className = "npc happy";
    el("objects").innerHTML = `<div id="skill-scene" class="skill-scene">${sk.before}</div>`;
    await speak(sk.line, this.voice);
    if (this.stale(s)) return;
    await wait(400);
    if (this.stale(s)) return;

    const scene = el("skill-scene");
    scene.classList.add("transform");
    scene.textContent = sk.after;
    playSuccess();
    this.dropConfetti();
    el("npc").className = "npc dance";
    el("instruction").textContent = sk.praise;

    const first = !this.save.skillsDone[this.zone.id];
    if (first) {
      this.save.skillsDone[this.zone.id] = true;
      this.addStar();
    }
    await speak(sk.praise, this.voice);
    if (this.stale(s)) return;

    if (first && sk.reward) {
      this.showReward(sk.reward);
      await speak(sk.reward.word, { rate: 0.7, pitch: 1.15 });
      if (this.stale(s)) return;
      await wait(1200);
      if (this.stale(s)) return;
      this.hideReward();
    } else {
      await wait(800);
      if (this.stale(s)) return;
    }
    this.showTask(); // z powrotem do bieżącego zadania
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
