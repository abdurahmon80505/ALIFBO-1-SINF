// ============================================================
//  BOʻGʻINLAR — oʻqishni oʻrganishning ENG MUHIM qismi
//  Bola harflarni bilsa ham, ularni QOʻSHIB oʻqiy olmasa — oʻqiy olmaydi.
//  Shu sababli har darsda: yangi undosh × oʻrganilgan unlilar.
// ============================================================
import { HARF_MAP, UNLILAR } from './harflar.js';

// Boʻgʻin turlari
export const TURLAR = {
  ochiq:  'CV',   // ma, mo, mi  — eng oson, birinchi oʻrgatiladi
  yopiq:  'VC',   // am, om, im  — teskari boʻgʻin
  toliq:  'CVC'   // mam, non, tol — toʻliq boʻgʻin
};

// Undosh + unli: ma, mo, mi, mu, me, moʻ
export function ochiqBoginlar(undosh, unlilar = UNLILAR) {
  return unlilar.map(u => undosh + u);
}

// Unli + undosh: am, om, im, um, em, oʻm
export function yopiqBoginlar(undosh, unlilar = UNLILAR) {
  return unlilar.map(u => u + undosh);
}

// Toʻliq boʻgʻin: mam, mom, ... (bir xil undosh ikki tomonda)
export function toliqBoginlar(undosh, unlilar = UNLILAR) {
  return unlilar.map(u => undosh + u + undosh);
}

// Ikki undoshni aralashtirib mashq qilish: ma-na, mo-no, ...
export function juftBoginlar(undosh1, undosh2, unlilar = UNLILAR) {
  return unlilar.map(u => [undosh1 + u, undosh2 + u]);
}

// Dars uchun toʻliq boʻgʻin jadvali tayyorlash
export function boginJadvali(undosh, ochilganUnlilar) {
  const unlilar = ochilganUnlilar.filter(u => UNLILAR.includes(u));
  return {
    undosh,
    unlilar,
    ochiq: ochiqBoginlar(undosh, unlilar),
    yopiq: yopiqBoginlar(undosh, unlilar),
    toliq: toliqBoginlar(undosh, unlilar)
  };
}

// Boʻgʻinni tovushlarga ajratib "choʻzib oʻqish" uchun: 'ma' -> ['m','a']
export function boginTovushlari(bogin) {
  const harflar = [];
  let i = 0;
  const s = bogin;
  while (i < s.length) {
    const ikki = s.slice(i, i + 2);
    if (HARF_MAP[ikki]) { harflar.push(ikki); i += 2; continue; }
    harflar.push(s[i]); i += 1;
  }
  return harflar;
}
