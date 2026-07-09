// Cała grafika wektorowa gry w stylu "Fabela Insulo": akwarelowo-bajkowe
// portrety NPC, generowane na żywo awatary (typ + kolor włosów/sierści),
// sceny bajki wprowadzającej i drobne ikonki statusu.
//
// Wspólny język plastyczny (patrz filtry w index.html, prefiks a-):
//   a-wob  — feTurbulence+feDisplacementMap: "rozedrgane" krawędzie plam
//            farby; nakładany na duże wypełnienia, NIGDY na detale twarzy
//   detale twarzy (oczy, nos, uśmiech) — ostra kreska bez filtra, jak tusz
//            na wyschniętej akwareli w prawdziwej ilustracji książkowej
//   cieniowanie — półprzezroczyste biało-czarne nakładki zamiast osobnych
//            kolorów, dzięki czemu jedna zmienna --hair przemalowuje całą
//            postać (włosy/sierść/grzywę) bez utraty malarskości
//
// Wszystkie portrety mają viewBox 0 0 240 240 i przezroczyste tło.

const SVG = (inner, style = "") =>
  `<svg viewBox="0 0 240 240" ${style ? `style="${style}"` : ""} aria-hidden="true">${inner}</svg>`;

// ---------- Zestaw twarzy awatara (wspólny dla wszystkich typów) ----------
// Te same oczy i uśmiech na każdej postaci sprawiają, że dziecko widzi
// "siebie" w każdym wariancie, a wybór typu nie zmienia charakteru.

const EYES = `
  <ellipse cx="92" cy="119" rx="12" ry="15.5" transform="rotate(-6 92 119)" fill="#fff"/>
  <ellipse cx="151" cy="117" rx="13" ry="16.5" transform="rotate(5 151 117)" fill="#fff"/>
  <circle cx="93" cy="122" r="6" fill="#4a2f1f"/>
  <circle cx="152" cy="120" r="6.2" fill="#4a2f1f"/>
  <circle cx="95.5" cy="119" r="1.9" fill="#fff"/>
  <circle cx="154.5" cy="117" r="1.9" fill="#fff"/>`;

const SMILE = `<path d="M103,162 Q120,171 139,160" fill="none" stroke="#4a2f1f" stroke-width="2.6" stroke-linecap="round"/>`;

const BLUSH = `
  <ellipse cx="76" cy="140" rx="10" ry="6.2" fill="#e79a91" opacity="0.75"/>
  <ellipse cx="166" cy="138" rx="10" ry="6.2" fill="#e79a91" opacity="0.75"/>`;

// ---------- Awatary ----------

export const AVATAR_TYPES = [
  { id: "knabo", name: "knabo", defaultColor: "#7a4a2b" },
  { id: "knabino", name: "knabino", defaultColor: "#e8b23d" },
  { id: "kato", name: "kato", defaultColor: "#d95f2b" },
  { id: "hundo", name: "hundo", defaultColor: "#7a4a2b" },
  { id: "unikorno", name: "unikorno", defaultColor: "#e0648a" },
  { id: "dino", name: "dino", defaultColor: "#58a86a" },
];

// Nazwy kolorów po esperancku — wybór koloru to też mini-lekcja słówek.
export const AVATAR_COLORS = [
  { id: "bruna", hex: "#7a4a2b" },
  { id: "ora", hex: "#e8b23d" },
  { id: "ruĝa", hex: "#d95f2b" },
  { id: "rozkolora", hex: "#e0648a" },
  { id: "blua", hex: "#4fa7d8" },
  { id: "verda", hex: "#58a86a" },
];

// Stare zapisy trzymały awatar jako emoji — mapujemy na nowy format,
// żeby nikt nie stracił postaci przy aktualizacji.
const LEGACY_AVATARS = {
  "🧒": { type: "knabo", color: "#7a4a2b" },
  "👧": { type: "knabino", color: "#7a4a2b" },
  "👦": { type: "knabo", color: "#e8b23d" },
  "🐱": { type: "kato", color: "#d95f2b" },
  "🐶": { type: "hundo", color: "#7a4a2b" },
  "🦄": { type: "unikorno", color: "#e0648a" },
  "🐼": { type: "kato", color: "#4fa7d8" },
  "🦖": { type: "dino", color: "#58a86a" },
};

export function migrateAvatar(avatar) {
  if (!avatar) return null;
  if (typeof avatar === "string") return LEGACY_AVATARS[avatar] ?? { type: "knabo", color: "#7a4a2b" };
  if (avatar.type && avatar.color) return avatar;
  return null;
}

const KID_BODY = `
  <path d="M48,240 Q41,190 75,176 Q99,162 120,164 Q144,158 170,178 Q201,192 192,240 Z"
        fill="url(#g-shirt)" stroke="#8c4028" stroke-width="2" stroke-opacity="0.5"/>`;

const KID_HEAD = `
  <ellipse cx="120" cy="124" rx="67" ry="74" transform="rotate(3 120 124)"
           fill="url(#g-skin)" stroke="#cfa06b" stroke-width="2" stroke-opacity="0.6"/>`;

function knaboBody() {
  return `
  <g filter="url(#a-wob)">
    ${KID_BODY}
    ${KID_HEAD}
    <path d="M48,118 Q41,55 84,34 Q108,19 120,24 Q134,17 158,34 Q201,53 194,118 Q182,80 158,66 Q148,84 134,66 Q121,84 108,66 Q95,84 84,68 Q58,82 48,118 Z"
          fill="var(--hair)"/>
    <path d="M58,102 Q59,64 96,45 Q110,37 118,39 Q103,48 89,61 Q70,77 58,102 Z" fill="#ffffff" opacity="0.15"/>
    <path d="M152,62 Q176,78 188,114 Q177,86 152,70 Z" fill="#000000" opacity="0.08"/>
    ${BLUSH}
  </g>
  ${EYES}${SMILE}
  <circle cx="108" cy="146" r="1.9" fill="#c68a5c"/>
  <circle cx="115" cy="151" r="1.7" fill="#c68a5c"/>
  <circle cx="129" cy="148" r="1.8" fill="#c68a5c"/>`;
}

function knabinoBody() {
  return `
  <g filter="url(#a-wob)">
    <path d="M46,240 Q40,196 60,182 Q48,150 44,110 Q40,52 88,32 Q110,17 120,22 Q132,15 154,32 Q202,50 198,110 Q194,150 182,182 Q202,196 196,240 Z"
          fill="var(--hair)"/>
    ${KID_BODY}
    ${KID_HEAD}
    <path d="M50,120 Q43,57 86,36 Q109,21 120,26 Q133,19 156,36 Q199,55 192,120 Q181,82 158,68 Q148,86 134,68 Q121,86 108,68 Q95,86 84,70 Q59,84 50,120 Z"
          fill="var(--hair)"/>
    <path d="M58,104 Q60,66 97,47 Q111,39 119,41 Q104,50 90,63 Q71,79 58,104 Z" fill="#ffffff" opacity="0.15"/>
    <path d="M154,64 Q177,80 189,116 Q178,88 154,72 Z" fill="#000000" opacity="0.08"/>
    <circle cx="63" cy="70" r="9" fill="#fbf0dd"/>
    <circle cx="55" cy="62" r="5.5" fill="#fbf0dd"/>
    <circle cx="71" cy="60" r="5.5" fill="#fbf0dd"/>
    <circle cx="63" cy="70" r="3.4" fill="url(#g-gold)"/>
    ${BLUSH}
  </g>
  ${EYES}${SMILE}`;
}

