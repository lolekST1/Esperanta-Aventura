// Ikony obiektów gry (zadania, nagrody, Vortaro, scenki-umiejętności)
// w stylu "Fabela Insulo". Kluczem jest DOKŁADNY string emoji z js/data/zones.js —
// silnik pozostaje w pełni sterowany danymi, a ikona to tylko "skórka":
// objArt() zwraca SVG albo null, a widok wtedy pokazuje oryginalne emoji.
// Dzięki temu nowa strefa z nowymi emoji działa od razu, jeszcze zanim
// ktoś domaluje jej ikony.
//
// Konwencje stylu (te same co portrety w art.js):
//   filtr o-wob  — akwarelowe, rozedrgane krawędzie dużych plam
//   highlight    — biała półprzezroczysta plamka światła
//   detale       — ostra kreska bez filtra na wierzchu

import { npcArt, starIcon, sparkIcon } from "./art.js";

const I = (inner) => `<svg viewBox="0 0 100 100" aria-hidden="true">${inner}</svg>`;
const W = (inner) => `<g filter="url(#o-wob)">${inner}</g>`;

// Nieregularna "plama farby" — wspólny kształt kolorowych kropek
// (nauka kolorów: ruĝa/flava/verda).
const BLOB = "M50,18 Q78,14 84,42 Q90,72 62,84 Q34,92 22,66 Q12,38 34,24 Q42,18 50,18 Z";
const blob = (fill, stroke) =>
  I(W(`<path d="${BLOB}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-opacity="0.4"/>
       <ellipse cx="38" cy="36" rx="10" ry="7" fill="#fff" opacity="0.3"/>`));

