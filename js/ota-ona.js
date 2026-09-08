// ============================================================
//  OTA-ONA PANELI — bola qanday oʻqiyotganini koʻrsatadi
//  Maʼlumot ilova bilan bir joyda (localStorage), hech qayerga
//  yuborilmaydi — faqat siz "yuborish" tugmasini bossangiz.
// ============================================================
import { HARF_MAP, TARTIB_BOYICHA } from '../data/harflar.js';
import { DARSLAR_SONI } from '../data/darslar.js';

const KALIT = 'alifbo1sinf';
const $ = s => document.querySelector(s);
const el = (t, c, h) => { const d = document.createElement(t); if (c) d.className = c; if (h !== undefined) d.innerHTML = h; return d; };

let P = {};
try { P = JSON.parse(localStorage.getItem(KALIT) || '{}'); } catch (e) { P = {}; }
P.kunlar = P.kunlar || {}; P.xato = P.xato || {}; P.togri = P.togri || {};

const yozuv = h => h.kichik.length > 1 ? h.katta + ' ' + h.kichik : h.katta + h.kichik;
const bugun = () => new Date().toISOString().slice(0, 10);
const kunNomi = ['Yak', 'Du', 'Se', 'Cho', 'Pay', 'Ju', 'Sha'];

function saqla() { try { localStorage.setItem(KALIT, JSON.stringify(P)); } catch (e) {} }

