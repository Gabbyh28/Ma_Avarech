// לוגיקת הברכות: נוסחים (עם ניקוד), סדר קדימה וחישוב ברכה אחרונה משולבת.
// הטקסטים נכתבים עם ניקוד; גרסה בלי ניקוד נגזרת מהם.

/** @typedef {{nusach?: 'ashkenaz'|'sefard'|'edot', israel?: boolean, nikud?: boolean}} Opts */

export const NUSACHIM = {
  ashkenaz: 'אשכנז',
  sefard: 'ספרד (חסידים)',
  edot: 'עדות המזרח',
};
export const DEFAULT_OPTS = { nusach: 'ashkenaz', israel: false, nikud: false };

const PREFIX = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם, ';

const RISHONA_ENDINGS = {
  hamotzi: 'הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ.',
  mezonot: 'בּוֹרֵא מִינֵי מְזוֹנוֹת.',
  hagafen: 'בּוֹרֵא פְּרִי הַגָּפֶן.',
  haetz: 'בּוֹרֵא פְּרִי הָעֵץ.',
  haadama: 'בּוֹרֵא פְּרִי הָאֲדָמָה.',
  shehakol: 'שֶׁהַכֹּל נִהְיָה בִּדְבָרוֹ.',
};

export const RISHONA = {
  hamotzi: { name: 'המוציא' },
  mezonot: { name: 'מזונות' },
  hagafen: { name: 'הגפן' },
  haetz: { name: 'העץ' },
  haadama: { name: 'האדמה' },
  shehakol: { name: 'שהכל' },
};
for (const k of Object.keys(RISHONA)) {
  Object.defineProperty(RISHONA[k], 'text', { get: () => rishonaText(k), enumerable: true });
}

// סדר קדימה בברכות הראשונות (כשאין לחם בסעודה).
export const RISHONA_ORDER = ['hamotzi', 'mezonot', 'hagafen', 'haetz', 'haadama', 'shehakol'];

export const ACHARONA = {
  birkat: { name: 'ברכת המזון' },
  mechiya: { name: 'על המחיה' },
  gafen: { name: 'על הגפן' },
  etz: { name: 'על העץ' },
  nefashot: { name: 'בורא נפשות' },
  none: { name: 'אין ברכה אחרונה' },
};

// ---------- ניקוד ----------
const PLAIN_FIXES = [
  ['אלקינו', 'אלוקינו'],
  ['בקדשה', 'בקדושה'],
  ['הקדש', 'הקודש'],
  ['חדש', 'חודש'],
  ['פרות', 'פירות'],
];
export function stripNikud(s) {
  let out = s.replace(/[֑-ׇ]/g, '');
  for (const [a, b] of PLAIN_FIXES) out = out.split(a).join(b);
  return out;
}
const finish = (text, opts) => (opts.nikud ? text : stripNikud(text));
const withDefaults = (opts) => ({ ...DEFAULT_OPTS, ...(opts || {}) });

/** ברכה מלאה מסיום נוסח (עם ניקוד). */
export function fullBlessing(ending, opts) {
  return finish(PREFIX + ending, withDefaults(opts));
}

export function rishonaText(key, opts) {
  const o = withDefaults(opts);
  return finish(PREFIX + RISHONA_ENDINGS[key], o);
}

function nefashotText(o) {
  const asher = o.nusach === 'edot' ? 'שֶּׁבָּרָא' : 'שֶּׁבָּרָאתָ';
  return finish(
    PREFIX + `בּוֹרֵא נְפָשׁוֹת רַבּוֹת וְחֶסְרוֹנָן, עַל כָּל מַה ${asher} לְהַחֲיוֹת בָּהֶם נֶפֶשׁ כָּל חָי. בָּרוּךְ חֵי הָעוֹלָמִים.`,
    o,
  );
}