function katoBody() {
  return `
  <g filter="url(#a-wob)">
    <path d="M52,240 Q46,192 78,178 Q100,164 120,166 Q142,162 166,178 Q198,192 190,240 Z"
          fill="var(--hair)"/>
    <path d="M86,240 Q88,204 120,200 Q152,204 154,240 Z" fill="#ffffff" opacity="0.4"/>
    <path d="M62,88 Q58,32 78,16 Q102,40 100,76 Q82,94 62,88 Z" fill="var(--hair)"/>
    <path d="M72,78 Q70,46 80,30 Q93,48 91,70 Q82,82 72,78 Z" fill="#f2a9b8"/>
    <path d="M178,88 Q182,32 162,16 Q138,40 140,76 Q158,94 178,88 Z" fill="var(--hair)"/>
    <path d="M168,78 Q170,46 160,30 Q147,48 149,70 Q158,82 168,78 Z" fill="#f2a9b8"/>
    <ellipse cx="120" cy="126" rx="66" ry="62" fill="var(--hair)"/>
    <path d="M62,84 Q56,110 60,140 Q76,158 100,150 Q80,120 62,84 Z" fill="#ffffff" opacity="0.16"/>
    <path d="M176,90 Q184,120 176,148 Q160,120 152,96 Z" fill="#000000" opacity="0.1"/>
    <ellipse cx="120" cy="152" rx="35" ry="24" fill="#fdf6e8" opacity="0.9"/>
    ${BLUSH}
  </g>
  ${EYES}
  <path d="M113,143 L127,143 L120,152 Z" fill="#e0648a"/>
  <path d="M110,160 Q115,166 120,159 Q125,166 130,160" fill="none" stroke="#4a2f1f" stroke-width="2.4" stroke-linecap="round"/>
  <g stroke="#4a2f1f" stroke-width="1.6" stroke-linecap="round" opacity="0.55">
    <line x1="62" y1="146" x2="34" y2="140"/><line x1="62" y1="154" x2="36" y2="156"/>
    <line x1="178" y1="144" x2="206" y2="138"/><line x1="178" y1="152" x2="204" y2="154"/>
  </g>`;
}

function hundoBody() {
  return `
  <g filter="url(#a-wob)">
    <path d="M52,240 Q46,192 78,178 Q100,164 120,166 Q142,162 166,178 Q198,192 190,240 Z"
          fill="var(--hair)"/>
    <path d="M86,240 Q88,204 120,200 Q152,204 154,240 Z" fill="#ffffff" opacity="0.4"/>
    <path d="M70,182 Q74,196 120,196 Q166,196 170,182 L170,196 Q166,208 120,208 Q74,208 70,196 Z" fill="#d94f2e"/>
    <circle cx="120" cy="204" r="7" fill="url(#g-gold)"/>
    <path d="M64,64 Q34,58 30,102 Q28,142 56,146 Q70,142 70,110 Q70,82 64,64 Z" fill="var(--hair)"/>
    <path d="M64,64 Q34,58 30,102 Q28,142 56,146 Q70,142 70,110 Q70,82 64,64 Z" fill="#000000" opacity="0.18"/>
    <path d="M176,64 Q206,58 210,102 Q212,142 184,146 Q170,142 170,110 Q170,82 176,64 Z" fill="var(--hair)"/>
    <path d="M176,64 Q206,58 210,102 Q212,142 184,146 Q170,142 170,110 Q170,82 176,64 Z" fill="#000000" opacity="0.18"/>
    <ellipse cx="120" cy="124" rx="62" ry="60" fill="var(--hair)"/>
    <circle cx="150" cy="106" r="26" fill="#000000" opacity="0.1"/>
    <path d="M64,84 Q58,112 62,140 Q78,154 98,148 Q78,118 64,84 Z" fill="#ffffff" opacity="0.15"/>
    <ellipse cx="120" cy="152" rx="37" ry="26" fill="#fdf6e8" opacity="0.9"/>
    ${BLUSH}
  </g>
  ${EYES}
  <ellipse cx="120" cy="143" rx="11" ry="8" fill="#3a2b22"/>
  <path d="M108,158 Q114,164 120,158 Q126,164 132,158" fill="none" stroke="#4a2f1f" stroke-width="2.4" stroke-linecap="round"/>`;
}

function unikornoBody() {
  return `
  <g filter="url(#a-wob)">
    <path d="M52,240 Q46,192 78,178 Q100,164 120,166 Q142,162 166,178 Q198,192 190,240 Z"
          fill="url(#g-white)" stroke="#d8cbae" stroke-width="2" stroke-opacity="0.7"/>
    <path d="M120,10 L136,66 Q120,76 104,66 Z" fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.6"/>
    <path d="M110,32 L129,26 M107,46 L133,40 M105,58 L135,54" stroke="#b57a18" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M66,84 Q60,44 76,32 Q94,52 92,80 Q80,92 66,84 Z" fill="url(#g-white)" stroke="#d8cbae" stroke-width="1.6"/>
    <path d="M174,84 Q180,44 164,32 Q146,52 148,80 Q160,92 174,84 Z" fill="url(#g-white)" stroke="#d8cbae" stroke-width="1.6"/>
    <ellipse cx="120" cy="126" rx="64" ry="61" fill="url(#g-white)" stroke="#d8cbae" stroke-width="2" stroke-opacity="0.7"/>
    <path d="M84,36 Q42,62 50,116 Q54,152 40,174 Q76,170 82,128 Q86,92 106,62 Q96,44 84,36 Z" fill="var(--hair)"/>
    <path d="M88,44 Q56,68 60,112 Q62,140 54,160 Q74,152 76,120 Q80,88 96,62 Z" fill="#ffffff" opacity="0.2"/>
    <circle cx="104" cy="58" r="17" fill="var(--hair)"/>
    <circle cx="130" cy="52" r="13" fill="var(--hair)"/>
    <ellipse cx="120" cy="154" rx="30" ry="20" fill="#f6dade" opacity="0.85"/>
    ${BLUSH}
  </g>
  ${EYES}${SMILE}
  <g fill="url(#g-gold)">
    <path d="M158,34 l2.5,6 6,2.5 -6,2.5 -2.5,6 -2.5,-6 -6,-2.5 6,-2.5 Z"/>
    <path d="M176,60 l1.8,4.4 4.4,1.8 -4.4,1.8 -1.8,4.4 -1.8,-4.4 -4.4,-1.8 4.4,-1.8 Z"/>
  </g>`;
}

