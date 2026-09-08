// ============================================================
//  ALIFBO — 1-sinf  |  Asosiy dastur
// ============================================================
import { HARFLAR, TARTIB_BOYICHA, HARF_MAP, BOSQICHLAR } from '../data/harflar.js';
import { darsYasa, DARSLAR_SONI, QADAMLAR, ochilganHarflar } from '../data/darslar.js';
import { boginTovushlari } from '../data/boginlar.js';
import * as ovoz from './ovoz.js';
import { aralashtir, tasodifiy, kattalashtir, tokenla } from './uz.js';

// ---------- PROGRESS (telefon xotirasida) ----------
const KALIT = 'alifbo1sinf';
const boshlangich = {
  dars: 1, yulduz: 0, korilgan: [], avto: true, ism: '',
  kunlar: {},        // { '2026-09-08': 12.5 }  — kuniga necha daqiqa
  xato: {},          // { 'q': 3 }  — qaysi harfda necha marta adashdi
  togri: {},         // { 'q': 7 }
  seriya: 0,         // ketma-ket necha kun oʻqidi
  oxirgiKun: '',
  avtoHisobot: true  // dars tugagach Telegramga yuborish
};
let P = yukla();

function yukla() {
  try { return Object.assign({}, boshlangich, JSON.parse(localStorage.getItem(KALIT) || '{}')); }
  catch (e) { return Object.assign({}, boshlangich); }
}
function saqla() {
  try { localStorage.setItem(KALIT, JSON.stringify(P)); } catch (e) {}
  yangilaTepa();
}
function bugun() { return new Date().toISOString().slice(0, 10); }
function kunQoshi(daqiqa = 1) {
  P.kunlar[bugun()] = Math.round(((P.kunlar[bugun()] || 0) + daqiqa) * 10) / 10;
}

// Ketma-ket kunlar seriyasini yangilash
function seriyaniYangila() {
  const b = bugun();
  if (P.oxirgiKun === b) return;
  const kecha = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  P.seriya = (P.oxirgiKun === kecha) ? (P.seriya || 0) + 1 : 1;
  P.oxirgiKun = b;
  saqla();
}

// Har 30 soniyada yarim daqiqa qoʻshamiz (ilova ochiq va koʻrinib turgan boʻlsa)
setInterval(() => {
  if (document.visibilityState === 'visible') { kunQoshi(0.5); saqla(); }
}, 30000);

// ---------- YORDAMCHI ----------
const $ = s => document.querySelector(s);
const el = (tag, sinf, ich) => {
  const d = document.createElement(tag);
  if (sinf) d.className = sinf;
  if (ich !== undefined) d.innerHTML = ich;
  return d;
};
function rang(harf) { return BOSQICHLAR[harf.bosqich - 1].rang; }
// "Aa" lekin "Ch ch", "Oʻ oʻ" — qoʻsh harflar ajratib yoziladi
function yozuv(h) { return h.kichik.length > 1 ? h.katta + ' ' + h.kichik : h.katta + h.kichik; }

function yangilaTepa() {
  $('#yulduzlar').textContent = '⭐ ' + P.yulduz;
  const sd = $('#sozDars'), sy = $('#sozYulduz');
  if (sd) sd.textContent = P.dars;
  if (sy) sy.textContent = P.yulduz;
}

// ============================================================
//  ALIFBO BOʻLIMI
// ============================================================
function korsatAlifbo() {
  const v = $('#v-alifbo');
  v.innerHTML = '';
  v.className = 'kirish';

  const salom = el('div', 'karta');
  salom.innerHTML = `
    <div class="sarlavha">${P.ism ? 'Salom, ' + P.ism + '! 👋' : 'Oʻzbek alifbosi 🇺🇿'}</div>
    <div class="izoh">29 ta harf va tutuq belgisi. Harfni bosing — uning
    <b>tovushini</b> eshitasiz va u bilan boshlanadigan soʻzlarni koʻrasiz.</div>`;
  const qoshiqBtn = el('div', 'tugmalar');
  const bQ = el('button', 'tugma', '🎵 Alifbo qoʻshigʻi');
  bQ.onclick = qoshiqIjro;
  qoshiqBtn.appendChild(bQ);
  salom.appendChild(qoshiqBtn);
  v.appendChild(salom);

  BOSQICHLAR.forEach(b => {
    const sarlavha = el('div', 'bosqich-nom');
    sarlavha.innerHTML = `<i style="background:${b.rang}"></i>${b.nom}<small>${b.izoh}</small>`;
    v.appendChild(sarlavha);

    const tor = el('div', 'tor');
    TARTIB_BOYICHA.filter(h => h.bosqich === b.raqam).forEach(h => {
      const k = el('button', 'hkarta');
      if (P.korilgan.includes(h.id)) k.classList.add('bajarildi');
      k.style.color = b.rang;
      k.innerHTML = `${yozuv(h)}<small>${h.tovush}</small>`;
      k.onclick = () => harfSahifasi(h.id);
      tor.appendChild(k);
    });
    v.appendChild(tor);
  });
}

