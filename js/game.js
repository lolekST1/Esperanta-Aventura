// Silnik gry: pętla NPC-instrukcja → interakcja dziecka → reakcja świata → nagroda.
// Silnik nie zna żadnych konkretnych słówek — wszystko pochodzi z js/data/zones.js.
//
// Tempo gry jest sterowane mową: każda kwestia NPC wybrzmiewa do końca,
// a celebracje mają czas na animacje. `session` unieważnia trwające
// sekwencje async, gdy dziecko wyjdzie do mapy w połowie zadania.

import { speak, playSuccess, playRetry, playTap, wait, NARRATOR, REWARD_VOICE } from "./audio.js";
import { npcArt, avatarArt, migrateAvatar, starIcon, sparkIcon, uiIcon, zoneBackdrop } from "./art.js";
import { objArt, objSceneArt } from "./objArt.js";

// Ikona zamiast emoji tam, gdzie ją mamy; emoji jako bezpieczny fallback
// (nowe strefy z nowymi emoji działają od razu, zanim powstanie grafika).
function setGlyph(node, emoji) {
  const art = objArt(emoji);
  if (art) node.innerHTML = art;
  else node.textContent = emoji;
}

const SAVE_KEY = "esperanta-aventuro-save-v1";

const el = (id) => document.getElementById(id);

// Konfetti: malowane gwiazdki w dwóch rozmiarach zamiast emoji.
const CONFETTI = [starIcon(34), sparkIcon(26), starIcon(24), sparkIcon(34), starIcon(28)];

// Duszek ręki: ile dziecko ma czasu, zanim pokażemy demonstrację.
const HINT_DELAY_MS = 4000;