// חלקי ברכה מעין שלוש לפי סוג.
const MS_OPENING = {
  mechiya: 'עַל הַמִּחְיָה וְעַל הַכַּלְכָּלָה',
  gafen: 'עַל הַגֶּפֶן וְעַל פְּרִי הַגֶּפֶן',
  etz: 'עַל הָעֵץ וְעַל פְּרִי הָעֵץ',
};
const msClosing = (kind, israel) =>
  ({
    mechiya: 'וְעַל הַמִּחְיָה',
    gafen: israel ? 'וְעַל פְּרִי גַפְנָהּ' : 'וְעַל פְּרִי הַגָּפֶן',
    etz: israel ? 'וְעַל פֵּרוֹתֶיהָ' : 'וְעַל הַפֵּרוֹת',
  })[kind];

export function meeinShaloshText(kinds, opts) {
  const o = withDefaults(opts);
  const ordered = ['mechiya', 'gafen', 'etz'].filter((k) => kinds.includes(k));
  if (ordered.length === 0) return '';
  const opening = ordered.map((k, i) => (i === 0 ? '' : 'וְ') + MS_OPENING[k]).join(' ');
  const closing = ordered.map((k) => msClosing(k, o.israel)).join(' ');
  const venochal = o.nusach === 'edot' ? '' : 'וְנֹאכַל מִפִּרְיָהּ וְנִשְׂבַּע מִטּוּבָהּ, ';
  return finish(
    PREFIX +
      `${opening}, וְעַל תְּנוּבַת הַשָּׂדֶה, ` +
      'וְעַל אֶרֶץ חֶמְדָּה טוֹבָה וּרְחָבָה שֶׁרָצִיתָ וְהִנְחַלְתָּ לַאֲבוֹתֵינוּ, לֶאֱכוֹל מִפִּרְיָהּ וְלִשְׂבּוֹעַ מִטּוּבָהּ. ' +
      'רַחֶם נָא ה׳ אֱלֹקֵינוּ עַל יִשְׂרָאֵל עַמֶּךָ, וְעַל יְרוּשָׁלַיִם עִירֶךָ, וְעַל צִיּוֹן מִשְׁכַּן כְּבוֹדֶךָ, וְעַל מִזְבְּחֶךָ וְעַל הֵיכָלֶךָ. ' +
      'וּבְנֵה יְרוּשָׁלַיִם עִיר הַקֹּדֶשׁ בִּמְהֵרָה בְיָמֵינוּ, וְהַעֲלֵנוּ לְתוֹכָהּ, וְשַׂמְּחֵנוּ בְּבִנְיָנָהּ, ' +
      venochal +
      'וּנְבָרֶכְךָ עָלֶיהָ בִּקְדֻשָּׁה וּבְטָהֳרָה. ' +
      '[בְּשַׁבָּת: וּרְצֵה וְהַחֲלִיצֵנוּ בְּיוֹם הַשַּׁבָּת הַזֶּה] [בְּרֹאשׁ חֹדֶשׁ: וְזָכְרֵנוּ לְטוֹבָה בְּיוֹם רֹאשׁ הַחֹדֶשׁ הַזֶּה] [בְּיוֹם טוֹב: וְשַׂמְּחֵנוּ בְּיוֹם חַג ... הַזֶּה] ' +
      `כִּי אַתָּה ה׳ טוֹב וּמֵטִיב לַכֹּל, וְנוֹדֶה לְּךָ עַל הָאָרֶץ ${closing}. ` +
      `בָּרוּךְ אַתָּה ה׳, עַל הָאָרֶץ ${closing}.`,
    o,
  );
}

export function acharonaName(kinds) {
  const parts = ['mechiya', 'gafen', 'etz'].filter((k) => kinds.includes(k));
  return parts.map((k, i) => (i === 0 ? '' : 'ו') + ACHARONA[k].name).join(' ');
}

export function acharonaText(key, opts) {
  const o = withDefaults(opts);
  if (key === 'nefashot') return nefashotText(o);
  if (key === 'none') return 'על מאכל זה אין ברכה אחרונה.';
  if (key === 'birkat') return 'ברכת המזון המלאה – נמצאת בכל סידור וברכון.';
  return meeinShaloshText([key], o);
}

