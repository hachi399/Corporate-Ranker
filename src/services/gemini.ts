import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { RawCompanyData, ApiUsage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function fetchCompanyData(companyNames: string[]): Promise<{ data: RawCompanyData[], usage: ApiUsage }> {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following Japanese companies and provide realistic data for the 13 specified metrics. 
    Companies: ${companyNames.join(", ")}
    
    Metrics to provide:
    0. englishName: Official English name of the company (string)
    1. genderRatio: % of women in workforce (number)
    2. income: Average annual income in 10k JPY (number, e.g. 750 for 7.5M JPY)
    3. culture: Satisfaction score 1.0-5.0 (number)
    4. career: Growth opportunity score 1.0-5.0 (number)
    5. welfare: Benefits score 1.0-5.0 (number)
    6. social: Social contribution rank (one of: "top20", "top40", "middle", "bottom40")
    7. turnoverRate: Annual turnover % (number)
    8. avgTenure: Average years of service (number)
    9. employeeTrend: Growth trend (one of: "5up", "4up", "flat", "2down")
    10. profitMargin: Operating profit margin % (number)
    11. medianOvertime: Monthly overtime hours (number)
    12. promotionTransparency: Fairness score 1.0-5.0 (number)
    13. remoteFlex: Flexibility level (one of: "free", "high", "mid", "low")
    
    Also provide a "sources" object where each key is the metric name and the value is a URL to a credible source (e.g., official company site, government data, or reliable news) that supports the data provided.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            englishName: { type: Type.STRING },
            genderRatio: { type: Type.NUMBER },
            income: { type: Type.NUMBER },
            culture: { type: Type.NUMBER },
            career: { type: Type.NUMBER },
            welfare: { type: Type.NUMBER },
            social: { type: Type.STRING },
            turnoverRate: { type: Type.NUMBER },
            avgTenure: { type: Type.NUMBER },
            employeeTrend: { type: Type.STRING },
            profitMargin: { type: Type.NUMBER },
            medianOvertime: { type: Type.NUMBER },
            promotionTransparency: { type: Type.NUMBER },
            remoteFlex: { type: Type.STRING },
            sources: {
              type: Type.OBJECT,
              properties: {
                genderRatio: { type: Type.STRING },
                income: { type: Type.STRING },
                culture: { type: Type.STRING },
                career: { type: Type.STRING },
                welfare: { type: Type.STRING },
                social: { type: Type.STRING },
                turnoverRate: { type: Type.STRING },
                avgTenure: { type: Type.STRING },
                employeeTrend: { type: Type.STRING },
                profitMargin: { type: Type.STRING },
                medianOvertime: { type: Type.STRING },
                promotionTransparency: { type: Type.STRING },
                remoteFlex: { type: Type.STRING },
              },
              required: [
                "genderRatio", "income", "culture", "career", "welfare", 
                "social", "turnoverRate", "avgTenure", "employeeTrend", 
                "profitMargin", "medianOvertime", "promotionTransparency", "remoteFlex"
              ]
            }
          },
          required: [
            "name", "englishName", "genderRatio", "income", "culture", "career", "welfare", 
            "social", "turnoverRate", "avgTenure", "employeeTrend", 
            "profitMargin", "medianOvertime", "promotionTransparency", "remoteFlex", "sources"
          ]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    const usageMetadata = response.usageMetadata;
    
    const promptTokens = usageMetadata?.promptTokenCount || 0;
    const candidatesTokens = usageMetadata?.candidatesTokenCount || 0;
    const totalTokens = usageMetadata?.totalTokenCount || 0;
    
    const estimatedCostUsd = (promptTokens * 0.000000075) + (candidatesTokens * 0.0000003);

    return {
      data,
      usage: {
        promptTokens,
        candidatesTokens,
        totalTokens,
        estimatedCostUsd
      }
    };
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return { data: [], usage: { promptTokens: 0, candidatesTokens: 0, totalTokens: 0, estimatedCostUsd: 0 } };
  }
}

export async function fetchExplanation(companyName: string, metricLabel: string, score: number, rawValue: any): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `あなたは企業の組織文化と財務分析のエキスパートです。
    ${companyName}の「${metricLabel}」に関する評価（5点満点中${score}点、実数値：${rawValue}）について、その評価に至った根本的な理由と背景を解説してください。
    
    解説のポイント：
    1. ${companyName}という特定の企業の実態や評判、業界内での立ち位置に言及すること。
    2. 単に数字を説明するのではなく、なぜそのような数字・評価になっているのかという「構造的な理由」を推測・分析すること。
    3. 専門的かつ客観的なトーンで、日本語で150文字以内で簡潔にまとめてください。`,
  });
  return response.text || "説明を取得できませんでした。";
}
