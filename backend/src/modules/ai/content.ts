// =============================================================
// AI Content Generation — Groq/OpenAI compatible
// DB'deki site_settings veya .env'deki key kullanılır
// =============================================================

import type { FastifyRequest, FastifyReply } from 'fastify';

type ContentRequest = {
  title?: string;
  summary?: string;
  content?: string;
  tags?: string;
  locale: string;
  target_locales?: string[];
  module_key?: string;
  action: 'enhance' | 'translate' | 'generate_meta' | 'full';
};

async function getAIConfig(req: FastifyRequest) {
  // 1) DB'den API key'leri oku (site_settings tablosu)
  try {
    const pool = (req.server as any).mysql?.pool || (req.server as any).db;
    if (pool) {
      // Önce bereketfide__ prefix ile dene
      for (const key of ['bereketfide__groq_api_key', 'groq_api_key']) {
        const [rows] = await pool.query(
          "SELECT `value` FROM site_settings WHERE `key` = ? AND locale = '*' LIMIT 1",
          [key],
        );
        const val = rows?.[0]?.value;
        if (val && typeof val === 'string' && val.trim()) {
          // Model key'ini de al
          const modelKey = key.replace('groq_api_key', 'groq_model');
          const [modelRows] = await pool.query(
            "SELECT `value` FROM site_settings WHERE `key` = ? AND locale = '*' LIMIT 1",
            [modelKey],
          );
          const model = modelRows?.[0]?.value || 'llama-3.3-70b-versatile';
          return {
            apiKey: val.trim(),
            model: typeof model === 'string' ? model.trim() : 'llama-3.3-70b-versatile',
            base: 'https://api.groq.com/openai/v1',
          };
        }
      }

      // OpenAI fallback
      for (const key of ['bereketfide__openai_api_key', 'openai_api_key']) {
        const [rows] = await pool.query(
          "SELECT `value` FROM site_settings WHERE `key` = ? AND locale = '*' LIMIT 1",
          [key],
        );
        const val = rows?.[0]?.value;
        if (val && typeof val === 'string' && val.trim()) {
          const modelKey = key.replace('openai_api_key', 'openai_model');
          const [modelRows] = await pool.query(
            "SELECT `value` FROM site_settings WHERE `key` = ? AND locale = '*' LIMIT 1",
            [modelKey],
          );
          const model = modelRows?.[0]?.value || 'gpt-4o-mini';
          return {
            apiKey: val.trim(),
            model: typeof model === 'string' ? model.trim() : 'gpt-4o-mini',
            base: 'https://api.openai.com/v1',
          };
        }
      }
    }
  } catch {}

  // 2) .env fallback
  const groqKey = process.env.GROQ_API_KEY || '';
  if (groqKey) {
    return {
      apiKey: groqKey,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      base: 'https://api.groq.com/openai/v1',
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY || '';
  if (openaiKey) {
    return {
      apiKey: openaiKey,
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      base: 'https://api.openai.com/v1',
    };
  }

  return { apiKey: '', model: '', base: '' };
}

async function callAI(
  config: { apiKey: string; model: string; base: string },
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('AI API key tanımlı değil. Admin Panel → Site Ayarları → API sekmesinden veya .env dosyasından GROQ_API_KEY ayarlayın.');
  }

  const res = await fetch(`${config.base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${res.status} — ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as any;
  return data?.choices?.[0]?.message?.content || '';
}

function extractJSON(text: string): any {
  try {
    return JSON.parse(text);
  } catch {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) {
    try {
      return JSON.parse(match[1].trim());
    } catch {}
  }
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch {}
  }
  throw new Error('AI yanıtından JSON çıkarılamadı');
}

const SYSTEM_PROMPT = `Sen Bereket Fide firması için profesyonel içerik yazarısın.
Bereket Fide, Antalya Aksu'da modern seralarda aşılı ve standart domates, biber, salatalık, karpuz, kavun fidesi üreten bir tarım firmasıdır.

Kurallar:
- Profesyonel, güvenilir ve doğal bir ton kullan
- Tarım ve fide sektörüne uygun terminoloji kullan
- SEO dostu içerik üret (anahtar kelime yoğunluğu doğal olsun)
- HTML formatında içerik üret (<p>, <h2>, <h3>, <ul>, <li>, <strong> tagleri kullan)
- Başlıklar kısa ve etkileyici olsun
- Meta description 155 karakter sınırında olsun
- Slug Türkçe karaktersiz, küçük harf, tire ile ayrılmış olsun
- Tags virgül ile ayrılmış olsun
- Yanıtı SADECE JSON olarak dön, açıklama ekleme`;

export async function aiContentAssist(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as ContentRequest;

  if (!body?.action) {
    return reply.code(400).send({ ok: false, error: { message: 'action alanı gerekli' } });
  }

  const locales = body.target_locales?.length ? body.target_locales : [body.locale || 'tr'];

  try {
    const config = await getAIConfig(req);
    let userPrompt = '';

    if (body.action === 'full') {
      userPrompt = `Mevcut bilgiler:
- Başlık: ${body.title || '(boş)'}
- Özet: ${body.summary || '(boş)'}
- İçerik: ${body.content ? body.content.slice(0, 500) : '(boş)'}
- Etiketler: ${body.tags || '(boş)'}
- Modül: ${body.module_key || 'blog'}

Görev: Bu bilgileri kullanarak her dil için eksiksiz bir içerik hazırla.
Hedef diller: ${locales.join(', ')}

SADECE şu JSON formatında yanıt ver:
{"locales":[{"locale":"tr","title":"...","slug":"...","summary":"...","content":"<p>...</p>","meta_title":"...","meta_description":"...","tags":"etiket1, etiket2"}]}`;
    } else if (body.action === 'enhance') {
      userPrompt = `Mevcut içerik:
- Başlık: ${body.title || '(boş)'}
- İçerik: ${body.content || '(boş)'}

Görev: Bu içeriği geliştir ve genişlet. Daha detaylı, profesyonel ve SEO dostu hale getir.
Dil: ${body.locale || 'tr'}

SADECE şu JSON formatında yanıt ver:
{"locales":[{"locale":"${body.locale || 'tr'}","title":"...","slug":"...","summary":"...","content":"<p>...</p>","meta_title":"...","meta_description":"...","tags":"..."}]}`;
    } else if (body.action === 'translate') {
      userPrompt = `Kaynak içerik (${body.locale || 'tr'}):
- Başlık: ${body.title}
- Özet: ${body.summary}
- İçerik: ${body.content?.slice(0, 2000)}
- Etiketler: ${body.tags}

Görev: Bu içeriği şu dillere çevir: ${locales.filter((l) => l !== body.locale).join(', ')}
Çeviri doğal olsun, kelime kelime değil anlam odaklı. Slug tüm dillerde aynı olsun.

SADECE şu JSON formatında yanıt ver:
{"locales":[{"locale":"en","title":"...","slug":"...","summary":"...","content":"<p>...</p>","meta_title":"...","meta_description":"...","tags":"..."}]}`;
    } else if (body.action === 'generate_meta') {
      userPrompt = `İçerik:
- Başlık: ${body.title}
- İçerik: ${body.content?.slice(0, 1000)}

Görev: SEO meta bilgilerini oluştur.
Dil: ${body.locale || 'tr'}

SADECE şu JSON formatında yanıt ver:
{"locales":[{"locale":"${body.locale || 'tr'}","title":"${body.title}","slug":"...","summary":"...","content":"","meta_title":"...","meta_description":"...","tags":"..."}]}`;
    }

    const raw = await callAI(config, SYSTEM_PROMPT, userPrompt);
    const result = extractJSON(raw);

    return reply.send({ ok: true, data: result });
  } catch (err: any) {
    return reply.code(500).send({ ok: false, error: { message: err.message || 'AI içerik hatası' } });
  }
}
