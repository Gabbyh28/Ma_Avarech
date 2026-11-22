import { FOODS, CATEGORIES } from './foods.js';
import { RISHONA, ACHARONA, acharonaText, computePlate, searchFoods } from './brachot.js';

const $ = (sel) => document.querySelector(sel);
const PLATE_KEY = 'ma-avarech-plate';
const EXAMPLE_PLATE = ['יין', 'עוגה', 'ענבים', 'תפוח', 'במבה'];

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

const state = { query: '', category: null, plate: loadPlate() };
const byName = (n) => FOODS.find((f) => f.name === n);

// ---------- storage ----------
function loadPlate() {
  try {
    const names = JSON.parse(localStorage.getItem(PLATE_KEY) || '[]');
    return names.filter((n) => byName(n));
  } catch {
    return [];
  }
}
function savePlate() {
  try {
    localStorage.setItem(PLATE_KEY, JSON.stringify(state.plate));
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
    else if (k.startsWith('data-') || k.startsWith('aria-')) node.setAttribute(k, v);
    else node[k] = v;
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

/** Bracha text with bracketed insertions (Shabbat etc.) rendered muted. */
function brachaText(text) {
  const p = el('p', { class: 'bracha-text' + (text.length > 200 ? ' long' : '') });
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
    ),
    brachaText(text),
  );
}

// Color of an after-blessing card, borrowed from the matching first blessing.
function acharonaColor(keyOrName) {
  const map = { birkat: 'hamotzi', mechiya: 'mezonot', gafen: 'hagafen', etz: 'haetz', nefashot: 'shehakol' };
  if (map[keyOrName]) return map[keyOrName];
  if (keyOrName.startsWith('על המחיה')) return 'mezonot';
  if (keyOrName.startsWith('על הגפן')) return 'hagafen';
  if (keyOrName.startsWith('על העץ')) return 'haetz';
  return 'shehakol';
}

const note = (text) => el('p', { class: 'note' }, el('span', {}, text));

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
  if (name === 'plate') renderPlate();
  window.scrollTo({ top: 0 });
}

