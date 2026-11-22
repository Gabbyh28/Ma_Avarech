import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computePlate, searchFoods, acharonaName, meeinShaloshText, RISHONA, ACHARONA } from '../src/brachot.js';
import { FOODS, CATEGORIES } from '../src/foods.js';

const get = (...names) => names.map((n) => FOODS.find((f) => f.name === n));

test('every food has valid keys and a unique name', () => {
  const seen = new Set();
  for (const f of FOODS) {
    assert.ok(RISHONA[f.rishona], `${f.name}: rishona ${f.rishona}`);
    assert.ok(ACHARONA[f.acharona], `${f.name}: acharona ${f.acharona}`);
    assert.ok(CATEGORIES[f.category], `${f.name}: category ${f.category}`);
    assert.ok(!seen.has(f.name), `duplicate ${f.name}`);
    seen.add(f.name);
  }
});

test('bread exempts everything: hamotzi + birkat hamazon', () => {
  const r = computePlate(get('לחם', 'תפוח', 'עוגה'));
  assert.equal(r.hasBread, true);
  assert.deepEqual(r.rishonot.map((x) => x.key), ['hamotzi']);
  assert.deepEqual(r.acharonot.map((x) => x.key), ['birkat']);
});

test('rishonot follow order of precedence', () => {
  const r = computePlate(get('במבה', 'בננה', 'תפוח', 'יין', 'עוגה'));
  assert.deepEqual(r.rishonot.map((x) => x.key), ['mezonot', 'hagafen', 'haetz', 'haadama', 'shehakol']);
});

test('combined meein shalosh for cake, wine and dates', () => {
  const r = computePlate(get('עוגה', 'יין', 'תמרים'));
  assert.equal(r.acharonot.length, 1);
  assert.equal(r.acharonot[0].name, 'על המחיה ועל הגפן ועל העץ');
  assert.match(r.acharonot[0].text, /על המחיה ועל הכלכלה ועל הגפן ועל פרי הגפן ועל העץ ועל פרי העץ/);
  assert.match(r.acharonot[0].text, /ברוך אתה ה׳, על הארץ ועל המחיה ועל פרי הגפן ועל הפירות\.$/);
});

test('al haetz covers other tree fruit, not vegetables', () => {
  const r = computePlate(get('תמרים', 'תפוח', 'מלפפון'));
  assert.deepEqual(r.acharonot.map((x) => x.key), ['meein-shalosh', 'nefashot']);
  assert.ok(r.acharonot[0].foods.includes('תפוח'));
  assert.deepEqual(r.acharonot[1].foods, ['מלפפון']);
});

test('rice is mezonot but borei nefashot', () => {
  const r = computePlate(get('אורז'));
  assert.deepEqual(r.rishonot.map((x) => x.key), ['mezonot']);
  assert.deepEqual(r.acharonot.map((x) => x.key), ['nefashot']);
});

test('acharonaName single', () => {
  assert.equal(acharonaName(['gafen']), 'על הגפן');
  assert.equal(meeinShaloshText([]), '');
});

test('search by alias and ignoring geresh', () => {
  assert.equal(searchFoods(FOODS, 'חלה')[0].name, 'לחם');
  assert.equal(searchFoods(FOODS, "ליצי")[0].name, 'ליצ׳י');
  assert.equal(searchFoods(FOODS, 'בננ')[0].name, 'בננה');
  assert.equal(searchFoods(FOODS, '').length, FOODS.length);
});