const OBJ = {
  // ---------- Fruktejo ----------
  "🍎": I(W(`
    <path d="M50,32 C30,26 18,44 22,62 C26,82 40,92 50,87 C60,92 74,82 78,62 C82,44 70,26 50,32 Z"
          fill="#e04b3b" stroke="#b23325" stroke-width="3" stroke-opacity="0.5"/>
    <path d="M50,32 Q49,20 56,12" fill="none" stroke="#8a5a34" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="64" cy="20" rx="10" ry="5.5" transform="rotate(-24 64 20)" fill="#58a86a"/>
    <ellipse cx="37" cy="47" rx="9" ry="12" fill="#fff" opacity="0.28"/>`)),
  "🍌": I(W(`
    <path d="M18,22 A44,44 0 0 0 78,74 A70,70 0 0 1 18,22 Z"
          fill="#f2c94c" stroke="#c9992e" stroke-width="3" stroke-opacity="0.55" stroke-linejoin="round"/>
    <path d="M14,18 Q11,12 17,10 Q23,10 21,18 Q18,23 14,18 Z" fill="#8a5a34"/>
    <path d="M76,70 Q82,68 84,74 Q84,80 77,80 Q73,75 76,70 Z" fill="#8a5a34"/>
    <path d="M24,36 Q29,58 48,70" fill="none" stroke="#fff" stroke-width="3.5" opacity="0.35" stroke-linecap="round"/>`)),
  "🍐": I(W(`
    <path d="M50,18 C55,18 57,25 55,33 C69,38 76,52 74,65 C72,82 60,91 50,89 C40,91 28,82 26,65 C24,52 31,38 45,33 C43,25 45,18 50,18 Z"
          fill="#c3cc5a" stroke="#93a03a" stroke-width="3" stroke-opacity="0.5"/>
    <ellipse cx="60" cy="16" rx="9" ry="5" transform="rotate(-20 60 16)" fill="#58a86a"/>
    <ellipse cx="39" cy="58" rx="8" ry="12" fill="#fff" opacity="0.28"/>`)),
  "🔴": blob("#e04b3b", "#b23325"),
  "🟡": blob("#f2c94c", "#c9992e"),
  "🟢": blob("#58a86a", "#3f8a52"),
  "🧺": I(W(`
    <circle cx="38" cy="38" r="9" fill="#e04b3b"/>
    <circle cx="56" cy="34" r="8" fill="#f2c94c"/>
    <circle cx="68" cy="40" r="7" fill="#c3cc5a"/>
    <path d="M18,42 L82,42 L74,84 Q50,90 26,84 Z" fill="#c99a5e" stroke="#9a6f3c" stroke-width="3"/>
    <path d="M22,55 L78,55 M25,68 L75,68 M38,44 L36,84 M52,44 L52,86 M66,44 L64,84"
          stroke="#9a6f3c" stroke-width="2.4" opacity="0.6"/>
    <path d="M30,42 Q50,12 70,42" fill="none" stroke="#9a6f3c" stroke-width="5" stroke-linecap="round"/>`)),
  "🪣": I(W(`
    <path d="M22,30 L78,30 L70,84 Q50,90 30,84 Z" fill="#c99a5e" stroke="#9a6f3c" stroke-width="3"/>
    <ellipse cx="50" cy="30" rx="28" ry="9" fill="#4fa7d8" stroke="#9a6f3c" stroke-width="3"/>
    <ellipse cx="42" cy="28" rx="8" ry="3" fill="#fff" opacity="0.5"/>
    <path d="M24,52 L76,52 M27,68 L73,68" stroke="#9a6f3c" stroke-width="2.6" opacity="0.6"/>
    <path d="M26,28 Q50,4 74,28" fill="none" stroke="#7a5730" stroke-width="4.5" stroke-linecap="round"/>`)),
  "🌱": I(W(`
    <path d="M30,88 Q50,80 70,88 Q60,96 50,95 Q40,96 30,88 Z" fill="#8a5a34" stroke="#6b4226" stroke-width="2.5"/>
    <path d="M50,86 Q49,66 50,52" fill="none" stroke="#58a86a" stroke-width="5" stroke-linecap="round"/>
    <path d="M50,58 Q26,58 22,32 Q48,32 50,54 Z" fill="#58a86a" stroke="#3f8a52" stroke-width="2.5"/>
    <path d="M50,58 Q74,58 78,32 Q52,32 50,54 Z" fill="#86bc60" stroke="#3f8a52" stroke-width="2.5"/>`)),
  "🌳": I(W(`
    <rect x="44" y="58" width="12" height="30" rx="5" fill="#8a5a34"/>
    <circle cx="42" cy="34" r="22" fill="url(#g-tree)"/>
    <circle cx="63" cy="42" r="17" fill="url(#g-tree)"/>
    <circle cx="30" cy="48" r="14" fill="url(#g-tree)"/>
    <circle cx="50" cy="52" r="16" fill="url(#g-tree)"/>
    <circle cx="35" cy="28" r="5" fill="#fff" opacity="0.25"/>`)),

  // ---------- Vilaĝo ----------
  "🏠": I(W(`
    <rect x="24" y="46" width="52" height="40" rx="4" fill="#f7ead0" stroke="#c9a86e" stroke-width="3"/>
    <path d="M16,50 Q50,8 84,50 Z" fill="#cf6b3c" stroke="#a84f27" stroke-width="3"/>
    <rect x="42" y="60" width="16" height="26" rx="4" fill="#8a5a34"/>
    <rect x="62" y="56" width="11" height="11" rx="2" fill="#aee7f5" stroke="#c9a86e" stroke-width="2"/>
    <rect x="27" y="56" width="11" height="11" rx="2" fill="#aee7f5" stroke="#c9a86e" stroke-width="2"/>`)),
  "🌻": I(W(`
    <path d="M50,60 Q48,80 46,92" fill="none" stroke="#58a86a" stroke-width="5" stroke-linecap="round"/>
    <path d="M47,78 Q30,74 26,62 Q42,62 48,72 Z" fill="#58a86a"/>
    <g fill="#f2b23d" stroke="#c9992e" stroke-width="1.6">
      <ellipse cx="50" cy="16" rx="8" ry="13"/><ellipse cx="50" cy="60" rx="8" ry="13"/>
      <ellipse cx="28" cy="38" rx="13" ry="8"/><ellipse cx="72" cy="38" rx="13" ry="8"/>
      <ellipse cx="34" cy="22" rx="10" ry="11" transform="rotate(-45 34 22)"/>
      <ellipse cx="66" cy="22" rx="10" ry="11" transform="rotate(45 66 22)"/>
      <ellipse cx="34" cy="54" rx="10" ry="11" transform="rotate(45 34 54)"/>
      <ellipse cx="66" cy="54" rx="10" ry="11" transform="rotate(-45 66 54)"/>
    </g>
    <circle cx="50" cy="38" r="14" fill="#8a5a34" stroke="#6b4226" stroke-width="2.5"/>
    <circle cx="46" cy="34" r="4" fill="#fff" opacity="0.25"/>`)),
  "🚪": I(W(`
    <rect x="26" y="12" width="48" height="80" rx="5" fill="#f2dcb0" stroke="#c9a86e" stroke-width="3"/>
    <rect x="33" y="19" width="34" height="73" rx="3" fill="#e04b3b" stroke="#b23325" stroke-width="2.5"/>
    <rect x="39" y="26" width="22" height="26" rx="3" fill="none" stroke="#b23325" stroke-width="2.2" opacity="0.75"/>
    <rect x="39" y="58" width="22" height="26" rx="3" fill="none" stroke="#b23325" stroke-width="2.2" opacity="0.75"/>
    <circle cx="61" cy="54" r="4.5" fill="#f2c94c" stroke="#b57a18" stroke-width="1.6"/>`)),
  "🪟": I(W(`
    <rect x="20" y="16" width="60" height="64" rx="5" fill="#f7ead0" stroke="#c9a86e" stroke-width="3"/>
    <rect x="27" y="23" width="46" height="50" fill="#aee7f5" stroke="#c9a86e" stroke-width="2.5"/>
    <path d="M50,23 L50,73 M27,48 L73,48" stroke="#c9a86e" stroke-width="3.5"/>
    <rect x="14" y="80" width="72" height="8" rx="4" fill="#c9a86e" stroke="#9a6f3c" stroke-width="2"/>
    <path d="M30,28 L40,40" stroke="#fff" stroke-width="4" opacity="0.5" stroke-linecap="round"/>`)),
  "🍞": I(W(`
    <path d="M18,58 Q16,32 40,30 L72,30 Q88,36 84,54 Q82,78 66,80 L32,80 Q18,76 18,58 Z"
          fill="#d9a05b" stroke="#a97440" stroke-width="3" stroke-opacity="0.6"/>
    <path d="M34,38 Q40,48 34,58 M50,36 Q56,46 50,56 M66,38 Q72,48 66,58"
          fill="none" stroke="#fbf0dd" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    <ellipse cx="34" cy="70" rx="12" ry="5" fill="#fff" opacity="0.2"/>`)),
  "🥛": I(W(`
    <path d="M30,14 L70,14 L64,88 Q50,93 36,88 Z" fill="#eef4f8" stroke="#9db4c4" stroke-width="3"/>
    <path d="M32,34 L68,34 L64,86 Q50,91 36,86 Z" fill="#ffffff" stroke="none"/>
    <path d="M33,30 Q50,38 67,30" fill="none" stroke="#d5e2ec" stroke-width="3"/>
    <path d="M38,40 L36,80" stroke="#d5e2ec" stroke-width="5" stroke-linecap="round" opacity="0.8"/>`)),
  "🍰": I(W(`
    <path d="M14,84 L86,84 L84,56 Q50,44 16,56 Z" fill="#f6dade" stroke="#d9a0aa" stroke-width="3"/>
    <path d="M16,66 Q50,56 84,66" fill="none" stroke="#e0648a" stroke-width="6"/>
    <path d="M16,56 Q28,50 34,58 Q42,48 50,56 Q58,48 66,58 Q74,50 84,56 L84,60 Q50,50 16,60 Z" fill="#fbf0dd" stroke="#e3cf9f" stroke-width="2"/>
    <circle cx="50" cy="34" r="11" fill="#e04b3b" stroke="#b23325" stroke-width="2.5"/>
    <path d="M50,23 Q49,16 54,12" fill="none" stroke="#58a86a" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="46" cy="30" r="3" fill="#fff" opacity="0.4"/>`)),
  "🐘": I(W(`
    <circle cx="34" cy="42" r="20" fill="#9aa3b5" stroke="#7d8598" stroke-width="2.5"/>
    <circle cx="66" cy="42" r="20" fill="#9aa3b5" stroke="#7d8598" stroke-width="2.5"/>
    <circle cx="34" cy="42" r="11" fill="#c3c9d6"/>
    <circle cx="66" cy="42" r="11" fill="#c3c9d6"/>
    <circle cx="50" cy="48" r="24" fill="#aab2c2" stroke="#7d8598" stroke-width="2.5"/>
    <path d="M50,58 Q48,74 38,82 Q46,88 54,82 Q56,70 56,58 Z" fill="#aab2c2" stroke="#7d8598" stroke-width="2.5"/>
    <ellipse cx="40" cy="44" rx="4" ry="5" fill="#2f2f3a"/>
    <ellipse cx="60" cy="44" rx="4" ry="5" fill="#2f2f3a"/>
    <circle cx="41.5" cy="42" r="1.4" fill="#fff"/>
    <circle cx="61.5" cy="42" r="1.4" fill="#fff"/>`)),
  "🐭": I(W(`
    <circle cx="30" cy="30" r="15" fill="#b5bcc9" stroke="#8b93a5" stroke-width="2.5"/>
    <circle cx="70" cy="30" r="15" fill="#b5bcc9" stroke="#8b93a5" stroke-width="2.5"/>
    <circle cx="30" cy="31" r="8" fill="#f2c4cf"/>
    <circle cx="70" cy="31" r="8" fill="#f2c4cf"/>
    <circle cx="50" cy="56" r="26" fill="#c3c9d6" stroke="#8b93a5" stroke-width="2.5"/>
    <ellipse cx="50" cy="70" rx="6" ry="4.5" fill="#e0648a"/>
    <circle cx="41" cy="52" r="4" fill="#2f2f3a"/>
    <circle cx="59" cy="52" r="4" fill="#2f2f3a"/>
    <g stroke="#8b93a5" stroke-width="1.8" opacity="0.8">
      <line x1="42" y1="68" x2="24" y2="64"/><line x1="42" y1="72" x2="26" y2="74"/>
      <line x1="58" y1="68" x2="76" y2="64"/><line x1="58" y1="72" x2="74" y2="74"/>
    </g>`)),
  "🤲": I(W(`
    <rect x="36" y="16" width="28" height="24" rx="4" fill="#e04b3b" stroke="#b23325" stroke-width="2.5"/>
    <path d="M50,16 L50,40 M36,28 L64,28" stroke="#f2c94c" stroke-width="4.5"/>
    <path d="M50,15 Q40,13 42,6 Q48,2 50,13 Q52,2 58,6 Q60,13 50,15 Z" fill="#f2c94c" stroke="#c9992e" stroke-width="1.6"/>
    <path d="M8,66 Q6,52 16,52 Q17,45 24,47 Q26,40 32,44 Q38,40 40,48 L44,58 Q44,72 30,76 Q14,78 8,66 Z"
          fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>
    <path d="M17,52 L18,58 M25,48 L26,55 M33,46 L33,54" stroke="#cfa06b" stroke-width="1.8" opacity="0.8"/>
    <path d="M92,66 Q94,52 84,52 Q83,45 76,47 Q74,40 68,44 Q62,40 60,48 L56,58 Q56,72 70,76 Q86,78 92,66 Z"
          fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>
    <path d="M83,52 L82,58 M75,48 L74,55 M67,46 L67,54" stroke="#cfa06b" stroke-width="1.8" opacity="0.8"/>`)),
  "🎁": I(W(`
    <rect x="18" y="42" width="64" height="46" rx="6" fill="#b5573e" stroke="#8c4028" stroke-width="3"/>
    <rect x="14" y="30" width="72" height="16" rx="5" fill="#cf6b3c" stroke="#8c4028" stroke-width="3"/>
    <path d="M50,30 L50,88 M14,38 L86,38" stroke="url(#g-gold)" stroke-width="6"/>
    <path d="M50,28 Q34,26 36,16 Q46,10 50,26 Q54,10 64,16 Q66,26 50,28 Z"
          fill="url(#g-gold)" stroke="#b57a18" stroke-width="2.5"/>`)),

  // ---------- Arbaro ----------
  "🐰": I(W(`
    <path d="M32,44 Q22,14 36,8 Q48,12 46,42 Z" fill="#e9e4da" stroke="#bcb2a2" stroke-width="2.5"/>
    <path d="M36,38 Q30,18 37,13 Q43,18 42,38 Z" fill="#f2c4cf"/>
    <path d="M68,44 Q78,14 64,8 Q52,12 54,42 Z" fill="#e9e4da" stroke="#bcb2a2" stroke-width="2.5"/>
    <path d="M64,38 Q70,18 63,13 Q57,18 58,38 Z" fill="#f2c4cf"/>
    <ellipse cx="50" cy="62" rx="30" ry="28" fill="#f4f0e8" stroke="#bcb2a2" stroke-width="2.5"/>
    <path d="M45,68 L55,68 L50,74 Z" fill="#e0648a"/>
    <circle cx="39" cy="58" r="4.5" fill="#3a3a3a"/>
    <circle cx="61" cy="58" r="4.5" fill="#3a3a3a"/>
    <circle cx="40.5" cy="56.5" r="1.5" fill="#fff"/>
    <circle cx="62.5" cy="56.5" r="1.5" fill="#fff"/>
    <g stroke="#bcb2a2" stroke-width="1.8" opacity="0.9">
      <line x1="42" y1="70" x2="26" y2="67"/><line x1="42" y1="74" x2="28" y2="77"/>
      <line x1="58" y1="70" x2="74" y2="67"/><line x1="58" y1="74" x2="72" y2="77"/>
    </g>
    <ellipse cx="30" cy="66" rx="6" ry="4" fill="#e79a91" opacity="0.6"/>
    <ellipse cx="70" cy="66" rx="6" ry="4" fill="#e79a91" opacity="0.6"/>`)),
  "🐦": I(W(`
    <ellipse cx="46" cy="56" rx="28" ry="23" fill="#4fa7d8" stroke="#2f7fae" stroke-width="2.5"/>
    <circle cx="68" cy="38" r="16" fill="#6cbbe4" stroke="#2f7fae" stroke-width="2.5"/>
    <path d="M82,36 L96,40 L82,45 Z" fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.6"/>
    <path d="M18,52 Q4,46 8,60 Q12,70 24,66 Z" fill="#2f7fae"/>
    <path d="M36,54 Q52,48 56,62 Q48,74 36,68 Q30,60 36,54 Z" fill="#2f7fae" opacity="0.85"/>
    <circle cx="71" cy="35" r="4" fill="#2f2620"/>
    <circle cx="72.5" cy="33.5" r="1.3" fill="#fff"/>
    <path d="M40,79 L38,90 M52,78 L52,90" stroke="#b57a18" stroke-width="3" stroke-linecap="round"/>`)),
  "🐸": I(W(`
    <circle cx="30" cy="26" r="14" fill="#58a86a" stroke="#3f8a52" stroke-width="2.5"/>
    <circle cx="70" cy="26" r="14" fill="#58a86a" stroke="#3f8a52" stroke-width="2.5"/>
    <circle cx="30" cy="26" r="8" fill="#fff"/>
    <circle cx="70" cy="26" r="8" fill="#fff"/>
    <circle cx="30" cy="28" r="4.4" fill="#2f2620"/>
    <circle cx="70" cy="28" r="4.4" fill="#2f2620"/>
    <ellipse cx="50" cy="58" rx="34" ry="28" fill="#6cb87b" stroke="#3f8a52" stroke-width="2.5"/>
    <path d="M30,62 Q50,76 70,62" fill="none" stroke="#2f5c38" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="44" cy="48" r="2" fill="#2f5c38"/>
    <circle cx="56" cy="48" r="2" fill="#2f5c38"/>
    <ellipse cx="26" cy="66" rx="6" ry="4" fill="#e79a91" opacity="0.55"/>
    <ellipse cx="74" cy="66" rx="6" ry="4" fill="#e79a91" opacity="0.55"/>`)),
  "🐿️": I(W(`
    <path d="M52,86 Q88,88 92,52 Q95,18 62,14 Q80,26 78,48 Q75,74 46,78 Z"
          fill="#c46f35" stroke="#9a4f22" stroke-width="2.5"/>
    <path d="M60,74 Q82,72 84,46 Q85,28 68,22 Q78,32 76,48 Q73,68 52,72 Z" fill="#e0975c" opacity="0.7"/>
    <ellipse cx="36" cy="68" rx="21" ry="17" fill="#a9754f" stroke="#7a4a2b" stroke-width="2.5"/>
    <circle cx="29" cy="38" r="15" fill="#a9754f" stroke="#7a4a2b" stroke-width="2.5"/>
    <path d="M20,28 Q17,12 28,15 Q33,20 29,27 Z" fill="#a9754f" stroke="#7a4a2b" stroke-width="2"/>
    <path d="M23,25 Q22,17 27,18 Q29,21 27,25 Z" fill="#f2c4cf"/>
    <ellipse cx="31" cy="46" rx="8" ry="6" fill="#f2dcc4"/>
    <ellipse cx="42" cy="74" rx="10" ry="7" fill="#f2dcc4" opacity="0.9"/>
    <circle cx="26" cy="36" r="3.4" fill="#2f2620"/>
    <circle cx="27.5" cy="34.8" r="1.1" fill="#fff"/>
    <ellipse cx="17" cy="42" rx="3.4" ry="2.8" fill="#6b3a24"/>
    <ellipse cx="42" cy="58" rx="6" ry="7.5" fill="#d9a05b" stroke="#9a6f3c" stroke-width="1.8"/>
    <path d="M35,53 Q42,47 49,53 L48,57 Q42,52 36,57 Z" fill="#7a5730"/>
    <path d="M30,58 Q36,54 41,57 M32,66 Q38,62 43,65" fill="none" stroke="#7a4a2b" stroke-width="3" stroke-linecap="round"/>`)),
  "🦋": I(W(`
    <path d="M46,48 Q18,18 10,34 Q6,50 40,56 Z" fill="#e0648a" stroke="#b23f68" stroke-width="2.5"/>
    <path d="M54,48 Q82,18 90,34 Q94,50 60,56 Z" fill="#e0648a" stroke="#b23f68" stroke-width="2.5"/>
    <path d="M44,58 Q18,62 20,78 Q26,90 46,66 Z" fill="#9a7ab8" stroke="#75569a" stroke-width="2.5"/>
    <path d="M56,58 Q82,62 80,78 Q74,90 54,66 Z" fill="#9a7ab8" stroke="#75569a" stroke-width="2.5"/>
    <circle cx="26" cy="36" r="4" fill="#fff" opacity="0.6"/>
    <circle cx="74" cy="36" r="4" fill="#fff" opacity="0.6"/>
    <ellipse cx="50" cy="58" rx="6" ry="18" fill="#4a3a5a"/>
    <circle cx="50" cy="38" r="7" fill="#4a3a5a"/>
    <path d="M46,32 Q40,22 34,20 M54,32 Q60,22 66,20" fill="none" stroke="#4a3a5a" stroke-width="2.5" stroke-linecap="round"/>`)),
  "🦘": I(W(`
    <path d="M20,86 Q34,80 50,84 M28,92 Q44,88 60,90" fill="none" stroke="#c9a86e" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
    <ellipse cx="52" cy="48" rx="24" ry="19" transform="rotate(-28 52 48)" fill="#c48a54" stroke="#9a6438" stroke-width="2.5"/>
    <circle cx="72" cy="28" r="13" fill="#d29a64" stroke="#9a6438" stroke-width="2.5"/>
    <path d="M70,18 Q68,4 76,4 Q82,8 79,18 Z" fill="#d29a64" stroke="#9a6438" stroke-width="2"/>
    <path d="M30,62 Q12,68 14,56 Q20,44 34,52 Z" fill="#c48a54" stroke="#9a6438" stroke-width="2.5"/>
    <path d="M44,64 Q40,74 48,76 M62,58 Q64,68 72,66" fill="none" stroke="#9a6438" stroke-width="4" stroke-linecap="round"/>
    <circle cx="76" cy="26" r="3.4" fill="#2f2620"/>
    <ellipse cx="84" cy="32" rx="3" ry="2.4" fill="#6b3a24"/>`)),
  "🕊️": I(W(`
    <path d="M40,44 Q20,20 46,16 Q50,26 48,38 Q60,28 78,32 Q66,40 62,48 Z" fill="#f4f0e8" stroke="#c9c2b2" stroke-width="2.5"/>
    <ellipse cx="52" cy="58" rx="28" ry="17" transform="rotate(-12 52 58)" fill="#fdfaf1" stroke="#c9c2b2" stroke-width="2.5"/>
    <circle cx="76" cy="44" r="11" fill="#fdfaf1" stroke="#c9c2b2" stroke-width="2.5"/>
    <path d="M86,42 L96,45 L86,49 Z" fill="url(#g-gold)"/>
    <path d="M26,64 Q10,72 8,80 Q22,80 32,72 Z" fill="#f4f0e8" stroke="#c9c2b2" stroke-width="2"/>
    <circle cx="78" cy="42" r="3" fill="#2f2620"/>
    <path d="M40,56 Q52,52 60,58" fill="none" stroke="#dcd4c4" stroke-width="3" opacity="0.8"/>`)),
  "😴": I(W(`
    <circle cx="42" cy="56" r="32" fill="#f8d3a5" stroke="#cfa06b" stroke-width="3"/>
    <path d="M28,54 Q34,60 40,54 M50,54 Q56,60 62,54" fill="none" stroke="#4a2f1f" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="42" cy="70" rx="5" ry="4" fill="#c68a5c"/>
    <ellipse cx="24" cy="64" rx="6" ry="4" fill="#e79a91" opacity="0.7"/>
    <ellipse cx="60" cy="64" rx="6" ry="4" fill="#e79a91" opacity="0.7"/>
    <path d="M68,24 L82,24 L68,38 L82,38" fill="none" stroke="url(#g-gold)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M84,8 L93,8 L84,17 L93,17" fill="none" stroke="url(#g-gold)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`)),
  "🎶": I(W(`
    <ellipse cx="30" cy="76" rx="11" ry="8.5" transform="rotate(-16 30 76)" fill="#4a5a8c" stroke="#36436b" stroke-width="2.5"/>
    <ellipse cx="66" cy="68" rx="11" ry="8.5" transform="rotate(-16 66 68)" fill="#4a5a8c" stroke="#36436b" stroke-width="2.5"/>
    <path d="M39,73 L39,26 L75,18 L75,65" fill="none" stroke="#36436b" stroke-width="5"/>
    <path d="M39,26 L75,18 L75,32 L39,40 Z" fill="#4a5a8c" stroke="#36436b" stroke-width="2"/>
    <path d="M14,30 Q20,22 16,14 M86,50 Q92,42 88,34" fill="none" stroke="url(#g-gold)" stroke-width="3.5" stroke-linecap="round"/>`)),
  "🐤": I(W(`
    <circle cx="50" cy="58" r="28" fill="#f2c94c" stroke="#c9992e" stroke-width="2.5"/>
    <circle cx="50" cy="32" r="18" fill="#f6d76a" stroke="#c9992e" stroke-width="2.5"/>
    <path d="M46,10 Q50,4 54,10" fill="none" stroke="#c9992e" stroke-width="3" stroke-linecap="round"/>
    <path d="M64,32 L76,36 L64,41 Z" fill="#e8722e" stroke="#b5551f" stroke-width="1.6"/>
    <circle cx="56" cy="29" r="3.6" fill="#2f2620"/>
    <path d="M26,56 Q14,60 18,70 Q28,72 34,64 Z" fill="#f6d76a" stroke="#c9992e" stroke-width="2"/>
    <path d="M44,86 L42,94 M56,86 L56,94" stroke="#b57a18" stroke-width="3" stroke-linecap="round"/>`)),

  // ---------- Monto ----------
  "🌙": I(W(`
    <path d="M62,6 C30,14 14,42 22,66 C29,88 50,96 66,93 C46,84 35,66 37,46 C39,27 49,13 62,6 Z"
          fill="url(#g-gold)" stroke="#b57a18" stroke-width="3" stroke-linejoin="round"/>
    <path d="M78,16 l2,4.8 4.8,2 -4.8,2 -2,4.8 -2,-4.8 -4.8,-2 4.8,-2 Z" fill="url(#g-gold)"/>
    <path d="M86,44 l1.5,3.6 3.6,1.5 -3.6,1.5 -1.5,3.6 -1.5,-3.6 -3.6,-1.5 3.6,-1.5 Z" fill="url(#g-gold)"/>`)),
  "☀️": I(W(`
    <g stroke="#e0a63c" stroke-width="6" stroke-linecap="round">
      <line x1="50" y1="4" x2="50" y2="16"/><line x1="50" y1="84" x2="50" y2="96"/>
      <line x1="4" y1="50" x2="16" y2="50"/><line x1="84" y1="50" x2="96" y2="50"/>
      <line x1="18" y1="18" x2="26" y2="26"/><line x1="74" y1="74" x2="82" y2="82"/>
      <line x1="18" y1="82" x2="26" y2="74"/><line x1="74" y1="26" x2="82" y2="18"/>
    </g>
    <circle cx="50" cy="50" r="26" fill="url(#g-gold)" stroke="#b57a18" stroke-width="3"/>
    <circle cx="42" cy="42" r="7" fill="#fff" opacity="0.35"/>`)),
  "⭐": I(`<g filter="url(#o-wob)" transform="translate(50,54) scale(4.4)">
    <path d="M0,-10 L2.5,-3.4 L9.5,-3.1 L4,1.3 L5.9,8.1 L0,4.2 L-5.9,8.1 L-4,1.3 L-9.5,-3.1 L-2.5,-3.4 Z"
          fill="url(#g-gold)" stroke="#b57a18" stroke-width="0.8" stroke-linejoin="round"/>
    </g>`),
  "☁️": I(W(`
    <ellipse cx="40" cy="56" rx="26" ry="18" fill="#fdfdfd" stroke="#c4d2dc" stroke-width="2.5"/>
    <ellipse cx="62" cy="48" rx="20" ry="15" fill="#fdfdfd" stroke="#c4d2dc" stroke-width="2.5"/>
    <ellipse cx="52" cy="62" rx="30" ry="14" fill="#ffffff"/>
    <ellipse cx="34" cy="48" rx="8" ry="5" fill="#fff" opacity="0.9"/>`)),
  "💧": I(W(`
    <path d="M50,8 C50,8 80,48 80,64 A30,30 0 1 1 20,64 C20,48 50,8 50,8 Z"
          fill="#4fa7d8" stroke="#2f7fae" stroke-width="3"/>
    <path d="M36,58 Q32,68 38,76" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.5"/>`)),
  "🔥": I(W(`
    <path d="M50,6 Q60,26 72,38 Q84,52 78,70 Q70,90 50,92 Q30,90 22,70 Q16,52 28,38 Q36,30 38,18 Q44,28 46,34 Q52,24 50,6 Z"
          fill="#e8722e" stroke="#b5551f" stroke-width="3"/>
    <path d="M50,42 Q58,54 60,64 Q60,80 50,82 Q40,80 40,64 Q42,54 50,42 Z" fill="#f2c94c"/>
    <ellipse cx="50" cy="72" rx="5" ry="7" fill="#fbf0dd" opacity="0.8"/>`)),
  "⛰️": I(W(`
    <path d="M8,84 Q28,28 40,22 Q48,16 56,36 Q62,50 60,60 Q36,90 8,84 Z"
          fill="url(#g-mtn)" stroke="#655a78" stroke-width="2.5" opacity="0.95"/>
    <path d="M30,84 Q52,18 66,14 Q76,8 84,36 Q94,62 88,80 Q60,92 30,84 Z"
          fill="url(#g-mtn)" stroke="#655a78" stroke-width="3"/>
    <path d="M58,32 Q66,16 72,20 Q78,22 76,38 Q66,30 58,32 Z" fill="#f6efe2"/>
    <path d="M32,38 Q38,26 43,29 Q47,31 45,42 Q38,36 32,38 Z" fill="#f6efe2" opacity="0.9"/>`)),
  "🌸": I(W(`
    <g fill="#f2a9c4" stroke="#d97ba2" stroke-width="2">
      <circle cx="50" cy="24" r="15"/><circle cx="75" cy="42" r="15"/>
      <circle cx="66" cy="72" r="15"/><circle cx="34" cy="72" r="15"/>
      <circle cx="25" cy="42" r="15"/>
    </g>
    <circle cx="50" cy="50" r="13" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2"/>
    <circle cx="46" cy="46" r="4" fill="#fff" opacity="0.4"/>`)),
  "🥤": I(W(`
    <path d="M30,32 L70,32 L64,88 Q50,92 36,88 Z" fill="#e0648a" stroke="#b23f68" stroke-width="3"/>
    <path d="M26,24 L74,24 L72,34 L28,34 Z" fill="#fbf0dd" stroke="#dcc9a0" stroke-width="2.5"/>
    <path d="M54,24 L62,4" stroke="#4fa7d8" stroke-width="5" stroke-linecap="round"/>
    <path d="M34,44 L66,44" stroke="#fff" stroke-width="4" opacity="0.4"/>
    <circle cx="44" cy="60" r="3" fill="#fff" opacity="0.5"/>
    <circle cx="54" cy="70" r="2.4" fill="#fff" opacity="0.5"/>`)),
  "🌃": I(W(`
    <rect x="12" y="10" width="76" height="80" rx="12" fill="#2f3b63" stroke="#222b4a" stroke-width="3"/>
    <path d="M64,22 A16,16 0 1 0 64,54 A12.5,12.5 0 1 1 64,22 Z" fill="url(#g-gold)"/>
    <path d="M30,26 l1.8,4.3 4.3,1.8 -4.3,1.8 -1.8,4.3 -1.8,-4.3 -4.3,-1.8 4.3,-1.8 Z" fill="#f6d76a"/>
    <path d="M42,50 l1.4,3.4 3.4,1.4 -3.4,1.4 -1.4,3.4 -1.4,-3.4 -3.4,-1.4 3.4,-1.4 Z" fill="#f6d76a"/>
    <path d="M12,74 L28,74 L28,62 L40,62 L40,70 L54,70 L54,60 L66,60 L66,72 L88,72 L88,90 Q50,96 12,90 Z"
          fill="#1c2338"/>
    <circle cx="33" cy="68" r="1.6" fill="#f6d76a"/>
    <circle cx="60" cy="66" r="1.6" fill="#f6d76a"/>`)),
  "🦉": null, // uzupełniane niżej portretem Strigo (spójność z NPC)
  "🌌": I(W(`
    <path d="M50,8 Q86,12 90,48 Q92,84 52,90 Q12,88 10,50 Q12,14 50,8 Z"
          fill="#2f3b63" stroke="#222b4a" stroke-width="3"/>
    <path d="M26,56 Q38,34 60,38 Q78,42 74,58 Q66,72 48,68 Q36,66 38,56 Q42,48 52,50"
          fill="none" stroke="#7f8bd0" stroke-width="4.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M32,26 l1.8,4.3 4.3,1.8 -4.3,1.8 -1.8,4.3 -1.8,-4.3 -4.3,-1.8 4.3,-1.8 Z" fill="#f6d76a"/>
    <path d="M72,22 l1.4,3.4 3.4,1.4 -3.4,1.4 -1.4,3.4 -1.4,-3.4 -3.4,-1.4 3.4,-1.4 Z" fill="#fff"/>
    <path d="M66,76 l1.4,3.4 3.4,1.4 -3.4,1.4 -1.4,3.4 -1.4,-3.4 -3.4,-1.4 3.4,-1.4 Z" fill="#f6d76a"/>
    <circle cx="24" cy="70" r="1.8" fill="#fff"/>`)),
  "🪶": I(W(`
    <path d="M68,10 Q90,28 70,58 Q56,78 40,80 Q40,60 48,42 Q56,22 68,10 Z"
          fill="#8b93b8" stroke="#5a628c" stroke-width="2.5"/>
    <path d="M68,12 Q52,40 42,76" fill="none" stroke="#454d73" stroke-width="2.5"/>
    <path d="M42,76 Q34,86 26,92" fill="none" stroke="#8a6136" stroke-width="3.5" stroke-linecap="round"/>
    <g stroke="#c7cde6" stroke-width="2" opacity="0.8">
      <path d="M58,30 Q64,32 70,30"/><path d="M52,44 Q60,46 68,42"/><path d="M47,58 Q54,60 62,56"/>
    </g>`)),

  // ---------- Marbordo ----------
  "🌧️": I(W(`
    <ellipse cx="40" cy="34" rx="24" ry="16" fill="#c4d2dc" stroke="#93a7b5" stroke-width="2.5"/>
    <ellipse cx="62" cy="28" rx="18" ry="13" fill="#c4d2dc" stroke="#93a7b5" stroke-width="2.5"/>
    <ellipse cx="52" cy="38" rx="28" ry="13" fill="#d5e0e8"/>
    <g fill="#4fa7d8" stroke="#2f7fae" stroke-width="1.6">
      <path d="M32,56 C32,56 40,66 40,71 A8,8 0 1 1 24,71 C24,66 32,56 32,56 Z"/>
      <path d="M54,62 C54,62 62,72 62,77 A8,8 0 1 1 46,77 C46,72 54,62 54,62 Z"/>
      <path d="M74,54 C74,54 81,63 81,67 A7,7 0 1 1 67,67 C67,63 74,54 74,54 Z"/>
    </g>`)),
  "💨": I(W(`
    <path d="M8,36 L58,36 Q72,36 72,24 Q72,14 62,14" fill="none" stroke="#7fb2c9" stroke-width="6" stroke-linecap="round"/>
    <path d="M8,54 L74,54 Q88,54 88,66 Q88,78 76,78" fill="none" stroke="#9cc5d8" stroke-width="6" stroke-linecap="round"/>
    <path d="M8,72 L48,72 Q58,72 58,80" fill="none" stroke="#7fb2c9" stroke-width="5" stroke-linecap="round" opacity="0.8"/>`)),
  "🌈": I(W(`
    <path d="M10,80 A40,40 0 0 1 90,80" fill="none" stroke="#e04b3b" stroke-width="9"/>
    <path d="M19,80 A31,31 0 0 1 81,80" fill="none" stroke="#f2b23d" stroke-width="9"/>
    <path d="M28,80 A22,22 0 0 1 72,80" fill="none" stroke="#58a86a" stroke-width="9"/>
    <path d="M37,80 A13,13 0 0 1 63,80" fill="none" stroke="#4fa7d8" stroke-width="9"/>
    <ellipse cx="14" cy="82" rx="12" ry="9" fill="#fdfdfd" stroke="#c4d2dc" stroke-width="2"/>
    <ellipse cx="86" cy="82" rx="12" ry="9" fill="#fdfdfd" stroke="#c4d2dc" stroke-width="2"/>`)),
  "😊": I(W(`
    <circle cx="50" cy="52" r="36" fill="#f8d3a5" stroke="#cfa06b" stroke-width="3"/>
    <path d="M32,44 Q38,38 44,44 M56,44 Q62,38 68,44" fill="none" stroke="#4a2f1f" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M34,62 Q50,76 66,62" fill="none" stroke="#4a2f1f" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="28" cy="56" rx="7" ry="4.5" fill="#e79a91" opacity="0.75"/>
    <ellipse cx="72" cy="56" rx="7" ry="4.5" fill="#e79a91" opacity="0.75"/>`)),
  "😢": I(W(`
    <circle cx="50" cy="52" r="36" fill="#f8d3a5" stroke="#cfa06b" stroke-width="3"/>
    <path d="M32,42 Q38,46 44,44 M56,44 Q62,46 68,42" fill="none" stroke="#4a2f1f" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="38" cy="52" r="4" fill="#4a2f1f"/>
    <circle cx="62" cy="52" r="4" fill="#4a2f1f"/>
    <path d="M36,72 Q50,62 64,72" fill="none" stroke="#4a2f1f" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M68,56 C68,56 75,65 75,69 A7,7 0 1 1 61,69 C61,65 68,56 68,56 Z" fill="#4fa7d8" stroke="#2f7fae" stroke-width="1.6"/>`)),
  "😱": I(W(`
    <circle cx="50" cy="52" r="36" fill="#f8d3a5" stroke="#cfa06b" stroke-width="3"/>
    <circle cx="36" cy="44" r="9" fill="#fff" stroke="#4a2f1f" stroke-width="2"/>
    <circle cx="64" cy="44" r="9" fill="#fff" stroke="#4a2f1f" stroke-width="2"/>
    <circle cx="36" cy="46" r="3.4" fill="#2f2620"/>
    <circle cx="64" cy="46" r="3.4" fill="#2f2620"/>
    <path d="M28,32 Q34,28 40,31 M60,31 Q66,28 72,32" fill="none" stroke="#4a2f1f" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="50" cy="70" rx="9" ry="12" fill="#4a2f1f"/>
    <ellipse cx="50" cy="74" rx="5" ry="5" fill="#e0648a"/>`)),
  "🤝": I(W(`
    <path d="M4,42 L34,42 L34,64 L4,64 Z" fill="#b5573e" stroke="#8c4028" stroke-width="2.5"/>
    <path d="M96,42 L66,42 L66,64 L96,64 Z" fill="#4a5a8c" stroke="#36436b" stroke-width="2.5"/>
    <path d="M30,52 Q40,42 52,48 L64,54 Q70,58 66,62 Q60,68 50,64 L38,60 Q30,58 30,52 Z"
          fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>
    <path d="M50,48 Q58,42 66,46 Q72,50 68,54" fill="#e6ad78" stroke="#cfa06b" stroke-width="2.5"/>
    <path d="M44,52 L52,56 M50,48 L58,52" stroke="#cfa06b" stroke-width="2" opacity="0.7"/>`)),
  "🌤️": I(W(`
    <circle cx="36" cy="36" r="20" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2.5"/>
    <g stroke="#e0a63c" stroke-width="5" stroke-linecap="round">
      <line x1="36" y1="6" x2="36" y2="13"/><line x1="6" y1="36" x2="13" y2="36"/>
      <line x1="14" y1="14" x2="20" y2="20"/><line x1="52" y1="14" x2="58" y2="20"/>
    </g>
    <ellipse cx="56" cy="64" rx="26" ry="16" fill="#fdfdfd" stroke="#c4d2dc" stroke-width="2.5"/>
    <ellipse cx="76" cy="58" rx="16" ry="12" fill="#fdfdfd" stroke="#c4d2dc" stroke-width="2.5"/>
    <ellipse cx="64" cy="70" rx="28" ry="11" fill="#ffffff"/>`)),
  "🌊": I(W(`
    <path d="M10,72 Q8,38 36,30 Q66,22 74,44 Q78,58 64,60 Q52,60 52,50 Q52,42 60,42 Q56,36 46,40 Q34,46 36,60 Q38,76 58,78 L90,78 Q92,86 84,90 L18,90 Q10,84 10,72 Z"
          fill="#4fa7d8" stroke="#2f7fae" stroke-width="3"/>
    <circle cx="24" cy="34" r="5" fill="#dff0ee" opacity="0.9"/>
    <circle cx="34" cy="24" r="4" fill="#dff0ee" opacity="0.8"/>
    <circle cx="48" cy="20" r="3.4" fill="#dff0ee" opacity="0.7"/>
    <path d="M20,76 Q40,70 60,74" fill="none" stroke="#8ed0cd" stroke-width="4" stroke-linecap="round" opacity="0.8"/>`)),
  "🔭": I(W(`
    <path d="M14,54 L64,22 L74,38 L24,70 Z" fill="#4a5a8c" stroke="#36436b" stroke-width="3"/>
    <path d="M60,18 L78,8 L88,24 L70,34 Z" fill="#36436b" stroke="#222b4a" stroke-width="2.5"/>
    <path d="M12,58 L22,74 L30,68 L20,52 Z" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2"/>
    <path d="M44,62 L36,92 M52,58 L60,90" stroke="#8a6136" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M90,44 l1.6,3.8 3.8,1.6 -3.8,1.6 -1.6,3.8 -1.6,-3.8 -3.8,-1.6 3.8,-1.6 Z" fill="#f6d76a"/>`)),
  "🏖️": I(W(`
    <path d="M10,86 Q50,74 90,86 Q90,94 82,94 L18,94 Q10,92 10,86 Z" fill="#eeda9e" stroke="#c9a15c" stroke-width="2.5"/>
    <path d="M54,84 L60,30" stroke="#8a6136" stroke-width="4" stroke-linecap="round"/>
    <path d="M24,36 Q56,4 92,28 Q80,30 74,36 Q64,28 56,36 Q46,30 38,38 Q30,34 24,36 Z"
          fill="#e0648a" stroke="#b23f68" stroke-width="2.5"/>
    <path d="M40,34 Q58,18 78,30" fill="none" stroke="#fbf0dd" stroke-width="4" opacity="0.7"/>
    <circle cx="26" cy="80" r="3" fill="#fdf6e8" stroke="#d9b98a" stroke-width="1.4"/>`)),

  // ---------- Kastelo ----------
  "🗼": I(W(`
    <rect x="34" y="34" width="32" height="54" rx="3" fill="#e8dcc4" stroke="#b39a6e" stroke-width="3"/>
    <path d="M28,36 L50,8 L72,36 Z" fill="#b5573e" stroke="#8c4028" stroke-width="3"/>
    <path d="M50,8 L50,-2" stroke="#6b4226" stroke-width="3"/>
    <path d="M30,56 L70,56 M30,72 L70,72 M50,36 L50,88" stroke="#b39a6e" stroke-width="2" opacity="0.6"/>
    <rect x="43" y="42" width="14" height="10" rx="4" fill="#4a5a8c"/>
    <rect x="43" y="74" width="14" height="14" rx="4" fill="#6b4226"/>
    <path d="M50,6 L64,10 L50,15 Z" fill="#e8722e"/>`)),
  "🔑": I(W(`
    <circle cx="50" cy="24" r="15" fill="none" stroke="#e0a63c" stroke-width="10"/>
    <rect x="45" y="37" width="10" height="51" rx="4" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
    <rect x="53" y="62" width="17" height="9" rx="3" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
    <rect x="53" y="77" width="12" height="9" rx="3" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
    <circle cx="50" cy="24" r="15" fill="none" stroke="#b57a18" stroke-width="2" opacity="0.5"/>
    <circle cx="44" cy="18" r="3.5" fill="#fff" opacity="0.5"/>`)),
  "🗝️": I(W(`
    <circle cx="50" cy="28" r="18" fill="none" stroke="#b0803c" stroke-width="8"/>
    <circle cx="50" cy="28" r="6" fill="none" stroke="#b0803c" stroke-width="4"/>
    <path d="M50,46 L50,90" stroke="#b0803c" stroke-width="8" stroke-linecap="round"/>
    <path d="M50,72 L64,72 M50,86 L60,86" stroke="#b0803c" stroke-width="7" stroke-linecap="round"/>`)),
  "👑": I(W(`
    <path d="M16,74 L12,32 L32,48 L50,20 L68,48 L88,32 L84,74 Q50,84 16,74 Z"
          fill="url(#g-gold)" stroke="#b57a18" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="12" cy="30" r="5" fill="#f6d76a" stroke="#b57a18" stroke-width="2"/>
    <circle cx="50" cy="17" r="5.5" fill="#f6d76a" stroke="#b57a18" stroke-width="2"/>
    <circle cx="88" cy="30" r="5" fill="#f6d76a" stroke="#b57a18" stroke-width="2"/>
    <circle cx="34" cy="62" r="5" fill="#e04b3b" stroke="#b23325" stroke-width="1.6"/>
    <circle cx="50" cy="64" r="5" fill="#4fa7d8" stroke="#2f7fae" stroke-width="1.6"/>
    <circle cx="66" cy="62" r="5" fill="#58a86a" stroke="#3f8a52" stroke-width="1.6"/>`)),
  "⚔️": I(W(`
    <g transform="rotate(45 50 44)">
      <path d="M50,-4 L56,6 L56,54 L44,54 L44,6 Z" fill="#dde2ec" stroke="#8b93a5" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="50" y1="4" x2="50" y2="52" stroke="#b8c0d0" stroke-width="2.4"/>
      <rect x="37" y="54" width="26" height="8" rx="3" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
      <rect x="45" y="62" width="10" height="17" rx="4" fill="#8a5a34" stroke="#6b4226" stroke-width="2"/>
      <circle cx="50" cy="83" r="5" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
    </g>
    <g transform="rotate(-45 50 44)">
      <path d="M50,-4 L56,6 L56,54 L44,54 L44,6 Z" fill="#c9d0dd" stroke="#8b93a5" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="50" y1="4" x2="50" y2="52" stroke="#aab2c2" stroke-width="2.4"/>
      <rect x="37" y="54" width="26" height="8" rx="3" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
      <rect x="45" y="62" width="10" height="17" rx="4" fill="#8a5a34" stroke="#6b4226" stroke-width="2"/>
      <circle cx="50" cy="83" r="5" fill="#e0a63c" stroke="#b57a18" stroke-width="2"/>
    </g>`)),
  "🛡️": I(W(`
    <path d="M50,6 Q72,14 88,16 Q88,52 76,72 Q64,88 50,94 Q36,88 24,72 Q12,52 12,16 Q28,14 50,6 Z"
          fill="#4a5a8c" stroke="#36436b" stroke-width="3"/>
    <path d="M50,14 Q66,20 80,22 Q79,50 69,66 Q60,80 50,85 Z" fill="#5d70a8" opacity="0.8"/>
    <path d="M12,38 Q50,30 88,38 L88,48 Q50,40 12,48 Z" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2"/>
    <circle cx="50" cy="60" r="9" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2"/>`)),
  "💰": I(W(`
    <path d="M40,26 Q34,16 38,10 Q50,16 62,10 Q66,16 60,26 Z" fill="#9a6f3c" stroke="#7a5730" stroke-width="2.5"/>
    <path d="M38,24 Q14,42 16,66 Q18,88 50,90 Q82,88 84,66 Q86,42 62,24 Z"
          fill="#c99a5e" stroke="#9a6f3c" stroke-width="3"/>
    <path d="M36,26 L64,26" stroke="#7a5730" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="58" r="15" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2.5"/>
    <path d="M50,50 L50,66 M44,54 Q50,48 56,54 M44,62 Q50,68 56,62" fill="none" stroke="#b57a18" stroke-width="2.5" stroke-linecap="round"/>`)),
  "📏": I(W(`
    <path d="M14,88 L86,88" stroke="#8a5a34" stroke-width="4.5" stroke-linecap="round"/>
    <rect x="28" y="18" width="20" height="70" rx="4" fill="#e8722e" stroke="#b5551f" stroke-width="2.5"/>
    <path d="M38,28 L38,78" stroke="#fff" stroke-width="3" opacity="0.3"/>
    <path d="M68,80 L68,26 M56,38 L68,24 L80,38" fill="none" stroke="#58a86a" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`)),
  "🔻": I(W(`
    <path d="M14,88 L86,88" stroke="#8a5a34" stroke-width="4.5" stroke-linecap="round"/>
    <rect x="28" y="62" width="20" height="26" rx="4" fill="#e8722e" stroke="#b5551f" stroke-width="2.5"/>
    <path d="M38,68 L38,82" stroke="#fff" stroke-width="3" opacity="0.3"/>
    <path d="M68,28 L68,74 M56,62 L68,76 L80,62" fill="none" stroke="#d95f2b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`)),
  "🔓": I(W(`
    <path d="M30,44 L30,32 A17,17 0 0 1 64,32 L64,38" fill="none" stroke="#8a7a5a" stroke-width="7" stroke-linecap="round" transform="rotate(-18 47 32)"/>
    <rect x="24" y="44" width="52" height="42" rx="9" fill="url(#g-gold)" stroke="#b57a18" stroke-width="3"/>
    <circle cx="50" cy="60" r="6.5" fill="#7a5718"/>
    <rect x="47" y="62" width="6" height="12" rx="3" fill="#7a5718"/>`)),
  "🏯": I(W(`
    <rect x="18" y="46" width="12" height="34" rx="2.5" fill="#e8dcc4" stroke="#b39a6e" stroke-width="2.5"/>
    <rect x="70" y="46" width="12" height="34" rx="2.5" fill="#e8dcc4" stroke="#b39a6e" stroke-width="2.5"/>
    <rect x="28" y="56" width="44" height="26" fill="#ddcdaf" stroke="#b39a6e" stroke-width="2.5"/>
    <rect x="40" y="30" width="20" height="30" fill="#e8dcc4" stroke="#b39a6e" stroke-width="2.5"/>
    <path d="M14,48 L24,30 L34,48 Z" fill="#b5573e" stroke="#8c4028" stroke-width="2.2"/>
    <path d="M66,48 L76,30 L86,48 Z" fill="#b5573e" stroke="#8c4028" stroke-width="2.2"/>
    <path d="M36,32 L50,12 L64,32 Z" fill="#b5573e" stroke="#8c4028" stroke-width="2.2"/>
    <path d="M50,12 L50,2 L61,6 L50,10 Z" fill="#e8722e" stroke="#b5551f" stroke-width="1.4"/>
    <rect x="45" y="68" width="10" height="14" rx="4" fill="#6b4226"/>
    <path d="M18,88 Q50,94 82,88" fill="none" stroke="#b39a6e" stroke-width="3" stroke-linecap="round"/>`)),

  // ---------- Ĉielo ----------
  "🪁": I(W(`
    <path d="M50,6 L80,42 L50,80 L20,42 Z" fill="#e0648a" stroke="#b23f68" stroke-width="3" stroke-linejoin="round"/>
    <path d="M50,6 L50,80 M20,42 L80,42" stroke="#fbf0dd" stroke-width="2.6" opacity="0.85"/>
    <ellipse cx="38" cy="30" rx="8" ry="6" fill="#fff" opacity="0.3"/>
    <path d="M50,80 Q42,86 46,94" fill="none" stroke="#8a6136" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M44,84 l-8,-2 4,7 Z" fill="#f2b23d" stroke="#c9992e" stroke-width="1.4"/>
    <path d="M47,93 l-7,2 6,4 Z" fill="#4fa7d8" stroke="#2f7fae" stroke-width="1.4"/>`)),
  "🎈": I(W(`
    <ellipse cx="50" cy="36" rx="26" ry="30" fill="#e04b3b" stroke="#b23325" stroke-width="3"/>
    <path d="M43,67 L57,67 L50,76 Z" fill="#b23325"/>
    <path d="M50,76 Q40,84 48,94" fill="none" stroke="#8a6136" stroke-width="2.4" stroke-linecap="round"/>
    <ellipse cx="40" cy="24" rx="8" ry="11" fill="#fff" opacity="0.35"/>`)),
  "✈️": I(W(`
    <path d="M14,44 L24,20 L36,42 Z" fill="#4a5a8c" stroke="#36436b" stroke-width="2.5"/>
    <ellipse cx="52" cy="52" rx="40" ry="14" fill="#eef1f6" stroke="#8b93a5" stroke-width="3"/>
    <path d="M46,56 L30,86 L46,82 L62,58 Z" fill="#4a5a8c" stroke="#36436b" stroke-width="2.5"/>
    <circle cx="42" cy="48" r="3.6" fill="#aee7f5" stroke="#8b93a5" stroke-width="1.4"/>
    <circle cx="56" cy="48" r="3.6" fill="#aee7f5" stroke="#8b93a5" stroke-width="1.4"/>
    <circle cx="70" cy="48" r="3.6" fill="#aee7f5" stroke="#8b93a5" stroke-width="1.4"/>
    <path d="M20,48 Q28,44 36,46" fill="none" stroke="#fff" stroke-width="3" opacity="0.5" stroke-linecap="round"/>`)),
  "⚡": I(W(`
    <path d="M58,4 L26,52 L44,52 L36,94 L74,40 L54,40 Z"
          fill="url(#g-gold)" stroke="#b57a18" stroke-width="3" stroke-linejoin="round"/>
    <path d="M52,14 L38,42" stroke="#fff" stroke-width="3" opacity="0.4" stroke-linecap="round"/>`)),
  "🙈": I(W(`
    <circle cx="50" cy="50" r="36" fill="#f8d3a5" stroke="#cfa06b" stroke-width="3"/>
    <ellipse cx="33" cy="44" rx="14" ry="12" fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>
    <ellipse cx="67" cy="44" rx="14" ry="12" fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>
    <path d="M27,40 L27,48 M33,38 L33,48 M39,40 L39,48 M61,40 L61,48 M67,38 L67,48 M73,40 L73,48"
          stroke="#cfa06b" stroke-width="1.8" opacity="0.8"/>
    <path d="M40,68 Q50,76 60,68" fill="none" stroke="#4a2f1f" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="24" cy="62" rx="6" ry="4" fill="#e79a91" opacity="0.7"/>
    <ellipse cx="76" cy="62" rx="6" ry="4" fill="#e79a91" opacity="0.7"/>`)),
  "🔍": I(W(`
    <circle cx="42" cy="40" r="26" fill="#d8ecf6" fill-opacity="0.55" stroke="#4a5a8c" stroke-width="6"/>
    <path d="M62,60 L86,84" stroke="#8a5a34" stroke-width="9" stroke-linecap="round"/>
    <path d="M28,32 Q34,22 46,22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`)),
  "🌅": I(W(`
    <rect x="8" y="62" width="84" height="28" rx="6" fill="#4fa7d8" stroke="#2f7fae" stroke-width="2.5"/>
    <path d="M28,62 A22,22 0 0 1 72,62 Z" fill="url(#g-gold)" stroke="#b57a18" stroke-width="2.5"/>
    <g stroke="#e0a63c" stroke-width="4.5" stroke-linecap="round">
      <line x1="50" y1="24" x2="50" y2="32"/>
      <line x1="24" y1="36" x2="30" y2="42"/><line x1="76" y1="36" x2="70" y2="42"/>
      <line x1="12" y1="58" x2="20" y2="58"/><line x1="88" y1="58" x2="80" y2="58"/>
    </g>
    <path d="M18,72 q3,-2.5 6,0 q3,2.5 6,0 M60,80 q3,-2.5 6,0 q3,2.5 6,0"
          fill="none" stroke="#dff0ee" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>`)),
  "💭": I(W(`
    <path d="M50,12 Q78,12 84,32 Q94,38 88,52 Q90,66 74,68 Q66,78 52,74 Q36,80 28,68 Q12,66 14,50 Q8,36 20,30 Q26,12 50,12 Z"
          fill="#ffffff" stroke="#c4d2dc" stroke-width="3"/>
    <circle cx="30" cy="80" r="6" fill="#fff" stroke="#c4d2dc" stroke-width="2.4"/>
    <circle cx="18" cy="91" r="4" fill="#fff" stroke="#c4d2dc" stroke-width="2"/>
    <path d="M48,26 l3,7.2 7.2,3 -7.2,3 -3,7.2 -3,-7.2 -7.2,-3 7.2,-3 Z" fill="url(#g-gold)"/>
    <path d="M68,42 l1.6,3.8 3.8,1.6 -3.8,1.6 -1.6,3.8 -1.6,-3.8 -3.8,-1.6 3.8,-1.6 Z" fill="#f6d76a"/>`)),
  "🤗": I(W(`
    <circle cx="50" cy="44" r="32" fill="#f8d3a5" stroke="#cfa06b" stroke-width="3"/>
    <path d="M36,38 Q42,32 48,38 M52,38 Q58,32 64,38" fill="none" stroke="#4a2f1f" stroke-width="3" stroke-linecap="round"/>
    <path d="M38,54 Q50,64 62,54" fill="none" stroke="#4a2f1f" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="30" cy="50" rx="6" ry="4" fill="#e79a91" opacity="0.75"/>
    <ellipse cx="70" cy="50" rx="6" ry="4" fill="#e79a91" opacity="0.75"/>
    <path d="M12,86 Q10,68 24,66 Q34,64 40,74 Q34,84 22,86 Z" fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>
    <path d="M88,86 Q90,68 76,66 Q66,64 60,74 Q66,84 78,86 Z" fill="#f0c398" stroke="#cfa06b" stroke-width="2.5"/>`)),

  // ---------- Wspólne ----------
  "❓": I(W(`
    <circle cx="50" cy="50" r="40" fill="#fff8e8" stroke="#e3cf9f" stroke-width="3"/>
    <path d="M36,38 Q36,24 50,24 Q64,24 64,37 Q64,46 55,50 Q51,52 51,58"
          fill="none" stroke="#8a7a5a" stroke-width="8" stroke-linecap="round"/>
    <circle cx="51" cy="72" r="5.5" fill="#8a7a5a"/>`)),
  "💤": I(W(`
    <path d="M22,34 L48,34 L22,60 L48,60" fill="none" stroke="url(#g-gold)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56,20 L76,20 L56,40 L76,40" fill="none" stroke="url(#g-gold)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64,56 L78,56 L64,70 L78,70" fill="none" stroke="url(#g-gold)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`)),
};

