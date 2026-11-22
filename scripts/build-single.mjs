// בונה קובץ HTML יחיד ועצמאי (CSS ו-JS מוטמעים) לתיקייה dist/.
// שימושי לפרסום בכל מקום שמקבל קובץ אחד.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const stripModule = (src) =>
  src
    .replace(/^import .*?;\n/gms, '')
    .replace(/^export (const|function|async function)/gm, '$1');

const html = read('index.html');
const body = html
  .match(/<body>([\s\S]*)<\/body>/)[1]
  .replace(/\s*<script type="module" src="src\/app.js"><\/script>/, '');
const js = ['src/foods.js', 'src/brachot.js', 'src/illustrations.js', 'src/app.js'].map((p) => stripModule(read(p))).join('\n');

const out = `<title>מה אברך</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&family=Frank+Ruhl+Libre:wght@500;700;900&display=swap">
<meta name="description" content="מה מברכים על מה – ברכה ראשונה ואחרונה לכל מאכל">
<style>
html { direction: rtl; }
${read('styles.css')}
</style>
<div dir="rtl" lang="he">
${body.trim()}
</div>
<script>
(() => {
${js}
})();
</script>
`;
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/ma-avarech.html', import.meta.url), out);
console.log('dist/ma-avarech.html', out.length, 'bytes');
