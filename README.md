# LifePay - 個人資産管理アプリ

私自身の生活に特化して資産管理をするWebアプリです。

## 機能

- **ダッシュボード**: 総資産・今月の収支をひと目で確認
- **収支記録**: 収入・支出を記録・管理（追加・編集・削除）。支出は通常支出と大型支出（学費など）の2つに分類
- **資産口座**: 銀行口座・貯蓄・投資・現金などの口座残高を管理
- **月次レポート**: 月別の収支サマリーと内訳を確認
- **予測ツール**: 過去の収支から将来の資産推移を予測。予定している大型支出（学費など）の登録、貯蓄目標の達成見込みも算出可能

## 技術スタック

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- データ永続化: `localStorage`（ブラウザ内保存）

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと使えます。

## ビルド

```bash
npm run build
npm start
```
