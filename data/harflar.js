// ============================================================
//  ALIFBO — 1-sinf  |  Oʻzbek lotin alifbosi maʼlumotlari
//  29 harf + tutuq belgisi (ʼ)
//  Belgilar: oʻ, gʻ da U+02BB (ʻ) — tutuq belgisi U+02BC (ʼ)
//
//  Maydonlar:
//    tovush    — harf QANDAY OʻQILADI (nomi emas!): "b", "be" emas
//    talaffuz  — bolaga tushuntirish uchun qisqa izoh
//    bosqich   — oʻrgatish bosqichi (1..5)
//    tartib    — dars raqami (1..30)
//    sozlar    — misol soʻzlar, boʻgʻinlarga ajratilgan holda
// ============================================================

export const HARFLAR = [
  // ---------- BOSQICH 1: UNLILAR ----------
  {
    id: 'a', katta: 'A', kichik: 'a', tip: 'unli',
    tovush: 'a', talaffuz: 'aaa — ogʻiz keng ochiladi',
    bosqich: 1, tartib: 1, qiyinlik: 1,
    sozlar: [
      { soz: 'ayiq', emoji: '🐻', bogin: ['a', 'yiq'] },
      { soz: 'ari',  emoji: '🐝', bogin: ['a', 'ri'] },
      { soz: 'aka',  emoji: '👦', bogin: ['a', 'ka'] }
    ]
  },
  {
    id: 'o', katta: 'O', kichik: 'o', tip: 'unli',
    tovush: 'o', talaffuz: 'ooo — lab biroz dumaloq',
    bosqich: 1, tartib: 2, qiyinlik: 1,
    sozlar: [
      { soz: 'ot',   emoji: '🐴', bogin: ['ot'] },
      { soz: 'ona',  emoji: '👩', bogin: ['o', 'na'] },
      { soz: 'olma', emoji: '🍎', bogin: ['ol', 'ma'] }
    ]
  },
  {
    id: 'i', katta: 'I', kichik: 'i', tip: 'unli',
    tovush: 'i', talaffuz: 'iii — lab yoyiladi, jilmayamiz',
    bosqich: 1, tartib: 3, qiyinlik: 1,
    sozlar: [
      { soz: 'it',   emoji: '🐕', bogin: ['it'] },
      { soz: 'ilon', emoji: '🐍', bogin: ['i', 'lon'] },
      { soz: 'igna', emoji: '🪡', bogin: ['ig', 'na'] }
    ]
  },
  {
    id: 'u', katta: 'U', kichik: 'u', tip: 'unli',
    tovush: 'u', talaffuz: 'uuu — lab oldinga choʻziladi',
    bosqich: 1, tartib: 4, qiyinlik: 1,
    sozlar: [
      { soz: 'uy',   emoji: '🏠', bogin: ['uy'] },
      { soz: 'uzum', emoji: '🍇', bogin: ['u', 'zum'] },
      { soz: 'uch',  emoji: '3️⃣', bogin: ['uch'] }
    ]
  },
  {
    id: 'e', katta: 'E', kichik: 'e', tip: 'unli',
    tovush: 'e', talaffuz: 'eee — ogʻiz yarim ochiq',
    bosqich: 1, tartib: 5, qiyinlik: 1,
    sozlar: [
      { soz: 'echki', emoji: '🐐', bogin: ['ech', 'ki'] },
      { soz: 'eshik', emoji: '🚪', bogin: ['e', 'shik'] },
      { soz: 'elak',  emoji: '🧺', bogin: ['e', 'lak'] }
    ]
  },
  {
    id: 'oʻ', katta: 'Oʻ', kichik: 'oʻ', tip: 'unli',
    tovush: 'oʻ', talaffuz: 'oʻoʻoʻ — "o" dan qisqaroq, lab dumaloq',
    bosqich: 1, tartib: 6, qiyinlik: 2,
    eslatma: 'Tepasidagi kichkina belgi ("ʻ") boshqa tovush ekanini bildiradi: ot — oʻt.',
    sozlar: [
      { soz: 'oʻrdak', emoji: '🦆', bogin: ['oʻr', 'dak'] },
      { soz: 'oʻrik',  emoji: '🍑', bogin: ['oʻ', 'rik'] },
      { soz: 'oʻt',    emoji: '🌿', bogin: ['oʻt'] }
    ]
  },

  // ---------- BOSQICH 2: ASOSIY UNDOSHLAR ----------
  {
    id: 'm', katta: 'M', kichik: 'm', tip: 'undosh',
    tovush: 'm', talaffuz: 'mmm — lab yopiq, burundan chiqadi ("em" emas!)',
    bosqich: 2, tartib: 7, qiyinlik: 1,
    sozlar: [
      { soz: 'maktab', emoji: '🏫', bogin: ['mak', 'tab'] },
      { soz: 'mushuk', emoji: '🐈', bogin: ['mu', 'shuk'] },
      { soz: 'meva',   emoji: '🍏', bogin: ['me', 'va'] }
    ]
  },
  {
    id: 'n', katta: 'N', kichik: 'n', tip: 'undosh',
    tovush: 'n', talaffuz: 'nnn — til tanglayga tegadi ("en" emas!)',
    bosqich: 2, tartib: 8, qiyinlik: 1,
    sozlar: [
      { soz: 'non', emoji: '🍞', bogin: ['non'] },
      { soz: 'nok', emoji: '🍐', bogin: ['nok'] },
      { soz: 'nur', emoji: '☀️', bogin: ['nur'] }
    ]
  },
  {
    id: 'l', katta: 'L', kichik: 'l', tip: 'undosh',
    tovush: 'l', talaffuz: 'lll — til tanglayga tegib turadi',
    bosqich: 2, tartib: 9, qiyinlik: 1,
    sozlar: [
      { soz: 'lola',   emoji: '🌷', bogin: ['lo', 'la'] },
      { soz: 'limon',  emoji: '🍋', bogin: ['li', 'mon'] },
      { soz: 'laylak', emoji: '🐦', bogin: ['lay', 'lak'] }
    ]
  },
  {
    id: 'r', katta: 'R', kichik: 'r', tip: 'undosh',
    tovush: 'r', talaffuz: 'rrr — til titraydi',
    bosqich: 2, tartib: 11, qiyinlik: 2,
    sozlar: [
      { soz: 'rasm',   emoji: '🖼️', bogin: ['rasm'] },
      { soz: 'ruchka', emoji: '🖊️', bogin: ['ruch', 'ka'] },
      { soz: 'radio',  emoji: '📻', bogin: ['ra', 'di', 'o'] }
    ]
  },
  {
    id: 's', katta: 'S', kichik: 's', tip: 'undosh',
    tovush: 's', talaffuz: 'sss — ilon kabi ("es" emas!)',
    bosqich: 2, tartib: 12, qiyinlik: 1,
    sozlar: [
      { soz: 'soat',  emoji: '⏰', bogin: ['so', 'at'] },
      { soz: 'sabzi', emoji: '🥕', bogin: ['sab', 'zi'] },
      { soz: 'sut',   emoji: '🥛', bogin: ['sut'] }
    ]
  },
  {
    id: 't', katta: 'T', kichik: 't', tip: 'undosh',
    tovush: 't', talaffuz: 't-t-t — qisqa urib chiqadi ("te" emas!)',
    bosqich: 2, tartib: 10, qiyinlik: 1,
    sozlar: [
      { soz: 'tovuq',  emoji: '🐔', bogin: ['to', 'vuq'] },
      { soz: 'tuya',   emoji: '🐫', bogin: ['tu', 'ya'] },
      { soz: 'tarvuz', emoji: '🍉', bogin: ['tar', 'vuz'] }
    ]
  },

  // ---------- BOSQICH 3 ----------
  {
    id: 'b', katta: 'B', kichik: 'b', tip: 'undosh',
    tovush: 'b', talaffuz: 'b-b-b — lab qisqa ochiladi ("be" emas!)',
    bosqich: 3, tartib: 13, qiyinlik: 1,
    sozlar: [
      { soz: 'bola',    emoji: '👦', bogin: ['bo', 'la'] },
      { soz: 'baliq',   emoji: '🐟', bogin: ['ba', 'liq'] },
      { soz: 'bodring', emoji: '🥒', bogin: ['bod', 'ring'] }
    ]
  },
  {
    id: 'd', katta: 'D', kichik: 'd', tip: 'undosh',
    tovush: 'd', talaffuz: 'd-d-d — til tanglayga urilib ochiladi',
    bosqich: 3, tartib: 14, qiyinlik: 1,
    sozlar: [
      { soz: 'daraxt', emoji: '🌳', bogin: ['da', 'raxt'] },
      { soz: 'dala',   emoji: '🌾', bogin: ['da', 'la'] },
      { soz: 'doska',  emoji: '📋', bogin: ['dos', 'ka'] }
    ]
  },
  {
    id: 'k', katta: 'K', kichik: 'k', tip: 'undosh',
    tovush: 'k', talaffuz: 'k-k-k — tomoq oldida qisqa',
    bosqich: 3, tartib: 15, qiyinlik: 1,
    sozlar: [
      { soz: 'kitob',   emoji: '📖', bogin: ['ki', 'tob'] },
      { soz: 'kapalak', emoji: '🦋', bogin: ['ka', 'pa', 'lak'] },
      { soz: 'kalit',   emoji: '🔑', bogin: ['ka', 'lit'] }
    ]
  },
  {
    id: 'g', katta: 'G', kichik: 'g', tip: 'undosh',
    tovush: 'g', talaffuz: 'g-g-g — "k" ning ovozli juftligi',
    bosqich: 3, tartib: 16, qiyinlik: 2,
    sozlar: [
      { soz: 'gul',   emoji: '🌷', bogin: ['gul'] },
      { soz: 'gilos', emoji: '🍒', bogin: ['gi', 'los'] },
      { soz: 'gilam', emoji: '🧶', bogin: ['gi', 'lam'] }
    ]
  },
  {
    id: 'p', katta: 'P', kichik: 'p', tip: 'undosh',
    tovush: 'p', talaffuz: 'p-p-p — lab portlab ochiladi',
    bosqich: 3, tartib: 17, qiyinlik: 1,
    sozlar: [
      { soz: 'piyoz',  emoji: '🧅', bogin: ['pi', 'yoz'] },
      { soz: 'pichoq', emoji: '🔪', bogin: ['pi', 'choq'] },
      { soz: 'paxta',  emoji: '🤍', bogin: ['pax', 'ta'] }
    ]
  },
  {
    id: 'y', katta: 'Y', kichik: 'y', tip: 'undosh',
    tovush: 'y', talaffuz: 'y-y-y — "i" ga oʻxshaydi, lekin qisqa',
    bosqich: 3, tartib: 18, qiyinlik: 2,
    sozlar: [
      { soz: 'yulduz', emoji: '⭐', bogin: ['yul', 'duz'] },
      { soz: 'yer',    emoji: '🌍', bogin: ['yer'] },
      { soz: 'yomgʻir',emoji: '🌧️', bogin: ['yom', 'gʻir'] }
    ]
  },

  // ---------- BOSQICH 4 ----------
  {
    id: 'q', katta: 'Q', kichik: 'q', tip: 'undosh',
    tovush: 'q', talaffuz: 'q-q-q — tomoqning ichidan, "k" dan chuqurroq',
    bosqich: 4, tartib: 19, qiyinlik: 3,
    eslatma: 'k va q ni adashtirmaslik uchun: kol — qol, kor — qor.',
    sozlar: [
      { soz: 'quyosh', emoji: '☀️', bogin: ['qu', 'yosh'] },
      { soz: 'qalam',  emoji: '✏️', bogin: ['qa', 'lam'] },
      { soz: 'quyon',  emoji: '🐇', bogin: ['qu', 'yon'] }
    ]
  },
  {
    id: 'x', katta: 'X', kichik: 'x', tip: 'undosh',
    tovush: 'x', talaffuz: 'xxx — tomoqdan havo surkalib chiqadi',
    bosqich: 4, tartib: 20, qiyinlik: 3,
    eslatma: 'x va h ni farqlash: xol — hol. x — tomoqdan qattiq, h — yengil nafas.',
    sozlar: [
      { soz: 'xoʻroz', emoji: '🐓', bogin: ['xoʻ', 'roz'] },
      { soz: 'xat',    emoji: '✉️', bogin: ['xat'] },
      { soz: 'xalta',  emoji: '🎒', bogin: ['xal', 'ta'] }
    ]
  },
  {
    id: 'h', katta: 'H', kichik: 'h', tip: 'undosh',
    tovush: 'h', talaffuz: 'h-h-h — yengil nafas, oynani bugʻlagandek',
    bosqich: 4, tartib: 21, qiyinlik: 3,
    sozlar: [
      { soz: 'hovli', emoji: '🏡', bogin: ['hov', 'li'] },
      { soz: 'harf',  emoji: '🔤', bogin: ['harf'] },
      { soz: 'hakka', emoji: '🐦', bogin: ['hak', 'ka'] }
    ]
  },
  {
    id: 'v', katta: 'V', kichik: 'v', tip: 'undosh',
    tovush: 'v', talaffuz: 'vvv — tish pastki labga tegadi',
    bosqich: 4, tartib: 22, qiyinlik: 2,
    sozlar: [
      { soz: 'velosiped', emoji: '🚲', bogin: ['ve', 'lo', 'si', 'ped'] },
      { soz: 'vaza',      emoji: '🏺', bogin: ['va', 'za'] },
      { soz: 'vagon',     emoji: '🚃', bogin: ['va', 'gon'] }
    ]
  },
  {
    id: 'z', katta: 'Z', kichik: 'z', tip: 'undosh',
    tovush: 'z', talaffuz: 'zzz — ari kabi ("ze" emas!)',
    bosqich: 4, tartib: 23, qiyinlik: 2,
    sozlar: [
      { soz: 'zebra', emoji: '🦓', bogin: ['zeb', 'ra'] },
      { soz: 'zina',  emoji: '🪜', bogin: ['zi', 'na'] },
      { soz: 'zavod', emoji: '🏭', bogin: ['za', 'vod'] }
    ]
  },
  {
    id: 'j', katta: 'J', kichik: 'j', tip: 'undosh',
    tovush: 'j', talaffuz: 'j-j-j — joʻja dagidek',
    bosqich: 4, tartib: 24, qiyinlik: 3,
    eslatma: 'J ikki xil oʻqiladi: joʻja (j) va jurnal (jj — yumshoq). Hozircha joʻja variantini oʻrganamiz.',
    sozlar: [
      { soz: 'joʻja',  emoji: '🐤', bogin: ['joʻ', 'ja'] },
      { soz: 'jiyda',  emoji: '🫒', bogin: ['jiy', 'da'] },
      { soz: 'jurnal', emoji: '📰', bogin: ['jur', 'nal'] }
    ]
  },
  {
    id: 'f', katta: 'F', kichik: 'f', tip: 'undosh',
    tovush: 'f', talaffuz: 'fff — shamol kabi, tish labga tegadi',
    bosqich: 4, tartib: 25, qiyinlik: 2,
    sozlar: [
      { soz: 'fil',    emoji: '🐘', bogin: ['fil'] },
      { soz: 'futbol', emoji: '⚽', bogin: ['fut', 'bol'] },
      { soz: 'fasl',   emoji: '🍂', bogin: ['fasl'] }
    ]
  },

  // ---------- BOSQICH 5: QOʻSH HARFLAR VA BELGI ----------
  {
    id: 'sh', katta: 'Sh', kichik: 'sh', tip: 'undosh', qosh: true,
    tovush: 'sh', talaffuz: 'shshsh — jim boʻling degandek',
    bosqich: 5, tartib: 26, qiyinlik: 2,
    eslatma: 'Ikki harf — bitta tovush! "s" va "h" alohida emas.',
    sozlar: [
      { soz: 'shar',      emoji: '🎈', bogin: ['shar'] },
      { soz: 'shaftoli',  emoji: '🍑', bogin: ['shaf', 'to', 'li'] },
      { soz: 'shakar',    emoji: '🍬', bogin: ['sha', 'kar'] }
    ]
  },
  {
    id: 'ch', katta: 'Ch', kichik: 'ch', tip: 'undosh', qosh: true,
    tovush: 'ch', talaffuz: 'ch-ch-ch — poyezd kabi',
    bosqich: 5, tartib: 27, qiyinlik: 2,
    eslatma: 'Ikki harf — bitta tovush!',
    sozlar: [
      { soz: 'choy',    emoji: '🍵', bogin: ['choy'] },
      { soz: 'chumoli', emoji: '🐜', bogin: ['chu', 'mo', 'li'] },
      { soz: 'chelak',  emoji: '🪣', bogin: ['che', 'lak'] }
    ]
  },
  {
    id: 'gʻ', katta: 'Gʻ', kichik: 'gʻ', tip: 'undosh', qosh: true,
    tovush: 'gʻ', talaffuz: 'gʻ-gʻ-gʻ — tomoq titraydi, gʻoz kabi',
    bosqich: 5, tartib: 28, qiyinlik: 3,
    eslatma: 'g va gʻ farqi: gul — gʻoz.',
    sozlar: [
      { soz: 'gʻoz',      emoji: '🦢', bogin: ['gʻoz'] },
      { soz: 'gʻisht',    emoji: '🧱', bogin: ['gʻisht'] },
      { soz: 'gʻildirak', emoji: '🛞', bogin: ['gʻil', 'di', 'rak'] }
    ]
  },
  {
    id: 'ng', katta: 'Ng', kichik: 'ng', tip: 'undosh', qosh: true,
    tovush: 'ng', talaffuz: 'nnng — burundan, soʻz oxirida',
    bosqich: 5, tartib: 29, qiyinlik: 3,
    eslatma: 'Bu harf soʻz boshida kelmaydi! Faqat oʻrtasida yoki oxirida: tong, singil.',
    sozlar: [
      { soz: 'tong',   emoji: '🌅', bogin: ['tong'] },
      { soz: 'ming',   emoji: '🔢', bogin: ['ming'] },
      { soz: 'singil', emoji: '👧', bogin: ['sin', 'gil'] }
    ]
  },
  {
    id: 'ʼ', katta: 'ʼ', kichik: 'ʼ', tip: 'belgi',
    tovush: '(toʻxtash)', talaffuz: 'Tovushi yoʻq — oldingi tovushni choʻzadi yoki soʻzni ikkiga boʻladi',
    bosqich: 5, tartib: 30, qiyinlik: 3,
    eslatma: 'Tutuq belgisi. Uni oʻqimaymiz, lekin qisqa toʻxtaymiz: maʼ-no.',
    sozlar: [
      { soz: 'maʼno',  emoji: '💬', bogin: ['maʼ', 'no'] },
      { soz: 'taʼlim', emoji: '📚', bogin: ['taʼ', 'lim'] },
      { soz: 'taʼm',   emoji: '😋', bogin: ['taʼm'] }
    ]
  }
];

