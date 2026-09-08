// ============================================================
//  /api/chatid — chat id ni topish uchun yordamchi
//
//  Ishlatish: botga Telegramda "/start" deb yozing,
//  keyin brauzerda shu manzilni oching. Chat id lar roʻyxati chiqadi.
//  Topgan id larni Netlify ENV dagi TG_CHAT ga yozing.
// ============================================================

export default async () => {
  const token = process.env.TG_TOKEN;
  if (!token) return Response.json({ ok: false, error: 'TG_TOKEN sozlanmagan' }, { status: 500 });

  const r = await fetch(`https://api.telegram.org/bot${token}/getUpdates`).then(x => x.json());
  if (!r.ok) return Response.json({ ok: false, error: r.description || 'telegram xatosi' }, { status: 502 });

  const korilgan = new Map();
  (r.result || []).forEach(u => {
    const c = (u.message || u.edited_message || u.channel_post || {}).chat;
    if (c) korilgan.set(c.id, [c.first_name, c.last_name, c.title, c.username && '@' + c.username]
      .filter(Boolean).join(' '));
  });

  const royxat = [...korilgan].map(([id, nom]) => ({ id, nom }));
  return Response.json({
    ok: true,
    izoh: royxat.length ? 'Shu id larni TG_CHAT ga vergul bilan yozing'
                        : 'Hech kim botga yozmagan. Telegramda botga /start yuboring va sahifani yangilang.',
    TG_CHAT: royxat.map(x => x.id).join(','),
    chatlar: royxat
  });
};

export const config = { path: '/api/chatid' };
