import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "ライフプラン資産シミュレーターに関するご意見・不具合報告・ご要望の連絡先です。",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-zinc-900">お問い合わせ</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        ご意見・不具合報告・改善要望は、下記の方法でご連絡ください。
      </p>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">連絡方法</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>
          GitHub Issues:
          <a
            href="https://github.com/melos9/life_pay/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline underline-offset-2 text-zinc-900"
          >
            https://github.com/melos9/life_pay/issues
          </a>
        </li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">報告時にあると助かる情報</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>発生した問題の内容（期待した動作 / 実際の動作）</li>
        <li>再現手順</li>
        <li>使用端末・ブラウザ（例: iPhone Safari / Chrome など）</li>
        <li>可能であればスクリーンショット</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">ご注意</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        個人情報や機微情報（氏名、住所、口座情報、マイナンバー等）は送信しないでください。
      </p>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link href="/" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          シミュレーターへ戻る
        </Link>
        <Link href="/how-to-use" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          使い方
        </Link>
        <Link href="/privacy-policy" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-50">
          プライバシーポリシー
        </Link>
      </div>
    </section>
  );
}