function dinoBody() {
  return `
  <g filter="url(#a-wob)">
    <path d="M52,240 Q46,192 78,178 Q100,164 120,166 Q142,162 166,178 Q198,192 190,240 Z"
          fill="var(--hair)"/>
    <path d="M84,240 Q86,200 120,196 Q154,200 152,240 Z" fill="#ffffff" opacity="0.35"/>
    <path d="M70,72 Q58,34 88,42 Q90,64 82,78 Z" fill="var(--hair)"/>
    <path d="M70,72 Q58,34 88,42 Q90,64 82,78 Z" fill="#000000" opacity="0.22"/>
    <path d="M106,52 Q104,12 134,24 Q132,48 122,58 Z" fill="var(--hair)"/>
    <path d="M106,52 Q104,12 134,24 Q132,48 122,58 Z" fill="#000000" opacity="0.22"/>
    <path d="M148,62 Q156,28 178,46 Q170,68 158,74 Z" fill="var(--hair)"/>
    <path d="M148,62 Q156,28 178,46 Q170,68 158,74 Z" fill="#000000" opacity="0.22"/>
    <ellipse cx="120" cy="128" rx="66" ry="62" fill="var(--hair)"/>
    <path d="M62,92 Q54,124 60,148 Q78,160 98,152 Q76,124 62,92 Z" fill="#ffffff" opacity="0.15"/>
    <ellipse cx="120" cy="158" rx="40" ry="24" fill="#ffffff" opacity="0.35"/>
    <circle cx="74" cy="112" r="6" fill="#000000" opacity="0.12"/>
    <circle cx="164" cy="126" r="5" fill="#000000" opacity="0.12"/>
    <circle cx="98" cy="94" r="4" fill="#000000" opacity="0.12"/>
    ${BLUSH}
  </g>
  ${EYES}${SMILE}
  <ellipse cx="108" cy="147" rx="3" ry="4" fill="#2f4f33" opacity="0.7"/>
  <ellipse cx="132" cy="147" rx="3" ry="4" fill="#2f4f33" opacity="0.7"/>`;
}

const AVATAR_BUILDERS = {
  knabo: knaboBody,
  knabino: knabinoBody,
  kato: katoBody,
  hundo: hundoBody,
  unikorno: unikornoBody,
  dino: dinoBody,
};

export function avatarBody(avatar) {
  const a = migrateAvatar(avatar) ?? { type: "knabo", color: "#7a4a2b" };
  const build = AVATAR_BUILDERS[a.type] ?? knaboBody;
  return build();
}

export function avatarArt(avatar) {
  const a = migrateAvatar(avatar) ?? { type: "knabo", color: "#7a4a2b" };
  return SVG(avatarBody(a), `--hair:${a.color}`);
}

// ---------- Portrety NPC ----------

function vulpoArt() {
  return `
  <g filter="url(#a-wob)">
    <path d="M55,240 Q46,192 74,176 Q96,160 120,162 Q150,156 180,180 Q202,200 196,240 Z"
          fill="url(#g-vulpo)" stroke="#b5551f" stroke-width="2" stroke-opacity="0.55"/>
    <path d="M58,86 Q58,32 74,12 Q100,38 96,78 Q78,92 58,86 Z"
          fill="url(#g-vulpo)" stroke="#b5551f" stroke-width="2" stroke-opacity="0.55"/>
    <path d="M68,78 Q68,44 77,26 Q90,46 88,72 Q78,82 68,78 Z" fill="#f2b27e"/>
    <path d="M184,86 Q184,32 168,12 Q142,38 146,78 Q164,92 184,86 Z"
          fill="url(#g-vulpo)" stroke="#b5551f" stroke-width="2" stroke-opacity="0.55"/>
    <path d="M174,78 Q174,44 165,26 Q152,46 154,72 Q164,82 174,78 Z" fill="#f2b27e"/>
    <ellipse cx="122" cy="120" rx="70" ry="79" transform="rotate(-4 122 120)"
             fill="url(#g-vulpo)" stroke="#b5551f" stroke-width="2" stroke-opacity="0.55"/>
    <path d="M54,128 Q36,148 56,168 Q74,178 88,164 Q80,142 54,128 Z" fill="#fbf0dd" stroke="#dcc9a0" stroke-width="1.2"/>
    <path d="M190,126 Q208,146 188,166 Q170,176 156,162 Q164,140 190,126 Z" fill="#fbf0dd" stroke="#dcc9a0" stroke-width="1.2"/>
    <path d="M84,142 Q82,178 120,187 Q160,180 158,144 Q140,124 120,127 Q101,124 84,142 Z"
          fill="#fbf0dd" stroke="#dcc9a0" stroke-width="1.4"/>
    <ellipse cx="74" cy="134" rx="11" ry="7" fill="#e79a91" opacity="0.75"/>
    <ellipse cx="168" cy="132" rx="11" ry="7" fill="#e79a91" opacity="0.75"/>
  </g>
  <ellipse cx="121" cy="137" rx="7.5" ry="6" fill="#6b3a24"/>
  <ellipse cx="92" cy="115" rx="12" ry="15.5" transform="rotate(-8 92 115)" fill="#fff"/>
  <ellipse cx="152" cy="113" rx="13" ry="16.5" transform="rotate(6 152 113)" fill="#fff"/>
  <circle cx="93" cy="118" r="6" fill="#4a2f1f"/>
  <circle cx="153" cy="116" r="6.2" fill="#4a2f1f"/>
  <circle cx="95.5" cy="115" r="1.9" fill="#fff"/>
  <circle cx="155.5" cy="113" r="1.9" fill="#fff"/>
  <path d="M101,158 Q120,168 142,156" fill="none" stroke="#4a2f1f" stroke-width="2.6" stroke-linecap="round"/>
  <g stroke="#b5551f" stroke-width="1.5" stroke-linecap="round" opacity="0.6" fill="none">
    <path d="M56,108 Q50,101 56,94"/>
    <path d="M189,110 Q196,103 191,95"/>
  </g>`;
}

function ursoArt() {
  return `
  <g filter="url(#a-wob)">
    <path d="M50,240 Q44,190 76,174 Q98,158 120,160 Q146,156 176,176 Q200,196 194,240 Z"
          fill="url(#g-urso)" stroke="#6f4a26" stroke-width="2" stroke-opacity="0.5"/>
    <circle cx="70" cy="54" r="26" fill="url(#g-urso)" stroke="#6f4a26" stroke-width="2" stroke-opacity="0.5"/>
    <circle cx="70" cy="57" r="13" fill="#e8c49a"/>
    <circle cx="170" cy="54" r="26" fill="url(#g-urso)" stroke="#6f4a26" stroke-width="2" stroke-opacity="0.5"/>
    <circle cx="170" cy="57" r="13" fill="#e8c49a"/>
    <circle cx="120" cy="124" r="78" fill="url(#g-urso)" stroke="#6f4a26" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M60,86 Q52,120 58,150 Q74,164 94,156 Q72,124 60,86 Z" fill="#ffffff" opacity="0.13"/>
    <ellipse cx="120" cy="154" rx="42" ry="30" fill="#ecd2ac" stroke="#cfae7e" stroke-width="1.4"/>
    <ellipse cx="66" cy="132" rx="11" ry="7" fill="#e79a91" opacity="0.7"/>
    <ellipse cx="174" cy="130" rx="11" ry="7" fill="#e79a91" opacity="0.7"/>
  </g>
  <ellipse cx="120" cy="142" rx="11" ry="8.5" fill="#4a3220"/>
  <ellipse cx="90" cy="108" rx="10.5" ry="13" fill="#fff"/>
  <ellipse cx="150" cy="106" rx="11" ry="13.5" fill="#fff"/>
  <circle cx="91" cy="111" r="5.4" fill="#3a2b1c"/>
  <circle cx="151" cy="109" r="5.5" fill="#3a2b1c"/>
  <circle cx="93.3" cy="108" r="1.7" fill="#fff"/>
  <circle cx="153.3" cy="106" r="1.7" fill="#fff"/>
  <path d="M104,166 Q120,175 136,164" fill="none" stroke="#4a3220" stroke-width="2.6" stroke-linecap="round"/>`;
}

