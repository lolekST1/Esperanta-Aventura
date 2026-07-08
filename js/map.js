// Mapa wyspy Esperantio — malowana plansza ze strefami, krętą drogą
// i awatarem, który fizycznie IDZIE po drodze między strefami (animacja
// wzdłuż krzywej, nie prosty przeskok). Strefy odblokowują się po kolei.
//
// Współrzędne stref (zone.map = {x,y}, w procentach 0–100) odpowiadają
// zarówno pozycji w SVG (viewBox 0 0 100 100), jak i pozycji znaczników/
// awatara (position:absolute, left/top w %) — oba układy współrzędnych
// są celowo tożsame, żeby droga i znaczniki zawsze się pokrywały.

import { ZONES, ZONE_ORDER } from "./data/zones.js";
import { speak, playRetry, playTap } from "./audio.js";
import { npcArt, avatarArt, starIcon, sparkIcon, lockIcon } from "./art.js";

// Awatar stoi kawałek pod znacznikiem strefy, żeby nie zasłaniać jego
// etykiety i statusu — logicznie to wciąż "ta sama" pozycja.
const AVATAR_OFFSET_Y = 6;

const el = (id) => document.getElementById(id);

// ---------- Kręta droga ----------
// Przez punkty stref (w kolejności odblokowywania) prowadzimy gładką
// krzywą Catmull-Rom, a między każdą parą stref wstawiamy dodatkowy punkt
// odsunięty w bok od prostej — dzięki temu droga zakręca i meandruje jak
// prawdziwa wiejska ścieżka. Odchylenia są deterministyczne (na przemian
// w lewo/prawo), żeby mapa wyglądała tak samo przy każdym renderze.

function roadPoints() {
  const stops = ZONE_ORDER.map((id) => ZONES[id].map);
  const pts = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    pts.push(a);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    // wektor prostopadły, wychylenie ~18% długości odcinka (max 6 jednostek)
    const k = Math.min(len * 0.18, 6) * (i % 2 === 0 ? 1 : -1);
    pts.push({
      x: (a.x + b.x) / 2 + (-dy / len) * k,
      y: (a.y + b.y) / 2 + (dx / len) * k,
    });
  }
  pts.push(stops[stops.length - 1]);
  return pts;
}

