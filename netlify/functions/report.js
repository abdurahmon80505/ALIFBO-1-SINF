// ============================================================
//  /api/report — ota-onaga Telegram orqali hisobot
//
//  Netlify ENV (kodda emas!):
//    TG_TOKEN — bot tokeni (@BotFather bergan)
//    TG_CHAT  — vergul bilan ajratilgan chat id lar: "123456,7891011"
// ============================================================

const TG = 'https://api.telegram.org/bot';

function qochir(s) {
  return String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
}

function xabarYasa(d) {
  const q = [];
  q.push(`📚 <b>Alifbo — hisobot</b>`);
  if (d.ism) q.push(`👧 Oʻquvchi: <b>${qochir(d.ism)}</b>`);
  if (d.dars) q.push(`📖 Dars: <b>${qochir(d.dars)}</b> / 30`);
  if (d.harf) q.push(`🔤 Bugungi harf: <b>${qochir(d.harf)}</b>`);
  if (d.yulduz != null) q.push(`⭐ Yulduzlar: <b>${qochir(d.yulduz)}</b>`);
  if (d.daqiqa) q.push(`⏱ Bugun oʻqidi: <b>${qochir(d.daqiqa)}</b> daqiqa`);
  if (d.togri != null && d.jami) {
    const foiz = Math.round(d.togri / d.jami * 100);
    q.push(`✅ Test: <b>${qochir(d.togri)}/${qochir(d.jami)}</b> (${foiz}%)`);
  }
  if (Array.isArray(d.qiyin) && d.qiyin.length) {
    q.push(`⚠️ Qiynalgan harflar: <b>${d.qiyin.map(qochir).join(', ')}</b>`);
  }
  q.push(`\n🕐 ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`);
  return q.join('\n');
}

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ ok: false, error: 'faqat POST' }, { status: 405 });
  }
  const token = process.env.TG_TOKEN;
  const chatlar = (process.env.TG_CHAT || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!token || !chatlar.length) {
    return Response.json({ ok: false, error: 'sozlanmagan' }, { status: 500 });
  }

  let d;
  try { d = await req.json(); } catch (e) { return Response.json({ ok: false, error: 'json' }, { status: 400 }); }

  const matn = xabarYasa(d);
  const natijalar = await Promise.all(chatlar.map(chat =>
    fetch(TG + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: matn, parse_mode: 'HTML' })
    }).then(r => r.json()).catch(e => ({ ok: false, error: String(e) }))
  ));

  return Response.json({ ok: natijalar.some(r => r.ok), yuborildi: natijalar.filter(r => r.ok).length });
};

export const config = { path: '/api/report' };
