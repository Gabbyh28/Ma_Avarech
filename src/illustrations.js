// איורים שטוחים לכל מאכל (SVG, viewBox 0 0 48 48) ואיור הצלחת.

const HI = (cx, cy, rx, ry, rot = -30) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="#fff" opacity=".35"/>`;
const LEAF = (x, y, rot = -30, c = '#4f9d3a') =>
  `<path d="M${x} ${y}c3-4 8-5 11-3-2 4-7 6-11 3z" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`;
const STEM = (x1, y1, x2, y2) =>
  `<path d="M${x1} ${y1}Q${x1} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="#6b4423" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;

// ---------- building blocks ----------
const round = (c, d, { r = 14, leaf = true, crease = false } = {}) =>
  `<circle cx="24" cy="27" r="${r}" fill="${c}"/>` +
  `<path d="M24 ${27 + r}a${r} ${r} 0 0 0 ${r * 0.9}-${r * 0.8}" fill="none" stroke="${d}" stroke-width="3" opacity=".35"/>` +
  (crease ? `<path d="M24 ${27 - r + 2}q-4 ${r} 0 ${r * 2 - 4}" stroke="${d}" stroke-width="1.6" fill="none" opacity=".6"/>` : '') +
  HI(18, 21, 3, 5) +
  (leaf ? STEM(24, 27 - r + 1, 25, 27 - r - 4) + LEAF(25, 27 - r - 2) : '');

const citrus = (c, d, r = 14, leaf = false) =>
  round(c, d, { r, leaf }) +
  [[-6, -3], [4, -7], [7, 4], [-3, 6], [1, 0], [-8, 5]]
    .map(([x, y]) => `<circle cx="${24 + x * r / 14}" cy="${27 + y * r / 14}" r=".9" fill="${d}" opacity=".5"/>`)
    .join('') +
  `<circle cx="24" cy="${27 - r + 2}" r="1.5" fill="${d}"/>`;

const half = (rind, flesh, center, extra = '') =>
  `<circle cx="24" cy="25" r="16" fill="${rind}"/><circle cx="24" cy="25" r="13.5" fill="${flesh}"/>` +
  `<circle cx="24" cy="25" r="6" fill="${center}"/>` + extra;

const glassShape = (liquid, level = 18) =>
  `<path d="M13 8h22l-2.6 32a3 3 0 0 1-3 2.7H18.6a3 3 0 0 1-3-2.7z" fill="#e7eef6" stroke="#b7c3d3" stroke-width="1.4"/>` +
  `<path d="M${13 + (level - 8) * 0.08} ${level}h${22 - (level - 8) * 0.16}l-1.8 ${22 - (level - 18)}a3 3 0 0 1-3 2.7H18.6a3 3 0 0 1-3-2.7z" fill="${liquid}"/>` +
  `<path d="M17 12l1.6 24" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`;

const wineGlass = (c) =>
  `<path d="M14 6h20c0 11-3.5 18-10 18S14 17 14 6z" fill="#e7eef6" stroke="#b7c3d3" stroke-width="1.4"/>` +
  `<path d="M15.2 12h17.6c-1 7-4 11.5-8.8 11.5S16.2 19 15.2 12z" fill="${c}"/>` +
  `<rect x="23" y="24" width="2" height="13" fill="#b7c3d3"/><ellipse cx="24" cy="39" rx="9" ry="2.6" fill="#c9d3e0"/>` +
  `<path d="M18 9c0 5 1 8 3 10" stroke="#fff" stroke-width="1.6" opacity=".6" fill="none" stroke-linecap="round"/>`;

const bottle = (c, label = '#f3efe6') =>
  `<rect x="20" y="5" width="8" height="5" rx="1" fill="#3a2a3a"/><path d="M20 10h8v6c4 2 5 4 5 8v16a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V24c0-4 1-6 5-8z" fill="${c}"/>` +
  `<rect x="17" y="26" width="14" height="9" rx="1.5" fill="${label}"/><rect x="19.5" y="29" width="9" height="1.4" fill="${c}" opacity=".7"/>` +
  `<path d="M18 22v14" stroke="#fff" stroke-width="1.6" opacity=".35" stroke-linecap="round"/>`;