/** מחיל על מאכל את הפסיקה של הנוסח הנבחר (אם יש לו פסיקה שונה). */
export function resolveFood(food, opts) {
  const o = withDefaults(opts);
  const over = food.edot && o.nusach === 'edot' ? food.edot : null;
  return over ? { ...food, ...over } : food;
}

/**
 * מחשב את הברכות לצלחת של כמה מאכלים.
 * @param {Array<{name:string, rishona:string, acharona:string}>} foodsIn
 * @param {Opts} [opts]
 */
export function computePlate(foodsIn, opts) {
  const o = withDefaults(opts);
  const foods = foodsIn.map((f) => resolveFood(f, o));
  const hasBread = foods.some((f) => f.rishona === 'hamotzi');

  if (hasBread) {
    return {
      hasBread,
      rishonot: [{ key: 'hamotzi', text: rishonaText('hamotzi', o), foods: foods.filter((f) => f.rishona === 'hamotzi').map((f) => f.name) }],
      acharonot: [{ key: 'birkat', name: ACHARONA.birkat.name, text: acharonaText('birkat', o), foods: foods.map((f) => f.name) }],
    };
  }

  const rishonot = RISHONA_ORDER.map((key) => ({
    key,
    text: rishonaText(key, o),
    foods: foods.filter((f) => f.rishona === key).map((f) => f.name),
  })).filter((r) => r.foods.length > 0);

  const acharonot = [];
  const shaloshKinds = ['mechiya', 'gafen', 'etz'].filter((k) => foods.some((f) => f.acharona === k));
  if (shaloshKinds.length > 0) {
    acharonot.push({
      key: 'meein-shalosh',
      kinds: shaloshKinds,
      name: acharonaName(shaloshKinds),
      text: meeinShaloshText(shaloshKinds, o),
      foods: foods.filter((f) => shaloshKinds.includes(f.acharona)).map((f) => f.name),
    });
  }

  const nefashotFoods = foods.filter((f) => f.acharona === 'nefashot');
  // "על העץ" פוטרת גם שאר פירות העץ מבורא נפשות.
  const coveredByEtz = shaloshKinds.includes('etz') ? nefashotFoods.filter((f) => f.rishona === 'haetz') : [];
  const remaining = nefashotFoods.filter((f) => !coveredByEtz.includes(f));
  if (coveredByEtz.length > 0) acharonot[0].foods.push(...coveredByEtz.map((f) => f.name));
  if (remaining.length > 0) {
    acharonot.push({ key: 'nefashot', name: ACHARONA.nefashot.name, text: nefashotText(o), foods: remaining.map((f) => f.name) });
  }

  return { hasBread, rishonot, acharonot };
}

/** טקסט לשיתוף של סדר הברכות לצלחת. */
export function plateShareText(foodsIn, opts) {
  const { hasBread, rishonot, acharonot } = computePlate(foodsIn, opts);
  const lines = [`מה אברך? – ${foodsIn.length} מאכלים`, ''];
  lines.push(hasBread ? 'לפני האכילה:' : 'לפני האכילה (לפי הסדר):');
  rishonot.forEach((r, i) => lines.push(`${i + 1}. ${RISHONA[r.key].name} – על ${r.foods.join(', ')}`));
  lines.push('', 'אחרי האכילה:');
  acharonot.forEach((a, i) => lines.push(`${i + 1}. ${a.name} – על ${a.foods.join(', ')}`));
  return lines.join('\n');
}

/** חיפוש מאכלים לפי שם או מילים נרדפות, מתעלם מניקוד וגרשיים. */
export function normalize(s) {
  return s
    .replace(/[֑-ׇ]/g, '')
    .replace(/["'״׳`\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function searchFoods(foods, query) {
  const q = normalize(query);
  if (!q) return foods;
  return foods
    .map((f) => {
      const names = [f.name, ...(f.aliases || [])].map(normalize);
      let score = 0;
      if (names.some((n) => n === q)) score = 3;
      else if (names.some((n) => n.startsWith(q))) score = 2;
      else if (names.some((n) => n.includes(q))) score = 1;
      return { f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.f.name.localeCompare(b.f.name, 'he'))
    .map((x) => x.f);
}
