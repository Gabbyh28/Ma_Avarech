import { FOODS, CATEGORIES } from './foods.js';
import {
  RISHONA, ACHARONA, NUSACHIM, DEFAULT_OPTS,
  rishonaText, acharonaText, computePlate, searchFoods, resolveFood, fullBlessing, plateShareText,
} from './brachot.js';
import { artSvg, plateSvg } from './illustrations.js';
import { EXTRA_GROUPS } from './extras.js';

const $ = (sel) => document.querySelector(sel);
const PLATE_KEY = 'ma-avarech-plate';
const SETTINGS_KEY = 'ma-avarech-settings';
const EXAMPLE_PLATE = ['יין', 'עוגה', 'ענבים', 'תפוח', 'במבה'];
const SITE_URL = 'https://gabbyh28.github.io/Ma_Avarech/';

const LADDER = [
  ['mezonot', 'מאפים ותבשילים מחמשת מיני דגן, ואורז'],
  ['hagafen', 'יין ומיץ ענבים'],
  ['haetz', 'פירות העץ'],
  ['haadama', 'ירקות ופירות האדמה'],
  ['shehakol', 'כל השאר: משקאות, בשר, חלב, ממתקים'],
];

const ICON_PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
const ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const ICON_READ = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>';

const state = {
  query: '',
  category: null,
  plate: load(PLATE_KEY, []).filter((n) => byName(n)),
  opts: { ...DEFAULT_OPTS, ...load(SETTINGS_KEY, {}) },
  moreTab: 'reiach',
  calc: { kind: 'food', amount: 30, time: 3 },
  readerSize: 1,
};
function byName(n) {
  return FOODS.find((f) => f.name === n);
}
const food = (f) => resolveFood(f, state.opts);

// ---------- storage ----------
function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

// ---------- helpers ----------
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k.startsWith('data-') || k.startsWith('aria-') || k === 'role' || k === 'type') node.setAttribute(k, v);
    else node[k] = v;
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

/** Bracha text with bracketed insertions (Shabbat etc.) rendered muted. */
function brachaText(text, cls = 'bracha-text') {
  const p = el('p', { class: cls + (text.length > 200 ? ' long' : '') });
  for (const part of text.split(/(\[[^\]]+\])/)) {
    if (!part) continue;
    p.append(part.startsWith('[') ? el('span', { class: 'ins' }, part) : part);
  }
  return p;
}

function brachaCard({ label, key, name, text, forFoods }) {
  return el(
    'div',
    { class: 'bracha', 'data-b': key || '' },
    el('div', { class: 'bracha-head' },
      el('span', { class: 'bracha-name' }, name),
      label ? el('span', { class: 'bracha-label' }, label) : null,
      forFoods ? el('span', { class: 'for' }, 'על ' + forFoods.join(', ')) : null,
      el('button', { class: 'read-btn', type: 'button', html: ICON_READ, 'aria-label': `קריאת ${name} במסך מלא`, onclick: () => openReader(name, text) }),
    ),
    brachaText(text),
  );
}

// Color of an after-blessing card, borrowed from the matching first blessing.
function acharonaColor(keyOrName) {
  const map = { birkat: 'hamotzi', mechiya: 'mezonot', gafen: 'hagafen', etz: 'haetz', nefashot: 'shehakol', none: 'shehakol' };
  if (map[keyOrName]) return map[keyOrName];
  if (keyOrName.startsWith('על המחיה')) return 'mezonot';
  if (keyOrName.startsWith('על הגפן')) return 'hagafen';
  if (keyOrName.startsWith('על העץ')) return 'haetz';
  return 'shehakol';
}

function summary({ title, sub, gold, pill, art, id }) {
  return el('div', { class: 'summary' },
    art ? el('span', { class: 'summary-art', html: artSvg(art) }) : null,
    el('div', { class: 'summary-main' },
      el('p', { class: 'summary-title', id: id || '' }, title),
      sub ? el('p', { class: 'summary-sub' }, sub) : null,
    ),
    el('div', { class: 'summary-side' },
      gold ? el('span', { class: 'summary-gold' }, gold) : null,
      pill ? el('span', { class: 'pill' }, pill) : null,
    ),
  );
}
const label = (text) => el('p', { class: 'section-label' }, text);
const note = (text) => el('p', { class: 'note' }, el('span', {}, text));

