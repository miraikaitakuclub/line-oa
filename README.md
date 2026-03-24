# line-oa

未来開拓倶楽部の公式ライン。

## プロジェクト構成

```
liff-app/     - LIFFアプリ（React + Vite + TypeScript）
functions/    - Firebase Cloud Functions（認証・スプレッドシート同期）
scripts/      - リッチメニュー設定スクリプト
```

## セットアップ手順

### 1. 前提条件

- Node.js 20+
- Firebase CLI (`npm install -g firebase-tools`)
- LINE Developers Console でチャネル作成済み
- Firebase プロジェクト作成済み（Blaze プラン）

### 2. 環境変数の設定

`.env.example` を参考に、以下のファイルを作成:

**`liff-app/.env`**
```
VITE_LIFF_ID=your_liff_id
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**`functions/.env`**
```
LINE_CHANNEL_ID=your_line_channel_id
GOOGLE_SHEET_ID=your_google_sheet_id
```

### 3. 依存関係のインストール

```bash
cd liff-app && npm install
cd ../functions && npm install
```

### 4. Firebase プロジェクトの設定

```bash
firebase login
firebase use --add  # .firebaserc の project ID を設定
```

### 5. Google スプレッドシートの準備

1. 新しいスプレッドシートを作成
2. ヘッダー行を追加: `LINE User ID | 表示名 | 学校名 | 学年 | 学部 | 学科 | 興味あるゼミ・PJ | ステータス | 入部日 | 更新日`
3. Firebase サービスアカウント（`firebase-adminsdk-xxxxx@project-id.iam.gserviceaccount.com`）に編集者権限を付与

### 6. デプロイ

```bash
cd liff-app && npm run build
cd ..
firebase deploy
```

### 7. LIFF エンドポイントの設定

LINE Developers Console で LIFF アプリのエンドポイント URL を `https://{project-id}.web.app` に設定

### 8. リッチメニューの設定

```bash
LINE_CHANNEL_ACCESS_TOKEN=xxx LIFF_ID=xxx npx ts-node scripts/setup-rich-menu.ts
```

※ `scripts/rich-menu-image.png`（2500x843px）を事前に配置してください。
左半分：「入退部」、右半分：「公式ウェブサイト」のデザイン。

## リッチメニュー

| ボタン | アクション |
|--------|-----------|
| 入退部 | LIFF アプリを開く（入部登録 / 情報編集 / 退部） |
| 公式ウェブサイト | https://miraikaitaku.com/ を開く |

## セキュリティ

- LINE アクセストークンをサーバーサイドで検証してから Firebase カスタムトークンを発行
- Firestore セキュリティルールにより、自分のデータのみ読み書き可能
- 直接削除は不可（退部は `status: 'left'` に更新）
