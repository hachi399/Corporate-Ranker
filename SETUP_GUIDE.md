# Corporate Ranker - GitHub Pages Setup & Running Guide

## 🚨 重要: セキュリティ警告

**この構成ではAPIキーがクライアント側コードに埋め込まれ、ブラウザで誰でも見ることができます。**

より安全な構成にするため、以下の代替案を検討してください：
- [Vercel Functions](https://vercel.com/docs/functions) でのバックエンドAPI
- [Netlify Functions](https://docs.netlify.com/functions/overview/) でのサーバーレス関数
- Cloud Functions for Firebase

## 🚀 **セットアップ手順**

### 1. GitHub Pages の有効化

リポジトリのSettings → Pagesで以下を設定：

1. **Build and deployment** セクションで:
   - **Source**: "Deploy from a branch"
   - **Branch**: `main` + `/docs` folder
   
2. 保存

3. GitHub Pages が有効化されます：
   - 公開URL: `https://hachi399.github.io/Corporate-Ranker/`

### 2. GitHub Secrets の設定（ローカルテスト用）

ローカルで開発する場合、`.env` ファイルを作成：

```bash
cp .env.example .env
# VITE_GEMINI_API_KEY に Gemini API キーを設定
```

GitHub Pages デプロイ時には GitHub Secrets は不要です（ビルドに APIキーが埋め込まれます）

### 3. ローカル開発は環境変数が必須

```bash
VITE_GEMINI_API_KEY=your_api_key npm run dev
```

または `.env` ファイルで設定後に `npm run dev`

### 4. 依存パッケージのインストール

```bash
npm install
```

### 5. TypeScript のビルドチェック

```bash
npm run lint
```

## 🏃 **ローカル開発実行**

### 開発環境で実行

```bash
# APIキーを設定してから実行
VITE_GEMINI_API_KEY=your_api_key npm run dev

# または .env ファイルを作成してから実行
npm run dev
```

実行内容：
- 開発サーバーが `http://localhost:3000` で起動
- Hot reload 対応

## 🚀 **GitHub Pages へのデプロイ**

### デプロイ手順

1. **ローカルでビルド**
   ```bash
   VITE_GEMINI_API_KEY=your_api_key npm run build
   ```
   - `docs/` ディレクトリが生成される

2. **GitHub にプッシュ**
   ```bash
   git add .
   git commit -m "Build: Update docs for deployment"
   git push origin main
   ```

3. **GitHub Pages で公開**
   - 自動的に `https://hachi399.github.io/Corporate-Ranker/` で公開されます

### 重要な注意

- **APIキーはビルド時に埋め込まれます** - クライアント側に埋め込まれるため、誰でも見ることができます
- `docs/` ディレクトリはコミットが必須です (`.gitignore` から除外されています)

## 📁 **プロジェクト構造**

```
src/
├── main.tsx           # React エントリーポイント
├── App.tsx            # メインコンポーネント
├── types.ts           # TypeScript 型定義
├── components/        # React コンポーネント
├── services/
│   └── gemini.ts      # Gemini API サービス（クライアント直接呼び出し）
└── utils/
    ├── pdf.ts
    └── scoring.ts
```

## 🔧 **推奨される開発フロー**

1. **ローカル開発**
   ```bash
   npm run dev
   ```
   - Hot reload 対応

2. **コード修正**
   - 変更は自動反映

3. **テスト・ビルド**
   ```bash
   npm run lint    # 型チェック
   npm run build   # 本番ビルド
   ```

## ⚠️ **セキュリティに関する注意事項**

### 現在の構成の問題点
- APIキーがクライアントコードに埋め込まれる
- ブラウザの開発者ツールでAPIキーが見える
- 悪用されるリスクがある

### 推奨される改善策

#### オプション1: Vercel Functions への移行
```bash
# Vercel CLIインストール
npm i -g vercel

# デプロイ
vercel

# APIキーを安全に設定
vercel env add GEMINI_API_KEY
```

#### オプション2: Netlify Functions
```bash
# Netlify CLIインストール
npm i -g netlify-cli

# デプロイ
netlify deploy --prod

# APIキーを安全に設定
netlify env:set GEMINI_API_KEY your_api_key
```

## 📝 **ライセンス**

このプロジェクトは Google AI Studio によって作成されました。