// ---------- Bitta harf sahifasi ----------
function harfSahifasi(id) {
  const h = HARF_MAP[id];
  if (!P.korilgan.includes(id)) { P.korilgan.push(id); saqla(); }

  const v = $('#v-alifbo');
  v.innerHTML = '';
  v.className = 'kirish';

  const orqaga = el('button', 'tugma oq', '← Alifboga qaytish');
  orqaga.style.marginBottom = '12px';
  orqaga.onclick = korsatAlifbo;
  v.appendChild(orqaga);

  const karta = el('div', 'karta');
  karta.innerHTML = `
    <div class="harf-bosh">
      <div class="katta-harf" style="background:${rang(h)}">${yozuv(h)}</div>
      <div class="harf-info">
        <div class="tovush-belgi">${h.tovush}</div>
        <div class="izoh">${h.talaffuz}</div>
      </div>
    </div>`;
  const tugmalar = el('div', 'tugmalar');
  const btnEshit = el('button', 'tugma', '🔊 Eshitish');
  btnEshit.onclick = () => ovoz.harfOqi(h.id);
  tugmalar.appendChild(btnEshit);
  if (h.tip !== 'belgi') {
    const btnBogin = el('button', 'tugma yashil', '🔗 Boʻgʻin mashqi');
    btnBogin.onclick = () => boginMashqi(h.id, () => harfSahifasi(id));
    tugmalar.appendChild(btnBogin);
  }
  karta.appendChild(tugmalar);
  if (h.eslatma) {
    const og = el('div', 'ogoh', '💡 ' + h.eslatma);
    og.style.marginTop = '12px';
    karta.appendChild(og);
  }
  v.appendChild(karta);

  const sozKarta = el('div', 'karta');
  sozKarta.innerHTML = `<div class="sarlavha">${h.katta}${h.kichik} bilan boshlanadigan soʻzlar</div>`;
  sozKarta.appendChild(sozTori(h.sozlar, v, () => harfSahifasi(id)));
  v.appendChild(sozKarta);
}

function sozTori(sozlar, joy, orqagaFn) {
  const tor = el('div', 'soz-tor');
  sozlar.forEach(s => {
    const k = el('button', 'soz-karta');
    k.innerHTML = `<div class="em">${s.emoji}</div><div class="nm">${s.soz}</div>`;
    k.onclick = () => sozOqish(s, joy || $('#v-alifbo'), orqagaFn || korsatAlifbo);
    tor.appendChild(k);
  });
  return tor;
}

// ============================================================
//  BOʻGʻIN MASHQI — ilovaning eng muhim qismi
// ============================================================
let tezlik = 1;

