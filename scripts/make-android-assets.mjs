// מייצר את קבצי המקור לאייקון ולמסך הפתיחה של אפליקציית האנדרואיד (תיקיית assets/),
// שמהם `npm run android:icons` יוצר את כל הגדלים.
// הרצה: node scripts/make-android-assets.mjs   (דורש Playwright)
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = new URL('../', import.meta.url);
mkdirSync(new URL('assets/', root), { recursive: true });

const FONTS = `<link rel="stylesheet" href="${new URL('fonts/fonts.css', root).href}">`;
const GOLD = 'linear-gradient(135deg,#fff6d0 0%,#f6d77f 20%,#d3a03b 45%,#f9e49d 60%,#b9832a 80%,#edc96f 100%)';
const GOLD_V = GOLD.replace('135deg', '180deg');
const VELVET = `
  radial-gradient(40% 60% at 0% 45%, rgb(255 200 110 / .22), transparent 70%),
  radial-gradient(40% 60% at 100% 45%, rgb(255 200 110 / .22), transparent 70%),
  repeating-linear-gradient(90deg, rgb(0 0 0 / .16) 0 8px, rgb(255 255 255 / .035) 8px 22px, rgb(0 0 0 / .05) 22px 50px, transparent 50px 68px),
  radial-gradient(70% 90% at 50% 0%, #2b4a9a 0%, transparent 70%),
  linear-gradient(180deg, #13265c 0%, #0a1638 100%)`;

// medallion: gold ring + gold "ב" on navy, sized by `d` (diameter in px)
const medal = (d) => `
  <div style="position:relative;width:${d}px;height:${d}px;display:grid;place-items:center">
    <div style="position:absolute;inset:0;border-radius:50%;border:${Math.round(d * 0.045)}px solid transparent;
      background:radial-gradient(circle at 40% 30%,#2b4a9a,#0f1f4d 60%,#0a1638) padding-box, ${GOLD} border-box;
      box-shadow:0 0 ${Math.round(d * 0.12)}px rgb(255 205 110 / .45), inset 0 0 ${Math.round(d * 0.08)}px rgb(0 0 0 / .45)"></div>
    <div style="position:absolute;inset:${Math.round(d * 0.09)}px;border-radius:50%;border:${Math.max(2, Math.round(d * 0.006))}px solid rgb(240 200 110 / .7)"></div>
    <div style="position:relative;font:900 ${Math.round(d * 0.62)}px/1 'Frank Ruhl Libre',serif;background:${GOLD_V};
      -webkit-background-clip:text;background-clip:text;color:transparent;margin-top:-${Math.round(d * 0.07)}px;
      filter:drop-shadow(0 ${Math.round(d * 0.015)}px 0 rgb(40 20 0 / .55)) drop-shadow(0 0 ${Math.round(d * 0.05)}px rgb(255 205 110 / .4))">ב</div>
  </div>`;

const page = (w, h, body, bg) => `<!doctype html><html><head>${FONTS}<style>
  html,body{margin:0;width:${w}px;height:${h}px;background:${bg}}
  .c{width:${w}px;height:${h}px;display:grid;place-items:center;align-content:center;gap:${Math.round(h * 0.03)}px;background:${bg}}
</style></head><body><div class="c">${body}</div></body></html>`;

const browser = await chromium.launch();
async function shot(html, w, h, out, transparent = false) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: new URL(out, root).pathname, omitBackground: transparent });
  await p.close();
}

// legacy + store icon (full bleed)
await shot(page(1024, 1024, medal(880), VELVET), 1024, 1024, 'assets/icon-only.png');
// adaptive icon: foreground keeps the medal inside the 66% safe zone, background is the velvet
await shot(page(1024, 1024, medal(640), 'transparent'), 1024, 1024, 'assets/icon-foreground.png', true);
await shot(page(1024, 1024, '', VELVET), 1024, 1024, 'assets/icon-background.png');
// splash (light & dark use the same royal look)
const splashBody = `${medal(820)}
  <div style="font:900 300px/1 'Frank Ruhl Libre',serif;background:${GOLD_V};-webkit-background-clip:text;background-clip:text;color:transparent;
    filter:drop-shadow(0 6px 0 rgb(40 20 0 / .55))">מה אברך?</div>`;
await shot(page(2732, 2732, splashBody, VELVET), 2732, 2732, 'assets/splash.png');
await shot(page(2732, 2732, splashBody, VELVET), 2732, 2732, 'assets/splash-dark.png');
await browser.close();
console.log('android source assets written to assets/');
