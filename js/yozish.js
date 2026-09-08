// ============================================================
//  OVOZ STUDIYASI
//  Telefon mikrofonidan har bir element alohida yoziladi va
//  IndexedDB ga saqlanadi. Kesish, tahrirlash kerak emas.
// ============================================================
import { TARTIB_BOYICHA, UNLILAR, HARF_MAP } from '../data/harflar.js';
import { SOZLAR } from '../data/sozlar.js';
import * as db from './db.js';

const $ = s => document.querySelector(s);
let joriyBolim = 'harf';
let yozuvchi = null, oqim = null, yozilayotgan = null;

// ---------- Roʻyxatlar ----------
function elementlar(bolim) {
  if (bolim === 'harf') {
    return TARTIB_BOYICHA.map(h => ({
      kalit: 'h:' + h.id, nom: h.kichik.length > 1 ? h.katta + ' ' + h.kichik : h.katta + h.kichik,
      ayt: h.kichik, izoh: h.talaffuz
    }));
  }
  if (bolim === 'bogin') {
    const r = [];
    TARTIB_BOYICHA.filter(h => h.tip === 'undosh').forEach(u =>
      UNLILAR.forEach(v => r.push({ kalit: 'b:' + u.id + v, nom: u.id + v, ayt: u.id + v, izoh: 'sekin, aniq' })));
    return r;
  }
  return SOZLAR.map(s => ({ kalit: 's:' + s.soz, nom: s.soz, ayt: s.soz, izoh: s.bogin.join('-') + ' ' + s.emoji }));
}

// ---------- Mikrofon ----------
function turi() {
  const variantlar = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
  return variantlar.find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
}

async function mikrofon() {
  if (oqim) return oqim;
  oqim = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
  });
  return oqim;
}

async function yozishniBoshla(kalit) {
  const s = await mikrofon();
  const bolaklar = [];
  const t = turi();
  yozuvchi = new MediaRecorder(s, t ? { mimeType: t } : undefined);
  yozuvchi.ondataavailable = e => { if (e.data.size) bolaklar.push(e.data); };
  yozilayotgan = kalit;
  return new Promise(yech => {
    yozuvchi.onstop = async () => {
      const blob = new Blob(bolaklar, { type: yozuvchi.mimeType || 'audio/webm' });
      if (blob.size > 800) {           // juda qisqa/boʻsh yozuvni saqlamaymiz
        await db.ovozSaqla(kalit, blob);
        db.borgaQosh(kalit);
      }
      yozuvchi = null; yozilayotgan = null;
      yech(blob.size > 800);
    };
    yozuvchi.start();
  });
}

function yozishniToxtat() { if (yozuvchi && yozuvchi.state !== 'inactive') yozuvchi.stop(); }

async function ijro(kalit) {
  const blob = await db.ovozOl(kalit);
  if (!blob) return;
  const u = URL.createObjectURL(blob);
  const a = new Audio(u);
  a.onended = () => URL.revokeObjectURL(u);
  a.play().catch(() => {});
}

// ---------- Roʻyxatni chizish ----------
function chiz() {
  const box = $('#royxat');
  const ro = elementlar(joriyBolim);
  box.innerHTML = '';
  ro.forEach(e => {
    const q = document.createElement('div');
    q.className = 'yqator' + (db.ovozBormi(e.kalit) ? ' bor' : '');
    q.innerHTML = `<div class="nom">${e.nom}</div><div class="izo">${e.izoh}</div>`;
    const amal = document.createElement('div');
    amal.className = 'amal';

    const yoz = document.createElement('button');
    yoz.className = 'kbtn yoz'; yoz.textContent = '🎙';
    yoz.onclick = async () => {
      if (yozilayotgan === e.kalit) { yozishniToxtat(); return; }
      if (yozilayotgan) return;
      yoz.classList.add('yozilyapti'); yoz.textContent = '⏹';
      const ok = await yozishniBoshla(e.kalit);
      yoz.classList.remove('yozilyapti'); yoz.textContent = '🎙';
      if (ok) { q.classList.add('bor'); hisobla(); }
    };

    const eshit = document.createElement('button');
    eshit.className = 'kbtn'; eshit.textContent = '▶';
    eshit.onclick = () => ijro(e.kalit);

    const ochir = document.createElement('button');
    ochir.className = 'kbtn'; ochir.textContent = '🗑';
    ochir.onclick = async () => {
      await db.ovozOchir(e.kalit); db.bordanOchir(e.kalit);
      q.classList.remove('bor'); hisobla();
    };

    amal.append(yoz, eshit, ochir);
    q.appendChild(amal);
    box.appendChild(q);
  });
  hisobla();
}

function hisobla() {
  const ro = elementlar(joriyBolim);
  const bor = ro.filter(e => db.ovozBormi(e.kalit)).length;
  $('#hisob').textContent = bor + ' / ' + ro.length;
}

// ---------- Ketma-ket rejim ----------
let ketmaRo = [], ketmaI = 0, ketmaHolat = 'kut';

function ketmaBoshla() {
  ketmaRo = elementlar(joriyBolim).filter(e => !db.ovozBormi(e.kalit));
  if (!ketmaRo.length) { alert('Bu boʻlimdagi hamma ovoz yozilgan ✅'); return; }
  ketmaI = 0; ketmaHolat = 'kut';
  $('#kattaYoz').classList.add('ochiq');
  ketmaChiz();
}
function ketmaChiz() {
  const e = ketmaRo[ketmaI];
  if (!e) { ketmaYop(); return; }
  $('#kyHisob').textContent = (ketmaI + 1) + ' / ' + ketmaRo.length;
  $('#kyHarf').textContent = e.nom;
  $('#kyIzoh').textContent = e.izoh;
  $('#kyTugma').textContent = ketmaHolat === 'yoz' ? '⏹' : '🎙';
  $('#kyTugma').classList.toggle('yozilyapti', ketmaHolat === 'yoz');
}
async function ketmaBos() {
  const e = ketmaRo[ketmaI];
  if (ketmaHolat === 'kut') {
    ketmaHolat = 'yoz'; ketmaChiz();
    const ok = await yozishniBoshla(e.kalit);
    ketmaHolat = 'kut';
    if (ok) { ketmaI++; }
    ketmaChiz(); hisobla();
  } else {
    yozishniToxtat();
  }
}
function ketmaYop() {
  yozishniToxtat();
  $('#kattaYoz').classList.remove('ochiq');
  chiz();
}

// ---------- Ishga tushirish ----------
document.querySelectorAll('.bolim button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.bolim button').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); joriyBolim = b.dataset.b; chiz();
  };
});
$('#btnKetma').onclick = ketmaBoshla;
$('#kyTugma').onclick = ketmaBos;
$('#kyYop').onclick = ketmaYop;
$('#kyOtkaz').onclick = () => { ketmaI++; ketmaChiz(); };
$('#btnOchir').onclick = async () => {
  if (confirm('Yozilgan hamma ovoz oʻchiriladi. Rozimisiz?')) {
    await db.hammasiniOchir(); await db.borlarniYukla(); chiz();
  }
};

(async () => {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    $('#ogoh').innerHTML = '<div class="ogoh">⚠️ Bu brauzer ovoz yozishni qoʻllab-quvvatlamaydi. ' +
      'Chrome yoki Safari da oching. Sayt <b>https</b> boʻlishi shart.</div>';
  }
  await db.borlarniYukla();
  chiz();
})();
