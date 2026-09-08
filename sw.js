// ============================================================
//  Service Worker — ilova internetsiz ishlashi uchun
//  Barcha fayllar telefon xotirasiga saqlanadi.
// ============================================================
const KESH = 'alifbo-v2';

const FAYLLAR = [
  './', 'index.html', 'ota-ona.html', 'manifest.webmanifest',
  'css/style.css',
  'js/app.js', 'js/ovoz.js', 'js/uz.js', 'js/ota-ona.js',
  'data/harflar.js', 'data/sozlar.js', 'data/gaplar.js', 'data/boginlar.js',
  'data/darslar.js', 'data/ovoz-vaqt.js',
  'audio/alifbo-qoshigi.m4a',
  'img/icon-192.png', 'img/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(KESH)
      // bittasi yuklanmasa ham qolganlari saqlansin
      .then(k => Promise.allSettled(FAYLLAR.map(f => k.add(f))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(nomlar => Promise.all(nomlar.filter(n => n !== KESH).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const s = e.request;
  if (s.method !== 'GET') return;                       // /api/report — keshlamaymiz
  const url = new URL(s.url);
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    caches.match(s).then(javob => {
      if (javob) return javob;
      return fetch(s).then(net => {
        // shriftlar va boshqa tashqi fayllarni ham saqlab qoʻyamiz
        if (net && net.status === 200 && (url.origin === location.origin || net.type === 'cors')) {
          const nusxa = net.clone();
          caches.open(KESH).then(k => k.put(s, nusxa)).catch(() => {});
        }
        return net;
      }).catch(() => caches.match('index.html'));
    })
  );
});
