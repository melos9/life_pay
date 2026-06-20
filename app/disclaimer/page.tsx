import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "免責事項",
  description:
    "ライフプラン資産シミュレーターの利用上の注意、非保証事項、責任範囲についてご案内します。",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">免責事項</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        本シミュレーションは、将来の資金計画を考えるための参考情報を提供するものです。ご利用にあたっては、以下の内容をご確認ください。
      </p>

      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>本シミュレーションは、過去データなどをもとに試算した参考情報であり、実際の結果とは異なる場合があります。</li>
        <li>本シミュレーションの内容は、将来の結果を予測・保証するものではありません。</li>
        <li>本シミュレーションおよび掲載情報のご利用により生じた損害（直接・間接を問いません）について、本サービス運営者は責任を負いかねます。実際の資産運用や投資判断は、ご自身の責任でご判断ください。</li>
        <li>本シミュレーションは、入力いただいたおおよその収入・支出条件をもとに、将来の資金計画や生活設計を考えるための情報提供を目的としています。診断結果（キャッシュフロー表）は目安としてご利用ください。</li>
        <li>ご入力いただいた情報は、シミュレーション診断以外の目的には利用しません。また、これらの情報を本サービス運営者が取得・蓄積することはありません。</li>
        <li>本シミュレーションは、特定の金融商品の取引を推奨・勧誘するものではありません。</li>
        <li>掲載情報の正確性には配慮していますが、正確性・完全性・信頼性を保証するものではありません。</li>
        <li>本シミュレーションの内容は、予告なく変更する場合があります。</li>
      </ul>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          シミュレーターへ戻る
        </Link>
        <Link href="/privacy-policy" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          プライバシーポリシー
        </Link>
        <Link href="/contact" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          お問い合わせ
        </Link>
      </div>
    </section>
  );
}
