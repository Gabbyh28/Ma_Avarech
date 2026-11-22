// מאגר מאכלים. rishona: hamotzi|mezonot|hagafen|haetz|haadama|shehakol
// acharona: birkat|mechiya|gafen|etz|nefashot
// note: הערה הלכתית (מחלוקות, מנהגים ותנאים).

export const CATEGORIES = {
  fruit: 'פירות',
  seven: 'שבעת המינים',
  veg: 'ירקות',
  grain: 'מאפים ודגנים',
  snack: 'חטיפים',
  drink: 'משקאות',
  other: 'שונות',
};

const f = (name, category, rishona, acharona, extra = {}) => ({ name, category, rishona, acharona, ...extra });

export const FOODS = [
  // שבעת המינים
  f('ענבים', 'seven', 'haetz', 'etz'),
  f('צימוקים', 'seven', 'haetz', 'etz'),
  f('תאנים', 'seven', 'haetz', 'etz', { aliases: ['תאנה', 'תאנים מיובשות'] }),
  f('רימון', 'seven', 'haetz', 'etz', { aliases: ['רימונים'] }),
  f('זיתים', 'seven', 'haetz', 'etz', { aliases: ['זית'] }),
  f('תמרים', 'seven', 'haetz', 'etz', { aliases: ['תמר', 'מג׳הול'] }),
  f('יין', 'seven', 'hagafen', 'gafen', { aliases: ['יין אדום', 'יין לבן', 'קידוש'] }),
  f('מיץ ענבים', 'seven', 'hagafen', 'gafen', { aliases: ['תירוש'] }),

  // פירות העץ
  f('תפוח', 'fruit', 'haetz', 'nefashot', { aliases: ['תפוחים', 'תפוח עץ'] }),
  f('אגס', 'fruit', 'haetz', 'nefashot', { aliases: ['אגסים'] }),
  f('אפרסק', 'fruit', 'haetz', 'nefashot', { aliases: ['נקטרינה'] }),
  f('שזיף', 'fruit', 'haetz', 'nefashot', { aliases: ['שזיפים', 'שזיף מיובש', 'פרונס'] }),
  f('משמש', 'fruit', 'haetz', 'nefashot', { aliases: ['מישמש', 'משמש מיובש'] }),
  f('דובדבנים', 'fruit', 'haetz', 'nefashot', { aliases: ['דובדבן'] }),
  f('תפוז', 'fruit', 'haetz', 'nefashot', { aliases: ['תפוזים'] }),
  f('קלמנטינה', 'fruit', 'haetz', 'nefashot', { aliases: ['מנדרינה', 'קלמנטינות'] }),
  f('אשכולית', 'fruit', 'haetz', 'nefashot', { aliases: ['פומלה', 'פומלית'] }),
  f('מנגו', 'fruit', 'haetz', 'nefashot'),
  f('אבוקדו', 'fruit', 'haetz', 'nefashot'),
  f('קיווי', 'fruit', 'haetz', 'nefashot'),
  f('ליצ׳י', 'fruit', 'haetz', 'nefashot'),
  f('אפרסמון', 'fruit', 'haetz', 'nefashot'),
  f('גויאבה', 'fruit', 'haetz', 'nefashot'),
  f('אוכמניות', 'fruit', 'haetz', 'nefashot', {
    aliases: ['בלובריז'],
    note: 'יש הנוהגים לברך האדמה על אוכמניות מתורבתות הגדלות על שיח נמוך.',
  }),
  f('שקדים', 'fruit', 'haetz', 'nefashot', { aliases: ['שקד'] }),
  f('אגוזי מלך', 'fruit', 'haetz', 'nefashot', { aliases: ['אגוזים', 'אגוז'] }),
  f('פיסטוקים', 'fruit', 'haetz', 'nefashot', { aliases: ['פיסטוק'] }),
  f('קשיו', 'fruit', 'haetz', 'nefashot'),
  f('אגוזי לוז', 'fruit', 'haetz', 'nefashot', { aliases: ['לוז'] }),
  f('רסק תפוחים', 'fruit', 'haetz', 'nefashot', {
    aliases: ['מחית תפוחים', 'תפוחים מרוסקים'],
    note: 'יש אומרים שהכל על פרי שנימוח לגמרי. הנוהג הרווח: העץ.',
  }),

  // פירות האדמה
  f('בננה', 'fruit', 'haadama', 'nefashot', { aliases: ['בננות'] }),
  f('תות שדה', 'fruit', 'haadama', 'nefashot', { aliases: ['תותים', 'תות'] }),
  f('אבטיח', 'fruit', 'haadama', 'nefashot'),
  f('מלון', 'fruit', 'haadama', 'nefashot'),
  f('אננס', 'fruit', 'haadama', 'nefashot'),
  f('פפאיה', 'fruit', 'haadama', 'nefashot', { note: 'יש מחלוקת; רבים מברכים האדמה.' }),

  // ירקות
  f('עגבניה', 'veg', 'haadama', 'nefashot', { aliases: ['עגבניות', 'עגבניות שרי'] }),
  f('מלפפון', 'veg', 'haadama', 'nefashot', { aliases: ['מלפפונים'] }),
  f('גזר', 'veg', 'haadama', 'nefashot'),
  f('פלפל', 'veg', 'haadama', 'nefashot', { aliases: ['גמבה'] }),
  f('חסה', 'veg', 'haadama', 'nefashot', { note: 'יש לבדוק היטב מחרקים.' }),
  f('תפוח אדמה מבושל', 'veg', 'haadama', 'nefashot', { aliases: ['תפוחי אדמה', 'פירה', 'תפו״א', 'צ׳יפס'] }),
  f('בטטה', 'veg', 'haadama', 'nefashot'),
  f('תירס', 'veg', 'haadama', 'nefashot', { aliases: ['קלח תירס', 'תירס מתוק'] }),
  f('סלט ירקות', 'veg', 'haadama', 'nefashot', { aliases: ['סלט'] }),
  f('מרק ירקות', 'veg', 'haadama', 'nefashot', {
    aliases: ['מרק'],
    note: 'כשאוכלים את הירקות. על הנוזל בלבד יש אומרים שהכל.',
  }),
  f('חומוס', 'veg', 'haadama', 'nefashot', {
    aliases: ['ממרח חומוס'],
    note: 'יש אומרים שהכל על ממרח שהגרגרים נטחנו לגמרי. רבים נוהגים האדמה.',
  }),
  f('פטריות', 'veg', 'shehakol', 'nefashot', { aliases: ['פטריה', 'שמפיניון'], note: 'פטריות אינן יונקות מהאדמה, לכן מברכים שהכל.' }),

  // מאפים ודגנים
  f('לחם', 'grain', 'hamotzi', 'birkat', {
    aliases: ['חלה', 'לחמניה', 'באגט', 'טוסט'],
    note: 'יש ליטול ידיים לפני הברכה.',
  }),
  f('פיתה', 'grain', 'hamotzi', 'birkat', { aliases: ['לאפה'], note: 'יש ליטול ידיים לפני הברכה.' }),
  f('מצה', 'grain', 'hamotzi', 'birkat', {
    note: 'בפסח – המוציא. בשאר השנה יש מהספרדים הנוהגים מזונות כשאינו קובע סעודה.',
  }),
  f('עוגה', 'grain', 'mezonot', 'mechiya', {
    aliases: ['עוגת שמרים', 'עוגת שוקולד', 'מאפה'],
    note: 'האוכל כמות גדולה (קביעת סעודה) מברך המוציא וברכת המזון.',
  }),
  f('עוגיות', 'grain', 'mezonot', 'mechiya', { aliases: ['עוגיה', 'ביסקוויט', 'רוגלך'] }),
  f('קרקרים', 'grain', 'mezonot', 'mechiya', { aliases: ['קרקר', 'פתיתים יבשים'] }),
  f('בורקס', 'grain', 'mezonot', 'mechiya', { note: 'האוכל כמות גדולה מברך המוציא.' }),
  f('פיצה', 'grain', 'mezonot', 'mechiya', {
    note: 'רבים פוסקים שהאוכל כמות של סעודה (כגון 2 משולשים ומעלה) מברך המוציא וברכת המזון.',
  }),
  f('פסטה', 'grain', 'mezonot', 'mechiya', { aliases: ['ספגטי', 'מקרוני', 'אטריות', 'לזניה'] }),
  f('קוסקוס', 'grain', 'mezonot', 'mechiya'),
  f('פתיתים', 'grain', 'mezonot', 'mechiya'),
  f('קרואסון', 'grain', 'mezonot', 'mechiya'),
  f('דייסת שיבולת שועל', 'grain', 'mezonot', 'mechiya', { aliases: ['קוואקר', 'שיבולת שועל', 'גרנולה'] }),
  f('אורז', 'grain', 'mezonot', 'nefashot', {
    aliases: ['סושי'],
    note: 'אורז אינו מחמשת מיני דגן, לכן הברכה האחרונה בורא נפשות.',
  }),
  f('פריכיות אורז', 'grain', 'haadama', 'nefashot', {
    aliases: ['פריכית'],
    note: 'על פריכיות מגרגרים שלמים – האדמה (וי״א מזונות). על פריכיות מקמח אורז – מזונות.',
  }),
  f('קורנפלקס', 'grain', 'haadama', 'nefashot', {
    aliases: ['דגני בוקר'],
    note: 'יש מחלוקת; יש הנוהגים שהכל. דגני בוקר מחיטה/שיבולת שועל – מזונות ועל המחיה.',
  }),

  // חטיפים
  f('ביסלי', 'snack', 'mezonot', 'mechiya'),
  f('במבה', 'snack', 'shehakol', 'nefashot', { note: 'עשויה מתירס טחון שאינו ניכר. יש אומרים האדמה.' }),
  f('פופקורן', 'snack', 'haadama', 'nefashot'),
  f('צ׳יפס תפוחי אדמה', 'snack', 'haadama', 'nefashot', {
    aliases: ['תפוצ׳יפס', 'צ׳יפס שקית'],
    note: 'על חטיפים מבצק תפוחי אדמה (כגון פרינגלס) יש אומרים שהכל.',
  }),
  f('בוטנים', 'snack', 'haadama', 'nefashot', { aliases: ['בוטן'] }),
  f('חמאת בוטנים', 'snack', 'haadama', 'nefashot', { note: 'יש אומרים שהכל.' }),
  f('גרעינים', 'snack', 'haadama', 'nefashot', { aliases: ['גרעיני חמניה', 'גרעיני דלעת'] }),
  f('שוקולד', 'snack', 'shehakol', 'nefashot', { note: 'יש מהספרדים הנוהגים העץ.' }),
  f('סוכריות', 'snack', 'shehakol', 'nefashot', { aliases: ['סוכריה', 'ממתקים', 'גומי'] }),
  f('חלבה', 'snack', 'shehakol', 'nefashot'),
  f('גלידה', 'snack', 'shehakol', 'nefashot', { aliases: ['ארטיק', 'שלגון'] }),

  // משקאות
  f('מים', 'drink', 'shehakol', 'nefashot', { note: 'מברכים רק כששותים לצמאון. ברכה אחרונה רק על רביעית בבת אחת.' }),
  f('קפה', 'drink', 'shehakol', 'nefashot', { note: 'על שתייה חמה, ברכה אחרונה רק כששותים רביעית בבת אחת (רבים אינם מברכים).' }),
  f('תה', 'drink', 'shehakol', 'nefashot'),
  f('חלב', 'drink', 'shehakol', 'nefashot', { aliases: ['שוקו'] }),
  f('מיץ תפוזים', 'drink', 'shehakol', 'nefashot', { aliases: ['מיץ', 'מיץ פירות', 'מיץ תפוחים'] }),
  f('משקה קל', 'drink', 'shehakol', 'nefashot', { aliases: ['קולה', 'סודה', 'לימונדה', 'בירה'] }),

  // שונות
  f('בשר', 'other', 'shehakol', 'nefashot', { aliases: ['עוף', 'שניצל', 'נקניק', 'המבורגר'] }),
  f('דג', 'other', 'shehakol', 'nefashot', { aliases: ['דגים', 'טונה', 'סלמון'] }),
  f('ביצה', 'other', 'shehakol', 'nefashot', { aliases: ['ביצים', 'חביתה'] }),
  f('גבינה', 'other', 'shehakol', 'nefashot', { aliases: ['קוטג׳', 'גבינה צהובה'] }),
  f('יוגורט', 'other', 'shehakol', 'nefashot', { aliases: ['מעדן', 'לבן'] }),
  f('סילאן', 'other', 'shehakol', 'nefashot', { aliases: ['דבש תמרים'] }),
  f('דבש', 'other', 'shehakol', 'nefashot'),
];
