import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "お問い合わせ",
  description:
    "FIRE特化 資産シミュレーターに関するご意見・不具合報告・ご要望の連絡先です。",
  path: "/contact",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "ホーム", path: "/" },
  { name: "お問い合わせ", path: "/contact" },
]);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">お問い合わせ</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        本サイトに関するご意見、不具合のご報告、改善のご要望などがございましたら、以下の連絡先までお寄せくださいますようお願い申し上げます。
      </p>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">ご連絡先</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>life.pay.simulator@gmail.com</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">お問い合わせの際にお伝えいただきたい内容</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        より迅速に状況を把握させていただくため、可能な範囲で以下の情報をお知らせいただけますと幸いです。
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>発生した事象（ご期待されていた動作と実際の動作）</li>
        <li>再現の手順</li>
        <li>ご利用の端末・ブラウザ（例：iPhone Safari、Google Chrome など）</li>
        <li>可能であれば画面のスクリーンショット</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">ご注意事項</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        個人情報や機微な情報（お名前、ご住所、口座情報、マイナンバーなど）はお送りにならないようお願い申し上げます。
      </p>
    </section>
    </>
  );
}