function boginMashqi(undoshId, orqagaFn, joy) {
  const h = HARF_MAP[undoshId];
  const unlilar = HARFLAR.filter(x => x.tip === 'unli').map(x => x.id);
  const boginlar = unlilar.map(u => undoshId + u);
  const v = joy || $('#v-alifbo');
  v.innerHTML = '';
  v.className = 'kirish';

  if (orqagaFn) {
    const orqaga = el('button', 'tugma oq', '← Orqaga');
    orqaga.style.marginBottom = '12px';
    orqaga.onclick = orqagaFn;
    v.appendChild(orqaga);
  }

  const sahna = el('div', 'bogin-sahna');
  sahna.innerHTML = `<div class="izoh">Boʻgʻinni bosing — tovushlar qoʻshilishini koʻrasiz</div>
    <div class="bogin-tovushlar" id="sahnaTovush"><span>${h.kichik}</span><span>a</span></div>`;
  const tezPanel = el('div', 'tezlik');
  ['🐢 Sekin', '🚶 Oʻrtacha', '🐇 Tez'].forEach((nom, i) => {
    const b = el('button', i + 1 === tezlik ? 'on' : '', nom);
    b.onclick = () => { tezlik = i + 1; [...tezPanel.children].forEach((c, j) => c.classList.toggle('on', j === i)); };
    tezPanel.appendChild(b);
  });
  sahna.appendChild(tezPanel);
  v.appendChild(sahna);

  const karta = el('div', 'karta');
  karta.innerHTML = `<div class="sarlavha">${yozuv(h)} + unli</div>
    <div class="izoh" style="margin-bottom:12px">Har bir katakni bosib oʻqing. Oʻqiganingiz yashil boʻladi.</div>`;
  const tor = el('div', 'bogin-tor');
  boginlar.forEach(b => {
    const k = el('button', 'bogin-katak', b);
    k.onclick = async () => { await ijroBogin(b); k.classList.add('oqildi'); };
    tor.appendChild(k);
  });
  karta.appendChild(tor);
  v.appendChild(karta);

  // teskari boʻgʻinlar: am, om, im...
  const karta2 = el('div', 'karta');
  karta2.innerHTML = `<div class="sarlavha">Unli + ${yozuv(h)}</div>
    <div class="izoh" style="margin-bottom:12px">Endi teskarisi — bu qiyinroq.</div>`;
  const tor2 = el('div', 'bogin-tor');
  unlilar.map(u => u + undoshId).forEach(b => {
    const k = el('button', 'bogin-katak', b);
    k.onclick = async () => { await ijroBogin(b); k.classList.add('oqildi'); };
    tor2.appendChild(k);
  });
  karta2.appendChild(tor2);
  v.appendChild(karta2);
}

// Boʻgʻinni sahnada "qoʻshib" koʻrsatish: m … a … → ma
async function ijroBogin(bogin) {
  const sahna = $('#sahnaTovush');
  const tovushlar = boginTovushlari(bogin);
  if (sahna) {
    sahna.classList.remove('qoshildi');
    sahna.innerHTML = tovushlar.map(t => `<span>${t}</span>`).join('');
  }
  await ovoz.boginQoshib(bogin, tovushlar, tezlik, i => {
    if (!sahna) return;
    [...sahna.children].forEach((c, j) => c.classList.toggle('faol', j === i));
    if (i === -1) { sahna.classList.add('qoshildi'); [...sahna.children].forEach(c => c.classList.remove('faol')); }
  });
}

// ---------- Soʻzni boʻgʻinlab oʻqish ----------
async function sozOqish(s, joy, orqagaFn) {
  const v = joy || $('#v-alifbo');
  v.innerHTML = '';
  v.className = 'kirish';
  $('#pastki').classList.add('hidden');

  const orqaga = el('button', 'tugma oq', '← Orqaga');
  orqaga.style.marginBottom = '12px';
  orqaga.onclick = orqagaFn || korsatAlifbo;
  v.appendChild(orqaga);

  const karta = el('div', 'karta soz-oqish');
  karta.innerHTML = `<div class="soz-emoji">${s.emoji}</div>
    <div class="soz-boginlar" id="sozBogin">${s.bogin.map(b => `<b>${b}</b>`).join('')}</div>`;
  const tugmalar = el('div', 'tugmalar');
  tugmalar.style.justifyContent = 'center';
  const b1 = el('button', 'tugma', '🐢 Boʻgʻinlab');
  b1.onclick = () => sozIjro(s, 700);
  const b2 = el('button', 'tugma yashil', '🐇 Butun soʻz');
  b2.onclick = () => ovoz.sozOqi(s.soz);
  tugmalar.append(b1, b2);
  karta.appendChild(tugmalar);
  v.appendChild(karta);

  sozIjro(s, 700);
}

async function sozIjro(s, tanaffus) {
  const box = $('#sozBogin');
  for (let i = 0; i < s.bogin.length; i++) {
    if (box) [...box.children].forEach((c, j) => c.classList.toggle('faol', j === i));
    await ovoz.boginOqi(s.bogin[i]);
    await ovoz.kut(tanaffus);
  }
  if (box) [...box.children].forEach(c => c.classList.remove('faol'));
  await ovoz.sozOqi(s.soz);
}