function papagoArt() {
  return `
  <g filter="url(#a-wob)">
    <path d="M56,240 Q50,190 80,172 Q102,158 120,160 Q142,156 168,174 Q196,192 190,240 Z"
          fill="url(#g-papago)" stroke="#a82a20" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M58,208 Q90,188 120,198 Q150,188 184,206 Q150,220 120,212 Q90,222 58,208 Z" fill="#3f9d5a"/>
    <path d="M62,226 Q92,208 120,216 Q148,208 180,224 Q148,236 120,230 Q92,238 62,226 Z" fill="#3f7fd9"/>
    <path d="M94,44 Q82,8 110,16 Q112,36 104,46 Z" fill="#f2b23d"/>
    <path d="M116,38 Q118,2 140,14 Q136,34 126,42 Z" fill="#e8722e"/>
    <path d="M138,46 Q154,14 166,30 Q158,46 146,52 Z" fill="#d94f2e"/>
    <circle cx="120" cy="112" r="66" fill="url(#g-papago)" stroke="#a82a20" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M60,92 Q52,120 58,144 Q72,156 90,150 Q68,122 60,92 Z" fill="#ffffff" opacity="0.14"/>
    <ellipse cx="94" cy="106" rx="21" ry="25" fill="#fdf6e8" stroke="#e0d2b0" stroke-width="1.2"/>
    <ellipse cx="146" cy="104" rx="21" ry="25" fill="#fdf6e8" stroke="#e0d2b0" stroke-width="1.2"/>
    <ellipse cx="70" cy="134" rx="10" ry="6" fill="#f2a24c" opacity="0.8"/>
    <ellipse cx="170" cy="132" rx="10" ry="6" fill="#f2a24c" opacity="0.8"/>
  </g>
  <circle cx="96" cy="108" r="6.5" fill="#2f2620"/>
  <circle cx="144" cy="106" r="6.5" fill="#2f2620"/>
  <circle cx="98.5" cy="105.5" r="1.9" fill="#fff"/>
  <circle cx="146.5" cy="103.5" r="1.9" fill="#fff"/>
  <path d="M98,138 Q120,124 142,138 Q140,164 120,170 Q100,164 98,138 Z"
        fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.8"/>
  <path d="M104,152 Q120,160 136,152" fill="none" stroke="#b57a18" stroke-width="1.8" stroke-linecap="round"/>`;
}

function strigoArt() {
  return `
  <g filter="url(#a-wob)">
    <path d="M54,240 Q50,192 78,176 Q100,162 120,164 Q142,160 168,176 Q194,192 188,240 Z"
          fill="url(#g-strigo)" stroke="#454d73" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M84,192 q12,-11 24,0 q12,-11 24,0 q12,-11 24,0" fill="none" stroke="#c7cde6" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M92,212 q12,-11 24,0 q12,-11 24,0" fill="none" stroke="#c7cde6" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M62,64 Q48,18 84,30 Q90,52 80,66 Z" fill="url(#g-strigo)" stroke="#454d73" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M178,64 Q192,18 156,30 Q150,52 160,66 Z" fill="url(#g-strigo)" stroke="#454d73" stroke-width="2" stroke-opacity="0.5"/>
    <circle cx="120" cy="118" r="72" fill="url(#g-strigo)" stroke="#454d73" stroke-width="2" stroke-opacity="0.5"/>
    <circle cx="92" cy="120" r="35" fill="#f2ead4" stroke="#d6c9a4" stroke-width="1.4"/>
    <circle cx="148" cy="120" r="35" fill="#f2ead4" stroke="#d6c9a4" stroke-width="1.4"/>
  </g>
  <circle cx="92" cy="120" r="17" fill="#f2b23d" stroke="#6b5b3a" stroke-width="1.6"/>
  <circle cx="148" cy="120" r="17" fill="#f2b23d" stroke="#6b5b3a" stroke-width="1.6"/>
  <circle cx="92" cy="122" r="9" fill="#2f2620"/>
  <circle cx="148" cy="122" r="9" fill="#2f2620"/>
  <circle cx="95.5" cy="118" r="2.6" fill="#fff"/>
  <circle cx="151.5" cy="118" r="2.6" fill="#fff"/>
  <path d="M111,142 L129,142 L120,162 Z" fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.6"/>`;
}

function kankroArt() {
  return `
  <g filter="url(#a-wob)">
    <g stroke="#c24425" stroke-width="8" stroke-linecap="round" fill="none">
      <path d="M62,196 Q40,208 36,226"/>
      <path d="M70,212 Q52,224 50,240"/>
      <path d="M178,196 Q200,208 204,226"/>
      <path d="M170,212 Q188,224 190,240"/>
    </g>
    <path d="M58,142 Q66,158 78,164" stroke="#c24425" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M182,142 Q174,158 162,164" stroke="#c24425" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M58,104 Q20,88 12,122 Q8,154 44,152 Q34,138 40,126 Q30,120 34,110 Q46,104 58,120 Z"
          fill="url(#g-kankro)" stroke="#a83618" stroke-width="2" stroke-opacity="0.6"/>
    <path d="M182,104 Q220,88 228,122 Q232,154 196,152 Q206,138 200,126 Q210,120 206,110 Q194,104 182,120 Z"
          fill="url(#g-kankro)" stroke="#a83618" stroke-width="2" stroke-opacity="0.6"/>
    <line x1="100" y1="112" x2="93" y2="72" stroke="#c24425" stroke-width="8" stroke-linecap="round"/>
    <line x1="140" y1="112" x2="147" y2="72" stroke="#c24425" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="120" cy="164" rx="72" ry="56" fill="url(#g-kankro)" stroke="#a83618" stroke-width="2" stroke-opacity="0.6"/>
    <path d="M56,152 Q52,180 62,198 Q80,210 98,202 Q70,180 56,152 Z" fill="#ffffff" opacity="0.14"/>
    <ellipse cx="120" cy="190" rx="46" ry="22" fill="#f6cfae" opacity="0.55"/>
    <ellipse cx="88" cy="186" rx="9" ry="5.5" fill="#e05c5c" opacity="0.7"/>
    <ellipse cx="152" cy="184" rx="9" ry="5.5" fill="#e05c5c" opacity="0.7"/>
  </g>
  <circle cx="93" cy="66" r="13" fill="#fff"/>
  <circle cx="147" cy="66" r="13" fill="#fff"/>
  <circle cx="94" cy="69" r="6" fill="#2f2620"/>
  <circle cx="146" cy="69" r="6" fill="#2f2620"/>
  <circle cx="96.4" cy="66" r="1.8" fill="#fff"/>
  <circle cx="148.4" cy="66" r="1.8" fill="#fff"/>
  <path d="M102,164 Q120,176 138,162" fill="none" stroke="#7a2a12" stroke-width="2.6" stroke-linecap="round"/>`;
}

