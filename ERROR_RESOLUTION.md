# 🔧 実行エラーの解決ガイド

## 出ているエラーについて

### エラー 1: `Verify stylesheet URLs - net::ERR_NAME_NOT_RESOLVED`
**原因**: CSSファイルが正しく読み込まれていない（ブラウザキャッシュまたはGitHub Pagesの遅延）

**解決方法:**
```bash
# 1. ブラウザキャッシュをクリア
Ctrl+Shift+R （Windows/Linux）
Cmd+Shift+R （Mac）

# 2. キャッシュをすべてクリア
開発者ツール → Application → Clear Storage → Clear All
```

### エラー 2: `API key should be set when using the Gemini API.`
**原因**: GitHub Secrets が正しく設定されていないか、ワークフロー実行が完了していない

**解決方法:**

#### Step 1: GitHub Secrets を確認
1. GitHub リポジトリを開く
2. **Settings → Secrets and variables → Actions**
3. `VITE_GEMINI_API_KEY` が存在するか確認
4. 値が空でないか確認（値は表示されません）

#### Step 2: GitHub Actions の実行を確認
1. GitHub リポジトリを開く
2. **Actions** タブをクリック
3. **"Build and Deploy to GitHub Pages"** をクリック
4. ✅ 最新の実行が **Green チェック** になっているか確認
5. ❌ 赤い × が表示されている場合はクリックして詳細ログを確認

#### Step 3: ワークフロー実行ログを確認
1. 失敗したワークフロー実行をクリック
2. **"Build and Deploy to GitHub Pages"** ジョブをクリック
3. **"Build for production"** ステップを展開
4. エラーメッセージを確認

**エラーメッセージ別の対策:**
- `VITE_GEMINI_API_KEY not found` → Secrets を再確認
- `npm ERR!` → `npm install` がうまくいっているか確認
- `Cannot find module` → 依存関係のインストール失敗

## ✅ 動作確認チェックリスト

- [ ] GitHub Secrets に `VITE_GEMINI_API_KEY` が設定されている
- [ ] GitHub Actions が ✅ (Green) 状態で実行完了している
- [ ] ブラウザでハードリロード（Ctrl+Shift+R）を実行した
- [ ] 開発者ツール → Console でエラーメッセージを確認した
- [ ] アプリが読み込まれ、企業名を入力できる
- [ ] 「分析開始」をクリックすると API が呼び出される

## 🔍 追加の確認方法

### 1. ビルド出力を確認
```bash
# ローカルでビルド（.env に VITE_GEMINI_API_KEY が設定されている場合）
VITE_GEMINI_API_KEY=test npm run build
ls -la docs/assets/
```

### 2. JavaScript ファイルに API キーが含まれているか確認
```bash
# ビルト出力の JS ファイルを検索
grep -r "test" docs/assets/index-*.js | head -1
```

コマンド出力に `test_api_key` が含まれる場合 → API キーが正しく埋め込まれている

### 3. 開発者ツールで確認
1. ブラウザで https://hachi399.github.io/Corporate-Ranker/ を開く
2. F12 キーで開発者ツール開く
3. **Sources** タブをクリック
4. `docs/assets/index-*.js` ファイルをクリック
5. Ctrl+F で API キーの一部を検索（例：`sk-` またはキーの先頭数文字）
6. キーが見つかるか確認

## 📞 さらにサポートが必要な場合

ワークフロー実行ログのスクリーンショットをご確認の上、以下を確認してください：

1. **GitHub Pages は正しく設定されているか?**
   - Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main`, Folder: `/docs`

2. **Secrets の値は本当に正しいか?**
   - Gemini API キー（`sk-`で始まる）をコピーペーストした時に、スペースが含まれていないか確認
   - テキストハイライトしてコピーするとスペースが含まれることがあります

3. **リポジトリは Public か Private か?**
   - GitHub Pages は Public リポジトリで無料で使用できます
   - Private リポジトリでは有料プラン（GitHub Pro 以上）が必要です

---

**問題が解決しない場合は、GitHub Actions のビルドログ全体をご確認ください。**
