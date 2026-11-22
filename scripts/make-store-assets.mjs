// מייצר תמונות לדף האפליקציה ב-Google Play: צילומי מסך ממוסגרים עם כותרת, ותמונה ראשית (Feature graphic).
// הרצה: מגישים את האתר מקומית (python3 -m http.server 8765) ואז: node scripts/make-store-assets.mjs
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { FOODS } from '../src/foods.js';
import { artSvg } from '../src/illustrations.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../', import.meta.url);
const SITE = process.env.SITE_URL || 'http://localhost:8765/';
const outDir = new URL('store/', root);
mkdirSync(new URL('screenshots/', outDir), { recursive: true });

const FONTS = `<style>${readFileSync(new URL('fonts/fonts.css', root), 'utf8').replace(/url\(/g, `url(${new URL('fonts/', root).href}`)}</style>`;
const GOLD_V = 'linear-gradient(180deg,#fff6d0 0%,#f6d77f 20%,#d3a03b 45%,#f9e49d 60%,#b9832a 80%,#edc96f 100%)';
const GOLD_H = 'linear-gradient(100deg,#9c6b1e,#f3d27a 22%,#fff3c4 38%,#cf9b36 58%,#f7df90 78%,#a8751f)';
const VELVET = `
  radial-gradient(35% 60% at 0% 40%, rgb(255 200 110 / .25), transparent 70%),
  radial-gradient(35% 60% at 100% 40%, rgb(255 200 110 / .25), transparent 70%),
  repeating-linear-gradient(90deg, rgb(0 0 0 / .16) 0 6px, rgb(255 255 255 / .035) 6px 16px, rgb(0 0 0 / .05) 16px 36px, transparent 36px 50px),
  radial-gradient(70% 60% at 50% 0%, #2b4a9a 0%, transparent 70%),
  linear-gradient(180deg, #13265c 0%, #0a1638 100%)`;
const goldText = `background:${GOLD_V};-webkit-background-clip:text;background-clip:text;color:transparent;`;

const browser = await chromium.launch();

// ---- raw app screenshots (1080x1920) ----
async function appShot(name, act) {
  const p = await browser.newPage({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, reducedMotion: 'reduce' });
  await p.goto(SITE);
  await p.evaluate(() => { localStorage.clear(); });
  await p.reload();
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);
  await act(p);
  await p.waitForTimeout(500);
  const buf = await p.screenshot();
  await p.close();
  return `data:image/png;base64,${buf.toString('base64')}`;
}
const shots = [
  ['01-search', '191 מאכלים, ברכה לכל אחד', async () => {}],
  ['02-food', 'הנוסח המלא לפני ואחרי', async (p) => { await p.fill('#search', 'רימון'); await p.click('.tile-open'); }],
  ['03-plate', 'צלחת שלמה – סדר הברכות הנכון', async (p) => { await p.click('[data-view=plate]'); await p.click('#plate-example'); await p.evaluate(() => window.scrollTo(0, document.querySelector('#view-plate h2').getBoundingClientRect().top + window.scrollY - 12)); }],
  ['04-order', 'ברכה אחרונה משולבת', async (p) => { await p.click('[data-view=plate]'); await p.click('#plate-example'); await p.evaluate(() => document.querySelector('#plate-result .section-label:nth-of-type(1)')?.scrollIntoView()); await p.evaluate(() => window.scrollBy(0, 420)); }],
  ['05-more', 'ברכות הריח, הראייה ושהחיינו', async (p) => { await p.click('[data-view=more]'); }],
  ['06-settings', 'אשכנז, ספרד ועדות המזרח', async (p) => { await p.click('[data-view=info]'); await p.click('label.setting:has(#opt-nikud)'); }],
];

for (const [file, caption, act] of shots) {
  const img = await appShot(file, act);
  const html = `<!doctype html><html lang="he" dir="rtl"><head>${FONTS}<style>
    html,body{margin:0;width:1080px;height:1920px}
    .s{position:relative;width:1080px;height:1920px;background:${VELVET};display:grid;justify-items:center;align-content:start;overflow:hidden}
    h2{margin:96px 60px 0;font:900 84px/1.15 "Frank Ruhl Libre",serif;text-align:center;${goldText}
      filter:drop-shadow(0 4px 0 rgb(40 20 0 / .55)) drop-shadow(0 0 20px rgb(255 205 110 / .35))}
    .orn{display:flex;align-items:center;gap:14px;width:460px;margin:26px 0 46px}
    .orn i{flex:1;height:3px;background:linear-gradient(90deg,transparent,#d4a744 60%,#f8e3a0)}
    .orn i:last-child{background:linear-gradient(270deg,transparent,#d4a744 60%,#f8e3a0)}
    .orn b{width:22px;height:22px;transform:rotate(45deg);background:${GOLD_V};box-shadow:0 0 14px rgb(255 205 110 / .8)}
    .phone{width:780px;height:1387px;border-radius:56px;padding:10px;background:${GOLD_H};
      box-shadow:0 40px 80px rgb(0 0 0 / .55),0 0 40px rgb(255 205 110 / .25)}
    .phone img{display:block;width:100%;height:100%;border-radius:46px;object-fit:cover;object-position:top}
  </style></head><body><div class="s"><h2>${caption}</h2><div class="orn"><i></i><b></b><i></i></div>
    <div class="phone"><img src="${img}"></div></div></body></html>`;
  const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: new URL(`screenshots/${file}.png`, outDir).pathname });
  await p.close();
  console.log('screenshot', file);
}

// ---- feature graphic (1024x500) ----
const picks = ['ענבים', 'יין', 'עוגה', 'תפוח', 'לחם'].map((n) => FOODS.find((f) => f.name === n));
const feature = `<!doctype html><html lang="he" dir="rtl"><head>${FONTS}<style>
  html,body{margin:0;width:1024px;height:500px}
  .f{position:relative;width:1024px;height:500px;background:${VELVET};color:#fbf3dc;display:grid;justify-items:center;align-content:center;gap:6px;overflow:hidden;font-family:Heebo,sans-serif}
  h1{margin:0;font:900 132px/1.05 "Frank Ruhl Libre",serif;${goldText}filter:drop-shadow(0 4px 0 rgb(60 35 0 / .6)) drop-shadow(0 0 24px rgb(255 205 110 / .35))}
  .sub{font-size:34px;font-weight:500}
  .row{display:flex;gap:18px;margin-top:22px}
  .m{width:88px;height:88px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#fff,#f3e6c8 75%);
    box-shadow:0 0 0 4px #d4a744,0 0 20px rgb(255 205 110 / .45),0 8px 14px rgb(0 0 0 / .35)}
  .m svg{width:66px;height:66px}
</style></head><body><div class="f"><h1>מה אברך?</h1><div class="sub">ברכה ראשונה ואחרונה לכל מאכל</div>
  <div class="row">${picks.map((f) => `<div class="m">${artSvg(f)}</div>`).join('')}</div></div></body></html>`;
{
  const p = await browser.newPage({ viewport: { width: 1024, height: 500 } });
  await p.setContent(feature, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: new URL('feature-graphic.png', outDir).pathname });
  await p.close();
}
await browser.close();
console.log('store assets written to store/');