function segmented(container, options, current, onPick, role = 'radio') {
  container.replaceChildren(
    ...options.map(([value, text]) =>
      el('button', {
        type: 'button',
        role,
        [role === 'tab' ? 'aria-selected' : 'aria-checked']: String(value === current),
        class: value === current ? 'on' : '',
        onclick: () => onPick(value),
      }, text),
    ),
  );
}

let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

// ---------- navigation ----------
document.querySelectorAll('.bottom-nav button').forEach((btn) =>
  btn.addEventListener('click', () => showView(btn.dataset.view)),
);
function showView(name) {
  document.querySelectorAll('.bottom-nav button').forEach((b) => {
    if (b.dataset.view === name) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.view').forEach((v) => (v.hidden = v.id !== `view-${name}`));
  $('#chips').hidden = name !== 'search';
  if (name === 'plate') renderPlate();
  if (name === 'more') renderMore();
  window.scrollTo({ top: 0 });
}

// ---------- settings ----------
function setOpts(patch) {
  state.opts = { ...state.opts, ...patch };
  save(SETTINGS_KEY, state.opts);
  renderSettings();
  renderResults();
  if (!$('#view-plate').hidden) renderPlate();
  if (!$('#view-more').hidden) renderMore();
}
function renderSettings() {
  segmented($('#nusach-seg'), Object.entries(NUSACHIM), state.opts.nusach, (v) => setOpts({ nusach: v }));
  $('#opt-israel').checked = state.opts.israel;
  $('#opt-nikud').checked = state.opts.nikud;
  $('#settings-chip').textContent =
    `נוסח ${NUSACHIM[state.opts.nusach]}` + (state.opts.nikud ? ' · עם ניקוד' : '') + (state.opts.israel ? ' · פירות א״י' : '') + ' · שינוי';
}
$('#opt-israel').addEventListener('change', (e) => setOpts({ israel: e.target.checked }));
$('#opt-nikud').addEventListener('change', (e) => setOpts({ nikud: e.target.checked }));
$('#settings-chip').addEventListener('click', () => {
  showView('info');
  $('#nusach-seg button.on')?.focus();
});

// ---------- search ----------
function renderChips() {
  const entries = [[null, 'הכל'], ...Object.entries(CATEGORIES)];
  $('#chips').replaceChildren(
    ...entries.map(([key, text]) =>
      el('button', {
        type: 'button',
        'aria-pressed': String(state.category === key),
        onclick: () => {
          state.category = key;
          renderChips();
          renderResults();
        },
      }, text),
    ),
  );
}

$('#search').addEventListener('input', (e) => {
  state.query = e.target.value;
  if (!$('#view-search').hidden) renderResults();
  else showView('search');
});
$('#search').addEventListener('focus', () => {
  if ($('#view-search').hidden) showView('search');
});

function foodTile(raw) {
  const f = food(raw);
  const add = el('button', { class: 'tile-add', type: 'button' });
  const li = el(
    'li',
    { class: 'tile', 'data-b': f.rishona },
    el('button', { class: 'tile-open', type: 'button', onclick: () => openSheet(raw) },
      el('span', { class: 'tile-art', html: artSvg(f) }),
      el('span', { class: 'tile-name' }, f.name),
      el('span', { class: 'tile-bracha' }, RISHONA[f.rishona].name),
    ),
    f.note ? el('span', { class: 'tile-note', title: 'יש הערה', 'aria-hidden': 'true' }) : null,
    add,
  );
  const sync = () => {
    const inPlate = state.plate.includes(f.name);
    li.classList.toggle('added', inPlate);
    add.innerHTML = inPlate ? ICON_CHECK : ICON_PLUS;
    add.setAttribute('aria-label', inPlate ? `הסרת ${f.name} מהצלחת` : `הוספת ${f.name} לצלחת`);
    add.setAttribute('aria-pressed', String(inPlate));
  };
  sync();
  add.addEventListener('click', () => {
    togglePlate(f.name);
    sync();
  });
  return li;
}

function renderResults() {
  let list = searchFoods(FOODS, state.query);
  if (state.category) list = list.filter((f) => f.category === state.category);
  $('#results').replaceChildren(...list.map(foodTile));
  $('#empty').hidden = list.length > 0;
  $('#count').hidden = list.length === 0;
  $('#count').textContent = state.query ? `${list.length} תוצאות` : `${list.length} מאכלים`;
}

// ---------- sheet ----------
let lastFocus = null;
function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const items = [...container.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')].filter((n) => !n.hidden && n.offsetParent !== null);
  if (!items.length) return;
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openSheet(raw) {
  const f = food(raw);
  lastFocus = document.activeElement;
  const body = $('#sheet-body');
  const inPlate = () => state.plate.includes(f.name);
  const plateBtn = el('button', { class: 'primary-btn', type: 'button' });
  const syncBtn = () => {
    plateBtn.textContent = inPlate() ? 'בצלחת ✓ (הסרה)' : 'הוספה לצלחת';
    plateBtn.classList.toggle('ghost', inPlate());
  };
  syncBtn();
  plateBtn.addEventListener('click', () => {
    togglePlate(f.name);
    syncBtn();
    renderResults();
  });

  body.replaceChildren(...[
    summary({
      id: 'sheet-title',
      title: f.name,
      art: f,
      sub: CATEGORIES[f.category] + (f.aliases?.length ? ' · גם: ' + f.aliases.slice(0, 3).join(', ') : ''),
      gold: RISHONA[f.rishona].name,
      pill: 'אחרי: ' + ACHARONA[f.acharona].name,
    }),
    label('ברכה ראשונה'),
    brachaCard({ key: f.rishona, name: RISHONA[f.rishona].name, text: rishonaText(f.rishona, state.opts) }),
    label('ברכה אחרונה'),
    brachaCard({ key: acharonaColor(f.acharona), name: ACHARONA[f.acharona].name, text: acharonaText(f.acharona, state.opts) }),
    f.note ? note(f.note) : null,
    plateBtn,
  ].filter(Boolean));
  $('#sheet').hidden = false;
  document.body.style.overflow = 'hidden';
  $('.sheet-close').focus();
}
function closeSheet() {
  $('#sheet').hidden = true;
  document.body.style.overflow = '';
  lastFocus?.focus?.();
}
document.querySelectorAll('[data-close]').forEach((n) => n.addEventListener('click', closeSheet));
$('.sheet-panel').addEventListener('keydown', (e) => trapFocus($('.sheet-panel'), e));

// ---------- reading mode ----------
let readerReturn = null;
function openReader(title, text) {
  readerReturn = document.activeElement;
  $('#reader-title').textContent = title;
  $('#reader-text').replaceChildren(brachaText(text, 'reader-body'));
  applyReaderSize();
  $('#reader').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#reader-close').focus();
}
function closeReader() {
  $('#reader').hidden = true;
  if ($('#sheet').hidden) document.body.style.overflow = '';
  readerReturn?.focus?.();
}
function applyReaderSize() {
  $('#reader').style.setProperty('--reader-scale', String(state.readerSize));
}
$('#reader-close').addEventListener('click', closeReader);
$('#reader-bigger').addEventListener('click', () => { state.readerSize = Math.min(1.8, state.readerSize + 0.15); applyReaderSize(); });
$('#reader-smaller').addEventListener('click', () => { state.readerSize = Math.max(0.7, state.readerSize - 0.15); applyReaderSize(); });
$('#reader').addEventListener('keydown', (e) => trapFocus($('#reader'), e));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!$('#reader').hidden) closeReader();
  else if (!$('#sheet').hidden) closeSheet();
});

