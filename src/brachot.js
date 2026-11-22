// לוגיקת הברכות: טקסטים, סדר קדימה וחישוב ברכה אחרונה משולבת.

export const RISHONA = {
  hamotzi: {
    name: 'המוציא',
    text: 'ברוך אתה ה׳ אלוקינו מלך העולם, המוציא לחם מן הארץ.',
  },
  mezonot: {
    name: 'מזונות',
    text: 'ברוך אתה ה׳ אלוקינו מלך העולם, בורא מיני מזונות.',
  },
  hagafen: {
    name: 'הגפן',
    text: 'ברוך אתה ה׳ אלוקינו מלך העולם, בורא פרי הגפן.',
  },
  haetz: {
    name: 'העץ',
    text: 'ברוך אתה ה׳ אלוקינו מלך העולם, בורא פרי העץ.',
  },
  haadama: {
    name: 'האדמה',
    text: 'ברוך אתה ה׳ אלוקינו מלך העולם, בורא פרי האדמה.',
  },
  shehakol: {
    name: 'שהכל',
    text: 'ברוך אתה ה׳ אלוקינו מלך העולם, שהכל נהיה בדברו.',
  },
};

// סדר קדימה בברכות הראשונות (כשאין לחם בסעודה).
export const RISHONA_ORDER = ['hamotzi', 'mezonot', 'hagafen', 'haetz', 'haadama', 'shehakol'];

export const ACHARONA = {
  birkat: { name: 'ברכת המזון' },
  mechiya: { name: 'על המחיה' },
  gafen: { name: 'על הגפן' },
  etz: { name: 'על העץ' },
  nefashot: { name: 'בורא נפשות' },
};

const NEFASHOT_TEXT =
  'ברוך אתה ה׳ אלוקינו מלך העולם, בורא נפשות רבות וחסרונן, על כל מה שבראת להחיות בהם נפש כל חי. ברוך חי העולמים.';

// חלקי ברכה מעין שלוש לפי סוג.
const MEEIN_SHALOSH_PARTS = {
  mechiya: { opening: 'על המחיה ועל הכלכלה', closing: 'ועל המחיה' },
  gafen: { opening: 'על הגפן ועל פרי הגפן', closing: 'ועל פרי הגפן' },
  etz: { opening: 'על העץ ועל פרי העץ', closing: 'ועל הפירות' },
};

export function meeinShaloshText(kinds) {
  const ordered = ['mechiya', 'gafen', 'etz'].filter((k) => kinds.includes(k));
  if (ordered.length === 0) return '';
  const opening = ordered
    .map((k, i) => (i === 0 ? '' : 'ו') + MEEIN_SHALOSH_PARTS[k].opening)
    .join(' ');
  const closing = ordered.map((k) => MEEIN_SHALOSH_PARTS[k].closing).join(' ');
  return (
    `ברוך אתה ה׳ אלוקינו מלך העולם, ${opening}, ועל תנובת השדה, ` +
    'ועל ארץ חמדה טובה ורחבה שרצית והנחלת לאבותינו, לאכול מפריה ולשבוע מטובה. ' +
    'רחם נא ה׳ אלוקינו על ישראל עמך, ועל ירושלים עירך, ועל ציון משכן כבודך, ועל מזבחך ועל היכלך. ' +
    'ובנה ירושלים עיר הקודש במהרה בימינו, והעלנו לתוכה, ושמחנו בבנינה, ונאכל מפריה ונשבע מטובה, ונברכך עליה בקדושה ובטהרה. ' +
    '[בשבת: ורצה והחליצנו ביום השבת הזה] [בראש חודש: וזכרנו לטובה ביום ראש החודש הזה] [ביום טוב: ושמחנו ביום חג ... הזה] ' +
    `כי אתה ה׳ טוב ומטיב לכל, ונודה לך על הארץ ${closing}. ` +
    `ברוך אתה ה׳, על הארץ ${closing}.`
  );
}

export function acharonaName(kinds) {
  const parts = ['mechiya', 'gafen', 'etz'].filter((k) => kinds.includes(k));
  if (parts.length === 0) return '';
  return parts
    .map((k, i) => {
      const n = ACHARONA[k].name; // "על המחיה" וכו'
      return i === 0 ? n : 'ו' + n;
    })
    .join(' ');
}

export function acharonaText(key) {
  if (key === 'nefashot') return NEFASHOT_TEXT;
  if (key === 'birkat') return 'ברכת המזון המלאה – נמצאת בכל סידור וברכון.';
  return meeinShaloshText([key]);
}

/**
 * מחשב את הברכות לצלחת של כמה מאכלים.
 * @param {Array<{name:string, rishona:string, acharona:string}>} foods
 * @returns {{rishonot: Array<{key:string, foods:string[]}>, acharonot: Array<{key:string, name:string, text:string, foods:string[]}>, hasBread:boolean}}
 */
export function computePlate(foods) {
  const hasBread = foods.some((f) => f.rishona === 'hamotzi');

  if (hasBread) {
    return {
      hasBread,
      rishonot: [{ key: 'hamotzi', foods: foods.filter((f) => f.rishona === 'hamotzi').map((f) => f.name) }],
      acharonot: [
        {
          key: 'birkat',
          name: ACHARONA.birkat.name,
          text: acharonaText('birkat'),
          foods: foods.map((f) => f.name),
        },
      ],
    };
  }

  const rishonot = RISHONA_ORDER.map((key) => ({
    key,
    foods: foods.filter((f) => f.rishona === key).map((f) => f.name),
  })).filter((r) => r.foods.length > 0);

  const acharonot = [];
  const shaloshKinds = ['mechiya', 'gafen', 'etz'].filter((k) => foods.some((f) => f.acharona === k));
  if (shaloshKinds.length > 0) {
    acharonot.push({
      key: 'meein-shalosh',
      name: acharonaName(shaloshKinds),
      text: meeinShaloshText(shaloshKinds),
      foods: foods.filter((f) => shaloshKinds.includes(f.acharona)).map((f) => f.name),
    });
  }

  const nefashotFoods = foods.filter((f) => f.acharona === 'nefashot');
  // פירות מז' המינים פוטרים פירות אחרים מבורא נפשות (על העץ פוטרת פירות העץ).
  const coveredByEtz = shaloshKinds.includes('etz')
    ? nefashotFoods.filter((f) => f.rishona === 'haetz')
    : [];
  const remaining = nefashotFoods.filter((f) => !coveredByEtz.includes(f));
  if (coveredByEtz.length > 0) {
    acharonot[0].foods.push(...coveredByEtz.map((f) => f.name));
  }
  if (remaining.length > 0) {
    acharonot.push({
      key: 'nefashot',
      name: ACHARONA.nefashot.name,
      text: NEFASHOT_TEXT,
      foods: remaining.map((f) => f.name),
    });
  }

  return { hasBread, rishonot, acharonot };
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
