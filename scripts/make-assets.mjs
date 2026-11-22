// מייצר את אייקוני האפליקציה ואת תמונת השיתוף (og.png) בעזרת דפדפן Playwright.
// הרצה: node scripts/make-assets.mjs   (דורש Playwright מותקן)
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { FOODS } from '../src/foods.js';
import { artSvg } from '../src/illustrations.js';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../', import.meta.url);
mkdirSync(new URL('icons/', root), { recursive: true });

const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@500;700&family=Frank+Ruhl+Libre:wght@900&display=swap">';
const GOLD = 'linear-gradient(180deg,#fff6d0 0%,#f6d77f 20%,#d3a03b 45%,#f9e49d 60%,#b9832a 80%,#edc96f 100%)';
const VELVET = `
  radial-gradient(35% 70% at 0% 45%, rgb(255 200 110 / .28), transparent 70%),
  radial-gradient(35% 70% at 100% 45%, rgb(255 200 110 / .28), transparent 70%),
  repeating-linear-gradient(90deg, rgb(0 0 0 / .16) 0 4px, rgb(255 255 255 / .035) 4px 11px, rgb(0 0 0 / .05) 11px 25px, transparent 25px 34px),
  radial-gradient(70% 90% at 50% 0%, #2b4a9a 0%, transparent 70%),
  linear-gradient(180deg, #13265c 0%, #0a1638 100%)`;
const goldText = `background:${GOLD};-webkit-background-clip:text;background-clip:text;color:transparent;`;

const iconHtml = (pad) => `<!doctype html><html><head>${FONTS}<style>
  html,body{margin:0;width:512px;height:512px;background:#0a1638}
  .i{position:relative;width:512px;height:512px;background:${VELVET};display:grid;place-items:center;overflow:hidden}
  .ring{position:absolute;inset:${pad}px;border-radius:50%;border:14px solid transparent;
    background:radial-gradient(circle at 40% 30%, #2b4a9a, #0f1f4d 60%, #0a1638) padding-box, ${GOLD.replace('180deg', '135deg')} border-box;
    box-shadow:0 0 40px rgb(255 205 110 / .45), inset 0 0 30px rgb(0 0 0 / .4)}
  .ring2{position:absolute;inset:${pad + 26}px;border-radius:50%;border:2px solid rgb(240 200 110 / .7)}
  .b{position:relative;font:900 ${512 - pad * 2 - 150}px/1 "Frank Ruhl Libre",serif;${goldText}
    filter:drop-shadow(0 6px 0 rgb(40 20 0 / .55)) drop-shadow(0 0 24px rgb(255 205 110 / .4));margin-top:-${Math.round((512 - pad * 2) * 0.06)}px}
</style></head><body><div class="i"><div class="ring"></div><div class="ring2"></div><div class="b">ב</div></div></body></html>`;

const picks = ['ענבים', 'יין', 'עוגה', 'תפוח', 'לחם', 'רימון', 'במבה'].map((n) => FOODS.find((f) => f.name === n));
const ogHtml = `<!doctype html><html lang="he" dir="rtl"><head>${FONTS}<style>
  html,body{margin:0;width:1200px;height:630px}
  .og{position:relative;width:1200px;height:630px;background:${VELVET};color:#fbf3dc;font-family:Heebo,sans-serif;
    display:grid;justify-items:center;align-content:center;gap:10px;overflow:hidden}
  .og::after{content:"";position:absolute;inset:18px;border:3px solid transparent;border-radius:28px;
    background:linear-gradient(#0000,#0000) padding-box, linear-gradient(100deg,#9c6b1e,#f3d27a 22%,#fff3c4 38%,#cf9b36 58%,#f7df90 78%,#a8751f) border-box;
    -webkit-mask:linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0);mask:linear-gradient(#000 0 0) padding-box exclude, linear-gradient(#000 0 0)}
  .bsd{position:absolute;top:40px;right:52px;color:#f8e3a0;font-size:22px}
  .eyebrow{color:#f8e3a0;letter-spacing:.2em;font-size:26px}
  h1{margin:0;font:900 150px/1.05 "Frank Ruhl Libre",serif;${goldText}
    filter:drop-shadow(0 4px 0 rgb(60 35 0 / .6)) drop-shadow(0 0 26px rgb(255 205 110 / .35))}
  .orn{display:flex;align-items:center;gap:14px;width:520px}
  .orn i{flex:1;height:2px;background:linear-gradient(90deg,transparent,#d4a744 60%,#f8e3a0)}
  .orn i:last-child{background:linear-gradient(270deg,transparent,#d4a744 60%,#f8e3a0)}
  .orn b{width:20px;height:20px;transform:rotate(45deg);background:${GOLD};box-shadow:0 0 12px rgb(255 205 110 / .8)}
  .sub{font-size:38px;font-weight:500}
  .row{display:flex;gap:22px;margin-top:22px}
  .m{width:104px;height:104px;border-radius:50%;display:grid;place-items:center;
    background:radial-gradient(circle at 35% 30%,#fff,#f3e6c8 75%);box-shadow:0 0 0 4px #d4a744,0 0 22px rgb(255 205 110 / .45),0 8px 16px rgb(0 0 0 / .35)}
  .m svg{width:78px;height:78px}
  .foot{margin-top:18px;color:#c5c9dc;font-size:26px}
</style></head><body><div class="og">
  <span class="bsd">בס״ד</span>
  <span class="eyebrow">ברכות הנהנין</span>
  <h1>מה אברך?</h1>
  <div class="orn"><i></i><b></b><i></i></div>
  <div class="sub">ברכה ראשונה ואחרונה לכל מאכל</div>
  <div class="row">${picks.map((f) => `<div class="m">${artSvg(f)}</div>`).join('')}</div>
  <div class="foot">${FOODS.length} מאכלים · סדר הברכות לצלחת · ברכות הריח והראייה</div>
</div></body></html>`;

const browser = await chromium.launch();
async function shot(html, w, h, out, scale = 1, type = 'png') {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(out, root).pathname, type, ...(type === 'jpeg' ? { quality: 86 } : {}) });
  await page.close();
}
// icons: "any" (ring near the edge) and "maskable" (content kept inside the 80% safe zone)
for (const [name, pad] of [['icon', 34], ['icon-maskable', 70]]) {
  await shot(iconHtml(pad), 512, 512, `icons/${name}-512.png`);
}
await shot(iconHtml(34), 512, 512, 'icons/icon-192.png', 192 / 512);
await shot(iconHtml(40), 512, 512, 'icons/apple-touch-icon.png', 180 / 512);
await shot(iconHtml(34), 512, 512, 'icons/favicon-32.png', 32 / 512);
await shot(ogHtml, 1200, 630, 'og.jpg', 1, 'jpeg');
await browser.close();
console.log('assets written');