// ---------- plate ----------
function togglePlate(name) {
  const i = state.plate.indexOf(name);
  if (i >= 0) state.plate.splice(i, 1);
  else state.plate.push(name);
  save(PLATE_KEY, state.plate);
  updateBadge(true);
}

function updateBadge(animate = false) {
  const badge = $('#plate-count');
  badge.textContent = state.plate.length;
  badge.hidden = state.plate.length === 0;
  if (animate) {
    badge.classList.remove('pop');
    void badge.offsetWidth;
    badge.classList.add('pop');
  }
}

function renderPlate() {
  const foods = state.plate.map(byName).map(food);
  $('#plate-items').replaceChildren(
    ...foods.map((f) =>
      el('li', { class: 'plate-chip', 'data-b': f.rishona },
        el('span', { class: 'chip-art', html: artSvg(f) }),
        f.name,
        el('button', {
          type: 'button',
          html: ICON_X,
          'aria-label': `הסרת ${f.name}`,
          onclick: () => {
            togglePlate(f.name);
            renderPlate();
            renderResults();
          },
        }),
      ),
    ),
  );
  $('#plate-art').innerHTML = plateSvg(foods);
  $('#plate-clear').hidden = foods.length === 0;
  $('#plate-empty').hidden = foods.length > 0;
  $('#plate-actions').hidden = foods.length === 0;

  const out = $('#plate-result');
  out.replaceChildren();
  if (foods.length === 0) return;

  const { hasBread, rishonot, acharonot } = computePlate(state.plate.map(byName), state.opts);

  const head = summary({
    title: `${foods.length} מאכלים`,
    sub: hasBread ? 'סעודה עם לחם' : 'לפי סדר הקדימה',
    gold: `${rishonot.length} לפני · ${acharonot.length} אחרי`,
    pill: hasBread ? 'ברכת המזון' : acharonot.map((a) => a.name).join(' + ') || 'אין ברכה אחרונה',
  });

  const before = el('section', {},
    label(hasBread ? 'לפני האכילה' : 'לפני האכילה, לפי הסדר'),
    el('ol', { class: 'steps' },
      ...rishonot.map((r) => el('li', {}, brachaCard({ key: r.key, name: RISHONA[r.key].name, text: r.text, forFoods: r.foods }))),
    ),
    hasBread ? note('ברכת המוציא פוטרת את המאכלים שבתוך הסעודה. על יין, ולדעת רבים גם על פירות לקינוח, מברכים בנפרד.') : null,
  );

  const after = el('section', {},
    label('אחרי האכילה'),
    acharonot.length
      ? el('ol', { class: 'steps' },
          ...acharonot.map((a) => el('li', {}, brachaCard({ key: acharonaColor(a.key === 'meein-shalosh' ? a.name : a.key), name: a.name, text: a.text, forFoods: a.foods }))),
        )
      : note('על המאכלים האלה אין ברכה אחרונה.'),
    acharonot.length > 1 ? note('מברכים קודם את ברכת מעין שלוש, ואחריה בורא נפשות.') : null,
  );

  out.append(head, before, after);
}

