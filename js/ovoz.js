// ============================================================
//  OVOZ TIZIMI
//  1) Asosiy usul: bitta MP3 (audio sprite) — tez, internetsiz ishlaydi
//  2) Zaxira usul: brauzer ovozi (Web Speech) — MP3 hali yoʻq boʻlsa
//
//  Telefonlarda ovoz faqat foydalanuvchi ekranga tekkanidan keyin
//  ishga tushadi — shuning uchun "unlock" qilamiz.
// ============================================================
import { OVOZ_FAYL, HARF_VAQT, BOGIN_VAQT, SOZ_VAQT } from '../data/ovoz-vaqt.js';

let audio = null;
let tayyor = false;
let raf = null, tmr = null;
let joriyTugash = 0;

export function ovozniTayyorla() {
  if (audio) return audio;
  audio = new Audio(OVOZ_FAYL);
  audio.preload = 'auto';
  audio.playsInline = true;
  return audio;
}

// Birinchi teginishda telefon ovozini "ochish"
export function unlock() {
  if (tayyor) return;
  tayyor = true;
  const a = ovozniTayyorla();
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

// Sprite'dan bitta boʻlakni ijro etish. Tugagach Promise qaytaradi.
function spriteIjro(vaqt) {
  return new Promise(resolve => {
    const a = ovozniTayyorla();
    const [boshi, oxiri] = vaqt;
    joriyTugash = oxiri;
    toxtat();

    let t0 = 0;
    const kuzat = () => {
      if (a.currentTime >= joriyTugash || Date.now() - t0 > 7000) {
        try { a.pause(); } catch (e) {}
        raf = null;
        resolve();
        return;
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

// Zaxira: brauzer ovozi. Oʻzbekcha ovoz koʻp telefonlarda yoʻq —
// bor boʻlsa uz, boʻlmasa ru (talaffuzi oʻzbekchaga yaqinroq), keyin har qanday.
let tanlanganOvoz = null;
function brauzerOvozi() {
  if (tanlanganOvoz !== null) return tanlanganOvoz;
  let ovozlar = [];
  try { ovozlar = speechSynthesis.getVoices() || []; } catch (e) {}
  tanlanganOvoz =
    ovozlar.find(v => /^uz/i.test(v.lang)) ||
    ovozlar.find(v => /^ru/i.test(v.lang)) ||
    ovozlar.find(v => /^tr/i.test(v.lang)) ||
    ovozlar[0] || null;
  return tanlanganOvoz;
}

function gapir(matn, tezlik = 0.75) {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window)) { resolve(); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(matn);
      const v = brauzerOvozi();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = tezlik;
      u.onend = resolve;
      u.onerror = resolve;
      speechSynthesis.speak(u);
      setTimeout(resolve, 3000); // qotib qolmasin
    } catch (e) { resolve(); }
  });
}

// ---- TASHQARIGA CHIQADIGAN FUNKSIYALAR ----

export function harfOqi(harfId) {
  if (HARF_VAQT[harfId]) return spriteIjro(HARF_VAQT[harfId]);
  return gapir(harfId, 0.7);
}

export function boginOqi(bogin) {
  if (BOGIN_VAQT[bogin]) return spriteIjro(BOGIN_VAQT[bogin]);
  return gapir(bogin, 0.7);
}

export function sozOqi(soz) {
  if (SOZ_VAQT[soz]) return spriteIjro(SOZ_VAQT[soz]);
  return gapir(soz, 0.8);
}

// Boʻgʻinni QOʻSHIB oʻqish mashqi: m ... a ... ma
// tezlik: 1 = sekin (600ms tanaffus), 3 = tez (120ms)
export async function boginQoshib(bogin, tovushlar, tezlik = 1, harakat) {
  const tanaffus = [600, 320, 120][Math.min(2, Math.max(0, tezlik - 1))];
  for (let i = 0; i < tovushlar.length; i++) {
    if (harakat) harakat(i);           // ekranda shu tovushni yoritish uchun
    await harfOqi(tovushlar[i]);
    await kut(tanaffus);
  }
  if (harakat) harakat(-1);            // endi butun boʻgʻin
  await boginOqi(bogin);
}

export function kut(ms) { return new Promise(r => setTimeout(r, ms)); }

export function ovozBormi() {
  return Object.keys(HARF_VAQT).length > 0;
}

document.addEventListener('touchstart', unlock, { once: true, passive: true });
document.addEventListener('click', unlock, { once: true });