// Catmull-Rom → segmenty Béziera (standardowe przekształcenie, tension 1).
function catmullRomPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x},${p2.y}`;
  }
  return d;
}

// Pozycja każdej strefy na krzywej (długość łuku od początku drogi) —
// wyznaczana raz przez próbkowanie; potem spacer to animacja parametru s.
function zoneArcOffsets(pathEl) {
  const total = pathEl.getTotalLength();
  const SAMPLES = 480;
  const offsets = {};
  const best = {};
  for (const id of ZONE_ORDER) best[id] = Infinity;
  for (let i = 0; i <= SAMPLES; i++) {
    const s = (total * i) / SAMPLES;
    const p = pathEl.getPointAtLength(s);
    for (const id of ZONE_ORDER) {
      const z = ZONES[id].map;
      const dist = Math.hypot(p.x - z.x, p.y - z.y);
      if (dist < best[id]) {
        best[id] = dist;
        offsets[id] = s;
      }
    }
  }
  return offsets;
}

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

let walkFrame = 0; // token anulowania trwającego spaceru

function placeAvatar(avatar, x, y) {
  avatar.style.left = `${x}%`;
  avatar.style.top = `${y + AVATAR_OFFSET_Y}%`;
}

// Spacer awatara po drodze między dwiema strefami. Zwraca Promise
// rozstrzygany po dojściu (nawigacja czeka na koniec animacji).
function walkAlong(avatar, pathEl, fromS, toS) {
  const myFrame = ++walkFrame;
  const dist = Math.abs(toS - fromS);
  if (dist < 0.5) return Promise.resolve();
  const duration = Math.min(2400, Math.max(700, dist * 26));
  const art = el("map-avatar-art");
  avatar.classList.add("walking");
  // Awatar patrzy w stronę marszu (odbicie lustrzane przy chodzeniu w lewo).
  const from = pathEl.getPointAtLength(fromS);
  const to = pathEl.getPointAtLength(toS);
  art.style.transform = to.x < from.x ? "scaleX(-1)" : "";

  return new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      if (myFrame !== walkFrame) return resolve(); // nowszy spacer przejął awatar
      const t = Math.min(1, (now - t0) / duration);
      const s = fromS + (toS - fromS) * easeInOut(t);
      const p = pathEl.getPointAtLength(s);
      placeAvatar(avatar, p.x, p.y);
      if (t < 1) requestAnimationFrame(step);
      else {
        avatar.classList.remove("walking");
        resolve();
      }
    };
    requestAnimationFrame(step);
  });
}

export function renderMap(game, onSelect) {
  const save = game.save;
  const road = el("map-road");
  const roadBed = el("map-road-bed");
  const markersBox = el("map-markers");
  const avatar = el("map-avatar");

  const d = catmullRomPath(roadPoints());
  road.setAttribute("d", d);
  roadBed.setAttribute("d", d);
  const arcOf = zoneArcOffsets(road);

  el("map-avatar-art").innerHTML = avatarArt(save.avatar);
  markersBox.innerHTML = "";

  const startId = save.mapPosition && ZONES[save.mapPosition] ? save.mapPosition : ZONE_ORDER[0];
  walkFrame++; // unieważnij ewentualny spacer z poprzedniego renderu
  const startPoint = road.getPointAtLength(arcOf[startId]);
  placeAvatar(avatar, startPoint.x, startPoint.y);

  ZONE_ORDER.forEach((zoneId, i) => {
    const zone = ZONES[zoneId];
    const progress = save.zones[zoneId];
    const unlocked = i === 0 || save.zones[ZONE_ORDER[i - 1]]?.done;

    // Nieodwiedzona jeszcze, ale odblokowana strefa delikatnie pulsuje —
    // zaprasza do stuknięcia. Iskierki = w strefie czeka akcja-słowo,
    // którą dziecko właśnie odblokowało (powód, żeby tam wrócić).
    const skillReady =
      !!zone.skill &&
      unlocked &&
      !save.skillsDone?.[zoneId] &&
      save.words.some((w) => w.word === zone.skill.word);
    const isNew = unlocked && (!progress?.done || skillReady);
    const marker = document.createElement("button");
    marker.className = "map-marker" + (unlocked ? "" : " locked") + (isNew ? " new" : "");
    marker.style.left = `${zone.map.x}%`;
    marker.style.top = `${zone.map.y}%`;
    marker.dataset.id = zoneId;

    const status = !unlocked
      ? lockIcon(15)
      : progress?.done
        ? `${starIcon(13)}<span class="status-num">${progress.stars}</span>`
        : sparkIcon(13);
    // Sekret gotowy do odkrycia: gwiazdki skrzą się wokół znacznika.
    const sparkles = skillReady
      ? `<span class="marker-sparkles" aria-hidden="true">
           <span class="spark spark-1">${sparkIcon(15)}</span>
           <span class="spark spark-2">${starIcon(13)}</span>
           <span class="spark spark-3">${sparkIcon(13)}</span>
           <span class="spark spark-4">${starIcon(15)}</span>
         </span>`
      : "";
    marker.innerHTML = `
      <span class="map-marker-face">
        ${npcArt(zone.npc.id)}
        ${sparkles}
      </span>
      <span class="map-marker-label">${zone.name}</span>
      <span class="map-marker-status">${status}</span>
    `;

    marker.addEventListener("pointerdown", () => {
      if (unlocked) {
        playTap();
        const fromId = save.mapPosition && ZONES[save.mapPosition] ? save.mapPosition : ZONE_ORDER[0];
        game.setMapPosition(zoneId);
        walkAlong(avatar, road, arcOf[fromId], arcOf[zoneId]).then(() => onSelect(zone));
      } else {
        playRetry();
        speak("Ankoraŭ ne! Unue finu la alian lokon!");
        marker.classList.add("wobble");
        setTimeout(() => marker.classList.remove("wobble"), 600);
      }
    });

    markersBox.appendChild(marker);
  });
}
