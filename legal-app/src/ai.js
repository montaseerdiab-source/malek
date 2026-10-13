// تلخيص نص قانوني إلى بنية موحّدة عبر خادم وسيط يستدعي Claude.
// لا تضع مفتاح API داخل التطبيق أبدًا؛ استدعِ خادمك الخاص.
export const API_URL = ''; // مثال: https://example.com/api/summarize

export const PROMPT = `أنت مساعد يبسّط المعلومات القانونية العامة بالعربية.
من النص التالي أعد JSON فقط بالحقول: title, summary, rights[], duties[], verdict (صح|خطأ|يعتمد), verdictNote.
لا تخترع مواد قانونية. إن كان الحكم يختلف حسب الدولة فاجعل verdict = "يعتمد".`;

export async function summarize(text) {
  if (!API_URL) throw new Error('لم يُضبط عنوان الخادم بعد (API_URL).');
  const r = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: PROMPT, text }),
  });
  if (!r.ok) throw new Error('تعذّر التلخيص');
  return r.json();
}
