import { RawCompanyData, ApiUsage } from "../types";

function getAnalyzeEndpoint(): string | null {
  const base = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  if (base) {
    return `${base}/api/analyze`;
  }

  if (typeof window === 'undefined') {
    return '/api/analyze';
  }

  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return '/api/analyze';
  }

  return null;
}

function endpointConfigError(): Error {
  return new Error('API endpoint is not configured for this host. Set VITE_API_BASE_URL to your Vercel domain.');
}

async function safeJson(response: Response): Promise<any> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function safePayload(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return safeJson(response);
  }

  const text = await response.text();
  return { error: text.slice(0, 200) || 'Non-JSON response' };
}

export async function fetchCompanyData(companyNames: string[]): Promise<{ data: RawCompanyData[], usage: ApiUsage }> {
  const endpoint = getAnalyzeEndpoint();
  if (!endpoint) {
    throw endpointConfigError();
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ companies: companyNames }),
  });

  const payload = await safePayload(response);
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || '分析APIの呼び出しに失敗しました。');
  }

  return {
    data: Array.isArray(payload?.data) ? payload.data : [],
    usage: payload?.usage || { promptTokens: 0, candidatesTokens: 0, totalTokens: 0, estimatedCostUsd: 0 },
  };
}

export async function fetchExplanation(companyName: string, metricLabel: string, score: number, rawValue: any): Promise<string> {
  const endpoint = getAnalyzeEndpoint();
  if (!endpoint) {
    throw endpointConfigError();
  }

  const response = await fetch(endpoint, {
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

  const payload = await safePayload(response);
  if (!response.ok) {
    throw new Error(payload?.detail || payload?.error || '説明APIの呼び出しに失敗しました。');
  }

  return typeof payload?.text === 'string' ? payload.text : '説明を取得できませんでした。';
}

export async function fetchDebugApiKey(): Promise<{ ok: boolean; status: number; payload: any }> {
  const endpoint = getAnalyzeEndpoint();
  if (!endpoint) {
    return { ok: false, status: 0, payload: { error: endpointConfigError().message } };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'debugApiKey' }),
  });

  const payload = await safePayload(response);
  return { ok: response.ok, status: response.status, payload };
}