// ============================================================
//  DARS BOʻLIMI
// ============================================================
let joriyQadam = 0;

function korsatDars() {
  const v = $('#v-dars');
  const d = darsYasa(P.dars);
  v.innerHTML = '';
  v.className = 'kirish';

  const bosh = el('div', 'karta');
  bosh.innerHTML = `
    <div class="dars-bosh">
      <span class="dars-raqam">${P.dars}-dars / ${DARSLAR_SONI}</span>
      <span class="dars-raqam">${QADAMLAR[joriyQadam].nom}</span>
    </div>
    <div class="progress"><i style="width:${((joriyQadam) / QADAMLAR.length) * 100}%"></i></div>`;
  const qadamlar = el('div', 'qadamlar');
  QADAMLAR.forEach((q, i) => {
    const k = el('button', 'qadam' + (i === joriyQadam ? ' on' : (i < joriyQadam ? ' tugadi' : '')));
    k.innerHTML = `<span class="em">${q.emoji}</span>${q.nom}`;
    k.onclick = () => { joriyQadam = i; korsatDars(); };
    qadamlar.appendChild(k);
  });
  bosh.appendChild(qadamlar);
  v.appendChild(bosh);

  const ich = el('div');
  v.appendChild(ich);
  qadamChiz(d, ich);
  pastkiTugmalar(d);
}

function qadamChiz(d, ich) {
  const h = d.harf;
  const qadam = QADAMLAR[joriyQadam].id;

  if (qadam === 'tanish') {
    const karta = el('div', 'karta');
    karta.innerHTML = `
      <div class="harf-bosh">
        <div class="katta-harf" style="background:${rang(h)}">${yozuv(h)}</div>
        <div class="harf-info">
          <div class="tovush-belgi">${h.tovush}</div>
          <div class="izoh">${h.talaffuz}</div>
        </div>
      </div>`;
    const t = el('div', 'tugmalar');
    const b = el('button', 'tugma', '🔊 Eshitish');
    b.onclick = () => ovoz.harfOqi(h.id);
    t.appendChild(b);
    karta.appendChild(t);
    if (h.eslatma) karta.appendChild(el('div', 'ogoh', '💡 ' + h.eslatma));
    ich.appendChild(karta);

    const sk = el('div', 'karta');
    sk.innerHTML = `<div class="sarlavha">Shu harfli soʻzlar</div>`;
    sk.appendChild(sozTori(h.sozlar, $('#v-dars'), korsatDars));
    ich.appendChild(sk);
    return;
  }

  if (qadam === 'bogin') {
    if (h.tip === 'belgi') {
      ich.appendChild(el('div', 'karta', `<div class="sarlavha">Tutuq belgisi</div>
        <div class="izoh">${h.eslatma}</div>`));
      const sk = el('div', 'karta');
      sk.appendChild(sozTori(h.sozlar, $('#v-dars'), korsatDars));
      ich.appendChild(sk);
      return;
    }
    const undosh = h.tip === 'undosh' ? h.id : (d.jadvallar[0] ? d.jadvallar[0].undosh : 'm');
    boginMashqi(undosh, null, ich);
    return;
  }

  if (qadam === 'soz') {
    const karta = el('div', 'karta');
    karta.innerHTML = `<div class="sarlavha">Oʻqiymiz 📖</div>
      <div class="izoh" style="margin-bottom:10px">Bu soʻzlarda faqat siz bilgan harflar bor.
      Soʻzni bosing — boʻgʻinlab oʻqib beradi.</div>`;
    karta.appendChild(sozTori(d.sozlar, $('#v-dars'), korsatDars));
    ich.appendChild(karta);
    return;
  }

  if (qadam === 'gap') {
    const karta = el('div', 'karta');
    karta.innerHTML = `<div class="sarlavha">Gapni oʻqing 💬</div>`;
    if (!d.gaplar.length) {
      karta.appendChild(el('div', 'izoh', 'Bu darsda hali gap yoʻq — harflar yetarli emas. Keyingi darslarda paydo boʻladi.'));
    } else {
      d.gaplar.forEach(g => {
        const q = el('div', 'karta');
        q.style.boxShadow = 'none';
        q.style.background = 'var(--fon)';
        q.innerHTML = `<div class="markaz" style="font-size:34px">${g.emoji}</div>
          <div class="gap-matn">${g.gap.split(' ').map(w => `<span>${w}</span>`).join(' ')}</div>`;
        q.onclick = async () => {
          const sozlar = [...q.querySelectorAll('.gap-matn span')];
          for (const s of sozlar) {
            sozlar.forEach(x => x.classList.remove('faol'));
            s.classList.add('faol');
            await ovoz.sozOqi(s.textContent.replace(/[.,!?]/g, ''));
            await ovoz.kut(250);
          }
          sozlar.forEach(x => x.classList.remove('faol'));
        };
        karta.appendChild(q);
      });
    }
    ich.appendChild(karta);
    return;
  }

  if (qadam === 'oyin') {
    ich.appendChild(testTuz(d.ochilgan, 5, () => {
      P.yulduz += 1;
      const tugagan = P.dars;
      if (P.dars < DARSLAR_SONI) P.dars += 1;
      joriyQadam = 0;
      saqla();
      if (P.avtoHisobot) hisobotYubor({ dars: tugagan, harf: yozuv(d.harf) });
      korsatDars();
    }));
  }
}

