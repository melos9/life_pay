# LifePay - 個人資産管理アプリ

私自身の生活に特化して資産管理をするWebアプリです。

## 機能

- **ダッシュボード**: 総資産・今月の収支をひと目で確認
- **収支記録**: 収入・支出をカテゴリ別に記録・管理（追加・編集・削除）
- **資産口座**: 銀行口座・貯蓄・投資・現金などの口座残高を管理
- **月次レポート**: 月別の収支サマリーとカテゴリ内訳を確認

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
