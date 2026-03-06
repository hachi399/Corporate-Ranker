# GitHub Pages + Gemini API デプロイ設定ガイド

このプロジェクトをGitHub Pagesで公開する際の、APIキーの安全な管理方法を説明します。

## ⚠️ 重要: セキュリティ警告

**GitHub Pagesは静的ホスティングのため、APIキーがクライアント側コードに埋め込まれ、ブラウザの開発者ツールで誰でも見ることができます。**

これはセキュリティ的に推奨されません。本番環境では以下の代替案を検討してください：
- Vercel Functions や Netlify Functions などのサーバーレス関数
- Cloud Functions for Firebase
- 独自のバックエンドサーバー

## 1. GitHub Secrets の設定（必須）

### リポジトリのSecretsページにアクセス
1. GitHubでリポジトリを開く
2. **Settings → Secrets and variables → Actions**
3. **"New repository secret"** をクリック

### 必須の Secret を追加

**Secret 名**: `VITE_GEMINI_API_KEY`
- **値**: https://aistudio.google.com/apikey から取得したAPIキー
- このキーはGitHub Actions のビルド時にクライアントコードに埋め込まれます

**必ず以下の点を確認:**
- Secret 名は正確に `VITE_GEMINI_API_KEY` （スペルを確認）
- 値は Gemini API キーそのもの
- 末尾に空白がないことを確認

## 2. GitHub Pages の設定

### リポジトリのPages設定
1. GitHubでリポジトリを開く → **Settings → Pages**
2. **Build and deployment** セクション:
   - **Source**: "Deploy from a branch" を選択
   - **Branch**: `main`
   - **Folder**: `/docs` を選択
3. **Save** をクリック

GitHub Actions が自動的にビルド・デプロイを実行します。

## 3. GitHub Actions ワークフローの流れ

```
git push
  ↓
GitHub Actions 実行
  ↓
npm ci (依存関係インストール)
  ↓
npm run lint (型チェック)
  ↓
npm run build (ビルド、VITE_GEMINI_API_KEY を環境変数として使用)
  ↓
docs/ に APIキーが埋め込まれたバンドルを生成
  ↓
GitHub Pages にアップロード
  ↓
https://hachi399.github.io/Corporate-Ranker/ で公開
```

## 4. ローカル開発環境での設定

ローカルで開発する場合は `.env` ファイルを使用：

```bash
cp .env.example .env
# .env に以下を記述
VITE_GEMINI_API_KEY=your_gemini_api_key
```

**注意**: `.env` は `.gitignore` に含まれているため、git にコミットされません

## 5. GitHub Pages キャッシュに関する注意

GitHub Pages は約15分間ファイルをキャッシュする場合があります。ビルド後、すぐに変更が反映されない場合：

1. **ブラウザキャッシュをクリア**
   ```
   Ctrl+Shift+R （Windows/Linux）
   Cmd+Shift+R （Mac）
   ```

2. **GitHub Pages キャッシュをクリア**
   - リポジトリの Settings を再度開く
   - Pages セクションで "Save" をクリック（変更なしでも可）

3. **ワークフローのステータスを確認**
   - GitHub → Actions タブ
   - 最新のワークフロー実行が完了しているか確認
   - Green チェックマークが表示されているか確認

## 6. トラブルシューティング

### GitHub Actions でビルドが失敗する場合

1. **WorkflowのログをWatchする**
   - GitHub → Actions タブ
   - 最新のワークフロー実行をクリック
   - "Build and Deploy to GitHub Pages" ジョブをクリック
   - **"Build for production"** ステップを展開して詳細ログを確認

2. **APIキーが正しく埋め込まれているか確認**
   ```
   ログ出力で以下のような行があるか確認:
   - タスク完了メッセージで APIs キーが使用されている
   ```

3. **Secret が正しく設定されているか確認**
   - Settings → Secrets and variables → Actions
   - `VITE_GEMINI_API_KEY` が存在するか
   - 値が空でないか（Secrets の値は表示されません）

4. **ワークフロー内の環境変数確認**
   - `.github/workflows/build.yml` で以下を確認:
   ```yaml
   - name: Build for production
     env:
       VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
     run: npm run build
   ```

5. **Vite 設定確認**
   - `vite.config.ts` で以下を確認:
   ```typescript
   const apiKey = process.env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
   define: {
     'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
   }
   ```

### スタイルシート（CSS）が読み込めない場合

1. **キャッシュをクリア**
   - Ctrl+Shift+R でハードリロード
   - 開発者ツール → Application → Storage → Clear All（Chrome）

2. **ワークフロー実行を確認**
   - GitHub Pages が正しいブランチとフォルダ（`/docs`）から配信されているか確認

3. **ファイルが生成されているか確認**
   ```bash
   # ローカルでビルドして確認
   ls -la docs/assets/
   ```

4. **ベースパスの確認**
   - `vite.config.ts` で `base: '/Corporate-Ranker/'` が設定されているか確認
   - `index.html` のCSS参照パスが `/Corporate-Ranker/assets/` で始まっているか確認

### アプリが起動するが API が動作しない場合

1. **ブラウザの開発者ツールでエラーを確認**
   - DevTools → Console タブでエラーメッセージを確認
   - "API key should be set when using the Gemini API" というエラーが出ていないか確認

2. **APIキーが埋め込まれているか確認**
   - DevTools → Sources タブ
   - `docs/assets/index-*.js` ファイルを開く
   - Ctrl+F で検索：APIキーの一部（例：`sk-`で始まる場合）
   - キーが見つかるか確認

3. **GitHub Secrets をもう一度確認**
   - Settings → Secrets and variables → Actions
   - `VITE_GEMINI_API_KEY` の値が正しいか確認
   - ブランク行がないか確認

4. **API クォータ確認**
   - https://aistudio.google.com/app/apikey で使い切っていないか確認
   - 無料枠は制限がある可能性があります

## 7. セキュリティ推奨策

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