function drakoArt() {
  return `
  <g filter="url(#a-wob)">
    <path d="M54,240 Q48,192 78,176 Q100,162 120,164 Q144,160 170,178 Q196,194 190,240 Z"
          fill="url(#g-drako)" stroke="#2f6b3f" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M84,240 Q84,198 120,194 Q156,198 156,240 Z" fill="#d9e8b8" stroke="#b3c78c" stroke-width="1.3"/>
    <path d="M84,54 Q76,16 100,28 Q104,50 94,60 Z" fill="#f2ead4" stroke="#cbb98e" stroke-width="1.6"/>
    <path d="M156,54 Q164,16 140,28 Q136,50 146,60 Z" fill="#f2ead4" stroke="#cbb98e" stroke-width="1.6"/>
    <path d="M112,34 Q118,10 130,28 Q126,42 116,44 Z" fill="#f2ead4" stroke="#cbb98e" stroke-width="1.4"/>
    <circle cx="120" cy="118" r="70" fill="url(#g-drako)" stroke="#2f6b3f" stroke-width="2" stroke-opacity="0.5"/>
    <path d="M60,92 Q52,122 58,148 Q74,160 94,152 Q70,124 60,92 Z" fill="#ffffff" opacity="0.14"/>
    <ellipse cx="120" cy="148" rx="40" ry="26" fill="#bfe0a0" stroke="#8fb872" stroke-width="1.4"/>
    <circle cx="70" cy="96" r="5" fill="#000000" opacity="0.1"/>
    <circle cx="168" cy="108" r="4.4" fill="#000000" opacity="0.1"/>
    <ellipse cx="72" cy="132" rx="10" ry="6" fill="#e79a91" opacity="0.65"/>
    <ellipse cx="168" cy="130" rx="10" ry="6" fill="#e79a91" opacity="0.65"/>
  </g>
  <ellipse cx="106" cy="142" rx="4" ry="5.5" fill="#2f5c38"/>
  <ellipse cx="134" cy="142" rx="4" ry="5.5" fill="#2f5c38"/>
  <ellipse cx="90" cy="106" rx="10.5" ry="13" fill="#fff"/>
  <ellipse cx="150" cy="104" rx="11" ry="13.5" fill="#fff"/>
  <circle cx="91" cy="109" r="5.4" fill="#26331f"/>
  <circle cx="151" cy="107" r="5.5" fill="#26331f"/>
  <circle cx="93.3" cy="106" r="1.7" fill="#fff"/>
  <circle cx="153.3" cy="104" r="1.7" fill="#fff"/>
  <path d="M102,162 Q120,172 138,160" fill="none" stroke="#26331f" stroke-width="2.6" stroke-linecap="round"/>`;
}

const NPC_BUILDERS = {
  vulpo: vulpoArt,
  urso: ursoArt,
  papago: papagoArt,
  strigo: strigoArt,
  kankro: kankroArt,
  drako: drakoArt,
};

export function npcArt(id) {
  const build = NPC_BUILDERS[id];
  return build ? SVG(build()) : SVG(vulpoArt());
}

// ---------- Sceny bajki wprowadzającej ----------

const CLOUDS = `
  <g fill="#ffffff" opacity="0.85" filter="url(#a-wob)">
    <ellipse cx="46" cy="52" rx="30" ry="12"/>
    <ellipse cx="68" cy="43" rx="19" ry="10"/>
    <ellipse cx="196" cy="80" rx="24" ry="10"/>
    <ellipse cx="212" cy="72" rx="14" ry="8"/>
  </g>`;

function balloonBody(scale = 1, dx = 0, dy = 0) {
  return `
  <g transform="translate(${dx},${dy}) scale(${scale})" filter="url(#a-wob)">
    <path d="M120,14 Q198,20 194,92 Q190,138 148,166 L148,180 L92,180 L92,166 Q50,138 46,92 Q42,20 120,14 Z"
          fill="url(#g-balloon)" stroke="#a83a2a" stroke-width="2" stroke-opacity="0.6"/>
    <path d="M96,20 Q74,70 96,162 Q104,172 110,176 Q92,110 104,18 Z" fill="#fbf0dd" opacity="0.9"/>
    <path d="M144,20 Q166,70 144,162 Q136,172 130,176 Q148,110 136,18 Z" fill="#f2b23d" opacity="0.9"/>
    <path d="M92,166 L98,206 M148,166 L142,206" stroke="#8a6136" stroke-width="2.4"/>
    <rect x="92" y="202" width="56" height="32" rx="8" fill="url(#g-basket)" stroke="#7a5730" stroke-width="2"/>
    <path d="M92,212 L148,212 M92,222 L148,222 M106,202 L106,234 M120,202 L120,234 M134,202 L134,234"
          stroke="#7a5730" stroke-width="1.6" opacity="0.6"/>
  </g>`;
}

const SEA_BAND = `
  <g filter="url(#a-wob)">
    <path d="M0,196 Q30,186 60,194 Q90,202 120,194 Q150,186 180,194 Q210,202 240,194 L240,240 L0,240 Z"
          fill="url(#g-sea)"/>
    <g fill="none" stroke="#dff0ee" stroke-width="2.6" stroke-linecap="round" opacity="0.6">
      <path d="M34,214 q8,-6 16,0 q8,6 16,0"/>
      <path d="M150,222 q8,-6 16,0 q8,6 16,0"/>
    </g>
  </g>`;

function sceneIsland() {
  return `
  ${CLOUDS}
  <g filter="url(#a-wob)">
    <ellipse cx="120" cy="150" rx="104" ry="62" fill="url(#g-sea)"/>
    <path d="M52,150 Q48,120 78,112 Q84,90 118,96 Q150,84 168,108 Q196,114 188,142 Q196,164 168,172 Q150,188 120,180 Q86,190 70,170 Q46,168 52,150 Z"
          fill="#e8c77e" stroke="#c79f54" stroke-width="1.6"/>
    <path d="M70,148 Q68,126 92,120 Q98,104 122,110 Q146,100 158,118 Q178,124 172,142 Q176,156 156,162 Q142,174 120,168 Q94,176 82,160 Q66,160 70,148 Z"
          fill="url(#g-land)" stroke="#55803d" stroke-width="1.4"/>
    <path d="M132,140 Q140,106 154,102 Q164,96 168,118 Q172,134 164,142 Q148,148 132,140 Z" fill="url(#g-mtn)" stroke="#655a78" stroke-width="1.4"/>
    <path d="M148,112 Q154,102 159,105 Q163,107 161,117 Q154,112 148,112 Z" fill="#f6efe2"/>
    <g>
      <rect x="88" y="138" width="5" height="10" rx="2" fill="#8a5a34"/>
      <circle cx="90" cy="132" r="10" fill="url(#g-tree)"/>
      <rect x="108" y="146" width="4" height="8" rx="2" fill="#8a5a34"/>
      <circle cx="110" cy="141" r="8" fill="url(#g-tree)"/>
    </g>
  </g>`;
}