function pastkiTugmalar(d) {
  const p = $('#pastki'), ich = $('#pastkiIch');
  ich.innerHTML = '';
  if (joriyQadam >= QADAMLAR.length - 1) { p.classList.add('hidden'); return; }
  p.classList.remove('hidden');
  if (joriyQadam > 0) {
    const b = el('button', 'tugma oq', '← Orqaga');
    b.onclick = () => { joriyQadam--; korsatDars(); };
    ich.appendChild(b);
  }
  const n = el('button', 'tugma', 'Keyingi →');
  n.onclick = () => { joriyQadam++; korsatDars(); };
  ich.appendChild(n);
}

// ============================================================
//  TEST / OʻYIN
// ============================================================
function testTuz(harfIdlar, soni, tugagachFn) {
  const box = el('div');
  const holat = { n: 0, togri: 0 };
  const pool = harfIdlar.map(id => HARF_MAP[id]).filter(Boolean);
  // Savollar: harflar yetmasa, aylantirib takrorlaymiz (kamida `soni` ta savol)
  const savollar = [];
  while (savollar.length < soni) {
    aralashtir(pool).forEach(h => { if (savollar.length < soni) savollar.push(h); });
    if (!pool.length) break;
  }

  function chiz() {
    box.innerHTML = '';
    if (holat.n >= savollar.length) {
      const foiz = Math.round(holat.togri / savollar.length * 100);
      const n = el('div', 'karta natija');
      n.innerHTML = `<div class="ball">${holat.togri} / ${savollar.length}</div>
        <div class="foiz">${foiz}%</div>
        <div class="gap">${foiz >= 80 ? 'Ajoyib! ⭐ Yangi dars ochildi.' :
          foiz >= 50 ? 'Yaxshi! Yana bir marta takrorlaymiz.' : 'Hechqisi yoʻq, qaytadan urinamiz.'}</div>`;
      const t = el('div', 'tugmalar');
      t.style.justifyContent = 'center';
      const yana = el('button', 'tugma oq', '🔁 Yana');
      yana.onclick = () => { holat.n = 0; holat.togri = 0; chiz(); };
      t.appendChild(yana);
      if (foiz >= 80 && tugagachFn) {
        const dav = el('button', 'tugma yashil', 'Davom etish ⭐');
        dav.onclick = tugagachFn;
        t.appendChild(dav);
      }
      n.appendChild(t);
      box.appendChild(n);
      return;
    }

    const h = savollar[holat.n];
    // Chalgʻituvchi javoblar: avval oʻrganilganlaridan, yetmasa butun alifbodan
    let notogrilar = tasodifiy(pool.filter(x => x.id !== h.id), 3).map(x => x.id);
    if (notogrilar.length < 3) {
      const qoshimcha = tasodifiy(
        HARFLAR.filter(x => x.id !== h.id && !notogrilar.includes(x.id) && x.tip !== 'belgi'),
        3 - notogrilar.length
      ).map(x => x.id);
      notogrilar = notogrilar.concat(qoshimcha);
    }
    const variantlar = aralashtir([h.id, ...notogrilar]);
    // 2 xil savol: harfni koʻrib tovushni topish / soʻzni koʻrib harfni topish
    const turi = Math.random() < 0.5 ? 'soz' : 'tovush';

    const s = el('div', 'savol');
    if (turi === 'soz') {
      const soz = h.sozlar[Math.floor(Math.random() * h.sozlar.length)];
      s.innerHTML = `<div style="font-size:64px">${soz.emoji}</div>
        <div class="savol-harf" style="font-size:34px">${soz.soz}</div>
        <div class="savol-matn">Bu soʻz qaysi harf bilan boshlanadi?</div>`;
    } else {
      s.innerHTML = `<div class="savol-harf" style="color:${rang(h)}">${yozuv(h)}</div>
        <div class="savol-matn">Bu harf qanday oʻqiladi? (bosib eshiting)</div>`;
      s.onclick = () => ovoz.harfOqi(h.id);
    }
    const bosh = el('div', 'karta');
    bosh.innerHTML = `<div class="dars-bosh"><span class="dars-raqam">Savol ${holat.n + 1} / ${savollar.length}</span>
      <span class="dars-raqam">Toʻgʻri: ${holat.togri}</span></div>`;
    box.append(bosh, s);

    const jav = el('div', 'javoblar');
    const fikr = el('div', 'fikr');
    variantlar.forEach(id => {
      const x = HARF_MAP[id];
      const b = el('button', 'javob');
      b.dataset.harf = x.id;
      b.innerHTML = `${yozuv(x)}<small>${x.tovush}</small>`;
      b.onclick = () => {
        if (b.dataset.done) return;
        [...jav.children].forEach(c => c.dataset.done = '1');
        if (id === h.id) {
          b.classList.add('togri'); holat.togri++;
          P.togri[h.id] = (P.togri[h.id] || 0) + 1;
          fikr.className = 'fikr ok'; fikr.textContent = 'Barakalla! ✅';
        } else {
          b.classList.add('notogri');
          [...jav.children].forEach(c => { if (c.dataset.harf === h.id) c.classList.add('togri'); });
          P.xato[h.id] = (P.xato[h.id] || 0) + 1;
          fikr.className = 'fikr yoq'; fikr.textContent = 'Bu ' + yozuv(h) + ' edi';
        }
        saqla();
        ovoz.harfOqi(h.id);
        setTimeout(() => { holat.n++; chiz(); }, 1100);
      };
      jav.appendChild(b);
    });
    box.append(jav, fikr);
  }
  chiz();
  return box;
}

