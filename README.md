# LifePay - 個人資産管理アプリ

私自身の生活に特化して資産管理をするWebアプリです。

## 機能

- **ダッシュボード**: 総資産・今月の収支をひと目で確認
- **収支記録**: 収入・支出を記録・管理（追加・編集・削除）。支出は通常支出と大型支出（学費など）の2つに分類
- **資産口座**: 銀行口座・貯蓄・投資・現金などの口座残高を管理
- **月次レポート**: 月別の収支サマリーと内訳を確認
- **予測ツール (FIRE シミュレーター)**: fire.onl.jp 風の早期リタイアシミュレーター。現在年齢・リタイア希望年齢・寿命・年収・支出・運用利回り・インフレ率・年金などを自由にカスタマイズでき、生涯の資産推移、FIRE 達成年齢（4% ルール）、資産寿命を計算可能。設定は localStorage に保存され、口座残高や取引履歴から自動入力もできます。

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
