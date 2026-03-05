# GitHub Pages 自動デプロイ設定チェックリスト

このチェックリストに従って、GitHub Secrets とGitHub Pages を正しく設定してください。

## ✅ 実施すべき手順

### Step 1: GitHub Secrets の設定（最初に1回のみ）

- [ ] GitHub でリポジトリを開く
- [ ] **Settings → Secrets and variables → Actions** に移動
- [ ] **"New repository secret"** をクリック
- [ ] 以下の情報を入力：
  - **Name**: `VITE_GEMINI_API_KEY` （スペルを正確に）
  - **Secret**: https://aistudio.google.com/apikey から取得したAPIキー
- [ ] **Add secret** をクリック
- [ ] Secret が `VITE_GEMINI_API_KEY` として登録されたか確認

### Step 2: GitHub Pages の設定（最初に1回のみ）

- [ ] GitHub でリポジトリを開く
- [ ] **Settings → Pages** に移動
- [ ] **Build and deployment** セクション:
  - [ ] **Source**: "Deploy from a branch" を選択
  - [ ] **Branch**: `main` を選択
  - [ ] **Folder**: `/docs` を選択
- [ ] **Save** をクリック

### Step 3: ローカル開発環境の準備

```bash
# ローカルで実施（1回のみ）
cp .env.example .env
```

- [ ] `.env` ファイルが作成されたことを確認
- [ ] `.env` に `VITE_GEMINI_API_KEY=your_api_key` を追加
- [ ] `npm install` を実行

### Step 4: デプロイ確認

- [ ] コードを編集
- [ ] Git にコミット:
  ```bash
  git add .
  git commit -m "feat: your feature"
  git push origin main
  ```
- [ ] GitHub の **Actions** タブでワークフロー実行を確認
- [ ] "Build and Deploy to GitHub Pages" が緑（成功）であることを確認
- [ ] `https://hachi399.github.io/Corporate-Ranker/` にアクセスして機能を確認

## 🔍 トラブルシューティング

### ワークフローが失敗する場合

1. **Actions** タブで失敗したワークフローをクリック
2. **Build and Deploy to GitHub Pages** ジョブをクリック
3. **Build for production** ステップを展開してエラーメッセージを確認

**一般的なエラー:**
- `VITE_GEMINI_API_KEY undefined` → Secret が正しく設定されていない
- `Cannot find module '@google/genai'` → `npm install` が必要
- `docs not found` → ビルドが失敗している

### API が動作しない場合

1. ブラウザの開発者ツール → Console でエラーを確認
2. 以下を確認：
   - APIキーが有効（有効期限切れなし）
   - Gemini API の無料枠に余裕がある
   - ネットワークエラーがないか

## 📋 ファイル構成と役割

| ファイル | 役割 |
|---------|------|
| `.github/workflows/build.yml` | GitHub Actions の自動ビルド・デプロイ設定 |
| `vite.config.ts` | VITE_GEMINI_API_KEY を環境変数として埋め込み |
| `src/services/gemini.ts` | 埋め込まれたAPIキーで Gemini API を呼び出し |
| `docs/` | GitHub Pages でホストされる静的ファイル |
| `.env` | ローカル開発用の環境変数（`.gitignore` で保護） |

## 💡 重要なポイント

- ✅ **Secret 名は正確に** `VITE_GEMINI_API_KEY` である必要があります
- ✅ **`.env` は git にコミットされません** - 安全です
- ✅ **本番環境では GitHub Secrets から自動注入** - API キーは安全に管理されます
- ⚠️ **クライアントコードに埋め込まれる** - APIキーを見られたくない場合はサーバーレス関数を使用してください

## 🚀 デプロイ後の確認

```bash
# ✅ アプリが正常に動作しているか確認
# https://hachi399.github.io/Corporate-Ranker/
# - ページが読み込まれるか
# - コンポーネントが表示されるか
# - API が呼び出せるか
```

---

**何か問題が発生した場合は、[.github/SECRETS_SETUP.md](./.github/SECRETS_SETUP.md) の詳細なトラブルシューティングセクションを参照してください。**
