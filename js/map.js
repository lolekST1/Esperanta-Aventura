// Mapa wyspy Esperantio — wybór strefy. Strefy odblokowują się po kolei:
// ukończenie strefy otwiera następną z ZONE_ORDER.

import { ZONES, ZONE_ORDER } from "./data/zones.js";
import { speak, playRetry, playTap } from "./audio.js";

export function renderMap(save, onSelect) {
  const list = document.getElementById("zone-list");
  list.innerHTML = "";

  ZONE_ORDER.forEach((zoneId, i) => {
    const zone = ZONES[zoneId];
    const progress = save.zones[zoneId];
    const unlocked = i === 0 || save.zones[ZONE_ORDER[i - 1]]?.done;

    const card = document.createElement("button");
    card.className = "zone-card" + (unlocked ? "" : " locked");
    card.dataset.id = zoneId;

    const status = !unlocked
      ? "🔒"
      : progress?.done
        ? `⭐ ${progress.stars}`
        : "🆕";

    card.innerHTML = `
      <span class="zone-emoji">${zone.mapEmoji}</span>
      <span class="zone-name">${zone.npc.emoji} ${zone.name}</span>
      <span class="zone-status">${status}</span>
    `;

    card.addEventListener("pointerdown", () => {
      if (unlocked) {
        playTap();
        onSelect(zone);
      } else {
        playRetry();
        speak("Ankoraŭ ne! Unue finu la alian lokon!");
        card.classList.add("wobble");
        setTimeout(() => card.classList.remove("wobble"), 600);
      }
    });

    list.appendChild(card);
  });
}
