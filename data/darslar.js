// ============================================================
//  DARSLAR — 30 ta dars (har bir harfga bittadan)
//  Dars avtomatik quriladi: yangi harf + shu paytgacha oʻrganilganlari.
//  Har dars 5 qadam:
//    1) Harf bilan tanishish  (koʻrish + eshitish)
//    2) Boʻgʻin qoʻshish      (ma, mo, mi...)  ← eng muhimi
//    3) Soʻz oʻqish           (boʻgʻinlab)
//    4) Gap oʻqish
//    5) Mustahkamlash oʻyini
// ============================================================
import { TARTIB_BOYICHA, HARF_MAP } from './harflar.js';
import { SOZLAR } from './sozlar.js';
import { GAPLAR } from './gaplar.js';
import { boginJadvali } from './boginlar.js';
import { tokenla } from '../js/uz.js';

export const QADAMLAR = [
  { id: 'tanish', nom: 'Tanishamiz',  emoji: '👀', izoh: 'Harfni koʻramiz va eshitamiz' },
  { id: 'bogin',  nom: 'Boʻgʻinlar',  emoji: '🔗', izoh: 'Harflarni qoʻshib oʻqiymiz' },
  { id: 'soz',    nom: 'Soʻzlar',     emoji: '📖', izoh: 'Boʻgʻinlardan soʻz yigʻamiz' },
  { id: 'gap',    nom: 'Gaplar',      emoji: '💬', izoh: 'Gapni oʻqiymiz' },
  { id: 'oyin',   nom: 'Oʻyin',       emoji: '🎮', izoh: 'Oʻrganganimizni tekshiramiz' }
];

// N-darsgacha oʻrganilgan harflar roʻyxati
export function ochilganHarflar(darsRaqami) {
  return TARTIB_BOYICHA.filter(h => h.tartib <= darsRaqami).map(h => h.id);
}

// Faqat oʻrganilgan harflardan tuzilgan soʻzlar
export function mumkinSozlar(darsRaqami, maxDaraja = 3) {
  const bor = new Set(ochilganHarflar(darsRaqami));
  return SOZLAR.filter(s =>
    s.daraja <= maxDaraja && tokenla(s.soz).every(h => bor.has(h))
  );
}

// Faqat oʻrganilgan harflardan tuzilgan gaplar
export function mumkinGaplar(darsRaqami) {
  const bor = new Set(ochilganHarflar(darsRaqami));
  return GAPLAR.filter(g =>
    tokenla(g.gap.replace(/[.,!?]/g, '')).every(h => bor.has(h))
  );
}

// Bitta darsni toʻliq yigʻish
export function darsYasa(darsRaqami) {
  const harf = TARTIB_BOYICHA.find(h => h.tartib === darsRaqami);
  if (!harf) return null;

  const ochilgan = ochilganHarflar(darsRaqami);
  const unlilar  = ochilgan.filter(id => HARF_MAP[id].tip === 'unli');

  // Unli harf darsi boʻlsa — oldin oʻrganilgan undoshlar bilan boʻgʻin tuzamiz
  const undoshlar = ochilgan.filter(id => HARF_MAP[id].tip === 'undosh');
  const boginUchun = harf.tip === 'undosh' ? [harf.id] : undoshlar.slice(-3);

  return {
    raqam: darsRaqami,
    harf,
    ochilgan,
    jadvallar: boginUchun.map(u => boginJadvali(u, unlilar)),
    // Yangi harf qatnashgan soʻzlar birinchi turadi, keyin osondan qiyinga
    sozlar: mumkinSozlar(darsRaqami)
      .sort((a, b) => {
        const aY = tokenla(a.soz).includes(harf.id) ? 0 : 1;
        const bY = tokenla(b.soz).includes(harf.id) ? 0 : 1;
        return aY - bY || a.daraja - b.daraja;
      })
      .slice(0, 8),
    yangiSozlar: harf.sozlar,
    gaplar: mumkinGaplar(darsRaqami).slice(0, 3),
    qadamlar: QADAMLAR
  };
}

export const DARSLAR_SONI = TARTIB_BOYICHA.length;
