'use strict';
/* Hub personale — PWA locale. Dati solo su questo telefono (localStorage). */
const KEY = 'hub-v2';
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lbl = t => esc(t).replace(/ g$/, ' <span class="hub-unit">g</span>');
const pad = n => String(n).padStart(2, '0');
const localDate = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const shiftDay = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return localDate(d); };
const fmtDay = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short'}).replace(',', '');
const safeImg = s => (typeof s === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(s)) ? s : null;
const num = (x, f = parseFloat) => { const n = f(x); return isNaN(n) ? 0 : n; };

/* ---------- icone (dal design system) ---------- */
const ICONS = {
  home: ["M3 11l9-8 9 8", "M5 10v10h5v-6h4v6h5V10"],
  beyblade: ["M20.6 12.0 L20.6 12.5 L20.6 12.9 L20.5 13.3 L20.4 13.8 L20.3 14.2 L20.2 14.7 L20.0 15.1 L19.9 15.5 L19.7 15.9 L19.4 16.3 L19.2 16.7 L19.0 17.1 L18.8 17.5 L18.6 17.9 L18.4 18.4 L18.2 18.9 L18.0 19.4 L17.8 20.0 L17.5 20.5 L17.2 21.0 L16.9 21.6 L16.5 22.2 L16.1 22.7 L15.1 21.6 L14.2 20.3 L13.8 20.4 L13.3 20.5 L12.9 20.6 L12.5 20.6 L12.0 20.6 L11.5 20.6 L11.1 20.6 L10.7 20.5 L10.2 20.4 L9.8 20.3 L9.3 20.2 L8.9 20.0 L8.5 19.9 L8.1 19.7 L7.7 19.4 L7.3 19.2 L6.9 19.0 L6.6 18.7 L6.2 18.4 L5.9 18.1 L5.6 17.8 L5.3 17.4 L5.0 17.1 L4.8 16.7 L4.6 16.3 L4.3 15.9 L4.1 15.5 L3.9 15.1 L3.5 14.8 L3.2 14.4 L2.8 14.0 L2.4 13.5 L2.1 13.0 L1.7 12.5 L1.3 12.0 L1.0 11.4 L0.6 10.8 L0.3 10.1 L1.9 9.9 L3.7 9.8 L3.8 9.3 L4.0 8.9 L4.1 8.5 L4.3 8.1 L4.6 7.7 L4.8 7.3 L5.0 6.9 L5.3 6.6 L5.6 6.2 L5.9 5.9 L6.2 5.6 L6.6 5.3 L6.9 5.0 L7.3 4.8 L7.7 4.6 L8.1 4.3 L8.5 4.1 L8.9 4.0 L9.3 3.8 L9.8 3.7 L10.2 3.6 L10.7 3.5 L11.1 3.4 L11.5 3.4 L12.0 3.4 L12.5 3.4 L12.9 3.4 L13.4 3.4 L13.8 3.3 L14.3 3.2 L14.9 3.2 L15.4 3.1 L16.0 3.0 L16.6 3.0 L17.2 3.0 L17.9 3.0 L18.5 3.0 L19.2 3.1 L18.8 4.5 L18.1 5.9 L18.4 6.2 L18.7 6.6 L19.0 6.9 L19.2 7.3 L19.4 7.7 L19.7 8.1 L19.9 8.5 L20.0 8.9 L20.2 9.3 L20.3 9.8 L20.4 10.2 L20.5 10.7 L20.6 11.1 L20.6 11.5z", "M18.2 8.4 Q17.9 15.7 12.1 15.6", "M12.0 19.2 Q5.8 15.3 8.8 10.3", "M5.8 8.4 Q12.2 5.0 15.1 10.1", "M10.6 12.0a1.4 1.4 0 1 0 2.8 0a1.4 1.4 0 1 0 -2.8 0"],
  ratchet: ["M12.0 0.8 L15.6 3.3 L19.6 4.4 L21.1 8.2 L23.3 12.0 L20.8 15.6 L19.5 19.5 L15.8 21.1 L12.0 23.2 L8.4 20.7 L4.3 19.7 L3.0 15.7 L0.7 12.0 L3.1 8.3 L4.4 4.4 L8.2 2.9z", "M5.4 12.0a6.6 6.6 0 1 0 13.2 0a6.6 6.6 0 1 0 -13.2 0", "M12.7 7.8 A4.3 4.3 0 0 1 15.6 9.7", "M16.3 11.4 A4.3 4.3 0 0 1 15.3 14.8", "M13.9 15.9 A4.3 4.3 0 0 1 10.4 16.0", "M8.9 15.0 A4.3 4.3 0 0 1 7.7 11.7", "M8.2 10.0 A4.3 4.3 0 0 1 11.0 7.8", "M10 12a2 1.7 0 1 0 4 0a2 1.7 0 1 0 -4 0"],
  bit: ["M12.4 2.7A2.5 1.1 18 0 1 17.2 4.2A2.5 1.1 18 0 1 12.4 2.7", "M12.4 2.7L11.2 6.5", "M17.2 4.2L15.9 8.0", "M10.3 6.2L16.8 8.3L15.6 11.9L9.1 9.8z", "M3.5 10.5A8.5 2.4 18 0 1 19.7 15.8A8.5 2.4 18 0 1 3.5 10.5", "M3.5 10.5L3.2 11.5A8.5 2.4 18 0 0 19.4 16.7L19.7 15.8", "M7.9 15.4L6.7 19.1A2.8 1.1 18 0 0 12.1 20.9L13.3 17.1", "M6.7 19.1A2.8 1.1 18 0 1 12.1 20.9"],
  mainblade: ["M12.0 2.8L14.8 1.5L17.0 4.5L17.9 5.0L20.9 5.7L20.7 9.5L21.1 10.4L22.9 12.9L20.2 15.7L20.0 16.6L19.7 19.7L15.9 20.1L15.1 20.6L12.9 22.9L9.8 20.7L8.9 20.6L5.7 20.9L4.7 17.3L4.0 16.6L1.5 14.8L3.0 11.4L2.9 10.4L2.1 7.4L5.5 5.7L6.1 5.0L7.4 2.1L11.1 3.0z", "M5.6 12a6.4 6.4 0 1 0 12.8 0a6.4 6.4 0 1 0 -12.8 0", "M10.0 5.6L10.7 8.0L13.3 8.0L14.0 5.6", "M18.5 13.5L16.1 12.9L14.8 15.1L16.5 16.9", "M7.5 16.9L9.2 15.1L7.9 12.9L5.5 13.5"],
  chip: ["M3.5 12a8.5 8.5 0 1 0 17.0 0a8.5 8.5 0 1 0 -17.0 0", "M6.8 12a5.2 5.2 0 1 0 10.4 0a5.2 5.2 0 1 0 -10.4 0", "M10.0 3.6L12.0 1.5L14.0 3.6", "M20.3 14.5L21.1 17.2L18.3 17.9", "M5.7 17.9L2.9 17.3L3.7 14.5", "M9.6 10.6L12 9L14.4 10.6L13.4 14L12 15L10.6 14z"],
  overblade: ["M8.4 12a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0 -7.2 0", "M9.9 9.1L9.0 5.5L12.9 5.0L16.4 2.7L15.2 5.7L18.5 5.3L14.6 9.0z", "M15.6 11.6L19.1 12.7L17.7 16.3L17.9 20.5L15.9 17.9L14.5 21.0L13.3 15.8z", "M10.5 15.3L7.9 17.8L5.5 14.8L1.7 12.9L4.9 12.4L3.0 9.7L8.1 11.2z"],
  metalblade: ["M12.0 4.6L15.5 3.4L21.2 6.2L19.0 9.7L21.3 12.6L20.3 19.0L16.3 18.0L14.2 21.0L7.9 22.1L7.7 18.0L4.1 16.9L1.1 11.2L5.0 9.7L4.9 6.0L9.4 1.4z", "M7.2 12a4.8 4.8 0 1 0 9.6 0a4.8 4.8 0 1 0 -9.6 0", "M9.4 12a2.6 2.6 0 1 0 5.2 0a2.6 2.6 0 1 0 -5.2 0"],
  assistblade: ["M12.0 5.6Q13.3 1.2 17.1 3.3L16.5 7.5Q20.6 5.3 21.8 9.4L18.4 12.0Q22.8 13.3 20.7 17.0L16.5 16.5Q18.7 20.6 14.6 21.8L12.0 18.4Q10.7 22.8 7.0 20.7L7.5 16.5Q3.4 18.7 2.2 14.6L5.6 12.0Q1.2 10.7 3.3 6.9L7.5 7.5Q5.3 3.4 9.4 2.2z", "M8.2 12a3.8 3.8 0 1 0 7.6 0a3.8 3.8 0 1 0 -7.6 0", "M10.8 12a1.2 1.2 0 1 0 2.4 0a1.2 1.2 0 1 0 -2.4 0"],
  accessory: ["M15.5 3.5a5 5 0 0 0-4.6 6.9L3.8 17.5a2.1 2.1 0 0 0 2.9 2.9l7.1-7.1a5 5 0 0 0 6.9-4.6l-3 3-2.8-.7-.7-2.8z"],
  gym: ["M6 7v10", "M3 9v6", "M18 7v10", "M21 9v6", "M6 12h12"],
  cart: ["M3 4h2l2.4 11h10.2L20 7H6.2", "M7 20a1.2 1.2 0 102.4 0a1.2 1.2 0 10-2.4 0", "M15 20a1.2 1.2 0 102.4 0a1.2 1.2 0 10-2.4 0"],
  diet: ["M4 11h16a8 8 0 01-16 0z", "M9 7c0-2 2-2 2-4", "M14 7c0-2 2-2 2-4"],
  wallet: ["M3 7h16a2 2 0 012 2v9H5a2 2 0 01-2-2z", "M3 7l12-3", "M16 13h2"],
  note: ["M6 3h9l4 4v14H6z", "M14 3v5h5", "M9 13h6", "M9 17h6"],
  settings: ["M9 12a3 3 0 106 0a3 3 0 10-6 0", "M12 2v3", "M12 19v3", "M2 12h3", "M19 12h3", "M5 5l2 2", "M17 17l2 2", "M19 5l-2 2", "M7 17l-2 2"],
  plus: ["M12 5v14", "M5 12h14"],
  image: ["M4 5h16v14H4z", "M4 16l5-5 4 4 3-3 4 4", "M15 9a1 1 0 102 0a1 1 0 10-2 0"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  check: ["M5 12.5l4.5 4.5L19 7"],
  chevL: ["M15 5l-7 7 7 7"],
  chevR: ["M9 5l7 7-7 7"]
};
const I = (n, s = 24) => `<svg class="hub-icon" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(ICONS[n] || ICONS.plus).map(d => `<path d="${d}"/>`).join('')}</svg>`;

/* ---------- stato + persistenza ---------- */
const def = () => ({
  beyblade: {parts: [], decks: []},
  gym: {plans: []},
  grocery: [],
  diet: {goal: {kcal: 0, prot: 0, carb: 0, fat: 0}, days: {}},
  wallet: {monthly: 0, limits: {}, expenses: []}
});
function normalize(d) {
  const o = def();
  if (!d || typeof d !== 'object') return o;
  const arr = x => Array.isArray(x) ? x.filter(e => e && typeof e === 'object') : [];
  o.beyblade.parts = arr(d.beyblade && d.beyblade.parts).map(p => Object.assign({}, p, {note: String(p.note || ''), weight: num(p.weight) > 0 ? num(p.weight) : null}));
  o.beyblade.decks = arr(d.beyblade && d.beyblade.decks);
  o.gym.plans = arr(d.gym && d.gym.plans).map(p => ({
    id: p.id || uid(), name: String(p.name || ''),
    exercises: (Array.isArray(p.exercises) ? p.exercises : []).map(e => typeof e === 'string' ? {t: e, done: false} : (e && typeof e === 'object' ? {t: String(e.t ?? ''), done: !!e.done} : null)).filter(Boolean),
    record: String(p.record || ''), recordDate: String(p.recordDate || '')
  }));
  o.grocery = arr(d.grocery);
  if (d.diet && typeof d.diet === 'object') {
    o.diet.goal = Object.assign(o.diet.goal, d.diet.goal || {});
    o.diet.days = d.diet.days && typeof d.diet.days === 'object' ? d.diet.days : {};
  }
  const w = d.wallet && typeof d.wallet === 'object' ? d.wallet : {};
  o.wallet.monthly = Math.max(0, num(w.monthly));
  if (w.limits && typeof w.limits === 'object') for (const k in w.limits) if (num(w.limits[k]) > 0) o.wallet.limits[k] = num(w.limits[k]);
  o.wallet.expenses = arr(w.expenses).map(e => ({id: e.id || uid(), name: String(e.name || ''), cat: String(e.cat || ''), price: num(e.price), date: /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : localDate()}));
  return o;
}
let S = (() => { try { return normalize(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return def(); } })();
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); localStorage.setItem(KEY + '-ts', String(Date.now())); }
  catch (e) { toast('Save failed'); }
}
function toast(m) {
  const t = document.getElementById('toast'); t.textContent = m; t.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- UI state ---------- */
const ui = {tab: 'home', bey: 'blades', day: localDate(), month: localDate().slice(0, 7), sheet: null, focus: null, lastKey: ''};
const CATS = [
  {id: 'blades', label: 'Blades', single: 'Blade', icon: 'beyblade', accent: 'pink'},
  {id: 'mainblades', label: 'Main Blades', single: 'Main Blade', icon: 'mainblade', accent: 'pink'},
  {id: 'chips', label: 'Chips', single: 'Chip', icon: 'chip', accent: 'green'},
  {id: 'overblades', label: 'Over Blades', single: 'Over Blade', icon: 'overblade', accent: 'amber'},
  {id: 'metalblades', label: 'Metal Blades', single: 'Metal Blade', icon: 'metalblade', accent: 'violet'},
  {id: 'assistblades', label: 'Assist Blades', single: 'Assist Blade', icon: 'assistblade', accent: 'cyan'},
  {id: 'ratchets', label: 'Ratchets', single: 'Ratchet', icon: 'ratchet', accent: 'violet'},
  {id: 'bits', label: 'Bits', single: 'Bit', icon: 'bit', accent: 'cyan'},
  {id: 'accessories', label: 'Accessories', single: 'Accessory', icon: 'accessory', accent: 'green', noWeight: true}
];
const DECK_CATS = ['blades', 'ratchets', 'bits'].map(id => CATS.find(c => c.id === id));
const catById = id => CATS.find(c => c.id === id) || CATS[0];
const NAV = [['beyblade', 'Beyblade', 'beyblade'], ['gym', 'Gym', 'gym'], ['home', 'Home', 'home'], ['grocery', 'Grocery', 'cart'], ['diet', 'Diet', 'diet']];

/* ---------- pezzi di UI ---------- */
const empty = t => `<p class="hub-empty">${esc(t)}</p>`;
const seg = (items, active, act) => `<div class="hub-seg" role="tablist">${items.map(it => `<button type="button" role="tab" aria-selected="${it.id === active}" class="hub-seg__item${it.id === active ? ' is-active' : ''}" style="--accent:var(--neon-${it.accent})" data-act="${act}" data-id="${it.id}"><span>${esc(it.label)}</span>${it.count != null ? `<span class="hub-seg__count">${it.count}</span>` : ''}</button>`).join('')}</div>`;
const nav = () => `<nav class="hub-nav" aria-label="Main navigation">${NAV.map(([id, l, ic]) => { const on = ui.tab === id; return `<button type="button" class="hub-nav__item${on ? ' is-active' : ''}"${on ? ' aria-current="page"' : ''} data-act="go" data-t="${id}">${I(ic, 22)}<span>${l}</span></button>`; }).join('')}</nav>`;
const delBtn = (act, id, label) => `<button type="button" class="hub-iconbtn" data-act="${act}" data-id="${esc(id)}" aria-label="${label}">${I('close', 18)}</button>`;

/* conferma dentro l'app (niente confirm() del browser) */
const ask = (msg, yes, label = 'Delete') => { ui.dialog = {msg, yes, label}; };
const vDialog = () => ui.dialog ? `<div class="hub-sheet-scrim hub-dialog-scrim"><div class="hub-sheet hub-dialog" role="alertdialog" aria-label="Confirm"><p class="hub-dialog__msg">${esc(ui.dialog.msg)}</p><div class="hub-actions"><button type="button" class="hub-btn hub-btn--ghost" data-act="dialogNo">Cancel</button><button type="button" class="hub-btn hub-btn--primary" data-act="dialogYes">${esc(ui.dialog.label)}</button></div></div></div>` : '';

function shell(v) {
  return `<header class="hub-screen__head"><span class="hub-label">${v.label}</span><h1 class="hub-screen__title">${v.icon ? `<span class="hub-screen__icon" style="color:var(--neon-${v.accent})">${I(v.icon, 30)}</span>` : ''}${esc(v.title)}</h1></header>${v.seg || ''}<main class="hub-scroll ${v.cls || 'hub-list'}">${v.body}</main>${v.fab ? `<button type="button" class="hub-fab" data-act="fab">${I('plus', 20)}Add</button>` : ''}${nav()}${vSheet()}${vDialog()}`;
}

/* ---------- viste ---------- */
function vHome() {
  const open = S.grocery.filter(i => !i.done).length;
  const tiles = [
    {id: 'beyblade', label: 'Beyblade', icon: 'beyblade', accent: 'violet', badge: S.beyblade.parts.length},
    {id: 'gym', label: 'Gym', icon: 'gym', accent: 'pink', badge: S.gym.plans.length},
    {id: 'grocery', label: 'Grocery', icon: 'cart', accent: 'cyan', badge: open},
    {id: 'diet', label: 'Diet', icon: 'diet', accent: 'green', badge: null},
    {id: 'wallet', label: 'Wallet', icon: 'wallet', accent: 'green', badge: null},
    {id: 'backup', label: 'Backup', icon: 'settings', accent: 'violet', badge: null}
  ];
  return {label: 'SYS // ONLINE', title: 'Home', cls: 'hub-screen__grid', body: tiles.map(t => `<button type="button" class="hub-tile" style="--accent:var(--neon-${t.accent})" data-act="go" data-t="${t.id}"><span class="hub-tile__icon">${I(t.icon, 28)}</span><span class="hub-tile__label">${t.label}</span>${t.badge ? `<span class="hub-tile__badge">${t.badge}</span>` : ''}</button>`).join('')};
}

function partRow(p) {
  const cat = catById(p.category), img = safeImg(p.photo);
  return `<div class="hub-row hub-row--part" style="--accent:var(--neon-${cat.accent})"><span class="hub-thumb">${img ? `<img src="${img}" alt="">` : I(cat.icon, 32)}</span><span class="hub-row__text"><span class="hub-row__name">${esc(p.name)}</span><span class="hub-label">${cat.single}${num(p.weight) > 0 ? ' // ' + Math.round(num(p.weight) * 100) / 100 + ' <span class="hub-unit">g</span>' : ''}</span>${p.note ? `<span class="hub-row__note">${esc(p.note)}</span>` : ''}</span><span class="hub-row__acts"><button type="button" class="hub-iconbtn" data-act="partEdit" data-id="${esc(p.id)}" aria-label="Edit part">${I('note', 18)}</button>${delBtn('partDel', p.id, 'Delete part')}</span></div>`;
}
function deckPanel(d) {
  const P = S.beyblade.parts, combos = Array.isArray(d.combos) ? d.combos : [];
  const sel = (i, c, cat) => { const k = cat.single.toLowerCase(); return `<select class="hub-input" aria-label="${cat.single}, combo ${i + 1}" data-chg="comboSet" data-id="${esc(d.id)}" data-i="${i}" data-k="${k}"><option value="">${cat.single}</option>${P.filter(p => p.category === cat.id).map(p => `<option value="${esc(p.id)}"${c[k] === p.id ? ' selected' : ''}>${esc(p.name)}</option>`).join('')}</select>`; };
  return `<section class="hub-panel" style="--accent:var(--neon-green)"><div class="hub-panel__head"><h2 class="hub-panel__title">${esc(d.name)}</h2>${delBtn('deckDel', d.id, 'Delete deck')}</div>${combos.map((c, i) => `<div class="hub-combo"><span class="hub-label">Combo ${i + 1}</span><div class="hub-combo__sel">${DECK_CATS.map(cat => sel(i, c || {}, cat)).join('')}</div></div>`).join('')}</section>`;
}
function vBey() {
  const B = S.beyblade;
  const tab = c => ({id: c.id, label: c.label, accent: c.accent, count: B.parts.filter(p => p.category === c.id).length});
  const tabs = CATS.filter(c => c.id !== 'accessories').map(tab).concat([{id: 'decks', label: 'Decks', accent: 'green', count: B.decks.length}], [tab(catById('accessories'))]);
  let body;
  if (ui.bey === 'decks') body = B.decks.map(deckPanel).join('') || empty(B.parts.length ? 'No decks yet. Tap Add to create the first one.' : 'Add some parts first, then build decks from them.');
  else { const cat = catById(ui.bey); body = B.parts.filter(p => p.category === cat.id).map(partRow).join('') || empty(`No ${cat.label.toLowerCase()} yet. Tap Add to create the first one.`); }
  return {label: `COLLECTION // ${B.parts.length} PARTS`, title: 'Beyblade', icon: 'beyblade', accent: 'violet', seg: seg(tabs, ui.bey, 'beyTab'), body, fab: true};
}

function vGym() {
  const plans = S.gym.plans;
  const checked = plans.reduce((n, p) => n + (p.exercises || []).filter(e => e.done).length, 0);
  const resetAll = checked >= 2 ? `<div class="hub-actions" style="margin-top:0"><button type="button" class="hub-btn hub-btn--secondary" data-act="resetAll">Reset all</button></div>` : '';
  const body = resetAll + plans.map(p => {
    const items = Array.isArray(p.exercises) ? p.exercises : [], anyDone = items.some(e => e.done);
    return `<section class="hub-panel" style="--accent:var(--neon-pink)"><div class="hub-panel__head"><h2 class="hub-panel__title">${esc(p.name)}</h2><span style="display:flex"><button type="button" class="hub-iconbtn" data-act="planEdit" data-id="${esc(p.id)}" aria-label="Edit plan">${I('note', 18)}</button>${delBtn('planDel', p.id, 'Delete plan')}</span></div>` +
      (p.record ? `<p class="hub-record"><span class="hub-label">Record</span><span class="hub-record__v">${esc(p.record)}</span>${p.recordDate ? `<span class="hub-label">${esc(fmtDay(p.recordDate))}</span>` : ''}</p>` : '') +
      items.map((e, i) => `<button type="button" class="hub-todo${e.done ? ' is-on' : ''}" role="checkbox" aria-checked="${!!e.done}" data-act="exTog" data-id="${esc(p.id)}" data-i="${i}"><i class="hub-box">${e.done ? I('check', 16) : ''}</i><span class="hub-todo__t">${esc(e.t)}</span></button>`).join('') +
      `<div class="hub-actions">${items.length ? `<button type="button" class="hub-btn hub-btn--ghost" data-act="planReset" data-id="${esc(p.id)}"${anyDone ? '' : ' disabled'}>Reset</button>` : ''}<button type="button" class="hub-btn hub-btn--secondary" data-act="recordNew" data-id="${esc(p.id)}">New record</button></div></section>`;
  }).join('') || empty('No plans yet. Tap Add to create the first one.');
  return {label: `TRAINING // ${plans.length} PLANS`, title: 'Gym', icon: 'gym', accent: 'pink', body, fab: true};
}

function vGrocery() {
  const items = S.grocery, open = items.filter(i => !i.done).length;
  const body = items.map(i => `<div class="hub-row${i.done ? ' is-done' : ''}" style="--accent:var(--neon-cyan)"><button type="button" class="hub-check${i.done ? ' is-on' : ''}" style="--accent:var(--neon-cyan)" data-act="grTog" data-id="${esc(i.id)}" role="checkbox" aria-checked="${!!i.done}" aria-label="${esc(i.t)}"><i>${i.done ? I('check', 16) : ''}</i></button><span class="hub-row__text"><span class="hub-row__name">${esc(i.t)}</span></span>${delBtn('grDel', i.id, 'Delete item')}</div>`).join('') || empty('List is empty. Tap Add to create the first item.');
  const clear = items.some(i => i.done) ? `<div class="hub-actions"><button type="button" class="hub-btn hub-btn--ghost" data-act="grClear">Remove checked</button></div>` : '';
  return {label: `LIST // ${open} OPEN // ${items.length - open} DONE`, title: 'Grocery', icon: 'cart', accent: 'cyan', body: body + clear, fab: true};
}

const r1 = x => Math.round(x * 10) / 10;
function vDiet() {
  const meals = S.diet.days[ui.day] || [], g = S.diet.goal;
  const tot = {kcal: 0, prot: 0, carb: 0, fat: 0, sugar: 0};
  meals.forEach(m => { for (const k in tot) tot[k] += num(m[k]); });
  for (const k in tot) tot[k] = r1(tot[k]);
  const isToday = ui.day === localDate();
  const nv = `<div class="hub-daynav"><button type="button" class="hub-iconbtn" data-act="dayPrev" aria-label="Previous day">${I('chevL')}</button><span class="hub-label">${esc(fmtDay(ui.day)).toUpperCase()}${isToday ? ' // TODAY' : ''}</span><button type="button" class="hub-iconbtn" data-act="dayNext" aria-label="Next day">${I('chevR')}</button></div>`;

  const totals = `<section class="hub-panel" style="--accent:var(--neon-green)"><div class="hub-panel__head"><h2 class="hub-panel__title">Daily total</h2></div><div class="hub-stat"><div class="hub-stat__row"><span class="hub-label">Kcal</span><span class="hub-stat__val">${tot.kcal}</span></div></div><div class="hub-totals">${[['prot', 'Protein'], ['carb', 'Carbs'], ['fat', 'Fat'], ['sugar', 'Sugar']].map(([k, l]) => `<div><span class="hub-label">${l}</span><span class="hub-totals__v">${tot[k]}<small> g</small></span></div>`).join('')}</div>${isToday ? '' : '<div class="hub-actions"><button type="button" class="hub-btn hub-btn--ghost" data-act="dayToday">Today</button></div>'}</section>`;

  const goalRow = ([k, label]) => {
    const goal = g[k] || 0; if (!goal) return '';
    const v = tot[k], over = v > goal, pct = Math.round(v / goal * 100), u = / g$/.test(label) ? ' g' : '';
    return `<div class="hub-stat"><div class="hub-stat__row"><span class="hub-label">${lbl(label)}</span><span class="hub-stat__val${over ? ' hub-over' : ''}">${v}<small>${u} / ${goal}${u}</small></span></div><div class="hub-bar"><i class="${over ? 'is-over' : ''}" style="width:${Math.min(100, v / goal * 100)}%"></i></div><div class="hub-stat__row"><span class="hub-label${over ? ' hub-over' : ''}">${pct}%</span><span class="hub-label${over ? ' hub-over' : ''}">${over ? 'OVER ' + r1(v - goal) : r1(goal - v) + ' LEFT'}</span></div></div>`;
  };
  const rows = [['kcal', 'Kcal'], ['prot', 'Protein g'], ['carb', 'Carbs g'], ['fat', 'Fat g']].map(goalRow).join('');
  const goals = `<section class="hub-panel" style="--accent:var(--neon-green)"><div class="hub-panel__head"><h2 class="hub-panel__title">Goals</h2></div>${rows || '<p class="hub-note">No goals set yet.</p>'}<div class="hub-actions"><button type="button" class="hub-btn hub-btn--ghost" data-act="goalSet">Set goals</button></div></section>`;

  const mealRow = m => {
    const extra = [['prot', 'prt'], ['carb', 'crb'], ['fat', 'fat'], ['sugar', 'sug']].filter(([k]) => num(m[k]) > 0).map(([k, l]) => r1(num(m[k])) + ' <span class="hub-unit">' + l + '</span>');
    return `<div class="hub-row" style="--accent:var(--neon-green)"><span class="hub-row__text"><span class="hub-row__name">${esc(m.name)}</span><span class="hub-label">${[num(m.kcal) + ' KCAL'].concat(extra).join(' // ')}</span></span><span class="hub-row__acts"><button type="button" class="hub-iconbtn" data-act="mealEdit" data-id="${esc(m.id)}" aria-label="Edit meal">${I('note', 18)}</button>${delBtn('mealDel', m.id, 'Delete meal')}</span></div>`;
  };
  const prev = S.diet.days[shiftDay(ui.day, -1)] || [];
  const list = meals.length ? meals.map(mealRow).join('') : empty('Nothing logged for this day.') + (prev.length ? `<div class="hub-actions" style="justify-content:center"><button type="button" class="hub-btn hub-btn--secondary" data-act="copyPrev">Copy last day</button></div>` : '');
  return {label: `NUTRITION // ${tot.kcal} KCAL`, title: 'Diet', icon: 'diet', accent: 'green', seg: nv, body: goals + totals + list, fab: true};
}

/* ---------- Wallet ---------- */
const catKey = x => String(x || '').trim().toLowerCase().replace(/\s+/g, ' ');
const money = x => { const r = Math.round(x * 100) / 100; return '$' + (Number.isInteger(r) ? r : r.toFixed(2)); };
const shiftMonth = (m, n) => { const [y, mo] = m.split('-').map(Number), d = new Date(y, mo - 1 + n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); };
const monthLabel = m => { const [y, mo] = m.split('-').map(Number); return new Date(y, mo - 1, 1).toLocaleDateString('en-GB', {month: 'short', year: 'numeric'}); };
const fmtShort = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
function catNames() {
  const m = new Map();
  S.wallet.expenses.forEach(e => { const k = catKey(e.cat); if (k && !m.has(k)) m.set(k, e.cat.trim()); });
  Object.keys(S.wallet.limits).forEach(k => { if (!m.has(k)) m.set(k, k); });
  return [...m.values()].sort((a, b) => a.localeCompare(b));
}
function budgetRow(label, v, max) {
  const over = max > 0 && v > max;
  const head = `<div class="hub-stat__row"><span class="hub-label">${esc(label)}</span><span class="hub-stat__val${over ? ' hub-over' : ''}">${money(v)}${max ? `<small> / ${money(max)}</small>` : ''}</span></div>`;
  if (!max) return `<div class="hub-stat">${head}<div class="hub-stat__row"><span class="hub-label">NO LIMIT</span></div></div>`;
  const pct = Math.round(v / max * 100);
  return `<div class="hub-stat">${head}<div class="hub-bar"><i class="${over ? 'is-over' : ''}" style="width:${Math.min(100, v / max * 100)}%"></i></div><div class="hub-stat__row"><span class="hub-label${over ? ' hub-over' : ''}">${pct}%</span><span class="hub-label${over ? ' hub-over' : ''}">${over ? 'OVER BUDGET ' + money(v - max) : money(max - v) + ' LEFT'}</span></div></div>`;
}
function vWallet() {
  const W = S.wallet, cur = localDate().slice(0, 7);
  const list = W.expenses.filter(e => String(e.date).slice(0, 7) === ui.month).reverse().sort((a, b) => a.date < b.date ? 1 : a.date > b.date ? -1 : 0);
  const total = list.reduce((n, e) => n + num(e.price), 0);
  const by = new Map();
  list.forEach(e => { const k = catKey(e.cat); const r = by.get(k) || {name: e.cat.trim(), sum: 0}; r.sum += num(e.price); by.set(k, r); });
  Object.keys(W.limits).forEach(k => { if (!by.has(k)) by.set(k, {name: k, sum: 0}); });
  const cats = [...by.entries()].sort((a, b) => b[1].sum - a[1].sum || a[0].localeCompare(b[0]));
  const nv = `<div class="hub-daynav"><button type="button" class="hub-iconbtn" data-act="monthPrev" aria-label="Previous month">${I('chevL')}</button><span class="hub-label">${esc(monthLabel(ui.month)).toUpperCase()}${ui.month === cur ? ' // THIS MONTH' : ''}</span><button type="button" class="hub-iconbtn" data-act="monthNext" aria-label="Next month">${I('chevR')}</button></div>`;
  const goals = `<section class="hub-panel" style="--accent:var(--neon-green)"><div class="hub-panel__head"><h2 class="hub-panel__title">Goals</h2></div>${budgetRow('Monthly', total, W.monthly)}${cats.length ? '<hr class="hub-sep">' + cats.map(([k, r]) => budgetRow(r.name, r.sum, W.limits[k] || 0)).join('') : ''}<div class="hub-actions"><button type="button" class="hub-btn hub-btn--ghost" data-act="wGoalSet">Set goals</button>${ui.month === cur ? '' : '<button type="button" class="hub-btn hub-btn--ghost" data-act="monthToday">This month</button>'}</div></section>`;
  const rows = list.map(e => `<div class="hub-row" style="--accent:var(--neon-green)"><span class="hub-row__text"><span class="hub-row__name">${esc(e.name)}</span><span class="hub-label">${esc(e.cat)} // ${money(e.price)} // ${esc(fmtShort(e.date))}</span></span><span class="hub-row__acts"><button type="button" class="hub-iconbtn" data-act="wExEdit" data-id="${esc(e.id)}" aria-label="Edit expense">${I('note', 18)}</button>${delBtn('wExDel', e.id, 'Delete expense')}</span></div>`).join('') || empty('No expenses this month.');
  return {label: `MONTH // ${money(total)} SPENT`, title: 'Wallet', icon: 'wallet', accent: 'green', seg: nv, body: goals + rows, fab: true};
}

function vBackup() {
  const ts = +localStorage.getItem(KEY + '-ts');
  const body = `<section class="hub-panel" style="--accent:var(--neon-violet)"><div class="hub-panel__head"><h2 class="hub-panel__title">Local data</h2></div><p class="hub-note">Everything lives on this phone only. Export a file before switching phones or clearing browser data.</p><div class="hub-actions" style="justify-content:flex-start"><button type="button" class="hub-btn hub-btn--primary" data-act="export">${I('plus', 18)}Export</button><label class="hub-btn hub-btn--secondary hub-photo__pick">${I('image', 18)}Import<input type="file" accept="application/json,.json" class="hub-photo__input" data-chg="import"></label></div></section><p class="hub-label">LAST SAVE // ${ts ? esc(new Date(ts).toLocaleString('en-GB')) : 'NONE'}</p><p class="hub-label" id="persist"></p>`;
  return {label: 'SYS // BACKUP', title: 'Backup', icon: 'settings', accent: 'violet', body};
}

/* ---------- sheet (form di creazione) ---------- */
const parseEx = s => String(s || '').split(/[\n,]/).map(x => x.trim()).filter(Boolean);
const SHEETS = {
  part: {title: 'Add part', editTitle: 'Edit part', fields: () => {
      const cat = catById((ui.sheet && ui.sheet.vals.category) || '');
      return [{k: 'name', label: 'Name', req: 1, ph: 'e.g. Dran Sword'}, {k: 'category', type: 'choice'}, {k: 'photo', type: 'photo', req: 1}]
        .concat(cat.noWeight ? [] : [{k: 'weight', label: 'Weight g', type: 'number', solo: 1, ph: '0'}])
        .concat([{k: 'note', label: 'Note', type: 'area', ph: 'e.g. Bought at the tournament'}]);
    },
    valid: v => !!(v.name || '').trim() && !!v.category && !!safeImg(v.photo),
    save: v => {
      const w = catById(v.category).noWeight ? 0 : num(v.weight), data = {name: v.name.trim(), category: v.category, photo: v.photo || null, weight: w > 0 ? w : null, note: (v.note || '').trim()};
      const e = v.id && byId(S.beyblade.parts, v.id);
      if (e) Object.assign(e, data); else S.beyblade.parts.push(Object.assign({id: uid()}, data));
      ui.bey = v.category;
    }},
  deck: {title: 'Add deck', fields: [{k: 'name', label: 'Name', req: 1, ph: 'e.g. Tournament deck'}],
    valid: v => !!(v.name || '').trim(),
    save: v => { S.beyblade.decks.push({id: uid(), name: v.name.trim(), combos: [0, 1, 2].map(() => ({blade: '', ratchet: '', bit: ''}))}); ui.bey = 'decks'; }},
  plan: {title: 'Plan', fields: [{k: 'name', label: 'Name', req: 1, ph: 'e.g. Push'}, {k: 'exercises', label: 'Exercises', type: 'area', ph: 'One per line'}, {k: 'record', label: 'Record', ph: 'e.g. 60 kg x 8'}],
    valid: v => !!(v.name || '').trim(),
    save: v => {
      const lines = parseEx(v.exercises), rec = (v.record || '').trim();
      if (v.id) {
        const p = byId(S.gym.plans, v.id);
        if (p) {
          const old = p.exercises || [];
          p.name = v.name.trim();
          p.exercises = lines.map(t => ({t, done: !!(old.find(o => o.t === t) || {}).done}));
          if (rec !== (p.record || '')) { p.record = rec; p.recordDate = rec ? localDate() : ''; }
        }
      } else S.gym.plans.push({id: uid(), name: v.name.trim(), exercises: lines.map(t => ({t, done: false})), record: rec, recordDate: rec ? localDate() : ''});
    }},
  record: {title: 'New record', fields: [{k: 'value', label: 'Record', req: 1, ph: 'e.g. 60 kg x 8'}],
    valid: v => !!(v.value || '').trim(),
    save: v => { const p = byId(S.gym.plans, v.id); if (p) { p.record = v.value.trim(); p.recordDate = localDate(); } }},
  grocery: {title: 'Add item', cancel: 'Close', saveLabel: 'Add', fields: [{k: 'name', label: 'Item', req: 1, ph: 'e.g. Milk'}],
    valid: v => !!(v.name || '').trim(),
    save: v => { S.grocery.push({id: uid(), t: v.name.trim(), done: false}); return 'keep'; }},
  meal: {title: 'Add meal', editTitle: 'Edit meal', fields: [{k: 'name', label: 'Meal', req: 1, ph: 'e.g. Chicken and rice'}, {k: 'kcal', label: 'Kcal', type: 'number', ph: '0'}, {k: 'prot', label: 'Protein g', type: 'number', ph: '0'}, {k: 'carb', label: 'Carbs g', type: 'number', ph: '0'}, {k: 'fat', label: 'Fat g', type: 'number', ph: '0'}, {k: 'sugar', label: 'Sugar g', type: 'number', ph: '0'}],
    valid: v => !!(v.name || '').trim(),
    save: v => {
      const data = {name: v.name.trim(), kcal: num(v.kcal, parseInt), prot: num(v.prot), carb: num(v.carb), fat: num(v.fat), sugar: num(v.sugar)};
      const list = S.diet.days[ui.day] = S.diet.days[ui.day] || [], m = v.id && byId(list, v.id);
      if (m) Object.assign(m, data); else list.push(Object.assign({id: uid()}, data));
    }},
  goal: {title: 'Daily goals', fields: [{k: 'kcal', label: 'Kcal', type: 'number', ph: '0 = none'}, {k: 'prot', label: 'Protein g', type: 'number', ph: '0 = none'}, {k: 'carb', label: 'Carbs g', type: 'number', ph: '0 = none'}, {k: 'fat', label: 'Fat g', type: 'number', ph: '0 = none'}],
    valid: () => true,
    save: v => { const n = x => Math.max(0, num(x, parseInt)); S.diet.goal = {kcal: n(v.kcal), prot: n(v.prot), carb: n(v.carb), fat: n(v.fat)}; }},
  expense: {title: 'Add expense', editTitle: 'Edit expense', fields: [{k: 'name', label: 'Name', req: 1, ph: 'e.g. Car insurance'}, {k: 'cat', label: 'Category', req: 1, ph: 'e.g. Car', list: 1}, {k: 'price', label: 'Price $', type: 'number', req: 1, solo: 1, ph: '0'}],
    valid: v => !!(v.name || '').trim() && !!(v.cat || '').trim() && num(v.price) > 0,
    save: v => {
      const data = {name: v.name.trim(), cat: v.cat.trim(), price: num(v.price)}, list = S.wallet.expenses, e = v.id && byId(list, v.id);
      if (e) Object.assign(e, data); else list.push(Object.assign({id: uid(), date: ui.month === localDate().slice(0, 7) ? localDate() : ui.month + '-01'}, data));
    }},
  wgoal: {title: 'Monthly goals', fields: () => {
      const cats = (ui.sheet && ui.sheet.vals._cats) || [];
      return [{k: 'monthly', label: 'Monthly max $', type: 'number', solo: 1, ph: '0 = none'}]
        .concat(cats.map((c, i) => ({k: 'lim' + i, label: c + ' $', type: 'number', ph: '0 = none'})))
        .concat([{k: 'newcat', label: 'New category', ph: 'e.g. Food'}, {k: 'newlim', label: 'Limit $', type: 'number', solo: 1, ph: '0'}]);
    },
    valid: () => true,
    save: v => {
      const W = S.wallet; W.monthly = Math.max(0, num(v.monthly));
      (v._cats || []).forEach((c, i) => { const n = Math.max(0, num(v['lim' + i])), k = catKey(c); if (n > 0) W.limits[k] = n; else delete W.limits[k]; });
      const nc = catKey(v.newcat), nl = Math.max(0, num(v.newlim)); if (nc && nl > 0) W.limits[nc] = nl;
    }}
};
function groupNums(fields, render) {
  let out = '', run = [];
  const flush = () => { if (run.length) out += run.length > 1 ? `<div class="hub-field-row">${run.join('')}</div>` : run[0]; run = []; };
  for (const f of fields) { const h = render(f); if (f.type === 'number' && !f.solo) run.push(h); else { flush(); out += h; } }
  flush(); return out;
}
function vSheet() {
  const sh = ui.sheet; if (!sh) return '';
  const cfg = SHEETS[sh.type], v = sh.vals, ok = cfg.valid(v), title = (v.id && cfg.editTitle) || cfg.title;
  const tag = f => f.req ? '<span class="hub-req">Required</span>' : '<span class="hub-opt">Optional</span>';
  const render = f => {
    if (f.type === 'choice') return `<div class="hub-field"><div class="hub-field__head"><span class="hub-label">Category</span><span class="hub-req">Required</span></div><div class="hub-choices" role="radiogroup" aria-label="Category">${CATS.map(c => { const on = v.category === c.id; return `<button type="button" role="radio" aria-checked="${on}" class="hub-choice${on ? ' is-active' : ''}" style="--accent:var(--neon-${c.accent})" data-act="choice" data-v="${c.id}">${I(c.icon, 20)}<span>${c.single}</span></button>`; }).join('')}</div></div>`;
    if (f.type === 'photo') { const img = safeImg(v.photo); return `<div class="hub-field"><div class="hub-field__head"><span class="hub-label">Photo</span>${f.req ? '<span class="hub-req">Required</span>' : '<span class="hub-opt">Optional</span>'}</div><div class="hub-photo"><span class="hub-thumb hub-thumb--empty">${img ? `<img src="${img}" alt="Selected photo">` : I('image', 22)}</span><label class="hub-btn hub-btn--secondary hub-photo__pick">${I('image', 18)}${img ? 'Change photo' : 'Upload photo'}<input type="file" accept="image/*" class="hub-photo__input" data-chg="photoPick"></label>${img ? '<button type="button" class="hub-btn hub-btn--ghost" data-act="photoClear">Remove</button>' : ''}</div></div>`; }
    const id = 'f-' + f.k, val = esc(v[f.k] ?? '');
    const control = f.type === 'area' ? `<textarea id="${id}" class="hub-input hub-input--area" name="${f.k}" placeholder="${esc(f.ph || '')}">${val}</textarea>`
      : `<input id="${id}" class="hub-input" name="${f.k}" type="${f.type === 'number' ? 'number' : 'text'}"${f.type === 'number' ? ' inputmode="decimal" step="any"' : ' autocomplete="off"'} value="${val}" placeholder="${esc(f.ph || '')}"${f.list ? ` list="dl-${f.k}"` : ''}>`;
    return `<div class="hub-field"><div class="hub-field__head"><label class="hub-label" for="${id}">${lbl(f.label)}</label>${tag(f)}</div>${control}${f.list ? `<datalist id="dl-${f.k}">${catNames().map(c => `<option value="${esc(c)}"></option>`).join('')}</datalist>` : ''}</div>`;
  };
  const fields = groupNums(typeof cfg.fields === 'function' ? cfg.fields() : cfg.fields, render);
  return `<div class="hub-sheet-scrim" data-act="scrim"><div class="hub-sheet" role="dialog" aria-label="${esc(title)}"><h2 class="hub-sheet__title">${esc(title)}</h2>${fields}<div class="hub-actions"><button type="button" class="hub-btn hub-btn--ghost" data-act="sheetClose">${cfg.cancel || 'Cancel'}</button><button type="button" class="hub-btn hub-btn--primary" data-act="sheetSave"${ok ? '' : ' disabled'}>${cfg.saveLabel || 'Save'}</button></div></div></div>`;
}
const openSheet = (type, vals = {}) => { ui.sheet = {type, vals}; ui.focus = 'sheet'; };
function snap() {
  if (!ui.sheet) return;
  document.querySelectorAll('.hub-sheet [name]').forEach(el => { ui.sheet.vals[el.name] = el.value; });
}

/* ---------- render ---------- */
const VIEWS = {home: vHome, beyblade: vBey, gym: vGym, grocery: vGrocery, diet: vDiet, wallet: vWallet, backup: vBackup};
function render() {
  const sc = document.querySelector('.hub-scroll');
  const keep = sc ? sc.scrollTop : 0;
  const key = [ui.tab, ui.bey, ui.day, ui.month].join('|');
  document.getElementById('app').innerHTML = shell(VIEWS[ui.tab]());
  const nsc = document.querySelector('.hub-scroll');
  if (nsc && key === ui.lastKey) nsc.scrollTop = keep;
  ui.lastKey = key;
  if (ui.tab === 'beyblade') { const a = document.querySelector('.hub-seg__item.is-active'); if (a && a.scrollIntoView) a.scrollIntoView({block: 'nearest', inline: 'center'}); }
  if (ui.focus === 'sheet') { const el = document.querySelector('.hub-sheet .hub-input'); if (el) el.focus(); ui.focus = null; }
  if (ui.tab === 'backup' && navigator.storage && navigator.storage.persisted) navigator.storage.persisted().then(p => { const e = document.getElementById('persist'); if (e) e.textContent = p ? 'STORAGE // PROTECTED' : 'STORAGE // STANDARD (INSTALL THE APP TO PROTECT IT)'; });
}

/* ---------- foto ---------- */
function fileToThumb(file, size) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        /* ritaglio quadrato centrale, ridotto a gradini (metà alla volta) con smoothing alto: niente effetto sgranato */
        const s = Math.min(img.width, img.height), sx = (img.width - s) / 2, sy = (img.height - s) / 2;
        let w = s, src = img, cx = sx, cy = sy, cs = s;
        while (w / 2 > size) {
          w = Math.round(w / 2);
          const t = document.createElement('canvas'); t.width = t.height = w;
          const g = t.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
          g.drawImage(src, cx, cy, cs, cs, 0, 0, w, w);
          src = t; cx = cy = 0; cs = w;
        }
        const c = document.createElement('canvas'); c.width = size; c.height = size;
        const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
        g.drawImage(src, cx, cy, cs, cs, 0, 0, size, size);
        resolve(c.toDataURL('image/jpeg', 0.9));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

/* ---------- azioni ---------- */
const byId = (arr, id) => arr.find(x => x.id === id);
const A = {
  go: el => { ui.tab = el.dataset.t; ui.sheet = null; },
  beyTab: el => { ui.bey = el.dataset.id; },
  fab: () => {
    if (ui.tab === 'beyblade') ui.bey === 'decks' ? openSheet('deck') : openSheet('part', {category: ui.bey});
    else if (ui.tab === 'gym') openSheet('plan');
    else if (ui.tab === 'grocery') openSheet('grocery');
    else if (ui.tab === 'diet') openSheet('meal');
    else if (ui.tab === 'wallet') openSheet('expense');
  },
  scrim: () => { ui.sheet = null; },
  sheetClose: () => { ui.sheet = null; },
  sheetSave: () => {
    const sh = ui.sheet, cfg = SHEETS[sh.type];
    if (!cfg.valid(sh.vals)) return;
    const r = cfg.save(sh.vals); persist();
    if (r === 'keep') { sh.vals = {}; ui.focus = 'sheet'; } else ui.sheet = null;
  },
  choice: el => { ui.sheet.vals.category = el.dataset.v; },
  photoClear: () => { ui.sheet.vals.photo = null; },

  dialogYes: () => { const d = ui.dialog; ui.dialog = null; if (d) d.yes(); },
  dialogNo: () => { ui.dialog = null; },

  partEdit: el => { const p = byId(S.beyblade.parts, el.dataset.id); if (p) openSheet('part', {id: p.id, name: p.name, category: p.category, photo: p.photo || null, weight: num(p.weight) > 0 ? String(p.weight) : '', note: p.note || ''}); },
  partDel: el => { const id = el.dataset.id; ask('Delete this part?', () => { S.beyblade.parts = S.beyblade.parts.filter(p => p.id !== id); S.beyblade.decks.forEach(d => (d.combos || []).forEach(c => { for (const k of ['blade', 'ratchet', 'bit']) if (c && c[k] === id) c[k] = ''; })); persist(); }); },
  deckDel: el => { const id = el.dataset.id; ask('Delete this deck?', () => { S.beyblade.decks = S.beyblade.decks.filter(d => d.id !== id); persist(); }); },

  planEdit: el => { const p = byId(S.gym.plans, el.dataset.id); openSheet('plan', {id: p.id, name: p.name, exercises: (p.exercises || []).map(e => e.t).join('\n'), record: p.record || ''}); },
  planDel: el => { const id = el.dataset.id; ask('Delete this plan?', () => { S.gym.plans = S.gym.plans.filter(p => p.id !== id); persist(); }); },
  exTog: el => { const p = byId(S.gym.plans, el.dataset.id), e = p && p.exercises[+el.dataset.i]; if (e) { e.done = !e.done; persist(); } },
  planReset: el => { const p = byId(S.gym.plans, el.dataset.id); if (p) { p.exercises.forEach(e => { e.done = false; }); persist(); } },
  resetAll: () => { S.gym.plans.forEach(p => (p.exercises || []).forEach(e => { e.done = false; })); persist(); },
  recordNew: el => openSheet('record', {id: el.dataset.id, value: ''}),

  grTog: el => { const i = byId(S.grocery, el.dataset.id); if (i) { i.done = !i.done; persist(); } },
  grDel: el => { S.grocery = S.grocery.filter(x => x.id !== el.dataset.id); persist(); },
  grClear: () => { S.grocery = S.grocery.filter(x => !x.done); persist(); },

  dayPrev: () => { ui.day = shiftDay(ui.day, -1); },
  dayNext: () => { ui.day = shiftDay(ui.day, 1); },
  dayToday: () => { ui.day = localDate(); },
  goalSet: () => openSheet('goal', {kcal: S.diet.goal.kcal || '', prot: S.diet.goal.prot || '', carb: S.diet.goal.carb || '', fat: S.diet.goal.fat || ''}),
  copyPrev: () => { const prev = S.diet.days[shiftDay(ui.day, -1)] || []; if (!prev.length || (S.diet.days[ui.day] || []).length) return; S.diet.days[ui.day] = prev.map(m => Object.assign({}, m, {id: uid()})); persist(); toast('Copied ' + prev.length + ' meals'); },
  mealEdit: el => { const m = byId(S.diet.days[ui.day] || [], el.dataset.id); if (!m) return; const f = x => x ? String(x) : ''; openSheet('meal', {id: m.id, name: m.name, kcal: f(m.kcal), prot: f(m.prot), carb: f(m.carb), fat: f(m.fat), sugar: f(m.sugar)}); },
  mealDel: el => { S.diet.days[ui.day] = (S.diet.days[ui.day] || []).filter(x => x.id !== el.dataset.id); persist(); },

  monthPrev: () => { ui.month = shiftMonth(ui.month, -1); },
  monthNext: () => { ui.month = shiftMonth(ui.month, 1); },
  monthToday: () => { ui.month = localDate().slice(0, 7); },
  wGoalSet: () => {
    const cats = [...new Set(catNames().map(catKey))], W = S.wallet, v = {monthly: W.monthly || '', _cats: cats};
    cats.forEach((c, i) => { v['lim' + i] = W.limits[c] || ''; });
    openSheet('wgoal', v);
  },
  wExEdit: el => { const e = byId(S.wallet.expenses, el.dataset.id); if (e) openSheet('expense', {id: e.id, name: e.name, cat: e.cat, price: String(e.price)}); },
  wExDel: el => { const id = el.dataset.id; ask('Delete this expense?', () => { S.wallet.expenses = S.wallet.expenses.filter(e => e.id !== id); persist(); }); },

  export: () => {
    const blob = new Blob([JSON.stringify(S, null, 2)], {type: 'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'hub-backup-' + localDate() + '.json';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Backup exported');
  }
};
const C = {
  comboSet: el => { const d = byId(S.beyblade.decks, el.dataset.id); if (d && d.combos && d.combos[+el.dataset.i]) { d.combos[+el.dataset.i][el.dataset.k] = el.value; persist(); } return false; },
  photoPick: el => {
    const f = el.files && el.files[0]; if (!f) return false;
    fileToThumb(f, 384).then(url => { if (ui.sheet) { ui.sheet.vals.photo = url; render(); } }, () => toast('Image not readable'));
    return false;
  },
  import: el => {
    const f = el.files && el.files[0]; if (!f) return false;
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        if (!d || !d.beyblade || !d.gym || !Array.isArray(d.grocery) || !d.diet) throw 0;
        ask('Replace all current data with this backup?', () => { S = normalize(d); persist(); ui.tab = 'home'; toast('Backup imported'); }, 'Replace');
        render();
      } catch (e) { toast('Invalid file'); }
    };
    r.readAsText(f);
    return false;
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.dataset.act === 'scrim' && e.target !== el) return;
  snap();
  A[el.dataset.act](el); render();
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-chg]'); if (!el) return;
  snap();
  if (C[el.dataset.chg](el) !== false) render();
});
document.addEventListener('input', e => {
  if (!ui.sheet || !e.target.closest('.hub-sheet')) return;
  snap();
  const b = document.querySelector('[data-act=sheetSave]'); if (b) b.disabled = !SHEETS[ui.sheet.type].valid(ui.sheet.vals);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || !ui.sheet || e.target.tagName !== 'INPUT') return;
  const b = document.querySelector('[data-act=sheetSave]'); if (b && !b.disabled) { e.preventDefault(); b.click(); }
});

render();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
