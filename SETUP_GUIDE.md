# 要件定義書: Corporate Ranker バックエンド移行 (Vercel版)

## 1. 目的

Vercel Serverless Functions を利用して Gemini API キーをサーバー側で管理し、フロントエンドには公開しない安全な構成へ移行する。

## 2. システム構成

- Frontend: React + Vite (TypeScript)
  - `/api/analyze` へ `fetch` でリクエスト送信
- Backend: Vercel Serverless Functions (TypeScript)
  - `api/analyze.ts` がリクエストごとに起動
- 特徴:
  - サーバー管理不要のフルマネージド
  - 同一ドメインでフロントとAPIを一体運用

## 3. 機能要件

### 3.1 API エンドポイント

- エンドポイント: `POST /api/analyze`
- 実装ファイル: `api/analyze.ts`
- 入力:
  - 分析: `{ companies: string[] }`
  - 詳細説明: `{ action: "explain", companyName, metricLabel, score, rawValue }`
- 出力:
  - 分析: `{ data: RawCompanyData[], usage: ApiUsage }`
  - 詳細説明: `{ text: string }`

### 3.2 セキュリティ

- Gemini APIキーは `GEMINI_API_KEY` として Vercel Environment Variables で管理
- フロントエンドで API キーを保持しない
- CORS:
  - `ALLOWED_ORIGINS` による許可オリジン制御
  - 未許可オリジンは `403` を返却

### 3.3 最適化

- 現在は Node.js Runtime で実装
- 必要に応じて `api/analyze.ts` の `runtime` を `edge` へ変更可能

## 4. 実装内容 (このリポジトリ)

- `api/analyze.ts` を追加
- `src/services/gemini.ts` をクライアント直呼び出しから `/api/analyze` 呼び出しへ変更
- `.env.example` を `GEMINI_API_KEY` / `ALLOWED_ORIGINS` 前提に変更
- `vite.config.ts` からクライアント向け API キー埋め込み処理を削除

## 5. ローカルセットアップ

1. 依存関係をインストール

```bash
npm install
```

2. 環境変数ファイル作成

```bash
cp .env.example .env
```

3. `.env` を編集

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
ALLOWED_ORIGINS="http://localhost:3000"
```

4. 起動

```bash
npm run dev
```

## 6. Vercel デプロイ手順

1. Vercel にリポジトリをインポート
2. Environment Variables を設定
   - `GEMINI_API_KEY` (必須)
   - `ALLOWED_ORIGINS` (推奨)
3. デプロイ実行
4. デプロイ後に `POST /api/analyze` の疎通確認

## 7. 受け入れ条件

- ブラウザ側コードに Gemini API キーが含まれない
- 企業分析が `/api/analyze` 経由で正常に返る
- 未許可 Origin からのアクセスが拒否される
- 既存の企業評価・詳細説明機能が維持される