function sceneStarBook() {
  return `
  <g filter="url(#a-wob)">
    <path d="M44,152 Q82,132 118,150 L118,200 Q82,184 44,200 Z" fill="#fdf6e8" stroke="#cbb98e" stroke-width="2"/>
    <path d="M196,152 Q158,132 122,150 L122,200 Q158,184 196,200 Z" fill="#fdf6e8" stroke="#cbb98e" stroke-width="2"/>
    <path d="M56,160 Q84,146 108,158 M56,172 Q84,158 108,170 M132,158 Q156,146 184,160 M132,170 Q156,158 184,172"
          fill="none" stroke="#cbb98e" stroke-width="2" opacity="0.7"/>
  </g>
  <path d="M120,38 L131,66 L161,68 L138,88 L145,118 L120,101 L95,118 L102,88 L79,68 L109,66 Z"
        fill="url(#g-gold)" stroke="#b57a18" stroke-width="2" stroke-linejoin="round"/>
  <path d="M70,52 l2.4,5.8 5.8,2.4 -5.8,2.4 -2.4,5.8 -2.4,-5.8 -5.8,-2.4 5.8,-2.4 Z" fill="url(#g-gold)"/>
  <path d="M176,96 l2,4.8 4.8,2 -4.8,2 -2,4.8 -2,-4.8 -4.8,-2 4.8,-2 Z" fill="url(#g-gold)"/>`;
}

function sceneSparkle() {
  return `
  <path d="M120,44 L131,90 L176,101 L131,112 L120,158 L109,112 L64,101 L109,90 Z"
        fill="url(#g-gold)" stroke="#b57a18" stroke-width="2" stroke-linejoin="round"/>
  <path d="M64,160 l4,9.6 9.6,4 -9.6,4 -4,9.6 -4,-9.6 -9.6,-4 9.6,-4 Z" fill="url(#g-gold)"/>
  <path d="M178,150 l3.2,7.7 7.7,3.2 -7.7,3.2 -3.2,7.7 -3.2,-7.7 -7.7,-3.2 7.7,-3.2 Z" fill="url(#g-gold)"/>`;
}

export function sceneArt(scene, avatar) {
  switch (scene) {
    case "balloon":
      return SVG(CLOUDS + balloonBody(0.92, 10, 4));
    case "balloon-sea":
      return SVG(CLOUDS + SEA_BAND + balloonBody(0.7, 36, -2));
    case "island":
      return SVG(sceneIsland());
    case "fox":
      return npcArt("vulpo");
    case "star-book":
      return SVG(sceneStarBook());
    case "sparkle":
      return SVG(sceneSparkle());
    case "flight": {
      const a = migrateAvatar(avatar) ?? { type: "knabo", color: "#7a4a2b" };
      // Awatar wystaje zza burty kosza balonu — kosz rysowany PO awatarze.
      return SVG(
        CLOUDS +
        `<g transform="scale(0.98) translate(2,0)" filter="url(#a-wob)">
          <path d="M120,14 Q198,20 194,92 Q190,138 148,166 L148,180 L92,180 L92,166 Q50,138 46,92 Q42,20 120,14 Z"
                fill="url(#g-balloon)" stroke="#a83a2a" stroke-width="2" stroke-opacity="0.6"/>
          <path d="M96,20 Q74,70 96,162 Q104,172 110,176 Q92,110 104,18 Z" fill="#fbf0dd" opacity="0.9"/>
          <path d="M144,20 Q166,70 144,162 Q136,172 130,176 Q148,110 136,18 Z" fill="#f2b23d" opacity="0.9"/>
          <path d="M92,166 L98,206 M148,166 L142,206" stroke="#8a6136" stroke-width="2.4"/>
        </g>
        <g transform="translate(77,132) scale(0.36)">${avatarBody(a)}</g>
        <g filter="url(#a-wob)">
          <rect x="92" y="202" width="56" height="32" rx="8" fill="url(#g-basket)" stroke="#7a5730" stroke-width="2"/>
          <path d="M92,212 L148,212 M92,222 L148,222 M106,202 L106,234 M120,202 L120,234 M134,202 L134,234"
                stroke="#7a5730" stroke-width="1.6" opacity="0.6"/>
        </g>`,
        `--hair:${a.color}`
      );
    }
    default:
      return SVG(sceneSparkle());
  }
}

// Balon z awatarem w koszu — scena przylotu na mapę (bez chmur,
// bo leci NAD prawdziwą mapą). Kosz rysowany PO awatarze (zasłania tułów).
export function balloonWithAvatar(avatar) {
  const a = migrateAvatar(avatar) ?? { type: "knabo", color: "#7a4a2b" };
  return SVG(
    `<g filter="url(#a-wob)">
      <path d="M120,14 Q198,20 194,92 Q190,138 148,166 L148,180 L92,180 L92,166 Q50,138 46,92 Q42,20 120,14 Z"
            fill="url(#g-balloon)" stroke="#a83a2a" stroke-width="2" stroke-opacity="0.6"/>
      <path d="M96,20 Q74,70 96,162 Q104,172 110,176 Q92,110 104,18 Z" fill="#fbf0dd" opacity="0.9"/>
      <path d="M144,20 Q166,70 144,162 Q136,172 130,176 Q148,110 136,18 Z" fill="#f2b23d" opacity="0.9"/>
      <path d="M92,166 L98,206 M148,166 L142,206" stroke="#8a6136" stroke-width="2.4"/>
    </g>
    <g transform="translate(77,132) scale(0.36)">${avatarBody(a)}</g>
    <g filter="url(#a-wob)">
      <rect x="92" y="202" width="56" height="32" rx="8" fill="url(#g-basket)" stroke="#7a5730" stroke-width="2"/>
      <path d="M92,212 L148,212 M92,222 L148,222 M106,202 L106,234 M120,202 L120,234 M134,202 L134,234"
            stroke="#7a5730" stroke-width="1.6" opacity="0.6"/>
    </g>`,
    `--hair:${a.color}`
  );
}

// ---------- Tła scen w strefach ----------
// Delikatne, malowane tło za sceną zadań: dziecko "wchodzi" do miejsca,
// które widziało na mapie. Kolory celowo wyblakłe — obiekty zadań i dymek
// NPC muszą pozostać najbardziej kontrastowym elementem ekranu.