// ---------- search ----------
function renderChips() {
  const entries = [[null, 'הכל'], ...Object.entries(CATEGORIES)];
  $('#chips').replaceChildren(
    ...entries.map(([key, label]) =>
      el('button', {
        'aria-pressed': String(state.category === key),
        onclick: () => {
          state.category = key;
          renderChips();
          renderResults();
        },
      }, label),
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

function addButton(food) {
  const btn = el('button', { class: 'add' });
  const sync = () => {
    const inPlate = state.plate.includes(food.name);
    btn.classList.toggle('added', inPlate);
    btn.innerHTML = inPlate ? ICON_CHECK : ICON_PLUS;
    btn.setAttribute('aria-label', inPlate ? `הסרת ${food.name} מהצלחת` : `הוספת ${food.name} לצלחת`);
  };
  sync();
  btn.addEventListener('click', () => {
    togglePlate(food.name);
    sync();
  });
  return btn;
}

function foodRow(food) {
  return el(
    'li',
    { class: 'food', 'data-b': food.rishona },
    el('button', { class: 'food-open', onclick: () => openSheet(food) },
      el('span', { class: 'mark', 'aria-hidden': 'true' }, food.name[0]),
      el('span', { class: 'food-text' },
        el('span', { class: 'food-name' }, food.name),
        el('span', { class: 'food-sub' },
          el('b', {}, RISHONA[food.rishona].name),
          ' · אחרי: ' + ACHARONA[food.acharona].name,
          food.note ? ' · יש הערה' : '',
        ),
      ),
    ),
    addButton(food),
  );
}

function renderResults() {
  let list = searchFoods(FOODS, state.query);
  if (state.category) list = list.filter((f) => f.category === state.category);
  $('#results').replaceChildren(...list.map(foodRow));
  $('#empty').hidden = list.length > 0;
  $('#count').hidden = list.length === 0;
  $('#count').textContent = state.query ? `${list.length} תוצאות` : `${list.length} מאכלים`;
}

// ---------- sheet ----------
let lastFocus = null;
function openSheet(food) {
  lastFocus = document.activeElement;
  const body = $('#sheet-body');
  const inPlate = () => state.plate.includes(food.name);
  const plateBtn = el('button', { class: 'primary-btn' });
  const syncBtn = () => {
    plateBtn.textContent = inPlate() ? 'בצלחת ✓ (הסרה)' : 'הוספה לצלחת';
    plateBtn.classList.toggle('ghost', inPlate());
  };
  syncBtn();
  plateBtn.addEventListener('click', () => {
    togglePlate(food.name);
    syncBtn();
    renderResults();
  });

  body.replaceChildren(
    el('h2', { class: 'sheet-title', id: 'sheet-title' }, food.name),
    el('p', { class: 'sheet-aliases' },
      CATEGORIES[food.category] + (food.aliases?.length ? ' · גם: ' + food.aliases.join(', ') : '')),
    brachaCard({ label: 'לפני', key: food.rishona, name: RISHONA[food.rishona].name, text: RISHONA[food.rishona].text }),
    brachaCard({ label: 'אחרי', key: acharonaColor(food.acharona), name: ACHARONA[food.acharona].name, text: acharonaText(food.acharona) }),
    food.note ? note(food.note) : null,
    plateBtn,
  );
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
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet();
});

// ---------- plate ----------
function togglePlate(name) {
  const i = state.plate.indexOf(name);
  if (i >= 0) state.plate.splice(i, 1);
  else state.plate.push(name);
  savePlate();
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
  const foods = state.plate.map(byName);
  $('#plate-items').replaceChildren(
    ...foods.map((food) =>
      el('li', { class: 'plate-chip', 'data-b': food.rishona },
        food.name,
        el('button', {
          html: ICON_X,
          'aria-label': `הסרת ${food.name}`,
          onclick: () => {
            togglePlate(food.name);
            renderPlate();
            renderResults();
          },
        }),
      ),
    ),
  );
  $('#plate-clear').hidden = foods.length === 0;
  $('#plate-empty').hidden = foods.length > 0;

  const out = $('#plate-result');
  out.replaceChildren();
  if (foods.length === 0) return;

  const { hasBread, rishonot, acharonot } = computePlate(foods);

  const before = el('section', { class: 'phase' },
    el('h3', { class: 'phase-title' }, hasBread ? 'לפני האכילה' : 'לפני האכילה · לפי הסדר'),
    el('ol', { class: 'steps' },
      ...rishonot.map((r) => el('li', {}, brachaCard({ key: r.key, name: RISHONA[r.key].name, text: RISHONA[r.key].text, forFoods: r.foods }))),
    ),
    hasBread ? note('ברכת המוציא פוטרת את המאכלים שבתוך הסעודה. על יין, ולדעת רבים גם על פירות לקינוח, מברכים בנפרד.') : null,
  );

  const after = el('section', { class: 'phase' },
    el('h3', { class: 'phase-title' }, 'אחרי האכילה'),
    el('ol', { class: 'steps' },
      ...acharonot.map((a) => el('li', {}, brachaCard({ key: acharonaColor(a.key === 'meein-shalosh' ? a.name : a.key), name: a.name, text: a.text, forFoods: a.foods }))),
    ),
    acharonot.length > 1 ? note('מברכים קודם את ברכת מעין שלוש, ואחריה בורא נפשות.') : null,
  );

  out.append(before, after);
}

$('#plate-clear').addEventListener('click', () => {
  state.plate = [];
  savePlate();
  updateBadge();
  renderPlate();
  renderResults();
});
$('#plate-example').addEventListener('click', () => {
  state.plate = [...EXAMPLE_PLATE];
  savePlate();
  updateBadge(true);
  renderPlate();
  renderResults();
});

// ---------- info ----------
$('#ladder').replaceChildren(
  ...LADDER.map(([key, desc]) =>
    el('li', { 'data-b': key },
      el('span', { class: 'l-name' }, RISHONA[key].name),
      el('span', { class: 'l-desc' }, desc),
    ),
  ),
);

// ---------- init ----------
renderChips();
renderResults();
updateBadge();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
