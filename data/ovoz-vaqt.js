// ============================================================
//  OVOZ VAQTLARI (audio sprite)
//  Bitta MP3 fayl — har bir harf/boʻgʻin uchun [boshlanish, tugash] soniya.
//  Arab harflari saytidagi tizimning aynan oʻzi.
//
//  MP3 kelgach bu jadval AVTOMATIK toʻldiriladi (sukunatlarni aniqlash orqali).
//  Fayl: audio/alifbo.mp3
// ============================================================

export const OVOZ_FAYL = 'audio/alifbo.mp3';

// Harf tovushlari: { 'a': [0.00, 0.95], 'b': [1.20, 2.05], ... }
export const HARF_VAQT = {};

// Boʻgʻin tovushlari (agar alohida yozilgan boʻlsa): { 'ma': [..], 'mo': [..] }
export const BOGIN_VAQT = {};

// Soʻz tovushlari: { 'ona': [..], 'olma': [..] }
export const SOZ_VAQT = {};

// Ovoz hali yuklanmaganini bilish uchun
export const OVOZ_TAYYORMI = Object.keys(HARF_VAQT).length > 0;