function korsatOyin() {
  const v = $('#v-oyin');
  v.innerHTML = '';
  v.className = 'kirish';
  const k = el('div', 'karta');
  k.innerHTML = `<div class="sarlavha">Oʻyin 🎮</div>
    <div class="izoh">Shu paytgacha oʻrgangan ${ochilganHarflar(P.dars).length} ta harf boʻyicha savollar.</div>`;
  v.appendChild(k);
  v.appendChild(testTuz(ochilganHarflar(P.dars), 10, null));
}

// ============================================================
//  TAB'LAR VA SOZLAMALAR
// ============================================================
function tabOch(nom) {
  ['alifbo', 'dars', 'oyin'].forEach(t => {
    $('#v-' + t).classList.toggle('hidden', t !== nom);
  });
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === nom));
  $('#pastki').classList.add('hidden');
  if (nom === 'alifbo') korsatAlifbo();
  if (nom === 'dars') korsatDars();
  if (nom === 'oyin') korsatOyin();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.tab').forEach(b => b.onclick = () => tabOch(b.dataset.tab));

$('#btnSoz').onclick = () => {
  $('#inIsm').value = P.ism || '';
  $('#swAvto').textContent = P.avto ? 'Yoniq' : 'Oʻchiq';
  yangilaTepa();
  $('#parda').classList.add('ochiq');
};
$('#btnYop').onclick = () => {
  P.ism = $('#inIsm').value.trim();
  saqla();
  $('#parda').classList.remove('ochiq');
  if (!$('#v-alifbo').classList.contains('hidden')) korsatAlifbo();
};
$('#swAvto').onclick = () => { P.avto = !P.avto; $('#swAvto').textContent = P.avto ? 'Yoniq' : 'Oʻchiq'; saqla(); };
$('#btnTozala').onclick = () => {
  if (confirm('Butun progress oʻchiriladi. Rozimisiz?')) {
    P = Object.assign({}, boshlangich);
    saqla();
    $('#parda').classList.remove('ochiq');
    tabOch('alifbo');
  }
};
$('#parda').onclick = e => { if (e.target === $('#parda')) $('#btnYop').click(); };

