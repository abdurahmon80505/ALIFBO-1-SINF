// ============================================================
//  Telefon xotirasida ovoz saqlash (IndexedDB)
//  Ota-ona/aka oʻz ovozini yozadi — bola tanish ovozni eshitadi.
//  Internetsiz ishlaydi, telefondan chiqmaydi.
// ============================================================
const DB_NOM = 'alifbo-ovoz';
const DOKON = 'ovozlar';
let dbP = null;

function db() {
  if (dbP) return dbP;
  dbP = new Promise((yech, rad) => {
    const s = indexedDB.open(DB_NOM, 1);
    s.onupgradeneeded = () => {
      if (!s.result.objectStoreNames.contains(DOKON)) s.result.createObjectStore(DOKON);
    };
    s.onsuccess = () => yech(s.result);
    s.onerror = () => rad(s.error);
  });
  return dbP;
}

async function amal(rejim, fn) {
  const d = await db();
  return new Promise((yech, rad) => {
    const t = d.transaction(DOKON, rejim);
    const sorov = fn(t.objectStore(DOKON));
    sorov.onsuccess = () => yech(sorov.result);
    sorov.onerror = () => rad(sorov.error);
  });
}

export const ovozSaqla   = (kalit, blob) => amal('readwrite', s => s.put(blob, kalit));
export const ovozOl      = (kalit)       => amal('readonly',  s => s.get(kalit));
export const ovozOchir   = (kalit)       => amal('readwrite', s => s.delete(kalit));
export const kalitlar    = ()            => amal('readonly',  s => s.getAllKeys());
export const hammasiniOchir = ()         => amal('readwrite', s => s.clear());

// Tez ishlashi uchun: qaysi kalitlar borligini xotirada saqlaymiz
let bor = null;
export async function borlarniYukla() {
  try { bor = new Set(await kalitlar()); } catch (e) { bor = new Set(); }
  return bor;
}
export function ovozBormi(kalit) { return bor ? bor.has(kalit) : false; }
export function borgaQosh(kalit) { if (bor) bor.add(kalit); }
export function bordanOchir(kalit) { if (bor) bor.delete(kalit); }
