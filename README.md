# ALIFBO — 1-sinf

10 yoshli bolaga **oʻzbek alifbosini va oʻqishni** oʻrgatuvchi ilova.
Telefonda ishlaydi, internetsiz ham ochiladi (PWA).

## Nima uchun bu ilova?

Koʻp bolalar harflarni biladi, lekin **qoʻshib oʻqiy olmaydi**. Sabab —
harfning *nomi* oʻrgatiladi ("be", "em"), *tovushi* emas ("b", "m").
Shuning uchun bu ilovada:

1. Harf emas — **TOVUSH** oʻrgatiladi
2. Darhol **boʻgʻin qoʻshish** mashq qilinadi: `m` + `a` = `ma`
3. Boʻgʻindan soʻz, soʻzdan gap yigʻiladi
4. Har kuni 10–15 daqiqa, oxirida yulduz

## Oʻrgatish tartibi (30 dars)

| Bosqich | Harflar | Izoh |
|---|---|---|
| 1 | a o i u e oʻ | unlilar — ovoz erkin chiqadi |
| 2 | m n l t r s | eng koʻp ishlatiladigan undoshlar |
| 3 | b d k g p y | soʻzlar uzayadi |
| 4 | q x h v z j f | qiyin tovushlar (q–k, x–h farqi) |
| 5 | sh ch gʻ ng ʼ | ikki harf — bitta tovush |

10-darsdayoq bola `ot, non, tol, ona, olma` kabi soʻzlarni **mustaqil** oʻqiy oladi.

## Tuzilishi

```
data/
  harflar.js      29 harf + tutuq belgisi: tovushi, talaffuzi, misol soʻzlari
  sozlar.js       103 soʻz — boʻgʻinlarga ajratilgan (ol-ma, ka-pa-lak)
  gaplar.js       20 gap + 3 matn (ravon oʻqish uchun)
  boginlar.js     boʻgʻin jadvalini yasovchi funksiyalar (ma mo mi mu me moʻ)
  darslar.js      30 ta dars AVTOMATIK quriladi
  ovoz-vaqt.js    MP3 ichidagi vaqt oralig'lari (audio sprite)
js/
  uz.js           soʻzni harflarga ajratish (sh, ch, ng, oʻ, gʻ = 1 ta harf)
  ovoz.js         ovoz tizimi: MP3 sprite + zaxira brauzer ovozi
netlify/functions/
  report.js       ota-onaga Telegram orqali hisobot
```

**Asosiy g'oya:** dars maʼlumotlari qoʻlda yozilmaydi — `darsYasa(n)` funksiyasi
bolaga faqat **oʻrgangan harflaridan tuzilgan** soʻz va gaplarni beradi.
Shuning uchun bola hech qachon "hali oʻrganmagan harfi bor" soʻzga duch kelmaydi.

## Ovoz

Arab harflari saytidagi tizim: **bitta MP3 fayl** + har tovushga vaqt oraligʻi.

```js
HARF_VAQT = { 'a': [0.00, 0.95], 'b': [1.21, 2.13], ... }
```

Afzalligi: bitta fayl tez yuklanadi, internetsiz ishlaydi, ovoz kechikmaydi.
`audio/alifbo.mp3` kelgach `data/ovoz-vaqt.js` avtomatik toʻldiriladi.

## Ishga tushirish

```bash
python3 -m http.server 8000
# brauzerda: http://localhost:8000
```

## Holat

- [x] Alifbo maʼlumotlari (30 harf, 103 soʻz, 20 gap, 30 dars)
- [x] Ovoz tizimi (MP3 kutilmoqda)
- [ ] Interfeys: Alifbo / Dars / Boʻgʻin / Oʻyin
- [ ] Ota-ona paneli + Telegram hisobot
- [ ] PWA (offline)