$('#plate-clear').addEventListener('click', () => {
  state.plate = [];
  save(PLATE_KEY, state.plate);
  updateBadge();
  renderPlate();
  renderResults();
});
$('#plate-example').addEventListener('click', () => {
  state.plate = [...EXAMPLE_PLATE];
  save(PLATE_KEY, state.plate);
  updateBadge(true);
  renderPlate();
  renderResults();
});

$('#plate-share').addEventListener('click', async () => {
  const text = plateShareText(state.plate.map(byName), state.opts) + `\n\n${SITE_URL}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: 'מה אברך?', text });
      return;
    }
  } catch (err) {
    if (err?.name === 'AbortError') return;
  }
  try {
    await navigator.clipboard.writeText(text);
    toast('סדר הברכות הועתק – אפשר להדביק בוואטסאפ');
  } catch {
    openReader('סדר הברכות לשיתוף', text);
    toast('סמנו את הטקסט והעתיקו אותו');
  }
});

// ---------- more blessings ----------
function renderMore() {
  segmented($('#more-tabs'), EXTRA_GROUPS.map((g) => [g.id, g.title]), state.moreTab, (v) => {
    state.moreTab = v;
    renderMore();
  }, 'tab');
  const g = EXTRA_GROUPS.find((x) => x.id === state.moreTab);
  $('#more-body').replaceChildren(
    note(g.intro),
    el('div', { class: 'extra-list' },
      ...g.items.map((it) => {
        const text = fullBlessing(it.ending, state.opts);
        return el('div', { class: 'bracha extra' },
          el('div', { class: 'bracha-head' },
            el('span', { class: 'bracha-name' }, it.name),
            el('button', { class: 'read-btn', type: 'button', html: ICON_READ, 'aria-label': `קריאת ${it.name} במסך מלא`, onclick: () => openReader(it.name, text) }),
          ),
          el('p', { class: 'extra-when' }, it.when),
          it.examples.length ? el('p', { class: 'extra-ex' }, 'למשל: ' + it.examples.join(', ')) : null,
          brachaText(text),
        );
      }),
    ),
  );
}

// ---------- shiurim calculator ----------
const CALC = {
  food: { amountLabel: 'כמה אכלתי (גרם)', unit: 'גר׳', max: 120, timeLabel: 'בתוך כמה דקות', need: 27 },
  drink: { amountLabel: 'כמה שתיתי (מ״ל)', unit: 'מ״ל', max: 330, timeLabel: 'בתוך כמה שניות', need: 86 },
};
function renderCalc() {
  const c = state.calc;
  const cfg = CALC[c.kind];
  segmented($('#calc-kind'), [['food', 'אוכל'], ['drink', 'משקה']], c.kind, (v) => {
    state.calc = { kind: v, amount: v === 'food' ? 30 : 100, time: v === 'food' ? 3 : 20 };
    renderCalc();
  });
  const amount = $('#calc-amount');
  const time = $('#calc-time');
  amount.max = String(cfg.max);
  amount.value = String(c.amount);
  time.max = c.kind === 'food' ? '15' : '120';
  time.step = c.kind === 'food' ? '1' : '5';
  time.value = String(c.time);
  $('#calc-amount-label').textContent = cfg.amountLabel;
  $('#calc-time-label').textContent = cfg.timeLabel;
  $('#calc-amount-out').textContent = `${c.amount} ${cfg.unit}`;
  $('#calc-time-out').textContent = c.kind === 'food' ? `${c.time} דק׳` : `${c.time} שנ׳`;

  let verdict, cls;
  if (c.amount < cfg.need) {
    verdict = c.kind === 'food' ? `פחות מכזית (${cfg.need} גרם) – אין ברכה אחרונה.` : `פחות מרביעית (${cfg.need} מ״ל) – אין ברכה אחרונה.`;
    cls = 'no';
  } else if (c.kind === 'food') {
    if (c.time <= 4) { verdict = 'אכלתם כזית בכדי אכילת פרס – מברכים ברכה אחרונה.'; cls = 'yes'; }
    else if (c.time <= 9) { verdict = 'ספק: יש פוסקים שכדי אכילת פרס הוא עד 9 דקות. רבים נוהגים לא לברך, או לאכול עוד כזית ברצף.'; cls = 'maybe'; }
    else { verdict = 'האכילה נמשכה זמן רב מדי – אין ברכה אחרונה.'; cls = 'no'; }
  } else if (c.time <= 30) { verdict = 'שתיתם רביעית ברצף – מברכים ברכה אחרונה.'; cls = 'yes'; }
  else { verdict = 'השתייה לא הייתה ברצף (כמו בשתיית משקה חם) – אין ברכה אחרונה.'; cls = 'no'; }
  const r = $('#calc-result');
  r.className = `calc-result ${cls}`;
  r.textContent = verdict;
}
$('#calc-amount').addEventListener('input', (e) => { state.calc.amount = Number(e.target.value); renderCalc(); });
$('#calc-time').addEventListener('input', (e) => { state.calc.time = Number(e.target.value); renderCalc(); });

// ---------- info & legend ----------
$('#ladder').replaceChildren(
  ...LADDER.map(([key, desc]) =>
    el('li', { 'data-b': key },
      el('span', { class: 'l-name' }, RISHONA[key].name),
      el('span', { class: 'l-desc' }, desc),
    ),
  ),
);
$('#legend').replaceChildren(
  ...Object.entries(RISHONA).map(([key, b]) => el('span', { 'data-b': key }, b.name)),
);

// ---------- init ----------
renderSettings();
renderChips();
renderResults();
renderCalc();
updateBadge();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