// Tła są projektowane PIONOWO (viewBox 0 0 100 200, "xMidYMax slice"):
// niebo wysoko, pas ziemi i pejzaż przy dolnej krawędzi — na telefonie
// kadr obcina boki, na tablecie górę nieba, a dolna linia zawsze zostaje.
function backdropSVG(id, sky1, sky2, ground, inner) {
  return `<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs>
      <linearGradient id="bg-sky-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${sky1}"/><stop offset="100%" stop-color="${sky2}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="200" fill="url(#bg-sky-${id})"/>
    ${inner}
    <path d="M0,164 Q18,160 36,163 Q58,167 78,162 Q90,160 100,163 L100,200 L0,200 Z"
          fill="${ground}" filter="url(#o-wob)"/>
    <rect width="100" height="200" filter="url(#u-grain)" style="mix-blend-mode:multiply"/>
  </svg>`;
}

const BACKDROPS = {
  fruktejo: () => backdropSVG("fruktejo", "#dff0fa", "#eef7e0", "#b7d489", `
    <circle cx="16" cy="18" r="8" fill="#f6d76a" opacity="0.6" filter="url(#o-wob)"/>
    <g filter="url(#o-wob)">
      <use href="#m-fruit-tree" transform="translate(13,158) scale(3)"/>
      <use href="#m-fruit-tree" transform="translate(89,161) scale(2.2)"/>
    </g>`),
  vilago: () => backdropSVG("vilago", "#e3f2fb", "#f4ecd8", "#c2cf8a", `
    <g fill="#ffffff" opacity="0.65" filter="url(#o-wob)">
      <ellipse cx="24" cy="18" rx="10" ry="3.4"/><ellipse cx="32" cy="15.5" rx="6" ry="2.8"/>
    </g>
    <g filter="url(#o-wob)">
      <use href="#m-house" transform="translate(12,158) scale(2.8)"/>
      <use href="#m-house" transform="translate(89,161) scale(2.1)"/>
      <use href="#m-tree" transform="translate(24,166) scale(1.7)"/>
    </g>`),
  arbaro: () => backdropSVG("arbaro", "#d5e9d0", "#e9f2d6", "#9cc27e", `
    <g filter="url(#o-wob)">
      <use href="#m-tree" transform="translate(9,152) scale(3.8)"/>
      <use href="#m-tree" transform="translate(20,164) scale(2.3)"/>
      <use href="#m-tree" transform="translate(91,155) scale(3.2)"/>
      <use href="#m-tree" transform="translate(82,166) scale(2)"/>
    </g>`),
  monto: () => backdropSVG("monto", "#d8ddf0", "#f2ead8", "#c3cdaa", `
    <g filter="url(#o-wob)" opacity="0.7">
      <path d="M-4,166 Q6,130 15,126 Q22,122 27,140 Q31,152 29,166 Z" fill="#a99bc0"/>
      <path d="M9,135 Q13,125 16,125 Q20,124 23,134 Q16,129 9,135 Z" fill="#f6efe2"/>
      <path d="M72,166 Q80,132 89,128 Q96,124 100,140 L100,166 Z" fill="#9a8db2"/>
      <path d="M83,137 Q87,127 90,127 Q94,126 97,136 Q90,131 83,137 Z" fill="#f6efe2"/>
    </g>
    <g fill="#e0a63c" opacity="0.8">
      <path d="M22,20 l1.4,3.4 3.4,1.4 -3.4,1.4 -1.4,3.4 -1.4,-3.4 -3.4,-1.4 3.4,-1.4 Z"/>
      <path d="M80,12 l1.1,2.6 2.6,1.1 -2.6,1.1 -1.1,2.6 -1.1,-2.6 -2.6,-1.1 2.6,-1.1 Z"/>
      <path d="M64,34 l0.9,2.2 2.2,0.9 -2.2,0.9 -0.9,2.2 -0.9,-2.2 -2.2,-0.9 2.2,-0.9 Z"/>
    </g>`),
  marbordo: () => backdropSVG("marbordo", "#d8f0f6", "#f6ecd0", "#eeda9e", `
    <path d="M0,152 Q25,148 50,151 Q75,154 100,150 L100,170 Q60,174 30,171 Q12,170 0,172 Z"
          fill="#8ed0cd" opacity="0.85" filter="url(#o-wob)"/>
    <g fill="none" stroke="#dff0ee" stroke-width="1" stroke-linecap="round" opacity="0.7" filter="url(#o-wob)">
      <path d="M16,156 q2.5,-2 5,0 q2.5,2 5,0"/>
      <path d="M70,154 q2.5,-2 5,0 q2.5,2 5,0"/>
    </g>
    <g filter="url(#o-wob)">
      <path d="M86,172 L88,146" stroke="#8a6136" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M74,148 Q88,134 100,144 Q94,146 92,148 Q88,145 84,149 Q80,146 74,148 Z"
            fill="#e0648a" stroke="#b23f68" stroke-width="0.8"/>
      <circle cx="14" cy="180" r="1.6" fill="#fdf6e8" stroke="#d9b98a" stroke-width="0.5"/>
    </g>`),
  kastelo: () => backdropSVG("kastelo", "#e6e9f5", "#f2e6d4", "#b9c99a", `
    <g filter="url(#o-wob)" opacity="0.8">
      <rect x="7" y="142" width="7" height="24" rx="1.4" fill="#d9cdb2" stroke="#b39a6e" stroke-width="0.7"/>
      <rect x="23" y="142" width="7" height="24" rx="1.4" fill="#d9cdb2" stroke="#b39a6e" stroke-width="0.7"/>
      <rect x="13" y="149" width="11" height="17" fill="#cfc1a0" stroke="#b39a6e" stroke-width="0.7"/>
      <path d="M5.5,143 L10.5,133 L15.5,143 Z" fill="#b5573e" stroke="#8c4028" stroke-width="0.6"/>
      <path d="M21.5,143 L26.5,133 L31.5,143 Z" fill="#b5573e" stroke="#8c4028" stroke-width="0.6"/>
      <line x1="10.5" y1="133" x2="10.5" y2="128.5" stroke="#6b4226" stroke-width="0.8"/>
      <path d="M10.5,128.5 L15,130 L10.5,131.5 Z" fill="#e8722e"/>
    </g>
    <g fill="#ffffff" opacity="0.6" filter="url(#o-wob)">
      <ellipse cx="78" cy="18" rx="9" ry="3"/><ellipse cx="85" cy="15.5" rx="5.5" ry="2.4"/>
    </g>`),
};

export function zoneBackdrop(zoneId) {
  const build = BACKDROPS[zoneId];
  return build ? build() : "";
}

// ---------- Ikony interfejsu (przyciski, nagłówki) ----------
// Małe, ostre (bez filtra akwarelowego — w 24–30 px drżenie zlewa się
// w rozmycie), ale w palecie i duchu reszty grafiki.

