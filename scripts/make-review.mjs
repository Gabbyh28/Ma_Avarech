// מייצר טבלה לבדיקה הלכתית של המאגר: docs/halacha-review.csv (לאקסל / Google Sheets) ו-docs/halacha-review.md.
// הרצה: node scripts/make-review.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { FOODS, CATEGORIES } from '../src/foods.js';
import { RISHONA, ACHARONA } from '../src/brachot.js';
import { EXTRA_GROUPS } from '../src/extras.js';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('docs/', root), { recursive: true });

const edot = (f) =>
  f.edot ? `${RISHONA[f.edot.rishona || f.rishona].name} / ${ACHARONA[f.edot.acharona || f.acharona].name}` : '';
const rows = FOODS.map((f, i) => ({
  n: i + 1,
  name: f.name,
  aliases: (f.aliases || []).join(', '),
  cat: CATEGORIES[f.category],
  rishona: RISHONA[f.rishona].name,
  acharona: ACHARONA[f.acharona].name,
  edot: edot(f),
  note: [f.note, f.edot?.note].filter(Boolean).join(' | '),
  flag: f.note || f.edot ? 'כן' : '',
}));

// CSV with BOM so Excel opens Hebrew correctly
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const header = ['#', 'מאכל', 'שמות נוספים', 'קטגוריה', 'ברכה ראשונה', 'ברכה אחרונה', 'שונה לעדות המזרח', 'הערה באפליקציה', 'יש מחלוקת/הערה', 'מאושר? (כן/לא)', 'תיקון / הערת הרב'];
const csv = [header, ...rows.map((r) => [r.n, r.name, r.aliases, r.cat, r.rishona, r.acharona, r.edot, r.note, r.flag, '', ''])]
  .map((line) => line.map(esc).join(','))
  .join('\r\n');
writeFileSync(new URL('docs/halacha-review.csv', root), '﻿' + csv);

const md = [
  '# בדיקה הלכתית – מאגר "מה אברך?"',
  '',
  `המאגר כולל ${FOODS.length} מאכלים. בכל שורה: הברכה הראשונה והאחרונה שהאפליקציה מציגה (ברירת מחדל: מנהג אשכנז), פסיקה שונה לעדות המזרח אם הוגדרה, וההערה שמוצגת למשתמש.`,
  'שורות עם "יש מחלוקת" הן המקומות שכדאי לבדוק קודם. את הקובץ `halacha-review.csv` אפשר לפתוח באקסל או ב-Google Sheets ולמלא בו את העמודות "מאושר?" ו"תיקון".',
  '',
  '## מאכלים',
  '',
  '| # | מאכל | קטגוריה | ראשונה | אחרונה | עדות המזרח | הערה |',
  '|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.n} | ${r.name} | ${r.cat} | ${r.rishona} | ${r.acharona} | ${r.edot} | ${r.note.replace(/\|/g, '/')} |`),
  '',
  '## נוסחים שתלויים בהגדרות',
  '',
  '- **בורא נפשות**: אשכנז וספרד – "על כל מה שבראת"; עדות המזרח – "על כל מה שברא".',
  '- **מעין שלוש**: בעדות המזרח הושמט "ונאכל מפריה ונשבע מטובה".',
  '- **פירות ארץ ישראל**: חתימה "על הארץ ועל פירותיה" / "על הארץ ועל פרי גפנה". על המחיה – "על הארץ ועל המחיה" בכל מקרה.',
  '- **ניקוד**: הנוסחים מנוקדים ב-`src/brachot.js` וב-`src/extras.js`.',
  '',
  '## ברכות נוספות',
  '',
  ...EXTRA_GROUPS.flatMap((g) => [`### ${g.title}`, '', g.intro, '', ...g.items.map((it) => `- **${it.name}** – ${it.ending.replace(/[֑-ׇ]/g, '')} (${it.when})`), '']),
].join('\n');
writeFileSync(new URL('docs/halacha-review.md', root), md);
console.log(`review written: ${rows.length} foods, ${rows.filter((r) => r.flag).length} flagged`);
