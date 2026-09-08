// ============================================================
//  Oʻzbek tili yordamchi funksiyalari
//  Asosiy vazifa: soʻzni HARFLARGA toʻgʻri ajratish.
//  "shakar" = sh + a + k + a + r  (6 ta emas, 6 ta harf-tovush)
// ============================================================

// Qoʻsh harflar — avval shular tekshiriladi (uzunroq mos keladi)
export const QOSH_HARFLAR = ['sh', 'ch', 'ng', 'oʻ', 'gʻ'];

// Turli klaviaturalarda turlicha yoziladigan apostroflarni bittaga keltiramiz
export function normalize(matn) {
  return String(matn)
    .replace(/[‘'`´ʼ']/g, 'ʻ')   // oʻ / gʻ uchun
    .replace(/[""«»]/g, '"')
    .toLowerCase();
}

// Tutuq belgisi (ʼ) va oʻ/gʻ belgisi (ʻ) ni farqlash kerak boʻlsa:
// oʻ va gʻ dan keyin kelsa — bu qoʻsh harf, aks holda tutuq belgisi.
export function tokenla(soz) {
  const s = normalize(soz);
  const natija = [];
  let i = 0;
  while (i < s.length) {
    const ikki = s.slice(i, i + 2);
    if (QOSH_HARFLAR.includes(ikki)) { natija.push(ikki); i += 2; continue; }
    const belgi = s[i];
    // oʻ/gʻ tarkibida boʻlmagan belgi — bu TUTUQ BELGISI (maʼno, taʼlim)
    if (belgi === 'ʻ') { natija.push('ʼ'); i++; continue; }
    if (belgi === ' ' || belgi === '-') { i++; continue; }
    natija.push(belgi);
    i++;
  }
  return natija;
}

// Soʻzda faqat berilgan harflar ishlatilganmi? (oʻrganilgan harflar filtri)
export function faqatShuHarflardanmi(soz, harflar) {
  const bor = new Set(harflar);
  return tokenla(soz).every(h => bor.has(h) || h === 'ʼ');
}

// Soʻzdagi harflar soni (qoʻsh harf = 1 ta)
export function harfSoni(soz) { return tokenla(soz).length; }

// Katta harf bilan yozish: "sh" -> "Sh", "oʻ" -> "Oʻ"
export function kattalashtir(harf) {
  return harf.charAt(0).toUpperCase() + harf.slice(1);
}

// Roʻyxatni aralashtirish (Fisher-Yates)
export function aralashtir(royxat) {
  const a = royxat.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Roʻyxatdan tasodifiy n ta element (bittasini chiqarib tashlab)
export function tasodifiy(royxat, n, chiqarib) {
  return aralashtir(royxat.filter(x => x !== chiqarib)).slice(0, n);
}