const mug = (c, tag = false) =>
  `<path d="M33 21h2.5a5 5 0 0 1 0 10H33" fill="none" stroke="#c4ccd8" stroke-width="3"/>` +
  `<path d="M11 17h22v18a6 6 0 0 1-6 6H17a6 6 0 0 1-6-6z" fill="#fdfdfd" stroke="#c4ccd8" stroke-width="1.4"/>` +
  `<ellipse cx="22" cy="17.5" rx="10.3" ry="2.6" fill="${c}"/>` +
  (tag ? `<path d="M28 17l3 9" stroke="#bbb" stroke-width="1"/><rect x="29" y="25" width="5" height="6" rx="1" fill="#e9b949"/>` : '') +
  `<path d="M18 13c-2-2 2-4 0-6M24 13c-2-2 2-4 0-6" stroke="#b7c3d3" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;

const bowlBase = (fill) =>
  `<ellipse cx="24" cy="24" rx="17" ry="4.6" fill="${fill}"/>` +
  `<path d="M7 24h34c0 9.5-7.6 17-17 17S7 33.5 7 24z" fill="#f4f6f9" stroke="#c4ccd8" stroke-width="1.4"/>` +
  `<path d="M12 28c1.5 5 5 8 9 9" stroke="#fff" stroke-width="2" fill="none" opacity=".8" stroke-linecap="round"/>`;
const dots = (pts, c, r = 1.3) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('');
const mound = (c) => `<path d="M10 24c2-7 8-10 14-10s12 3 14 10z" fill="${c}"/>`;

const bag = (c, accent, art = '') =>
  `<path d="M12 9l3 2 3-2 3 2 3-2 3 2 3-2 3 2 3-2v3l-2 4v20l2 4v3l-3-2-3 2-3-2-3 2-3-2-3 2-3-2-3 2-3-2v-3l2-4V16l-2-4z" fill="${c}"/>` +
  `<circle cx="24" cy="27" r="8" fill="${accent}"/>` + art +
  `<path d="M16 16v20" stroke="#fff" stroke-width="2" opacity=".3" stroke-linecap="round"/>`;

const jar = (c, lid = '#c8963e', label = '#f3efe6') =>
  `<rect x="14" y="8" width="20" height="6" rx="2" fill="${lid}"/>` +
  `<path d="M13 16a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v22a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z" fill="${c}"/>` +
  `<rect x="15" y="23" width="18" height="10" rx="2" fill="${label}"/>` +
  `<path d="M16 18v18" stroke="#fff" stroke-width="2" opacity=".3" stroke-linecap="round"/>`;

const nut = (c, d, shape) => shape(c, d);

// ---------- art per food ----------
const ART = {
  'ענבים':
    STEM(24, 12, 26, 6) + LEAF(26, 9, -10) +
    dots([[18, 16], [24, 15], [30, 16], [15, 22], [21, 22], [27, 22], [33, 22], [18, 28], [24, 28], [30, 28], [21, 34], [27, 34], [24, 40]], '#7a3e9d', 4.3) +
    dots([[17, 14.5], [23, 13.5], [20, 20.5], [26, 20.5], [17, 26.5], [23, 26.5], [20, 32.5]], '#fff', 1.1).replace(/fill="#fff"/g, 'fill="#fff" opacity=".45"'),
  'צימוקים':
    [[14, 30, 20], [22, 33, -10], [31, 30, 30], [18, 23, -40], [27, 24, 10], [34, 36, 0], [12, 37, 15], [24, 18, 60]]
      .map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="3.4" transform="rotate(${r} ${x} ${y})" fill="#5b2c3c"/><path d="M${x - 2} ${y}h3" stroke="#8a4a5e" stroke-width="1"/>`)
      .join(''),
  'תאנים':
    `<path d="M24 9c-2 0-3 3-3 5-7 3-11 9-11 15 0 7 6 12 14 12s14-5 14-12c0-6-4-12-11-15 0-2-1-5-3-5z" fill="#6e3f73"/>` +
    `<path d="M24 41c5 0 11-3 12-10" stroke="#4e2a53" stroke-width="3" fill="none" opacity=".5"/>` + HI(18, 25, 3, 5) +
    STEM(24, 10, 25, 6),
  'רימון':
    `<circle cx="24" cy="27" r="15" fill="#c52a3a"/><path d="M19 13l1.5-6 3.5 4 3.5-4 1.5 6z" fill="#a11d2c"/>` +
    `<path d="M24 42a15 15 0 0 0 13-8" stroke="#8f1525" stroke-width="3" fill="none" opacity=".5"/>` + HI(17, 22, 3, 5.5),
  'זיתים':
    `<ellipse cx="18" cy="28" rx="8" ry="11" transform="rotate(-20 18 28)" fill="#6f7f2a"/>` +
    `<ellipse cx="31" cy="25" rx="7.5" ry="10.5" transform="rotate(20 31 25)" fill="#3c3530"/>` +
    HI(15, 23, 2, 3.5, -20) + HI(28, 20, 1.8, 3, 20) + LEAF(22, 12, -60, '#7e9a54'),
  'תמרים':
    `<ellipse cx="18" cy="26" rx="6.5" ry="14" transform="rotate(-18 18 26)" fill="#7a3a17"/>` +
    `<ellipse cx="31" cy="27" rx="6.5" ry="14" transform="rotate(14 31 27)" fill="#8f4a1f"/>` +
    `<path d="M14 20c1 6 2 11 5 15M28 18c0 6 0 12 2 16" stroke="#5a2a10" stroke-width="1.2" fill="none" opacity=".6"/>` +
    HI(15, 18, 1.6, 4, -18) + HI(29, 19, 1.6, 4, 14),
  'יין': wineGlass('#8a1f3d'),
  'מיץ ענבים': bottle('#6a2c7a'),

  'תפוח':
    `<path d="M24 15c-3-2-8-3-11 0-4 4-3 12 0 17 2 4 5 8 8 7 2-.7 4-.7 6 0 3 1 6-3 8-7 3-5 4-13 0-17-3-3-8-2-11 0z" fill="#d9363e"/>` +
    `<path d="M33 33c-2 4-5 7-7.5 6" stroke="#a8222b" stroke-width="3" fill="none" opacity=".5"/>` + HI(17, 22, 2.6, 4.5) +
    STEM(24, 15, 26, 8) + LEAF(26, 11),
  'אגס':
    `<path d="M24 11c-3 0-4 4-4 7 0 3-7 6-7 14 0 7 5 11 11 11s11-4 11-11c0-8-7-11-7-14 0-3-1-7-4-7z" fill="#c4cf43"/>` +
    `<path d="M34 34c-1 5-5 8-10 8" stroke="#98a32a" stroke-width="3" fill="none" opacity=".5"/>` + HI(19, 28, 2.4, 4.5) +
    STEM(24, 11, 25, 6) + LEAF(25, 8),
  'אפרסק': round('#f6a560', '#e0703f', { crease: true }) + `<circle cx="30" cy="31" r="7" fill="#ef6b5b" opacity=".35"/>`,
  'שזיף': round('#6b3a8f', '#4a2266', { r: 13, crease: true }),
  'משמש': round('#f4a42a', '#d77d16', { r: 12, crease: true }) + `<circle cx="29" cy="31" r="5" fill="#e8612c" opacity=".3"/>`,
  'דובדבנים':
    `<path d="M17 31C19 22 23 14 28 8M31 33c0-9-1-17-3-25" stroke="#5f7a2a" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
    LEAF(28, 9, -20) +
    `<circle cx="16" cy="34" r="7.5" fill="#c71f35"/><circle cx="32" cy="35" r="7.5" fill="#b0182d"/>` +
    HI(13.5, 31.5, 1.6, 2.6) + HI(29.5, 32.5, 1.6, 2.6),
  'תפוז': citrus('#f7931e', '#d9740b') + LEAF(25, 11, -20),
  'קלמנטינה': citrus('#f98a1c', '#d8670a', 12) + STEM(24, 16, 25, 12) + LEAF(25, 13, -25),
  'אשכולית': half('#f6b04a', '#f37a6c', '#f9c2b5',
    [0, 60, 120, 180, 240, 300].map((a) => `<path d="M24 25l${(13 * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(13 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" stroke="#f9c2b5" stroke-width="1.4"/>`).join('')),
  'מנגו':
    `<path d="M14 30c-2-10 6-19 16-18 7 1 10 8 7 16-3 9-12 14-18 11-3-1-4-5-5-9z" fill="#f4b23a"/>` +
    `<path d="M30 12c6 1 9 7 7 13-3-5-6-8-7-13z" fill="#e5543b" opacity=".75"/>` + HI(20, 26, 2.6, 5, 20) + LEAF(29, 11, -40),
  'אבוקדו':
    `<path d="M24 7c-5 0-7 6-8 11-3 4-5 8-5 13 0 7 6 11 13 11s13-4 13-11c0-5-2-9-5-13-1-5-3-11-8-11z" fill="#3c5a1f"/>` +
    `<path d="M24 10c-3.5 0-5 5-6 9-2.6 3.5-4 7-4 11.5 0 5.5 4.7 9 10 9s10-3.5 10-9c0-4.5-1.4-8-4-11.5-1-4-2.5-9-6-9z" fill="#d6e48a"/>` +
    `<circle cx="24" cy="30" r="6" fill="#8a5428"/>` + HI(22, 28, 1.5, 2.3),
  'קיווי': half('#8a6a3c', '#7ec242', '#e9f5c9',
    Array.from({ length: 10 }, (_, i) => { const a = (i * 36 * Math.PI) / 180; return `<ellipse cx="${(24 + 8.6 * Math.cos(a)).toFixed(1)}" cy="${(25 + 8.6 * Math.sin(a)).toFixed(1)}" rx=".8" ry="1.5" transform="rotate(${i * 36 + 90} ${(24 + 8.6 * Math.cos(a)).toFixed(1)} ${(25 + 8.6 * Math.sin(a)).toFixed(1)})" fill="#2b2b1d"/>`; }).join('')),
  'ליצ׳י': round('#d2394a', '#a02233', { r: 13, leaf: false }) +
    dots([[18, 23], [24, 21], [30, 24], [17, 30], [23, 28], [29, 31], [24, 35], [20, 36]], '#a02233', 1.2) + STEM(24, 14, 25, 9),
  'אפרסמון': `<ellipse cx="24" cy="28" rx="15" ry="13" fill="#f2832b"/>` + HI(17, 24, 3, 5) +
    `<path d="M24 16l-7-3 4 5-6 2 7 1 2 4 2-4 7-1-6-2 4-5z" fill="#4f7a2a"/>`,
  'גויאבה': `<ellipse cx="24" cy="27" rx="14" ry="15" fill="#9cc65a"/><path d="M24 42a14 15 0 0 0 12-8" stroke="#79a03a" stroke-width="3" fill="none" opacity=".5"/>` + HI(18, 21, 2.6, 4.6) + `<circle cx="24" cy="12.5" r="1.6" fill="#5c7a2c"/>`,
  'אוכמניות':
    [[16, 30], [30, 31], [23, 20], [22, 37], [33, 21]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="7" fill="#35477d"/><circle cx="${x}" cy="${y - 4.2}" r="1.8" fill="#1f2a50"/>` + HI(x - 3, y - 1, 1.2, 2)).join(''),
  'שקדים':
    [[18, 27, -25], [30, 24, 20]].map(([x, y, r]) =>
      `<path d="M${x} ${y - 11}c5 4 7 9 6 14-1 4-4 7-6 7s-5-3-6-7c-1-5 1-10 6-14z" fill="#c4864f" transform="rotate(${r} ${x} ${y})"/>` +
      `<path d="M${x} ${y - 8}v16" stroke="#9c6437" stroke-width="1" transform="rotate(${r} ${x} ${y})" opacity=".6"/>`).join(''),
  'אגוזי מלך':
    `<circle cx="24" cy="25" r="15" fill="#b6884f"/><path d="M24 10v30" stroke="#8a6232" stroke-width="2"/>` +
    `<path d="M15 18c3 2 4 5 2 8s1 6 4 8M33 18c-3 2-4 5-2 8s-1 6-4 8" stroke="#8a6232" stroke-width="1.6" fill="none"/>` + HI(17, 18, 2, 3.5),
  'פיסטוקים':
    [[17, 28, -20], [31, 26, 25]].map(([x, y, r]) =>
      `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="7" ry="11" fill="#e6d3ab"/><ellipse cx="${x}" cy="${y}" rx="3.6" ry="8.5" fill="#8db43c"/><path d="M${x - 3.6} ${y}a3.6 8.5 0 0 1 3.6-8.5" stroke="#b69a6a" stroke-width="1.6" fill="none"/></g>`).join(''),
  'קשיו':
    [[18, 27, 0], [30, 24, 40]].map(([x, y, r]) =>
      `<path d="M${x - 6} ${y - 8}c-4 6-2 15 6 17 6 1 9-3 8-6-1-2-4-2-6-3-3-1-4-4-3-8 0-3-3-3-5 0z" fill="#ecd29f" transform="rotate(${r} ${x} ${y})"/>`).join(''),
  'אגוזי לוז':
    [[17, 29], [31, 27]].map(([x, y]) =>
      `<circle cx="${x}" cy="${y}" r="8.5" fill="#9a5c2b"/><path d="M${x - 8} ${y - 3}c3-6 13-6 16 0-5-2-11-2-16 0z" fill="#d8b48a"/>` + HI(x - 3, y + 1, 1.5, 3)).join(''),
  'רסק תפוחים': bowlBase('#ecd57e') + dots([[18, 23], [26, 24], [31, 23]], '#d9b54e', 1.4) + LEAF(28, 15, -10),

  'בננה':
    `<path d="M9 28c7 8 22 8 30-5 1.5-2.5 2-6 1-8-2-.3-3 2.5-4 4.5-6 9-17 11-25 7z" fill="#f6d33a"/>` +
    `<path d="M11 31c8 6 19 5 26-4" stroke="#d8ae16" stroke-width="2.4" fill="none" opacity=".7"/>` +
    `<path d="M39 15l2-3" stroke="#6b4a1f" stroke-width="2.6" stroke-linecap="round"/><circle cx="9.5" cy="28.5" r="1.4" fill="#6b4a1f"/>`,
  'תות שדה':
    `<path d="M24 42c-8-6-13-13-12-20 1-5 6-7 12-5 6-2 11 0 12 5 1 7-4 14-12 20z" fill="#e1323f"/>` +
    dots([[18, 23], [24, 22], [30, 23], [16, 29], [22, 28], [28, 29], [32, 28], [20, 34], [26, 34], [23, 39]], '#f8d65a', .9) +
    `<path d="M24 18l-8-3 5 0-3-5 6 4 0-6 2 6 5-4-2 5 7 0z" fill="#3f8a32"/>` + HI(17, 26, 1.6, 3),
  'אבטיח':
    `<path d="M5 16a19 19 0 0 0 38 0z" fill="#3d8b3d"/><path d="M8 16a16 16 0 0 0 32 0z" fill="#e8f0c4"/>` +
    `<path d="M9.6 16a14.4 14.4 0 0 0 28.8 0z" fill="#ec4352"/>` +
    [[16, 21], [24, 24], [32, 21], [20, 27], [28, 27]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1" ry="1.7" fill="#2a1a1a"/>`).join(''),
  'מלון':
    `<path d="M5 18a19 19 0 0 0 38 0z" fill="#b9c96e"/><path d="M8 18a16 16 0 0 0 32 0z" fill="#f6e9b0"/>` +
    `<path d="M9.6 18a14.4 14.4 0 0 0 28.8 0z" fill="#f7a35a"/><path d="M15 18a9 9 0 0 0 18 0z" fill="#f2c27a"/>`,
  'אננס':
    `<path d="M24 16l-3-10 3 4 2-6 1 7 4-4-2 8 5-2-5 6z" fill="#3d8b3d"/>` +
    `<ellipse cx="24" cy="30" rx="10.5" ry="12.5" fill="#eaa628"/>` +
    `<path d="M15 23l15 15M14 31l9 9M19 19l13 13M33 23L18 38M34 31l-9 9M29 19L16 32" stroke="#b8741a" stroke-width="1.2" opacity=".8"/>`,
  'פפאיה':
    `<ellipse cx="24" cy="25" rx="11" ry="17" transform="rotate(25 24 25)" fill="#8ab33f"/>` +
    `<ellipse cx="24" cy="25" rx="9" ry="15" transform="rotate(25 24 25)" fill="#f58a3a"/>` +
    `<ellipse cx="24" cy="25" rx="3.5" ry="8" transform="rotate(25 24 25)" fill="#f7b37a"/>` +
    dots([[22, 21], [24, 25], [26, 29], [23, 28], [25, 22]], '#2a1a1a', 1.2),

  'עגבניה': round('#e2413b', '#b72a24', { r: 14, leaf: false }) +
    `<path d="M24 16l-7-2 4 3-6 3 7-1 2 4 2-4 7 1-6-3 4-3z" fill="#3f8a32"/>`,
  'מלפפון':
    `<rect x="7" y="18" width="34" height="12" rx="6" transform="rotate(-30 24 24)" fill="#4b9a3a"/>` +
    `<rect x="11" y="21" width="26" height="3" rx="1.5" transform="rotate(-30 24 24)" fill="#7cc061" opacity=".7"/>` +
    dots([[16, 30], [22, 26], [28, 23], [33, 19]], '#2f6e24', .9),
  'גזר':
    `<path d="M31 14L12 38c-1.5 2 .5 3.5 2.5 2.4L37 20z" fill="#f2862a"/>` +
    `<path d="M22 25l3 2M17 31l3 2M27 19l2.5 2" stroke="#c9631a" stroke-width="1.4"/>` +
    `<path d="M33 17c0-6 2-9 4-10M34 18c4-3 7-3 9-2M34 17c2-4 5-6 8-6" stroke="#4f9d3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`,
  'פלפל':
    `<path d="M13 20c0-5 5-7 11-7s11 2 11 7c0 11-3 22-11 22S13 31 13 20z" fill="#e2393a"/>` +
    `<path d="M24 14v26M18 16c-2 8-1 17 2 23M30 16c2 8 1 17-2 23" stroke="#b5212a" stroke-width="1.2" fill="none" opacity=".6"/>` +
    `<path d="M24 13c0-4 2-6 5-6" stroke="#3f8a32" stroke-width="3" fill="none" stroke-linecap="round"/>` + HI(18, 22, 1.8, 4, 0),
  'חסה':
    `<path d="M8 30c-2-8 4-15 10-15 2-4 10-5 13-1 6 0 11 6 9 14 2 6-3 12-10 12H17c-6 0-10-4-9-10z" fill="#7cc25a"/>` +
    `<path d="M12 30c2-6 7-9 12-9s10 3 12 9c-1 5-6 9-12 9s-11-4-12-9z" fill="#a6db7a"/>` +
    `<path d="M24 21v18M24 28l-6-4M24 33l7-5" stroke="#5e9e40" stroke-width="1.4" fill="none"/>`,
  'תפוח אדמה מבושל':
    `<path d="M9 27c0-8 7-13 15-13 9 0 16 5 16 12 0 8-7 13-16 13-9 0-15-4-15-12z" fill="#cf9f5f"/>` +
    dots([[17, 22], [29, 21], [22, 31], [33, 30]], '#9c7038', 1.2) + HI(17, 24, 2.4, 4.4, -60),
  'בטטה':
    `<path d="M6 28c2-7 10-12 20-12 8 0 15 4 16 9 0 6-7 10-16 11-10 1-21-2-20-8z" fill="#b5553a"/>` +
    `<path d="M14 24c3 1 6 1 8-1M27 30c2 1 4 1 6 0" stroke="#8a3a25" stroke-width="1.2" fill="none"/>` + HI(16, 23, 2, 5, -70),
  'תירס':
    `<ellipse cx="25" cy="22" rx="7.5" ry="15" transform="rotate(30 25 22)" fill="#f6cf3c"/>` +
    Array.from({ length: 5 }, (_, r) => Array.from({ length: 3 }, (_, c) => {
      const x = 19 + c * 4 + r * 2.6, y = 33 - r * 5 + c * 1.2;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.3" fill="#e2a91c"/>`;
    }).join('')).join('') +
    `<path d="M14 41c2-9 6-14 12-16-3 6-6 11-12 16zM17 41c6-4 11-8 13-14 1 6-5 11-13 14z" fill="#6aa840"/>`,
  'סלט ירקות': bowlBase('#86c45e') + mound('#86c45e') +
    dots([[17, 20], [26, 17], [31, 21]], '#e2413b', 2.4) + dots([[21, 18], [29, 17]], '#f6d33a', 1.6) + dots([[22, 22], [34, 22]], '#3e8a32', 1.8),
  'מרק ירקות': bowlBase('#eb9a3c') + dots([[16, 23.5], [30, 24]], '#f6d33a', 1.6) + dots([[22, 23], [33, 23]], '#5fae3e', 1.4) +
    `<rect x="24" y="22.4" width="3" height="2" rx=".6" fill="#e2632b"/>` +
    `<path d="M18 15c-2-2 2-4 0-6M24 15c-2-2 2-4 0-6M30 15c-2-2 2-4 0-6" stroke="#b7c3d3" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
  'חומוס': bowlBase('#e6c78d') +
    `<path d="M14 24c3-2 7-1 10 0s7 1 10-.5" stroke="#d1aa62" stroke-width="2" fill="none"/>` +
    `<ellipse cx="24" cy="24" rx="5" ry="1.5" fill="#b4b13a" opacity=".85"/>` + dots([[19, 23], [29, 25], [26, 22.5]], '#d9542c', .9) +
    dots([[22, 24], [26, 24.6]], '#d8b97a', 1.4),
  'פטריות':
    `<path d="M20 26h8l1 13a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2z" fill="#efe3cc"/>` +
    `<path d="M7 27c0-10 8-17 17-17s17 7 17 17c0 2-2 2-3 2H10c-1 0-3 0-3-2z" fill="#b8835a"/>` +
    dots([[16, 19], [28, 16], [33, 23]], '#e4c8a6', 2) + HI(15, 17, 2, 4, -50),

  'לחם':
    `<path d="M7 27c0-8 7-13 17-13s17 5 17 13v8c0 3-2 5-5 5H12c-3 0-5-2-5-5z" fill="#c98a3e"/>` +
    `<path d="M7 27c0-8 7-13 17-13s17 5 17 13c-5 3-11 4-17 4S12 30 7 27z" fill="#a8692a"/>` +
    `<path d="M14 22l4-4M21 22l4-5M28 22l4-4" stroke="#e9b86e" stroke-width="2" stroke-linecap="round"/>`,
  'פיתה':
    `<ellipse cx="24" cy="27" rx="18" ry="12" fill="#e7c27b"/><ellipse cx="24" cy="25" rx="15" ry="8.5" fill="#f0d394"/>` +
    dots([[17, 24], [27, 22], [31, 27], [21, 29]], '#c99b4e', 1.2),
  'מצה':
    `<rect x="8" y="10" width="32" height="28" rx="2.5" fill="#ecd096" transform="rotate(-6 24 24)"/>` +
    Array.from({ length: 4 }, (_, r) => `<path d="M12 ${17 + r * 6.2}h24" stroke="#c49a52" stroke-width="1.6" stroke-dasharray=".1 3" stroke-linecap="round" transform="rotate(-6 24 24)"/>`).join('') +
    dots([[17, 15], [31, 21], [21, 33]], '#a6702f', 1.6),
  'עוגה':
    `<path d="M8 24h26v14H8z" fill="#f0cf86"/><path d="M8 29h26v2.5H8z" fill="#7b4a2a"/><path d="M34 24l6-8v14l-6 8z" fill="#ddb466"/>` +
    `<path d="M8 24h26l6-8H16z" fill="#fdf6ec"/><path d="M8 24h26v2.4H8z" fill="#f6e9d6"/>` +
    `<circle cx="27" cy="17" r="3" fill="#d23a48"/>` + HI(26, 16, .8, 1.2),
  'עוגיות':
    `<circle cx="24" cy="25" r="16" fill="#d6a258"/><circle cx="24" cy="25" r="16" fill="none" stroke="#b98238" stroke-width="2" opacity=".6"/>` +
    dots([[17, 19], [28, 17], [32, 27], [20, 30], [26, 34], [14, 26], [24, 25]], '#5a3320', 2.1),
  'קרקרים':
    `<rect x="9" y="9" width="30" height="30" rx="4" fill="#e3b05f" transform="rotate(8 24 24)"/>` +
    dots([[16, 16], [24, 17], [32, 18], [15, 24], [23, 25], [31, 26], [14, 32], [22, 33], [30, 34]], '#bf883a', 1.2),
  'בורקס':
    `<path d="M24 9c1.5 0 2.5 1 3.4 2.5l12 22c1.2 2.4-.2 5-3 5H11.6c-2.8 0-4.2-2.6-3-5l12-22C21.5 10 22.5 9 24 9z" fill="#e0a54a"/>` +
    `<path d="M24 12L12 35h24z" fill="#ecba62"/>` + dots([[20, 24], [26, 21], [24, 30], [29, 31], [18, 32]], '#fff6dc', .9),
  'פיצה':
    `<path d="M24 43L7 12c11-6 23-6 34 0z" fill="#f5cf5c"/><path d="M7 12c11-6 23-6 34 0l-2 3.6c-9.5-5-20.5-5-30 0z" fill="#d49a48"/>` +
    dots([[20, 20], [29, 21], [24, 30]], '#c8343a', 3) + dots([[17, 26], [31, 28]], '#3e8a32', 1),
  'פסטה': bowlBase('#f1c84a') +
    `<path d="M12 23c2-6 5-6 6 0s4 6 6 0 4-6 6 0 4 5 6 0" stroke="#e9b62f" stroke-width="2.2" fill="none"/>` +
    `<path d="M17 20c4-4 10-4 14 0" stroke="#d24a32" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
  'קוסקוס': bowlBase('#f0cf6a') + mound('#f0cf6a') + dots([[16, 21], [20, 18], [25, 17], [30, 19], [33, 22], [22, 22], [28, 22]], '#d9ad3a', .9) + dots([[24, 15], [19, 21]], '#d9542c', 1.4),
  'פתיתים': bowlBase('#e8d29e') + mound('#e8d29e') + dots([[15, 22], [19, 19], [24, 17], [29, 18], [33, 22], [21, 22], [27, 21]], '#c9ad6e', 1.4),
  'קרואסון':
    `<path d="M6 31c2-7 8-8 12-6-2 5-6 7-12 6zM42 31c-2-7-8-8-12-6 2 5 6 7 12 6z" fill="#cf8a3a"/>` +
    `<path d="M14 26c0-8 4-13 10-13s10 5 10 13c-3 3-6 4-10 4s-7-1-10-4z" fill="#e0a24e"/>` +
    `<path d="M19 15c1 5 1 9 0 14M29 15c-1 5-1 9 0 14" stroke="#b9772c" stroke-width="1.6" fill="none"/>`,
  'דייסת שיבולת שועל': bowlBase('#e2c993') + dots([[17, 23], [22, 22], [27, 23.5], [32, 23]], '#c9a868', 1.2) + dots([[20, 24.5], [30, 22]], '#35477d', 2),
  'אורז': bowlBase('#fbfaf3') + mound('#fbfaf3') + `<path d="M10 24c2-7 8-10 14-10s12 3 14 10" fill="none" stroke="#e4e1d2" stroke-width="1.2"/>` +
    [[16, 21, 30], [21, 18, -20], [26, 17, 40], [31, 20, -30], [23, 22, 0], [28, 22, 60]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry=".7" transform="rotate(${r} ${x} ${y})" fill="#dedbcc"/>`).join(''),
  'פריכיות אורז':
    `<ellipse cx="24" cy="30" rx="17" ry="6" fill="#d8c79c"/><ellipse cx="24" cy="26" rx="17" ry="6" fill="#f1e6c6"/>` +
    dots([[14, 26], [19, 24], [24, 26], [29, 24], [34, 26], [18, 28], [28, 28], [24, 22.5]], '#ddcfa6', 1.6),
  'קורנפלקס': bowlBase('#fafafa') +
    [[16, 21, 20], [22, 19, -30], [28, 20, 10], [32, 22, -20], [20, 23, 40], [26, 23, -10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2.2" transform="rotate(${r} ${x} ${y})" fill="#f0a63a"/>`).join(''),

  'ביסלי': bag('#d9742c', '#f6d35a',
    `<rect x="19" y="23" width="10" height="3" rx="1.5" fill="#c46a2a"/><rect x="21" y="28" width="8" height="3" rx="1.5" fill="#c46a2a"/>`),
  'במבה': bag('#f2c230', '#d13b2f', `<path d="M20 25c2-2 6-2 8 0M19 29c3-1 7-1 10 0" stroke="#f7e08a" stroke-width="2.4" fill="none" stroke-linecap="round"/>`),
  'פופקורן':
    dots([[16, 15], [22, 12], [28, 13], [33, 16], [19, 19], [26, 18], [31, 20]], '#fff8e1', 4) +
    dots([[16, 15], [26, 18], [33, 16]], '#f2d27a', 1.4) +
    `<path d="M12 18h24l-3 24H15z" fill="#fff"/><path d="M16 18h4l1 24h-4zM24 18h4l-.5 24h-4z" fill="#d6343c"/>`,
  'צ׳יפס תפוחי אדמה': bag('#2f6db5', '#f6d35a', `<ellipse cx="24" cy="27" rx="5" ry="3.4" transform="rotate(-20 24 27)" fill="#e6a63a"/>`),
  'בוטנים':
    [[17, 28, -30], [31, 25, 25]].map(([x, y, r]) =>
      `<g transform="rotate(${r} ${x} ${y})"><path d="M${x} ${y - 11}c4 0 6 3 6 6 0 2-1 3-1 5s1 3 1 5c0 3-2 6-6 6s-6-3-6-6c0-2 1-3 1-5s-1-3-1-5c0-3 2-6 6-6z" fill="#d6a76a"/>` +
      `<path d="M${x - 3} ${y - 6}h6M${x - 3} ${y + 6}h6" stroke="#b98a4f" stroke-width="1"/></g>`).join(''),
  'חמאת בוטנים': jar('#a8642c', '#c8343a'),
  'גרעינים':
    [[16, 26, -30], [24, 20, 10], [31, 28, 40], [22, 33, -60], [33, 18, -10]].map(([x, y, r]) =>
      `<g transform="rotate(${r} ${x} ${y})"><path d="M${x} ${y - 6}c3 2 4 5 3 8-.6 2-2 3-3 3s-2.4-1-3-3c-1-3 0-6 3-8z" fill="#2f2b28"/><path d="M${x} ${y - 4}v8" stroke="#e8e2d4" stroke-width="1"/></g>`).join(''),
  'שוקולד':
    `<rect x="11" y="8" width="26" height="33" rx="2" fill="#5b3420"/>` +
    [0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${13.5 + c * 11.3}" y="${10.5 + r * 7.6}" width="9.5" height="6" rx="1" fill="#6e4129"/>`).join('')).join('') +
    `<path d="M11 30l26-9v18a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2z" fill="#c9cfd8"/><path d="M11 30l26-9v4l-26 9z" fill="#e6eaf0"/>`,
  'סוכריות':
    `<path d="M10 17l6 7-6 7zM38 17l-6 7 6 7z" fill="#e85b8a"/><circle cx="24" cy="24" r="9" fill="#f37aa3"/>` +
    `<path d="M17 21c4 2 10 2 14 0M17 27c4 2 10 2 14 0" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>` ,
  'חלבה':
    `<path d="M8 22l8-8h24l-8 8z" fill="#efe1c0"/><path d="M32 22l8-8v18l-8 8z" fill="#d6c29a"/><rect x="8" y="22" width="24" height="18" fill="#e5d3ab"/>` +
    `<path d="M10 28c4-2 7 2 11 0s6-2 9 0M10 34c3 1 6-2 10 0s7 1 10-1" stroke="#a37a4e" stroke-width="1.4" fill="none" opacity=".7"/>`,
  'גלידה':
    `<path d="M15 24h18L24 44z" fill="#e2a65a"/><path d="M17 26l10 10M21 25l9 7M31 26L21 36M27 25l-9 7" stroke="#bd7f36" stroke-width="1.1"/>` +
    `<circle cx="19" cy="20" r="6.5" fill="#f7a8c2"/><circle cx="29" cy="20" r="6.5" fill="#fbf1dc"/><circle cx="24" cy="13" r="6.5" fill="#7a4a2a"/>` +
    HI(21, 11, 1.4, 2.2),

  'מים': glassShape('#a8d8f2', 16),
  'קפה': mug('#6b3e22'),
  'תה': mug('#c7792b', true),
  'חלב': glassShape('#fbfbf8', 14) + `<path d="M15 14h18" stroke="#c4ccd8" stroke-width="1"/>`,
  'מיץ תפוזים': glassShape('#f7a12b', 15) + `<circle cx="32" cy="10" r="5" fill="#f9b84a" stroke="#f08a1c" stroke-width="1.6"/><path d="M32 6v8M28 10h8" stroke="#f08a1c" stroke-width="1"/>`,
  'משקה קל':
    `<rect x="14" y="8" width="20" height="33" rx="4" fill="#d6343c"/><rect x="14" y="8" width="20" height="4" rx="2" fill="#c9cfd8"/>` +
    `<rect x="14" y="37" width="20" height="4" rx="2" fill="#c9cfd8"/><path d="M14 26c5-4 14 2 20-3v5c-6 5-15-1-20 3z" fill="#fff"/>` +
    `<path d="M18 13v22" stroke="#fff" stroke-width="2" opacity=".35" stroke-linecap="round"/>`,

  'בשר':
    `<path d="M30 16l7-7a3 3 0 1 1 3 4 3 3 0 1 1-4 3l-7 7z" fill="#f6efe2" stroke="#d9cdb6" stroke-width="1"/>` +
    `<path d="M27 15c5 2 7 6 6 10-2 9-11 16-19 14-6-2-6-9-3-14 3-6 10-12 16-10z" fill="#b8652f"/>` +
    `<path d="M14 31c2-6 7-11 12-12" stroke="#d98b4e" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>`,
  'דג':
    `<path d="M33 24l9-8v16z" fill="#5d87b0"/><path d="M6 24c4-8 12-11 19-11 6 0 10 4 11 11-1 7-5 11-11 11-7 0-15-3-19-11z" fill="#7fa8cf"/>` +
    `<path d="M10 25c6 4 14 5 24 1" stroke="#a9c9e6" stroke-width="2.4" fill="none" opacity=".8"/><circle cx="13" cy="22" r="1.6" fill="#1e2a4a"/>` +
    `<path d="M22 15c2 4 2 14 0 18" stroke="#5d87b0" stroke-width="1.4" fill="none"/>`,
  'ביצה':
    `<path d="M10 22c-3-7 4-12 10-10 4-5 13-4 15 2 6 1 8 8 4 12 2 6-3 11-10 9-5 4-13 2-15-3-6 0-8-6-4-10z" fill="#fff" stroke="#e3dccd" stroke-width="1.2"/>` +
    `<circle cx="24" cy="25" r="7" fill="#f6b51f"/>` + HI(22, 23, 1.6, 2.4),
  'גבינה':
    `<path d="M7 32l26-17 9 8v16H7z" fill="#f5c842"/><path d="M7 32l26-17 9 8z" fill="#f9dc72"/>` +
    dots([[15, 36], [25, 33], [34, 36]], '#e0a92a', 2.4) + dots([[30, 24]], '#e8bc3a', 1.6),
  'יוגורט':
    `<path d="M11 14h26l-3 26a3 3 0 0 1-3 2.6H17a3 3 0 0 1-3-2.6z" fill="#fdfdfd" stroke="#c4ccd8" stroke-width="1.4"/>` +
    `<rect x="9" y="10" width="30" height="5" rx="2" fill="#4a7fd0"/><rect x="15" y="22" width="18" height="10" rx="2" fill="#dfe9f8"/>` +
    `<path d="M19 27h10" stroke="#4a7fd0" stroke-width="1.6"/>`,
  'סילאן': jar('#4e2312', '#c8963e'),
  'דבש':
    jar('#f0a316', '#8a5a1e', '#fff3d1') +
    `<path d="M21 26l3-1.7 3 1.7v3.4l-3 1.7-3-1.7z" fill="none" stroke="#e0941a" stroke-width="1.2"/>`,
};

const FALLBACK = round('#c9cfd8', '#9aa4b2', { leaf: false });

/** Inner SVG markup (viewBox 0 0 48 48) for a food. */
export function artInner(name) {
  return ART[name] || FALLBACK;
}

/** Complete inline SVG for a food illustration. */
export function artSvg(name, cls = 'art') {
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${artInner(name)}</svg>`;
}

export const hasArt = (name) => Boolean(ART[name]);

const isDrink = (food) => food.category === 'drink' || food.rishona === 'hagafen';

/**
 * Top-down table setting: plate with the solid foods, drinks in a column beside it.
 * Colors of the plate come from CSS tokens so it follows the theme.
 */
export function plateSvg(foods) {
  const solids = foods.filter((f) => !isDrink(f));
  const drinks = foods.filter(isDrink);
  const CX = 168, CY = 150, R_IN = 96;
  const parts = [];

  // placemat + fork
  parts.push(
    `<defs>` +
    `<linearGradient id="goldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d0"/><stop offset=".2" stop-color="#f6d77f"/><stop offset=".45" stop-color="#d3a03b"/><stop offset=".6" stop-color="#f9e49d"/><stop offset=".8" stop-color="#b9832a"/><stop offset="1" stop-color="#edc96f"/></linearGradient>` +
    `<linearGradient id="goldH" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="#fff6d0"/><stop offset=".2" stop-color="#f6d77f"/><stop offset=".45" stop-color="#d3a03b"/><stop offset=".6" stop-color="#f9e49d"/><stop offset=".8" stop-color="#b9832a"/><stop offset="1" stop-color="#edc96f"/></linearGradient>` +
    `<linearGradient id="velvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4a9a"/><stop offset=".55" stop-color="#13265c"/><stop offset="1" stop-color="#0a1638"/></linearGradient>` +
    `<radialGradient id="rim" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#f4ead6"/><stop offset="1" stop-color="#e2d3b0"/></radialGradient>` +
    `<pattern id="folds" width="24" height="10" patternUnits="userSpaceOnUse"><rect width="4" height="10" fill="#000" opacity=".18"/><rect x="4" width="6" height="10" fill="#fff" opacity=".045"/></pattern>` +
    `<radialGradient id="sheen" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `</defs>`,
  );
  parts.push(`<rect x="8" y="14" width="384" height="272" rx="26" class="pl-mat"/>`);
  parts.push(`<rect x="8" y="14" width="384" height="272" rx="26" fill="url(#folds)"/>`);
  parts.push(`<rect x="18" y="24" width="364" height="252" rx="18" fill="none" stroke="url(#goldH)" stroke-width="1" opacity=".55"/>`);
  parts.push(
    `<g class="pl-silver"><rect x="34" y="84" width="7" height="140" rx="3.5"/>` +
    `<path d="M28 52v30a9.5 9.5 0 0 0 19 0V52h-3v26h-2.6V52h-2.8v26h-2.6V52h-2.8v26h-2.6V52z"/></g>`,
  );
  // plate
  parts.push(`<circle cx="${CX + 3}" cy="${CY + 5}" r="124" class="pl-shadow"/>`);
  parts.push(`<circle cx="${CX}" cy="${CY}" r="122" class="pl-rim"/>`);
  parts.push(`<circle cx="${CX}" cy="${CY}" r="${R_IN}" class="pl-well"/>`);
  parts.push(`<circle cx="${CX}" cy="${CY}" r="110" class="pl-line"/>`);
  parts.push(`<circle cx="${CX}" cy="${CY}" r="${R_IN + 1}" fill="none" stroke="url(#goldH)" stroke-width="1.2" opacity=".7"/>`);
  parts.push(`<ellipse cx="${CX - 52}" cy="${CY - 70}" rx="46" ry="16" transform="rotate(-35 ${CX - 52} ${CY - 70})" fill="url(#sheen)"/>`);

  // solids
  const n = solids.length;
  if (n > 0) {
    const size = n === 1 ? 100 : n <= 3 ? 80 : n <= 5 ? 70 : n <= 8 ? 58 : n <= 12 ? 48 : 40;
    const spots = [];
    if (n === 1) spots.push([CX, CY]);
    else {
      const ringR = R_IN - size / 2 - 2;
      const cap = Math.max(3, Math.floor((2 * Math.PI * ringR) / (size * 0.98)));
      const centerCount = n > cap ? Math.min(n - cap, n <= 9 ? 1 : 4) : n >= 5 ? 1 : 0;
      const outer = n - centerCount;
      for (let i = 0; i < outer; i++) {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / outer;
        spots.push([CX + ringR * Math.cos(a), CY + ringR * Math.sin(a)]);
      }
      if (centerCount === 1) spots.push([CX, CY]);
      else for (let i = 0; i < centerCount; i++) {
        const a = Math.PI / 4 + (i * 2 * Math.PI) / centerCount;
        spots.push([CX + size * 0.55 * Math.cos(a), CY + size * 0.55 * Math.sin(a)]);
      }
    }
    solids.forEach((f, i) => {
      const [x, y] = spots[i];
      const rot = ((i * 37) % 30) - 15;
      parts.push(
        `<g transform="translate(${(x - size / 2).toFixed(1)} ${(y - size / 2).toFixed(1)}) rotate(${rot} ${size / 2} ${size / 2})">` +
        `<svg width="${size}" height="${size}" viewBox="0 0 48 48">${artInner(f.name)}</svg></g>`,
      );
    });
  }

  // drinks column
  const dn = drinks.length;
  if (dn > 0) {
    const dsize = dn <= 3 ? 70 : dn <= 4 ? 58 : 46;
    const step = Math.min(dsize + 6, 250 / dn);
    const top = 150 - ((dn - 1) * step) / 2;
    drinks.forEach((f, i) => {
      parts.push(
        `<svg x="${325 - dsize / 2}" y="${(top + i * step - dsize / 2).toFixed(1)}" width="${dsize}" height="${dsize}" viewBox="0 0 48 48">${artInner(f.name)}</svg>`,
      );
    });
  }

  return `<svg class="plate-art" viewBox="0 0 400 300" role="img" aria-label="${foods.length ? 'צלחת עם ' + foods.map((f) => f.name).join(', ') : 'צלחת ריקה'}">${parts.join('')}</svg>`;
}
