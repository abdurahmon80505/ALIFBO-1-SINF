// ============================================================
//  OVOZ TIZIMI — hech qanday yozib olish talab qilinmaydi
//
//  Muammo: telefonlarda oʻzbekcha sintez ovozi deyarli yoʻq,
//  lotin yozuvini ingliz ovozi bilan oʻqitsa — rasvo chiqadi.
//
//  Yechim: matnni ovoz tiliga MOSLAB beramiz.
//    • ruscha ovoz  → kirill yozuviga oʻgiramiz  (ma → ма, shakar → шакар)
//    • turkcha ovoz → turk imlosiga             (shakar → şakar, qalam → kalam)
//    • oʻzbekcha ovoz bor boʻlsa — oʻzgartirmaymiz
//  Rus va turk tillari oʻzbek tovushlariga juda yaqin, natija tabiiy chiqadi.
//
//  MP3 sprite (bitta fayl + vaqt jadvali) ham qoʻllab-quvvatlanadi:
//  data/ovoz-vaqt.js toʻldirilsa, u avtomatik ustun turadi.
// ============================================================
import { OVOZ_FAYL, HARF_VAQT, BOGIN_VAQT, SOZ_VAQT } from '../data/ovoz-vaqt.js';

let audio = null;
let tayyor = false;
let raf = null, tmr = null;
let joriyTugash = 0;

// ---------- MP3 sprite (agar bor boʻlsa) ----------
function spriteBormi() {
  return Object.keys(HARF_VAQT).length + Object.keys(BOGIN_VAQT).length + Object.keys(SOZ_VAQT).length > 0;
}

export function ovozniTayyorla() {
  if (audio) return audio;
  if (!spriteBormi()) return null;
  audio = new Audio(OVOZ_FAYL);
  audio.preload = 'auto';
  audio.playsInline = true;
  return audio;
}

export function unlock() {
  if (tayyor) return;
  tayyor = true;
  const a = ovozniTayyorla();
  if (!a) return;
  try {
    a.load();
    a.muted = true;
    const p = a.play();
    if (p && p.then) {
      p.then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
       .catch(() => { a.muted = false; });
    } else { a.pause(); a.muted = false; }
  } catch (e) { a.muted = false; }
}

export function toxtat() {
  clearTimeout(tmr);
  if (raf) { cancelAnimationFrame(raf); raf = null; }
  try { if (audio) audio.pause(); } catch (e) {}
  try { speechSynthesis.cancel(); } catch (e) {}
}

function spriteIjro(vaqt) {
  return new Promise(resolve => {
    const a = ovozniTayyorla();
    if (!a) { resolve(); return; }
    const [boshi, oxiri] = vaqt;
    joriyTugash = oxiri;
    toxtat();

    let t0 = 0;
    const kuzat = () => {
      if (a.currentTime >= joriyTugash || Date.now() - t0 > 7000) {
        try { a.pause(); } catch (e) {}
        raf = null; resolve(); return;
      }
      raf = requestAnimationFrame(kuzat);
    };
    const boshla = () => {
      t0 = Date.now();
      const p = a.play();
      if (p && p.catch) p.catch(() => resolve());
      kuzat();
    };
    const seekdanKeyin = () => {
      clearTimeout(tmr);
      a.removeEventListener('seeked', seekdanKeyin);
      boshla();
    };
    try {
      if (Math.abs(a.currentTime - boshi) < 0.03 && a.readyState >= 3) { boshla(); return; }
      a.addEventListener('seeked', seekdanKeyin);
      a.currentTime = boshi;
      tmr = setTimeout(() => { a.removeEventListener('seeked', seekdanKeyin); boshla(); }, 450);
    } catch (e) { boshla(); }
  });
}

// ============================================================
//  MATNNI OVOZ TILIGA MOSLASH
// ============================================================

// Lotin → kirill (rus ovozi uchun; oʻzbekcha kirill harflarini
// rus ovozi bilmaydi, shuning uchun eng yaqin rus harfiga oʻgiramiz)
const KIRILL = {
  'oʻ': 'о', 'gʻ': 'г', 'sh': 'ш', 'ch': 'ч', 'ng': 'нг',
  'a': 'а', 'b': 'б', 'd': 'д', 'e': 'э', 'f': 'ф', 'g': 'г', 'h': 'х',
  'i': 'и', 'j': 'ж', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о',
  'p': 'п', 'q': 'к', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'v': 'в',
  'x': 'х', 'y': 'й', 'z': 'з', 'ʼ': 'ъ'
};

// y + unli = bitta kirill harfi: yulduz → юлдуз, quyosh → куёш
const YOTLI = { 'a': 'я', 'o': 'ё', 'u': 'ю', 'e': 'е' };

// Lotin → turk imlosi
const TURK = {
  'oʻ': 'ö', 'gʻ': 'ğ', 'sh': 'ş', 'ch': 'ç', 'ng': 'ng',
  'q': 'k', 'x': 'h', 'ʼ': ''
};

