// Mapa wyspy Esperantio — prawdziwa plansza z wyspą, ścieżką i awatarem,
// który fizycznie chodzi między strefami. Strefy odblokowują się po
// kolei: ukończenie strefy otwiera następną z ZONE_ORDER.
//
// Współrzędne stref (zone.map = {x,y}, w procentach 0–100) odpowiadają
// zarówno pozycji SVG (viewBox 0 0 100 100), jak i pozycji znaczników/
// awatara (position:absolute, left/top w %) — oba układy współrzędnych
// są celowo tożsame, żeby ścieżka i znaczniki zawsze się pokrywały.

import { ZONES, ZONE_ORDER } from "./data/zones.js";
import { speak, playRetry, playTap } from "./audio.js";

const WALK_MS = 900;
// Awatar stoi kawałek pod znacznikiem strefy, żeby nie zasłaniać jego
// etykiety i statusu — logicznie to wciąż "ta sama" pozycja.
const AVATAR_OFFSET_Y = 7;

const el = (id) => document.getElementById(id);

function buildRoadPath() {
  return "M" + ZONE_ORDER.map((id) => {
    const { x, y } = ZONES[id].map;
    return `${x},${y}`;
  }).join(" L ");
}

function placeAvatar(avatar, pos, animated) {
  avatar.classList.toggle("walking", animated);
  avatar.style.left = `${pos.x}%`;
  avatar.style.top = `${pos.y + AVATAR_OFFSET_Y}%`;
  if (animated) setTimeout(() => avatar.classList.remove("walking"), WALK_MS);
}

export function renderMap(game, onSelect) {
  const save = game.save;
  const road = el("map-road");
  const markersBox = el("map-markers");
  const avatar = el("map-avatar");

  road.setAttribute("d", buildRoadPath());
  el("map-avatar-emoji").textContent = save.avatar ?? "🧒";
  markersBox.innerHTML = "";

  const startId = save.mapPosition && ZONES[save.mapPosition] ? save.mapPosition : ZONE_ORDER[0];
  placeAvatar(avatar, ZONES[startId].map, false);

  ZONE_ORDER.forEach((zoneId, i) => {
    const zone = ZONES[zoneId];
    const progress = save.zones[zoneId];
    const unlocked = i === 0 || save.zones[ZONE_ORDER[i - 1]]?.done;

    // Nieodwiedzona jeszcze, ale odblokowana strefa delikatnie pulsuje —
    // zaprasza do stuknięcia. Twarz NPC na znaczniku ożywia mapę nawet
    // przed wejściem do strefy.
    const isNew = unlocked && !progress?.done;
    const marker = document.createElement("button");
    marker.className = "map-marker" + (unlocked ? "" : " locked") + (isNew ? " new" : "");
    marker.style.left = `${zone.map.x}%`;
    marker.style.top = `${zone.map.y}%`;
    marker.dataset.id = zoneId;

    const status = !unlocked ? "🔒" : progress?.done ? `⭐${progress.stars}` : "🆕";
    marker.innerHTML = `
      <span class="map-marker-emoji">${zone.mapEmoji}<span class="map-marker-npc">${zone.npc.emoji}</span></span>
      <span class="map-marker-label">${zone.name}</span>
      <span class="map-marker-status">${status}</span>
    `;

    marker.addEventListener("pointerdown", () => {
      if (unlocked) {
        playTap();
        placeAvatar(avatar, zone.map, true);
        game.setMapPosition(zoneId);
        setTimeout(() => onSelect(zone), WALK_MS);
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