const UI_ICONS = {
  island: { vb: "0 0 24 24", body: `
    <path d="M2.5,17.5 Q12,13.5 21.5,17.5 Q21,20.5 12,20.5 Q3,20.5 2.5,17.5 Z" fill="#ecd28f" stroke="#c9a15c" stroke-width="1.2"/>
    <path d="M14.5,16 Q15.5,11 13.5,7" fill="none" stroke="#8a5a34" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M13.5,7 Q9.5,5.5 7.5,8 Q11,8.5 13.5,7 Z" fill="#58a86a"/>
    <path d="M13.5,7 Q17.5,5 19.5,7.5 Q16,8.5 13.5,7 Z" fill="#6cb87b"/>
    <path d="M13.5,7 Q13,3.5 16,2.5 Q16.5,5.5 13.5,7 Z" fill="#58a86a"/>
    <path d="M2,22 q1.5,-1 3,0 q1.5,1 3,0 M16,22 q1.5,-1 3,0 q1.5,1 3,0" fill="none" stroke="#7fc4c9" stroke-width="1.3" stroke-linecap="round"/>` },
  book: { vb: "0 0 24 24", body: `
    <path d="M12,5 Q7,2.5 2.5,4 L2.5,18 Q7,16.5 12,19 Q17,16.5 21.5,18 L21.5,4 Q17,2.5 12,5 Z"
          fill="#fdf6e8" stroke="#c9a86e" stroke-width="1.3"/>
    <path d="M12,5 L12,19" stroke="#c9a86e" stroke-width="1.2"/>
    <path d="M5,8 Q8.5,7 10,8 M5,11.5 Q8.5,10.5 10,11.5 M14,8 Q17.5,7 19,8 M14,11.5 Q17.5,10.5 19,11.5"
          fill="none" stroke="#c9a86e" stroke-width="1" opacity="0.8"/>` },
  scroll: { vb: "0 0 24 24", body: `
    <rect x="5" y="4" width="14" height="16" rx="2" fill="#f6e7c8" stroke="#c9a86e" stroke-width="1.3"/>
    <ellipse cx="12" cy="4.4" rx="7" ry="2.1" fill="#e8d3a8" stroke="#c9a86e" stroke-width="1.1"/>
    <ellipse cx="12" cy="19.6" rx="7" ry="2.1" fill="#e8d3a8" stroke="#c9a86e" stroke-width="1.1"/>
    <path d="M8,9.5 L16,9.5 M8,13 L16,13 M8,16.5 L13,16.5" stroke="#a98a58" stroke-width="1.2" stroke-linecap="round"/>` },
  gear: { vb: "0 0 24 24", body: `
    <g fill="#8b93b8">
      <rect x="10.6" y="1.5" width="2.8" height="21" rx="1.2"/>
      <rect x="10.6" y="1.5" width="2.8" height="21" rx="1.2" transform="rotate(45 12 12)"/>
      <rect x="10.6" y="1.5" width="2.8" height="21" rx="1.2" transform="rotate(90 12 12)"/>
      <rect x="10.6" y="1.5" width="2.8" height="21" rx="1.2" transform="rotate(135 12 12)"/>
    </g>
    <circle cx="12" cy="12" r="6.5" fill="#8b93b8" stroke="#5a628c" stroke-width="1.4"/>
    <circle cx="12" cy="12" r="2.6" fill="#fdf6e8" stroke="#5a628c" stroke-width="1.2"/>` },
  speaker: { vb: "0 0 24 24", body: `
    <path d="M3,9.5 L7,9.5 L12,4.5 L12,19.5 L7,14.5 L3,14.5 Z"
          fill="#e0a63c" stroke="#b57a18" stroke-width="1.3" stroke-linejoin="round"/>
    <path d="M15,9 Q17,12 15,15 M17.5,6.5 Q21,12 17.5,17.5" fill="none" stroke="#b57a18" stroke-width="1.6" stroke-linecap="round"/>` },
  replay: { vb: "0 0 24 24", body: `
    <path d="M12,4 A8,8 0 1 0 20,12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M12,0.8 L17.5,4 L12,7.2 Z" fill="#fff"/>` },
  play: { vb: "0 0 24 24", body: `
    <path d="M7,4.5 L19.5,12 L7,19.5 Z" fill="#fff" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>` },
  party: { vb: "0 0 24 24", body: `
    <path d="M3.5,20.5 L8,9.5 L14.5,16 Z" fill="#e0a63c" stroke="#b57a18" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M5.5,15 L10,19.5 M7,12 L12.5,17.5" stroke="#c9992e" stroke-width="1" opacity="0.7"/>
    <circle cx="16" cy="6" r="1.4" fill="#e04b3b"/>
    <circle cx="20.5" cy="10" r="1.2" fill="#4fa7d8"/>
    <circle cx="12" cy="3.5" r="1.1" fill="#58a86a"/>
    <path d="M17.5,13.5 q1.5,-1 1,-2.5 M12.5,8.5 q0.5,-2 -1,-3 M20,3.5 q-1.5,0.5 -2.5,-0.5"
          fill="none" stroke="#e0648a" stroke-width="1.2" stroke-linecap="round"/>` },
  hand: { vb: "0 0 100 100", body: `
    <g filter="url(#o-wob)">
      <path d="M40,10 Q40,4 47,4 Q54,4 54,12 L54,42 Q62,38 72,42 Q84,47 80,60 Q74,84 52,86 Q30,86 26,64 L24,52 Q23,42 32,44 L40,46 Z"
            fill="#f0c398" stroke="#cfa06b" stroke-width="3"/>
      <path d="M54,46 Q60,44 66,47 M56,56 Q64,54 70,57" stroke="#cfa06b" stroke-width="2" fill="none" opacity="0.7"/>
    </g>` },
};

export function uiIcon(name, size = 24) {
  const ic = UI_ICONS[name];
  if (!ic) return "";
  return `<svg viewBox="${ic.vb}" width="${size}" height="${size}" aria-hidden="true">${ic.body}</svg>`;
}

// ---------- Ikonki statusu (mapa) ----------

const STAR_D = "M0,-10 L2.5,-3.4 L9.5,-3.1 L4,1.3 L5.9,8.1 L0,4.2 L-5.9,8.1 L-4,1.3 L-9.5,-3.1 L-2.5,-3.4 Z";

export function starIcon(size = 14) {
  return `<svg viewBox="-11 -11 22 22" width="${size}" height="${size}" aria-hidden="true">
    <path d="${STAR_D}" fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;
}

export function sparkIcon(size = 14) {
  return `<svg viewBox="-11 -11 22 22" width="${size}" height="${size}" aria-hidden="true">
    <path d="M0,-10 L2.6,-2.6 L10,0 L2.6,2.6 L0,10 L-2.6,2.6 L-10,0 L-2.6,-2.6 Z"
          fill="url(#g-gold)" stroke="#b57a18" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

export function lockIcon(size = 15) {
  return `<svg viewBox="-11 -11 22 22" width="${size}" height="${size}" aria-hidden="true">
    <path d="M-5,-1 L-5,-4.5 A5,5 0 0 1 5,-4.5 L5,-1" fill="none" stroke="#7a6a4c" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="-8" y="-1" width="16" height="11.5" rx="3.4" fill="#8a7a5a" stroke="#6b5b3e" stroke-width="1.2"/>
    <circle cx="0" cy="4" r="2" fill="#fdf6e8"/>
  </svg>`;
}