function tokenlar(matn) {
  const s = String(matn).toLowerCase().replace(/[''`´]/g, 'ʻ');
  const chiq = [];
  let i = 0;
  while (i < s.length) {
    const ikki = s.slice(i, i + 2);
    if (['oʻ', 'gʻ', 'sh', 'ch', 'ng'].includes(ikki)) { chiq.push(ikki); i += 2; continue; }
    if (s[i] === 'ʻ') { chiq.push('ʼ'); i++; continue; }
    chiq.push(s[i]); i++;
  }
  return chiq;
}

export function moslash(matn, til) {
  if (/^ru/i.test(til)) {
    const t = tokenlar(matn);
    const chiq = [];
    for (let i = 0; i < t.length; i++) {
      if (t[i] === 'y' && YOTLI[t[i + 1]]) { chiq.push(YOTLI[t[i + 1]]); i++; continue; }
      chiq.push(KIRILL[t[i]] !== undefined ? KIRILL[t[i]] : t[i]);
    }
    return chiq.join('');
  }
  if (/^tr/i.test(til)) return tokenlar(matn).map(t => TURK[t] !== undefined ? TURK[t] : t).join('');
  return matn;   // oʻzbekcha yoki nomaʼlum — oʻzgartirmaymiz
}

// ---------- Ovozni tanlash ----------
const OVOZ_KALIT = 'alifboOvozi';
let tanlangan = null;

export function ovozlarRoyxati() {
  try {
    const hammasi = speechSynthesis.getVoices() || [];
    // faqat foydali tillar: oʻzbek, turk, rus (+ boshqalari oxirida)
    const tartib = v => /^uz/i.test(v.lang) ? 0 : /^tr/i.test(v.lang) ? 1 : /^ru/i.test(v.lang) ? 2 : 3;
    return hammasi.slice().sort((a, b) => tartib(a) - tartib(b));
  } catch (e) { return []; }
}

export function ovozTanla(nom) {
  try { localStorage.setItem(OVOZ_KALIT, nom || ''); } catch (e) {}
  tanlangan = null;
}

function ovoz() {
  if (tanlangan) return tanlangan;
  const hammasi = ovozlarRoyxati();
  if (!hammasi.length) return null;
  let saqlangan = '';
  try { saqlangan = localStorage.getItem(OVOZ_KALIT) || ''; } catch (e) {}
  tanlangan = hammasi.find(v => v.name === saqlangan) || hammasi[0];
  return tanlangan;
}

function gapir(matn, tezlik = 0.8) {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window)) { resolve(); return; }
    try {
      speechSynthesis.cancel();
      const v = ovoz();
      const til = v ? v.lang : 'ru-RU';
      const u = new SpeechSynthesisUtterance(moslash(matn, til));
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = tezlik;
      u.pitch = 1.05;
      u.onend = resolve;
      u.onerror = resolve;
      speechSynthesis.speak(u);
      setTimeout(resolve, 4000);          // qotib qolmasin
    } catch (e) { resolve(); }
  });
}

// Ovozlar roʻyxati brauzerda kechroq yuklanadi
try { speechSynthesis.addEventListener('voiceschanged', () => { tanlangan = null; }); } catch (e) {}

// ============================================================
//  HARF TOVUSHI
//  Choʻziladigan tovushlar (m, s, a…) — uch marta takrorlanadi: "ммм"
//  Portlovchilar (b, d, k…) — choʻzib boʻlmaydi, "ба-ба-ба" deb beriladi
// ============================================================
const PORTLOVCHI = ['b', 'd', 'g', 'k', 'p', 't', 'q', 'ch', 'j'];

export function portlovchimi(id) { return PORTLOVCHI.includes(id); }

function harfMatni(id) {
  if (id === 'ʼ') return 'a-a';                       // tutuq belgisi: qisqa toʻxtash
  if (portlovchimi(id)) return [id + 'a', id + 'a', id + 'a'].join(', ');
  return id + id + id;                                 // mmm, sss, ааа
}

// ---- TASHQARIGA CHIQADIGAN FUNKSIYALAR ----

export function harfOqi(harfId) {
  if (HARF_VAQT[harfId]) return spriteIjro(HARF_VAQT[harfId]);
  return gapir(harfMatni(harfId), 0.7);
}

export function boginOqi(bogin) {
  if (BOGIN_VAQT[bogin]) return spriteIjro(BOGIN_VAQT[bogin]);
  return gapir(bogin, 0.7);
}

export function sozOqi(soz) {
  if (SOZ_VAQT[soz]) return spriteIjro(SOZ_VAQT[soz]);
  return gapir(soz, 0.85);
}

export function gapOqi(gap) { return gapir(gap, 0.85); }

// Sinab koʻrish uchun (sozlamalarda)
export function sinov() { return gapir('ma, mo, mi — ona, olma', 0.8); }

// ============================================================
//  BOʻGʻINNI QOʻSHIB OʻQISH
//  Choʻziladigan undosh bilan: "mmm … a … ma"
//  Portlovchi bilan: tovushni yakka choʻzib boʻlmaydi — harflar
//  ketma-ket yonadi, keyin butun boʻgʻin sekin oʻqiladi.
// ============================================================
export async function boginQoshib(bogin, tovushlar, tezlik = 1, harakat) {
  const tanaffus = [600, 320, 120][Math.min(2, Math.max(0, tezlik - 1))];

  for (let i = 0; i < tovushlar.length; i++) {
    const t = tovushlar[i];
    if (harakat) harakat(i);
    // portlovchini yakka holda choʻzib boʻlmaydi — faqat yonadi, oʻqilmaydi
    if (portlovchimi(t) && !HARF_VAQT[t]) await kut(Math.max(280, tanaffus * 0.6));
    else { await harfOqi(t); await kut(tanaffus); }
  }
  if (harakat) harakat(-1);
  await boginOqi(bogin);
}

export function kut(ms) { return new Promise(r => setTimeout(r, ms)); }

document.addEventListener('touchstart', unlock, { once: true, passive: true });
document.addEventListener('click', unlock, { once: true });
