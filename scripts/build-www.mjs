// מעתיק את קבצי האתר לתיקייה www/ שממנה Capacitor בונה את אפליקציית האנדרואיד.
import { cpSync, rmSync, mkdirSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const out = new URL('www/', root);
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'styles.css', 'manifest.webmanifest', 'og.jpg', 'icons', 'fonts', 'src', 'privacy.html']) {
  cpSync(new URL(f, root), new URL(f, out), { recursive: true });
}
console.log('www/ ready');
