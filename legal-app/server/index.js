import http from 'node:http';
import { summarize } from './summarize.js';
import { PLATFORMS } from './platforms.js';

const PORT = process.env.PORT || 8787;
const send = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type' });
  res.end(JSON.stringify(body));
};
const readBody = (req) => new Promise((ok) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => ok(d)); });

http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, {});
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/api/summarize' && req.method === 'POST') {
      const { text, country } = JSON.parse(await readBody(req));
      if (!text) return send(res, 400, { error: 'text مطلوب' });
      return send(res, 200, await summarize(text, country));
    }
    if (url.pathname === '/api/search') {
      const q = url.searchParams.get('q') || 'حقوق وواجبات قانونية';
      const only = url.searchParams.get('platform');
      const fns = Object.entries(PLATFORMS).filter(([n]) => !only || only === 'الكل' || only === n);
      const posts = (await Promise.all(fns.map(([, f]) => f(q).catch(() => [])))).flat().slice(0, 12);
      const items = (await Promise.all(posts.map(async (p, i) => {
        try { const s = await summarize(p.text, url.searchParams.get('country') || ''); return s.relevant ? { id: `${Date.now()}-${i}`, ...p, ...s } : null; }
        catch { return null; }
      }))).filter(Boolean);
      return send(res, 200, { items });
    }
    send(res, 404, { error: 'غير موجود' });
  } catch (e) { send(res, 500, { error: String(e.message || e) }); }
}).listen(PORT, () => console.log(`huquqi server on :${PORT}`));