// Adaptacyjne powtórki: ile słówek maksymalnie dokłada się na koniec strefy.
const MAX_REVIEW_TASKS = 2;

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
  // Stare zapisy trzymały awatar jako emoji — migrujemy do {type, color}.
  save.avatar = migrateAvatar(save.avatar ?? null);
  save.mapPosition ??= null;
  save.storiesSeen ??= {};
  save.islandCelebrated ??= false;
  save.skillsDone ??= {};
  save.hintsSeen ??= {};
  save.mistakes ??= {};
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

  // Zadania strefy + niewidoczne powtórki dołożone na końcu (buildReviewQueue).
  get task() {
    const base = this.zone?.tasks ?? [];
    if (this.taskIndex < base.length) return base[this.taskIndex];
    return this.reviewQueue?.[this.taskIndex - base.length];
  }

  // Adaptacyjne powtórki: po wyczerpaniu zwykłych zadań strefy dokładamy do
  // MAX_REVIEW_TASKS zadań odpowiadających słówkom, w których dziecko
  // ostatnio się myliło — bez żadnego oznaczenia "to jest powtórka".
  //
  // Powtórki pochodzą WYŁĄCZNIE z zadań bieżącej strefy: NPC pyta swoim
  // głosem o swoje rzeczy (nagrania lektorskie zawsze istnieją, a instrukcje
  // typu "Donu la panon al Urso!" nie padają w strefie Papago). Pomyłki
  // z innych stref wracają do dziecka, gdy znów odwiedzi tamtą strefę.
  buildReviewQueue() {
    const entries = Object.entries(this.save.mistakes).filter(([, n]) => n > 0);
    if (!entries.length) return [];
    entries.sort((a, b) => b[1] - a[1]); // najpierw najczęściej mylone
    const own = new Map();
    for (const task of this.zone?.tasks ?? []) {
      if (task.reward?.word && !own.has(task.reward.word)) own.set(task.reward.word, task);
    }
    const picked = [];
    for (const [word] of entries) {
      const task = own.get(word);
      if (task) picked.push(task);
      if (picked.length >= MAX_REVIEW_TASKS) break;
    }
    return picked;
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
    this.cancelHint();
    this.zone = zone;
    this.taskIndex = 0;
    this.sessionStars = 0;
    this.locked = true;
    this.active = true;
    this.session++;
    this.reviewQueue = this.buildReviewQueue();
    el("npc").innerHTML = npcArt(zone.npc.id);
    el("zone-bg").innerHTML = zoneBackdrop(zone.id);
    this.renderSkillSpot();
  }

  // Wywoływane przy wyjściu do mapy — unieważnia trwające sekwencje.
  deactivate() {
    this.cancelHint();
    this.active = false;
    this.session++;
  }

  stale(session) {
    return session !== this.session || !this.active;
  }

  // Wejście do strefy: NPC wskakuje na scenę. Powitanie ("Mi estas Vulpo!")
  // i historyjka (zone.story) grają TYLKO przy pierwszej wizycie — przy
  // kolejnych NPC od razu przechodzi do zadań (nikt nie przedstawia się
  // znajomemu w kółko).
  async intro() {
    const s = this.session;
    const npc = el("npc");
    npc.className = "npc enter";
    el("objects").innerHTML = "";

    if (this.save.storiesSeen[this.zone.id]) {
      el("instruction").textContent = "";
      await wait(700); // chwila na animację wejścia NPC
      if (this.stale(s)) return;
      this.showTask();
      return;
    }

    el("instruction").textContent = this.zone.npc.greeting;
    await speak(this.zone.npc.greeting, this.voice);
    if (this.stale(s)) return;
    await wait(500);
    if (this.stale(s)) return;

    for (const line of this.zone.story ?? []) {
      el("instruction").textContent = line;
      await speak(line, this.voice);
      if (this.stale(s)) return;
      await wait(600);
      if (this.stale(s)) return;
    }
    this.save.storiesSeen[this.zone.id] = true;
    persist(this.save);

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
      setGlyph(emoji, obj.emoji);
      if (obj.scale) emoji.style.fontSize = `${obj.scale}em`;
      btn.appendChild(emoji);

      if (obj.badge) {
        const badge = document.createElement("span");
        badge.className = "obj-badge";
        setGlyph(badge, obj.badge);
        btn.appendChild(badge);
      }

      if (isDrag) this.makeDraggable(btn, obj);
      else btn.addEventListener("pointerdown", () => this.onTap(btn, obj));
      box.appendChild(btn);
    }

    this.locked = false;
    await speak(task.instruction, this.voice);
    if (this.stale(s)) return;
    this.scheduleHint(task, s);
  }

  onTap(btn, obj) {
    if (this.locked || !this.active) return;
    if (btn.classList.contains("seq-done")) return; // już zaliczony krok sekwencji
    this.cancelHint();
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
      const num = document.createElement("span");
      num.className = "seq-num";
      num.textContent = String(this.seqIndex + 1); // widoczna kolejność, nie sam fakt trafienia
      btn.appendChild(num);
      btn.classList.add("seq-done");
      this.seqIndex++;
      if (this.seqIndex >= seq.length) this.onCorrect(btn);
    } else {
      this.seqIndex = 0;
      for (const b of el("objects").children) {
        b.classList.remove("seq-done");
        b.querySelectorAll(".seq-num").forEach((n) => n.remove());
      }
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
      this.cancelHint();
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

  // ---------- Duszek ręki (demonstracja pierwszego zadania każdego typu) ----------
  // Przy PIERWSZYM zadaniu danego typu ("tap"/"drag"/"sequence") w całej grze,
  // jeśli dziecko samo nie zareaguje w ciągu chwili, na scenie pojawia się
  // dłoń-duszek i pokazuje dokładnie co zrobić — nie klika za dziecko, tylko
  // demonstruje. Znacznik hintsSeen zapisujemy natychmiast przy planowaniu,
  // więc każdy typ dostaje tylko jedną szansę na pokazanie się w całej grze
  // (kolejne zadania tego samego typu już nigdy nie pokazują duszka).
  scheduleHint(task, s) {
    const type = task.type ?? "tap";
    if (this.save.hintsSeen[type]) return;
    this.save.hintsSeen[type] = true;
    persist(this.save);
    this.hintTimer = setTimeout(() => {
      if (this.stale(s) || this.locked) return;
      this.showHint(task, s);
    }, HINT_DELAY_MS);
  }

  cancelHint() {
    clearTimeout(this.hintTimer);
    this.hintToken = (this.hintToken ?? 0) + 1;
    el("ghost-hand")?.classList.remove("visible", "tap");
  }

  async showHint(task, s) {
    const token = this.hintToken ?? 0;
    const live = () => this.hintToken === token && !this.stale(s);
    const hand = el("ghost-hand");
    const objOf = (id) => el("objects").querySelector(`[data-id="${id}"]`);
    const centerOf = (elm) => {
      const r = elm.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    const placeInstant = (pos) => {
      hand.style.transition = "none";
      hand.style.left = `${pos.x}px`;
      hand.style.top = `${pos.y}px`;
      hand.offsetHeight; // wymuś reflow, żeby kolejny ruch znów miał przejście
      hand.style.transition = "";
    };
    const moveTo = async (pos) => {
      hand.style.left = `${pos.x}px`;
      hand.style.top = `${pos.y}px`;
      await wait(650);
    };
    const tapPulse = async () => {
      hand.classList.add("tap");
      await wait(400);
      hand.classList.remove("tap");
    };

    const type = task.type ?? "tap";

    // Jedno przejście demonstracji; zwraca false, gdy dziecko zdążyło
    // zareagować (cancelHint unieważnia token) w trakcie animacji.
    const passTap = async () => {
      const obj = objOf(task.correct);
      if (!obj) return false;
      placeInstant(centerOf(obj));
      hand.classList.add("visible");
      await wait(300);
      if (!live()) return false;
      await tapPulse();
      return live();
    };

    const passSequence = async () => {
      const first = objOf(task.sequence[0]);
      if (!first) return false;
      placeInstant(centerOf(first));
      hand.classList.add("visible");
      for (const id of task.sequence) {
        if (!live()) return false;
        const obj = objOf(id);
        if (!obj) return false;
        await moveTo(centerOf(obj));
        if (!live()) return false;
        await tapPulse();
        await wait(200);
      }
      return live();
    };

    const passDrag = async () => {
      const obj = objOf(task.correct);
      if (!obj) return false;
      placeInstant(centerOf(obj));
      hand.classList.add("visible");
      await wait(300);
      if (!live()) return false;
      await tapPulse(); // "chwyt" obiektu
      if (!live()) return false;
      await moveTo(centerOf(el("npc")));
      if (!live()) return false;
      await tapPulse(); // "wręczenie" NPC
      return live();
    };

    const pass = type === "drag" ? passDrag : type === "sequence" ? passSequence : passTap;

    hand.classList.remove("hidden");
    // Duszek powtarza gest w kółko, aż dziecko samo je wykona — każda
    // prawdziwa interakcja woła cancelHint(), które unieważnia token
    // i przerywa pętlę na najbliższym sprawdzeniu live().
    while (live()) {
      const finished = await pass();
      if (!finished || !live()) break;
      hand.classList.remove("visible");
      await wait(500);
    }

    hand.classList.remove("visible");
    hand.classList.add("hidden");
  }

  async onCorrect(btn, { skipPop = false } = {}) {
    const s = this.session;
    this.locked = true;
    const reward = this.task.reward;

    // Poprawna odpowiedź na zadanie-powtórkę "spłaca" wcześniejsze pomyłki —
    // słówko przestaje się doklejać do kolejnych stref, dopóki znów się nie pomyli.
    const isReview = this.taskIndex >= (this.zone.tasks?.length ?? 0);
    if (isReview && reward?.word) {
      this.save.mistakes[reward.word] = 0;
      persist(this.save);
    }

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
    await speak(reward.word, REWARD_VOICE);
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

    // Niewidoczne śledzenie pomyłek: to słówko staje się kandydatem do
    // powtórki na końcu jakiejś przyszłej strefy (buildReviewQueue).
    const word = this.task.reward?.word;
    if (word) {
      this.save.mistakes[word] = (this.save.mistakes[word] ?? 0) + 1;
      persist(this.save);
    }

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
    el("avatar-chip").innerHTML = this.save.avatar ? avatarArt(this.save.avatar) : "";
  }

  showReward(reward) {
    if (!reward) return;
    if (!this.save.words.some((w) => w.word === reward.word)) {
      this.save.words.push(reward);
      persist(this.save);
      this.renderVortaro();
      this.renderSkillSpot(); // nowe słówko mogło właśnie odblokować akcję
    }
    setGlyph(el("reward-emoji"), reward.emoji);
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
    const art = unlocked ? objSceneArt(sk.emoji) : objArt("❓");
    if (art) spot.innerHTML = art;
    else spot.textContent = unlocked ? sk.emoji : "❓";
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

    // Scenka: pokazujemy "before" i czekamy na stuknięcie dziecka — nic nie
    // dzieje się samo, dopiero jego dotyk uruchamia przemianę.
    el("instruction").textContent = sk.line;
    el("npc").className = "npc happy";
    el("objects").innerHTML =
      `<button id="skill-scene" class="skill-scene" aria-label="ago">${objSceneArt(sk.before) ?? sk.before}</button>`;
    const scene = el("skill-scene");
    // Nasłuch podłączony NATYCHMIAST (nie po mowie) — dziecko może stuknąć
    // scenkę, zanim NPC skończy mówić, i to wciąż ma zadziałać.
    const tapped = new Promise((resolve) => scene.addEventListener("pointerdown", resolve, { once: true }));
    await speak(sk.line, this.voice);
    if (this.stale(s)) return;

    await tapped;
    if (this.stale(s)) return;

    playTap();
    scene.classList.add("transform");
    const after = objSceneArt(sk.after);
    if (after) scene.innerHTML = after;
    else scene.textContent = sk.after;
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
      await speak(sk.reward.word, REWARD_VOICE);
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
      piece.innerHTML = randomOf(CONFETTI);
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

    el("win-npc").innerHTML =
      `${avatarArt(this.save.avatar)}<span class="win-party">${uiIcon("party", 44)}</span>${npcArt(this.zone.npc.id)}`;
    el("win-text").textContent = this.zone.winText;
    el("win-stars").innerHTML = starIcon(30).repeat(Math.min(this.sessionStars, 10));
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
    this.reviewQueue = this.buildReviewQueue();
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
      item.innerHTML = `<span class="emoji">${objArt(w.emoji) ?? w.emoji}</span>${w.word}`;
      item.addEventListener("pointerdown", () => speak(w.word, REWARD_VOICE));
      grid.appendChild(item);
    }
  }
}