// ---------- Telegramga hisobot ----------
export function hisobotYubor(qosh = {}) {
  const qiyin = Object.entries(P.xato)
    .filter(([id, n]) => n >= 2 && n > (P.togri[id] || 0))
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([id]) => HARF_MAP[id] ? yozuv(HARF_MAP[id]) : id);

  return fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify(Object.assign({
      ism: P.ism || 'Oʻquvchi',
      dars: P.dars,
      yulduz: P.yulduz,
      daqiqa: Math.round(P.kunlar[bugun()] || 0),
      qiyin
    }, qosh))
  }).then(r => r.json()).catch(() => ({ ok: false }));
}

// ---------- Alifbo qoʻshigʻi ----------
let qoshiq = null;
function qoshiqIjro() {
  if (!qoshiq) qoshiq = new Audio('audio/alifbo-qoshigi.m4a');
  if (qoshiq.paused) { qoshiq.play().catch(() => {}); } else { qoshiq.pause(); qoshiq.currentTime = 0; }
}

// ---------- Koʻrinish (yorugʻ / qorongʻi) ----------
const MAVZU_KALIT = 'alifboMavzu';

function mavzuQoy(m) {
  if (m === 'avto') delete document.documentElement.dataset.mavzu;
  else document.documentElement.dataset.mavzu = m;
  try { localStorage.setItem(MAVZU_KALIT, m); } catch (e) {}
  document.querySelectorAll('#mavzu button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  // telefon tepasidagi panel rangi ham moslashsin
  const rang = getComputedStyle(document.body).backgroundColor;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && rang) meta.setAttribute('content', rang);
}

function mavzuniYukla() {
  let m = 'avto';
  try { m = localStorage.getItem(MAVZU_KALIT) || 'avto'; } catch (e) {}
  mavzuQoy(m);
}
document.querySelectorAll('#mavzu button').forEach(b => b.onclick = () => mavzuQoy(b.dataset.m));

// ---------- Talaffuz ovozini tanlash ----------
function ovozlarniChiz() {
  const sel = $('#selOvoz');
  if (!sel) return;
  const royxat = ovoz.ovozlarRoyxati();
  if (!royxat.length) {
    sel.innerHTML = '<option>Ovoz topilmadi</option>';
    $('#ovozIzoh').textContent = 'Telefoningizda sintez ovozi yoʻq. Android: Sozlamalar → Tillar → Matndan nutqqa.';
    return;
  }
  let joriy = '';
  try { joriy = localStorage.getItem('alifboOvozi') || ''; } catch (e) {}
  sel.innerHTML = royxat.map(v =>
    `<option value="${v.name}"${v.name === joriy ? ' selected' : ''}>${v.name} — ${v.lang}</option>`).join('');
  const til = (royxat.find(v => v.name === (joriy || royxat[0].name)) || royxat[0]).lang;
  $('#ovozIzoh').innerHTML = /^uz/i.test(til)
    ? 'Oʻzbekcha ovoz topildi — eng yaxshisi. ✅'
    : /^ru/i.test(til)
      ? 'Ruscha ovoz: soʻzlar kirillga oʻgirilib oʻqiladi (<b>shakar → шакар</b>) — talaffuz oʻzbekchaga yaqin chiqadi.'
      : /^tr/i.test(til)
        ? 'Turkcha ovoz: soʻzlar turk imlosiga oʻgiriladi (<b>shakar → şakar</b>).'
        : 'Bu til oʻzbekchaga uzoq. Roʻyxatdan <b>ruscha</b> yoki <b>turkcha</b> ovozni tanlang.';
}
if ($('#selOvoz')) {
  $('#selOvoz').onchange = e => { ovoz.ovozTanla(e.target.value); ovozlarniChiz(); ovoz.sinov(); };
}
if ($('#btnSinov')) $('#btnSinov').onclick = () => ovoz.sinov();
try { speechSynthesis.addEventListener('voiceschanged', ovozlarniChiz); } catch (e) {}

// ---------- Ishga tushirish ----------
mavzuniYukla();
seriyaniYangila();
yangilaTepa();
tabOch('alifbo');
setTimeout(ovozlarniChiz, 300);
