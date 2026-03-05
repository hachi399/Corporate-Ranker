# Corporate Ranker - GitHub Pages Setup & Running Guide

## 🚨 重要: セキュリティ警告

**この構成ではAPIキーがクライアント側コードに埋め込まれ、ブラウザで誰でも見ることができます。**

より安全な構成にするため、以下の代替案を検討してください：
- [Vercel Functions](https://vercel.com/docs/functions) でのバックエンドAPI
- [Netlify Functions](https://docs.netlify.com/functions/overview/) でのサーバーレス関数
- Cloud Functions for Firebase

## 🚀 **セットアップ手順**

### 1. GitHub Secrets の設定（必須）

**ステップ1: リポジトリの Secrets に API キーを登録**
1. GitHub でリポジトリを開く
2. **Settings → Secrets and variables → Actions**
3. **"New repository secret"** をクリック
4. 以下の情報を入力：
   - **Name**: `VITE_GEMINI_API_KEY` （正確にスペルを確認！）
   - **Secret**: https://aistudio.google.com/apikey から取得したAPIキー
5. **Add secret** をクリック

### 2. GitHub Pages の設定

**ステップ2: GitHub Pages をセットアップ**
1. リポジトリの **Settings → Pages**
2. **Build and deployment** セクション:
   - **Source**: "Deploy from a branch"
   - **Branch**: `main`
   - **Folder**: `/docs`
3. **Save**

これで GitHub Actions が自動的にビルド・デプロイを実行します

### 3. ローカル開発用の環境変数設定

**ステップ3: ローカル環境の準備**
```bash
cp .env.example .env
# .env ファイルを編集して VITE_GEMINI_API_KEY を設定
```

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
# .env ファイルに VITE_GEMINI_API_KEY を設定してから実行
npm run dev
```

実行内容：
- 開発サーバーが `http://localhost:3000` で起動
- Hot reload 対応

## 🚀 **自動デプロイ（GitHub Actions）**

### GitHub Actions でのデプロイフロー

コードを `main` ブランチにプッシュすると、自動的に以下が実行されます：

```
git push
  ↓
GitHub Actions 実行
  ↓
npm ci
  ↓
npm run lint
  ↓
VITE_GEMINI_API_KEY (from Secrets) を使用して npm run build
  ↓
docs/ に APIキー付きでビルド
  ↓
GitHub Pages にアップロード
  ↓
https://hachi399.github.io/Corporate-Ranker/ で自動公開
```

### デプロイ手順

1. **ローカルでコードを修正**
   ```bash
   # コードを編集
   ```

2. **GitHub にプッシュ**
   ```bash
   git add .
   git commit -m "feat: update description"
   git push origin main
   ```

3. **GitHub Actions が自動実行**
   - リポジトリの **Actions** タブで進行状況を確認
   - ビルドとデプロイが自動的に実行されます

4. **GitHub Pages で確認**
   - `https://hachi399.github.io/Corporate-Ranker/` にアクセス

### 重要な注意

- **GitHub Secrets に `VITE_GEMINI_API_KEY` が正しく設定されていることが必須です**
- ローカルでは `.env` ファイルを使用（コミットされません）
- 本番デプロイでは GitHub Secrets から自動的に API キーが注入されます

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