// Tez qidirish uchun
export const HARF_MAP = Object.fromEntries(HARFLAR.map(h => [h.id, h]));

// Oʻrgatish tartibida
export const TARTIB_BOYICHA = [...HARFLAR].sort((a, b) => a.tartib - b.tartib);

export const UNLILAR  = HARFLAR.filter(h => h.tip === 'unli').map(h => h.id);
export const UNDOSHLAR = HARFLAR.filter(h => h.tip === 'undosh').map(h => h.id);

export const BOSQICHLAR = [
  { nom: 'Unlilar',          izoh: 'Ogʻiz ochiq — ovoz erkin chiqadi', raqam: 1, rang: '#FF6B6B' },
  { nom: 'Asosiy undoshlar', izoh: 'Eng koʻp ishlatiladigan tovushlar', raqam: 2, rang: '#4ECDC4' },
  { nom: 'Yangi undoshlar',  izoh: 'Soʻzlar tobora uzayadi',            raqam: 3, rang: '#FFD93D' },
  { nom: 'Qiyin tovushlar',  izoh: 'q, x, h — diqqat bilan',            raqam: 4, rang: '#A78BFA' },
  { nom: 'Qoʻsh harflar',    izoh: 'Ikki harf — bitta tovush',          raqam: 5, rang: '#F97316' }
];
