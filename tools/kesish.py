#!/usr/bin/env python3
"""
Ovoz faylini avtomatik kesish (audio sprite jadvalini yasash).

MP3 ichidagi jimliklarga qarab har bir element boshlanishi/tugashini topadi
va data/ovoz-vaqt.js faylini toʻldiradi.

Ishlatish:
    python3 tools/kesish.py audio/alifbo.mp3 harf
    python3 tools/kesish.py audio/boginlar.mp3 bogin
    python3 tools/kesish.py audio/sozlar.mp3 soz
"""
import sys, json, subprocess, re
import numpy as np
import soundfile as sf

ODIM = 0.020          # 20 ms oyna
MIN_UZUNLIK = 0.08    # bundan qisqa tovush — shovqin
MIN_JIMLIK = 0.22     # bundan qisqa jimlik — bitta element ichida
CHET = 0.05           # boshi/oxiriga qoʻshiladigan zaxira


def segmentlar(yol):
    ovoz, sr = sf.read(yol, dtype='float32', always_2d=True)
    x = ovoz.mean(axis=1)
    n = max(1, int(sr * ODIM))
    bolaklar = len(x) // n
    rms = np.sqrt(np.array([np.mean(x[i*n:(i+1)*n] ** 2) for i in range(bolaklar)]) + 1e-12)

    # Shovqin darajasi: eng jim 20% ning medianasi
    shovqin = np.median(np.sort(rms)[: max(1, bolaklar // 5)])
    cheg = max(shovqin * 4.0, rms.max() * 0.045)

    ovozli = rms > cheg
    segs, boshi = [], None
    for i, v in enumerate(ovozli):
        if v and boshi is None:
            boshi = i
        elif not v and boshi is not None:
            segs.append([boshi * ODIM, i * ODIM])
            boshi = None
    if boshi is not None:
        segs.append([boshi * ODIM, bolaklar * ODIM])

    # Yaqin segmentlarni birlashtirish
    birlashgan = []
    for s in segs:
        if birlashgan and s[0] - birlashgan[-1][1] < MIN_JIMLIK:
            birlashgan[-1][1] = s[1]
        else:
            birlashgan.append(s)

    # Juda qisqalarini tashlash + chetiga zaxira
    davomiylik = len(x) / sr
    tayyor = []
    for a, b in birlashgan:
        if b - a < MIN_UZUNLIK:
            continue
        tayyor.append([round(max(0, a - CHET), 3), round(min(davomiylik, b + CHET), 3)])
    return tayyor, davomiylik


def royxat(tur):
    """Kutilayotgan elementlar roʻyxatini data/ fayllaridan olamiz."""
    kod = {
        'harf': "import('./data/harflar.js').then(m=>console.log(JSON.stringify(m.TARTIB_BOYICHA.map(h=>h.id))))",
        'bogin': ("Promise.all([import('./data/harflar.js')]).then(([m])=>{"
                  "const u=m.UNLILAR, c=m.TARTIB_BOYICHA.filter(x=>x.tip==='undosh');"
                  "const r=[];c.forEach(x=>u.forEach(v=>r.push(x.id+v)));"
                  "console.log(JSON.stringify(r))})"),
        'soz': "import('./data/sozlar.js').then(m=>console.log(JSON.stringify(m.SOZLAR.map(s=>s.soz))))",
    }[tur]
    chiqish = subprocess.run(['node', '--input-type=module', '-e', kod],
                             capture_output=True, text=True, cwd='.')
    return json.loads(chiqish.stdout.strip())


def yoz(tur, jadval):
    yol = 'data/ovoz-vaqt.js'
    matn = open(yol, encoding='utf-8').read()
    nom = {'harf': 'HARF_VAQT', 'bogin': 'BOGIN_VAQT', 'soz': 'SOZ_VAQT'}[tur]
    satrlar = ',\n'.join(f"  {json.dumps(k, ensure_ascii=False)}: [{v[0]}, {v[1]}]"
                         for k, v in jadval.items())
    yangi = f"export const {nom} = {{\n{satrlar}\n}};"
    matn = re.sub(rf"export const {nom} = \{{[^}}]*\}};", yangi, matn, count=1)
    open(yol, 'w', encoding='utf-8').write(matn)
    print(f"→ data/ovoz-vaqt.js dagi {nom} yangilandi ({len(jadval)} ta)")


if __name__ == '__main__':
    fayl, tur = sys.argv[1], sys.argv[2]
    segs, uzunlik = segmentlar(fayl)
    kutilgan = royxat(tur)
    print(f"Fayl: {fayl}  ({uzunlik:.1f} soniya)")
    print(f"Topildi: {len(segs)} ta tovush  |  Kutilgan: {len(kutilgan)} ta")
    if len(segs) != len(kutilgan):
        print("\n⚠️  SONI MOS EMAS. Sabablari: jimliklar qisqa, fon shovqini,")
        print("   yoki bir element ikkiga boʻlinib ketgan.")
        print("   Birinchi 10 ta segment:", [f"{a}-{b}" for a, b in segs[:10]])
        print("   Baribir yozish uchun: --majburiy")
        if '--majburiy' not in sys.argv:
            sys.exit(1)
    yoz(tur, {k: v for k, v in zip(kutilgan, segs)})
