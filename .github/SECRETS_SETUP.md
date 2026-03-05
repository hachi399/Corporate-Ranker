# GitHub Pages + Gemini API デプロイ設定ガイド

このプロジェクトをGitHub Pagesで公開する際の、APIキーの安全な管理方法を説明します。

## ⚠️ 重要: セキュリティ警告

**GitHub Pagesは静的ホスティングのため、APIキーがクライアント側コードに埋め込まれ、ブラウザの開発者ツールで誰でも見ることができます。**

これはセキュリティ的に推奨されません。本番環境では以下の代替案を検討してください：
- Vercel Functions や Netlify Functions などのサーバーレス関数
- Cloud Functions for Firebase
- 独自のバックエンドサーバー

## 1. GitHub Pages の設定

### リポジトリのPages設定
1. GitHubでリポジトリを開く → Settings → Pages
2. **Build and deployment** セクション:
   - **Source**: "Deploy from a branch" を選択
   - **Branch**: `main`
   - **Folder**: `/docs` を選択
3. 保存

## 2. ローカル開発でのAPIキー設定

`.env` ファイルを作成してAPIキーを設定：

```bash
cp .env.example .env
# .env に以下を記述
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**注意**: `.env` は `.gitignore` に含まれているため、git にコミットされません

## 3. ビルドとデプロイの手順

### ステップ1: ローカルでビルド
```bash
npm run build
# docs/ ディレクトリが生成される
```

### ステップ2: GitHub にプッシュ
```bash
git add .
git commit -m "chore: rebuild docs for deployment"
git push origin main
```

### ステップ3: GitHub Pages で確認
```
https://hachi399.github.io/Corporate-Ranker/
```

## 4. GitHub Actions は不요（非使用）

デプロイに GitHub Actions を使用しないため、Secrets は不要です。

デプロイフロー：
```
ローカルでビルド → docs/ に出力 → git add → push → GitHub Pages で自動公開
```

## 5. CI/CD を使用する場合（オプション）

GitHub Actions でビルドを自動化したい場合は、以下の手順で `.github/workflows/build.yml` を設定します：

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.x'
      - run: npm ci
      - run: npm run lint
      - run: VITE_GEMINI_API_KEY=${{ secrets.GEMINI_API_KEY }} npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './docs'
      - uses: actions/deploy-pages@v4
```

その場合、Settings → Secrets に `GEMINI_API_KEY` を追加してください。

## 6. セキュリティ推奨策

### オプションA: Vercel Functionsに移行
```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトをデプロイ
vercel

# APIキーをVercelの環境変数に設定
vercel env add VITE_GEMINI_API_KEY
```

### オプションB: Netlify Functions
```bash
# Netlify CLIをインストール
npm i -g netlify-cli

# プロジェクトをデプロイ
netlify deploy --prod

# APIキーをNetlifyの環境変数に設定
netlify env:set VITE_GEMINI_API_KEY your_api_key
```

## 7. トラブルシューティング

### ビルドが失敗する場合
- Secretsが正しく設定されているか確認
- リポジトリのActions権限を確認

### API呼び出しが失敗する場合
- ブラウザの開発者ツールでAPIキーが正しく埋め込まれているか確認
- Gemini APIのクォータ制限を確認

## 8. 推奨される本番構成

```
Frontend (GitHub Pages) → APIキー埋め込み（⚠️ 非推奨）
    ↓
Backend (Vercel Functions) → APIキー安全管理（推奨）
```

より安全な構成にするため、バックエンドAPIサーバーの使用を検討してください。
```bash
# vercel コマンドでSecretsを設定
vercel env add secret GEMINI_API_KEY
# プロンプトでAPIキーを入力
```

## 4. セキュリティベストプラクティス

✅ Do:
- APIキーは必ずSecretsで管理する
- デッドリンクを有効にせず、引数を渡す
- GitHub Actions内でのみシークレットを使用する

❌ Don't:
- APIキーをコードにハードコードしない
- APIキーをコミットメッセージやドキュメントに含めない
- APIキーをログに出力しない

## 5. ワークフローでの使用例

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    steps:
      - uses: actions/checkout@v4
      - name: Deploy with secure API key
        run: npm run build
```

## 6. トラブルシューティング

### ワークフローで環境変数が見つからない場合
1. Secrets が正しく設定されているか確認
2. Secrets 名がワークフローファイルと一致しているか確認
3. リポジトリの権限を確認

### ローカルでのテスト
```bash
# ローカル関数でワークフローをシミュレート
node --require dotenv/config src/server.ts
```
