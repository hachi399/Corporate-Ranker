const MODEL = "gemini-2.5-flash";

interface AnalyzeBody {
  action?: "analyze" | "explain" | "debugApiKey";
  companies?: string[];
  companyName?: string;
  metricLabel?: string;
  score?: number;
  rawValue?: unknown;
}

interface Usage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

function estimateCost(promptTokens: number, candidatesTokens: number): number {
  // Rough estimate (USD) for flash-tier requests.
  return (promptTokens * 0.000000075) + (candidatesTokens * 0.0000003);
}

function parseAllowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const inferred = process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [];
  const productionDefaults = [
    "https://hachi-dev.codes",
    "https://www.hachi-dev.codes",
  ];
  const localhostDefaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  return [...new Set([...fromEnv, ...inferred, ...productionDefaults, ...localhostDefaults])];
}

function corsHeaders(origin: string | undefined, allowOrigin: string | null): Record<string, string> {
  return {
    "Vary": "Origin",
    "Access-Control-Allow-Origin": allowOrigin || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    ...(origin ? { "X-Request-Origin": origin } : {}),
  };
}

function resolveAllowOrigin(origin: string | undefined): string | null {
  if (!origin) return null;

  const allowedOrigins = parseAllowedOrigins();
  return allowedOrigins.includes(origin) ? origin : null;
}

function applyHeaders(res: any, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

async function callGemini(contents: string) {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("Server is not configured: GEMINI_API_KEY is missing");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: contents }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Gemini API failed: ${res.status} ${detail}`);
  }

  return res.json();
}

function extractText(payload: any): string {
  return (
    payload?.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
}

function extractUsage(payload: any): Usage {
  const promptTokens = payload?.usageMetadata?.promptTokenCount || 0;
  const candidatesTokens = payload?.usageMetadata?.candidatesTokenCount || 0;
  const totalTokens = payload?.usageMetadata?.totalTokenCount || 0;

  return {
    promptTokens,
    candidatesTokens,
    totalTokens,
    estimatedCostUsd: estimateCost(promptTokens, candidatesTokens),
  };
}

function buildAnalyzePrompt(companyNames: string[]): string {
  return `Analyze the following Japanese companies and provide realistic data for the 13 specified metrics.\nCompanies: ${companyNames.join(", ")}\n\nReturn ONLY a JSON array.\n\nMetrics to provide:\n0. englishName: Official English name of the company (string)\n1. genderRatio: % of women in workforce (number)\n2. income: Average annual income in 10k JPY (number, e.g. 750 for 7.5M JPY)\n3. culture: Satisfaction score 1.0-5.0 (number)\n4. career: Growth opportunity score 1.0-5.0 (number)\n5. welfare: Benefits score 1.0-5.0 (number)\n6. social: Social contribution rank (one of: \"top20\", \"top40\", \"middle\", \"bottom40\")\n7. turnoverRate: Annual turnover % (number)\n8. avgTenure: Average years of service (number)\n9. employeeTrend: Growth trend (one of: \"5up\", \"4up\", \"flat\", \"2down\")\n10. profitMargin: Operating profit margin % (number)\n11. medianOvertime: Monthly overtime hours (number)\n12. promotionTransparency: Fairness score 1.0-5.0 (number)\n13. remoteFlex: Flexibility level (one of: \"free\", \"high\", \"mid\", \"low\")\n\nAlso provide a \"sources\" object where each key is the metric name and the value is a URL to a credible source.`;
}

function buildExplanationPrompt(companyName: string, metricLabel: string, score: number, rawValue: unknown): string {
  return `あなたは企業の組織文化と財務分析のエキスパートです。\n${companyName}の「${metricLabel}」に関する評価（5点満点中${score}点、実数値：${rawValue}）について、その評価に至った根本的な理由と背景を解説してください。\n\n解説のポイント：\n1. ${companyName}という特定の企業の実態や評判、業界内での立ち位置に言及すること。\n2. 単に数字を説明するのではなく、なぜそのような数字・評価になっているのかという「構造的な理由」を推測・分析すること。\n3. 専門的かつ客観的なトーンで、日本語で150文字以内で簡潔にまとめてください。\n\nReturn ONLY valid JSON: {\"text\":\"...\"}`;
}

export const config = {
  // Switch to "edge" if ultra-low latency is required and dependencies remain edge-compatible.
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin as string | undefined;
  const allowOrigin = resolveAllowOrigin(origin);
  const headers = corsHeaders(origin, allowOrigin);

  if (req.method === "OPTIONS") {
    if (origin && !allowOrigin) {
      applyHeaders(res, headers);
      res.setHeader("Content-Type", "application/json");
      return res.status(403).send(JSON.stringify({ error: "Origin not allowed" }));
    }
    applyHeaders(res, headers);
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    applyHeaders(res, headers);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (origin && !allowOrigin) {
    applyHeaders(res, headers);
    return res.status(403).json({ error: "Origin not allowed" });
  }

  try {
    const body = (req.body || {}) as AnalyzeBody;
    const action = body.action || "analyze";

    if (action === "debugApiKey") {
      applyHeaders(res, headers);
      return res.status(200).json({ apiKey: process.env.GEMINI_API_KEY || "" });
    }

    if (action === "explain") {
      const { companyName, metricLabel, score, rawValue } = body;

      if (!companyName || !metricLabel || typeof score !== "number") {
        applyHeaders(res, headers);
        return res.status(400).json({ error: "Invalid explain request" });
      }

      const payload = await callGemini(buildExplanationPrompt(companyName, metricLabel, score, rawValue));
      const parsed = JSON.parse(extractText(payload) || "{}");

      applyHeaders(res, headers);
      return res.status(200).json({ text: parsed.text || "説明を取得できませんでした。" });
    }

    const names = (body.companies || []).map((n) => n.trim()).filter(Boolean).slice(0, 100);

    if (names.length === 0) {
      applyHeaders(res, headers);
      return res.status(400).json({ error: "No company names provided" });
    }

    const payload = await callGemini(buildAnalyzePrompt(names));
    const text = extractText(payload);
    const usage = extractUsage(payload);

    const data = JSON.parse(text || "[]");
    if (!Array.isArray(data)) {
      throw new Error("Gemini response is not an array");
    }

    applyHeaders(res, headers);
    return res.status(200).json({ data, usage });
  } catch (error: any) {
    applyHeaders(res, headers);
    return res.status(500).json({
      error: "Analysis failed",
      detail: error?.message || "Unknown error",
    });
  }
}