// Sowa jako obiekt = portret Strigo z art.js (to ta sama postać).
OBJ["🦉"] = npcArt("strigo");
// Iskierki w scenkach — ta sama gwiazdka co w statusach mapy.
OBJ["✨"] = `<svg viewBox="-11 -11 22 22" aria-hidden="true">
  <path d="M0,-10 L2.6,-2.6 L10,0 L2.6,2.6 L0,10 L-2.6,2.6 L-10,0 L-2.6,-2.6 Z"
        fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M6,-8 l0.9,2.2 2.2,0.9 -2.2,0.9 -0.9,2.2 -0.9,-2.2 -2.2,-0.9 2.2,-0.9 Z" fill="url(#g-gold)"/>
</svg>`;
// Kwiatek 🌼-style z Vilaĝo ("floro" tam używa 🌻, w Monto 🌸 — oba wyżej).

// Zwraca SVG ikony albo null, gdy dla emoji nie ma jeszcze grafiki —
// wtedy widok pokazuje oryginalne emoji (nowe strefy działają od razu).
export function objArt(emoji) {
  return OBJ[emoji] ?? null;
}

// Scenki mogą składać się z kilku emoji ("🌙🦉⭐", "🐦🐤🐥") — renderujemy
// każdy znak osobno; jeśli KTÓREGOKOLWIEK brakuje, wracamy do czystego
// tekstu, żeby scenka nigdy nie była w połowie narysowana, w połowie pisana.
const segmenter = typeof Intl !== "undefined" && Intl.Segmenter
  ? new Intl.Segmenter("eo", { granularity: "grapheme" })
  : null;

function graphemes(str) {
  if (segmenter) return [...segmenter.segment(str)].map((s) => s.segment);
  return [...str];
}

export function objSceneArt(str) {
  // 🐥 wygląda jak 🐤 — celowo ten sam rysunek, scenka "ptasia rodzina".
  const alias = { "🐥": "🐤" };
  const parts = graphemes(str).filter((g) => g.trim());
  const arts = parts.map((g) => objArt(alias[g] ?? g));
  if (arts.some((a) => !a)) return null;
  return arts.join("");
}

export { starIcon, sparkIcon };
