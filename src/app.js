import { FOODS, CATEGORIES } from './foods.js';
import { RISHONA, ACHARONA, acharonaText, computePlate, searchFoods } from './brachot.js';

const $ = (sel) => document.querySelector(sel);
const PLATE_KEY = 'ma-avarech-plate';

const state = {
  query: '',
  category: null,
  plate: loadPlate(),
};

function loadPlate() {
  try {
    const names = JSON.parse(localStorage.getItem(PLATE_KEY) || '[]');
    return names.filter((n) => FOODS.some((f) => f.name === n));
  } catch {
    return [];
  }
}
function savePlate() {
  try {
    localStorage.setItem(PLATE_KEY, JSON.stringify(state.plate));
  } catch {
    /* אחסון לא זמין – ממשיכים בלי לשמור */
  }
}

// ---- טאבים ----
document.querySelectorAll('.tabs button').forEach((btn) => {
  btn.addEventListener('click', () => showTab(btn.dataset.tab));
});
function showTab(name) {
  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
  document.querySelectorAll('.panel').forEach((p) => (p.hidden = p.id !== `tab-${name}`));
  if (name === 'plate') renderPlate();
}

// ---- סינון ----
function renderChips() {
  const chips = $('#chips');
  const entries = [[null, 'הכל'], ...Object.entries(CATEGORIES)];
  chips.replaceChildren(
    ...entries.map(([key, label]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.setAttribute('aria-pressed', String(state.category === key));
      b.addEventListener('click', () => {
        state.category = key;
        renderChips();
        renderResults();
      });
      return b;
    }),
  );
}

$('#search').addEventListener('input', (e) => {
  state.query = e.target.value;
  renderResults();
});

// ---- תוצאות ----
function foodCard(food) {
  const node = $('#food-template').content.firstElementChild.cloneNode(true);
  node.querySelector('.food-name').textContent = food.name;
  const r = node.querySelector('.tag.rishona');
  r.textContent = RISHONA[food.rishona].name;
  r.dataset.b = food.rishona;
  node.querySelector('.tag.acharona').textContent = ACHARONA[food.acharona].name;

  const main = node.querySelector('.food-main');
  const details = node.querySelector('.details');
  main.addEventListener('click', () => {
    const open = details.hidden;
    if (open && !details.childElementCount) fillDetails(details, food);
    details.hidden = !open;
    main.setAttribute('aria-expanded', String(open));
  });

  const add = node.querySelector('.add');
  const sync = () => {
    const inPlate = state.plate.includes(food.name);
    add.classList.toggle('added', inPlate);
    add.textContent = inPlate ? '✓' : '＋';
    add.setAttribute('aria-label', inPlate ? 'הסרה מהצלחת' : 'הוספה לצלחת');
  };
  sync();
  add.addEventListener('click', () => {
    togglePlate(food.name);
    sync();
  });
  return node;
}

function fillDetails(el, food) {
  const parts = [
    ['ברכה ראשונה', RISHONA[food.rishona].text],
    [`ברכה אחרונה – ${ACHARONA[food.acharona].name}`, acharonaText(food.acharona)],
  ];
  for (const [title, text] of parts) {
    const h = document.createElement('h3');
    h.textContent = title;
    const p = document.createElement('p');
    p.className = 'bracha-text';
    p.textContent = text;
    el.append(h, p);
  }
  if (food.note) {
    const n = document.createElement('p');
    n.className = 'note';
    n.textContent = food.note;
    el.append(n);
  }
}

function renderResults() {
  let list = searchFoods(FOODS, state.query);
  if (state.category) list = list.filter((f) => f.category === state.category);
  $('#results').replaceChildren(...list.map(foodCard));
  $('#empty').hidden = list.length > 0;
}

// ---- צלחת ----
function togglePlate(name) {
  const i = state.plate.indexOf(name);
  if (i >= 0) state.plate.splice(i, 1);
  else state.plate.push(name);
  savePlate();
  updateBadge();
}

function updateBadge() {
  const badge = $('#plate-count');
  badge.textContent = state.plate.length;
  badge.hidden = state.plate.length === 0;
}

function renderPlate() {
  const foods = state.plate.map((n) => FOODS.find((f) => f.name === n));
  $('#plate-items').replaceChildren(
    ...foods.map((food) => {
      const li = document.createElement('li');
      li.className = 'plate-item';
      const span = document.createElement('span');
      span.textContent = food.name;
      const rm = document.createElement('button');
      rm.textContent = '✕';
      rm.setAttribute('aria-label', `הסרת ${food.name}`);
      rm.addEventListener('click', () => {
        togglePlate(food.name);
        renderPlate();
        renderResults();
      });
      li.append(span, rm);
      return li;
    }),
  );
  $('#plate-clear').hidden = foods.length === 0;

  const out = $('#plate-result');
  out.replaceChildren();
  if (foods.length === 0) return;

  const { hasBread, rishonot, acharonot } = computePlate(foods);

  const before = step(hasBread ? 'לפני האוכל' : 'ברכות ראשונות – לפי הסדר');
  const ol = document.createElement('ol');
  for (const r of rishonot) {
    ol.append(listEntry(RISHONA[r.key].name, RISHONA[r.key].text, r.foods));
  }
  before.append(ol);
  if (hasBread) {
    before.append(note('ברכת המוציא פוטרת את שאר המאכלים הנאכלים בתוך הסעודה. יין, ולדעת רבים גם פירות לקינוח, טעונים ברכה בפני עצמם.'));
  }

  const after = step('ברכה אחרונה');
  const ol2 = document.createElement('ol');
  for (const a of acharonot) ol2.append(listEntry(a.name, a.text, a.foods));
  after.append(ol2);
  if (acharonot.length > 1) {
    after.append(note('מברכים קודם ברכה מעין שלוש ואחר כך בורא נפשות.'));
  }

  out.append(before, after);
}

function step(title) {
  const div = document.createElement('div');
  div.className = 'step';
  const h = document.createElement('h2');
  h.textContent = title;
  div.append(h);
  return div;
}

function listEntry(name, text, foods) {
  const li = document.createElement('li');
  const b = document.createElement('b');
  b.textContent = name;
  const forEl = document.createElement('div');
  forEl.className = 'for';
  forEl.textContent = `על: ${foods.join(', ')}`;
  const p = document.createElement('p');
  p.className = 'bracha-text';
  p.textContent = text;
  li.append(b, forEl, p);
  return li;
}

function note(text) {
  const p = document.createElement('p');
  p.className = 'note';
  p.textContent = text;
  return p;
}

$('#plate-clear').addEventListener('click', () => {
  state.plate = [];
  savePlate();
  updateBadge();
  renderPlate();
  renderResults();
});

// ---- אתחול ----
renderChips();
renderResults();
updateBadge();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
