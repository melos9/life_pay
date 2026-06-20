import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "使い方",
  description:
    "ライフプラン資産シミュレーターの使い方。入力手順、結果の見方、注意点と免責事項をまとめています。",
  alternates: {
    canonical: "/how-to-use",
  },
};

export default function HowToUsePage() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">使い方</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        このシミュレーターは、現在の資産・収入・支出・年金・家族構成をもとに、将来の資産推移を年次で試算するツールです。
      </p>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">基本的な手順</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>「基本情報」で現在年齢、リタイア年齢、想定寿命、現在資産、年収を入力します。</li>
        <li>「リタイア前の支出」「リタイア後の支出」で生活費・住居費・その他支出を設定します。</li>
        <li>必要に応じて「子供の費用」「配偶者」「リタイア後の収入（サイド収入）」を入力します。</li>
        <li>「計算する」を押すと、資産推移グラフと支出内訳グラフが表示されます。</li>
      </ol>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">結果の見方</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>「資産推移」は年末時点の資産残高です。リタイア年齢、年金開始年齢、資産枯渇年齢を確認できます。</li>
        <li>「支出の推移（内訳）」は、生活費・住居費・その他・子供費の積み上げ推移です。</li>
        <li>各グラフはホバーでその年の金額詳細を確認できます。</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">データの取り扱い</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>入力したシミュレーションデータはブラウザ内に保存され、サーバーへ送信されません。</li>
        <li>詳しくは<Link href="/privacy-policy" className="ml-1 underline underline-offset-2 text-zinc-900">プライバシーポリシー</Link>をご確認ください。</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">免責事項（必ずご確認ください）</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        試算結果の取り扱い、将来非保証、責任範囲などの重要事項は、
        <Link href="/disclaimer" className="underline underline-offset-2 text-zinc-900">
          免責事項ページ
        </Link>
        にまとめています。ご利用前にご確認ください。
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          シミュレーターへ戻る
        </Link>
        <Link href="/privacy-policy" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          プライバシーポリシー
        </Link>
        <Link href="/disclaimer" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          免責事項
        </Link>
        <Link href="/contact" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          お問い合わせ
        </Link>
      </div>
    </section>
  );
}