function chiz() {
  const ich = $('#ich');
  ich.innerHTML = '';
  $('#ism').textContent = P.ism || 'Oʻquvchi';

  // ---- Asosiy raqamlar ----
  const bugungi = Math.round(P.kunlar[bugun()] || 0);
  const jami = Math.round(Object.values(P.kunlar).reduce((a, b) => a + b, 0));
  const k = el('div', 'katak4');
  [
    ['⏱', bugungi + ' daq', 'Bugun oʻqidi'],
    ['🔥', (P.seriya || 0) + ' kun', 'Ketma-ket'],
    ['📖', (P.dars || 1) + ' / ' + DARSLAR_SONI, 'Dars'],
    ['⭐', (P.yulduz || 0), 'Yulduz']
  ].forEach(([em, son, yor]) => {
    k.appendChild(el('div', 'katak', `<div class="son">${em} ${son}</div><div class="yor">${yor}</div>`));
  });
  ich.appendChild(k);

  // ---- 7 kunlik grafik ----
  const g = el('div', 'karta');
  g.innerHTML = `<div class="sarlavha">Soʻnggi 7 kun</div>
    <div class="izoh">Jami ${jami} daqiqa. Kuniga 10–15 daqiqa yetarli.</div>`;
  const grafik = el('div', 'grafik');
  const kunlar = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    kunlar.push([d.toISOString().slice(0, 10), kunNomi[d.getDay()]]);
  }
  const maxDaq = Math.max(10, ...kunlar.map(([s]) => P.kunlar[s] || 0));
  kunlar.forEach(([sana, nom]) => {
    const v = P.kunlar[sana] || 0;
    const u = el('div', 'ustun');
    u.innerHTML = `<b>${v ? Math.round(v) : ''}</b>
      <i class="${v ? '' : 'bosh'}" style="height:${Math.max(3, v / maxDaq * 82)}px"></i>
      <small>${nom}</small>`;
    grafik.appendChild(u);
  });
  g.appendChild(grafik);
  ich.appendChild(g);

  // ---- Qiyin harflar ----
  const baholar = TARTIB_BOYICHA
    .map(h => ({ h, x: P.xato[h.id] || 0, t: P.togri[h.id] || 0 }))
    .filter(o => o.x + o.t > 0);
  const qiyin = baholar.filter(o => o.x > 0).sort((a, b) => (b.x / (b.x + b.t)) - (a.x / (a.x + a.t))).slice(0, 8);
  const yaxshi = baholar.filter(o => o.t >= 2 && o.x === 0).slice(0, 8);

  const q = el('div', 'karta');
  q.innerHTML = `<div class="sarlavha">Harflar boʻyicha</div>`;
  if (!baholar.length) {
    q.appendChild(el('div', 'izoh', 'Hali test ishlanmagan. Bola bir-ikki dars oʻtsa, shu yerda qaysi harf qiyinligi koʻrinadi.'));
  } else {
    if (qiyin.length) {
      q.appendChild(el('div', 'izoh', '<b>Qiynalyapti</b> — shu harflarni birga takrorlang:'));
      const r = el('div', 'harflar');
      qiyin.forEach(o => r.appendChild(el('div', 'hbelgi yomon',
        `${yozuv(o.h)}<span>${o.x} xato / ${o.x + o.t}</span>`)));
      q.appendChild(r);
    }
    if (yaxshi.length) {
      q.appendChild(el('div', 'izoh', '<br><b>Yaxshi biladi:</b>'));
      const r2 = el('div', 'harflar');
      yaxshi.forEach(o => r2.appendChild(el('div', 'hbelgi yaxshi', `${yozuv(o.h)}<span>${o.t} ✓</span>`)));
      q.appendChild(r2);
    }
  }
  ich.appendChild(q);

  // ---- Telegram ----
  const t = el('div', 'karta');
  t.innerHTML = `<div class="sarlavha">Telegram hisobot</div>
    <div class="izoh">Har dars tugagach qisqa hisobot yuboriladi: nechanchi dars,
    necha daqiqa oʻqidi, qaysi harflar qiyin.</div>`;
  const qator = el('div', 'qator');
  qator.innerHTML = `<span>Avtomatik yuborish</span>`;
  const sw = el('button', 'tugma oq', P.avtoHisobot === false ? 'Oʻchiq' : 'Yoniq');
  sw.onclick = () => { P.avtoHisobot = !(P.avtoHisobot !== false); sw.textContent = P.avtoHisobot ? 'Yoniq' : 'Oʻchiq'; saqla(); };
  qator.appendChild(sw);
  t.appendChild(qator);
  const tg = el('div', 'tugmalar');
  const yubor = el('button', 'tugma yashil', '📤 Hozir yuborish');
  yubor.onclick = async () => {
    yubor.disabled = true; yubor.textContent = 'Yuborilmoqda…';
    const qiyinlar = qiyin.slice(0, 5).map(x => yozuv(x.h));
    const r = await fetch('/api/report', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ism: P.ism || 'Oʻquvchi', dars: P.dars || 1, yulduz: P.yulduz || 0,
        daqiqa: bugungi, qiyin: qiyinlar
      })
    }).then(x => x.json()).catch(() => ({ ok: false }));
    yubor.disabled = false;
    yubor.textContent = r.ok ? '✅ Yuborildi' : '⚠️ Yuborilmadi (sayt hali chiqmagan?)';
    setTimeout(() => { yubor.textContent = '📤 Hozir yuborish'; }, 3000);
  };
  tg.appendChild(yubor);
  t.appendChild(tg);
  ich.appendChild(t);

  // ---- Maslahatlar ----
  const m = el('div', 'karta');
  m.innerHTML = `<div class="sarlavha">Qanday yordam berish kerak</div>`;
  [
    '<b>Harf nomini emas, tovushini</b> ayting. "be" emas — "b". Aks holda bola "b-a" ni "bea" deb oʻqiydi.',
    '<b>Boʻgʻin — eng muhimi.</b> Bola harflarni bilsa ham qoʻsha olmasa, oʻqiy olmaydi. Har kuni boʻgʻin mashqini takrorlang.',
    '<b>Kuniga 10–15 daqiqa</b> — 1 soatlik mashgʻulotdan yaxshiroq. Har kuni bir vaqtda.',
    '<b>Xato qilsa tuzatmang darrov.</b> 3 soniya kutib turing — koʻpincha oʻzi tuzatadi.',
    '<b>Telefon ovozini sozlang.</b> Sozlamalar → Talaffuz ovozi: ruscha yoki turkcha ovoz oʻzbekchaga eng yaqin chiqadi.'
  ].forEach(x => m.appendChild(el('div', 'maslahat', x)));
  ich.appendChild(m);
}

chiz();
