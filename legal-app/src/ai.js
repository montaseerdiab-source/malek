// عنوان الخادم الوسيط (server/). على الجهاز الحقيقي استبدل localhost بعنوان IP جهازك أو الخادم المستضاف.
export const API_URL = 'http://localhost:8787';

export async function searchLive(q, platform) {
  const u = `${API_URL}/api/search?q=${encodeURIComponent(q || '')}&platform=${encodeURIComponent(platform || 'الكل')}`;
  const r = await fetch(u);
  if (!r.ok) throw new Error('تعذّر الاتصال بالخادم');
  return (await r.json()).items;
}

export async function summarize(text, country = '') {
  const r = await fetch(`${API_URL}/api/summarize`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, country }),
  });
  if (!r.ok) throw new Error('تعذّر التلخيص');
  return r.json();
}
