// جلب منشورات من واجهات رسمية فقط (بدون كشط). كل منصة تحتاج مفتاحها في متغيرات البيئة.
export async function searchYouTube(q, max = 5) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];
  const u = new URL('https://www.googleapis.com/youtube/v3/search');
  u.search = new URLSearchParams({ part: 'snippet', type: 'video', maxResults: String(max), q, key, relevanceLanguage: 'ar' });
  const r = await fetch(u);
  if (!r.ok) throw new Error(`YouTube ${r.status}`);
  const j = await r.json();
  return (j.items || []).map((v) => ({
    platform: 'يوتيوب', source: v.snippet.channelTitle,
    url: `https://www.youtube.com/watch?v=${v.id.videoId}`,
    text: `${v.snippet.title}\n${v.snippet.description}`,
  }));
}

export async function searchX(q, max = 10) {
  const token = process.env.X_BEARER_TOKEN;
  if (!token) return [];
  const u = new URL('https://api.x.com/2/tweets/search/recent');
  u.search = new URLSearchParams({ query: `${q} lang:ar -is:retweet`, max_results: String(Math.max(10, max)), 'tweet.fields': 'author_id' });
  const r = await fetch(u, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`X ${r.status}`);
  const j = await r.json();
  return (j.data || []).slice(0, max).map((t) => ({
    platform: 'X', source: `مستخدم ${t.author_id}`, url: `https://x.com/i/web/status/${t.id}`, text: t.text,
  }));
}

export const PLATFORMS = { 'يوتيوب': searchYouTube, X: searchX };
