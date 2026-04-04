import { RawCompanyData, ApiUsage } from "../types";

async function safeJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function fetchCompanyData(companyNames: string[]): Promise<{ data: RawCompanyData[], usage: ApiUsage }> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companies: companyNames }),
  });

  const payload = await safeJson(response);
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || '分析APIの呼び出しに失敗しました。');
  }

  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    usage: payload?.usage || { promptTokens: 0, candidatesTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
  };
}

export async function fetchExplanation(companyName: string, metricLabel: string, score: number, rawValue: any): Promise<string> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'explain',
      companyName,
      metricLabel,
      score,
      rawValue,
    }),
  });

  const payload = await safeJson(response);
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || '説明APIの呼び出しに失敗しました。');
  }

  return typeof payload?.text === 'string' ? payload.text : '説明を取得できませんでした。';
}

