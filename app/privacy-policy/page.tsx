import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "プライバシーポリシー",
  description:
    "本シミュレーターにおける個人情報・アクセス情報の取り扱い方針です。",
  path: "/privacy-policy",
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "ホーム", path: "/" },
  { name: "プライバシーポリシー", path: "/privacy-policy" },
]);

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <section className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">プライバシーポリシー</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        本サービスにおける、情報の取り扱い方針をご案内します。
      </p>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">1. 入力データとサーバー送信について</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>シミュレーションの入力データ（年齢・収入・支出・家族構成など）は、本サービスのサーバーへ送信されません。</li>
        <li>入力データは主にお使いのブラウザ内（ローカルストレージ）に保存されます。</li>
        <li>そのため、入力データを本サービス運営者がサーバー側で取得・蓄積することはありません。</li>
        <li>ブラウザ設定の変更やキャッシュ削除などにより、保存データが消える場合があります。</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">2. 免責事項について</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        本サービスのご利用に関する注意事項は、
        <Link href="/disclaimer" className="underline underline-offset-2 text-zinc-900">
          免責事項ページ
        </Link>
        にまとめています。ご利用前にご確認ください。
      </p>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">3. 広告配信について</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>本サービスは第三者配信の広告サービス（Google AdSense 等）を利用する場合があります。</li>
        <li>本サービスはシミュレーション診断のために独自の Cookie を使用しませんが、広告配信事業者は Cookie 等を用いて、利用者の興味に応じた広告を表示することがあります。</li>
        <li>
          Google の広告に関する詳細は
          <a
            href="https://policies.google.com/technologies/ads?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline underline-offset-2 text-zinc-900"
          >
            Google ポリシーと規約
          </a>
          を参照してください。
        </li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">4. 利用目的</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
        <li>シミュレーション機能の提供、表示最適化、不具合調査のため</li>
        <li>サービス品質向上、セキュリティ維持、利用状況の把握・改善のため</li>
      </ul>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">5. 改定</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        本ポリシーは、法令改正やサービス内容の変更に応じて、予告なく改定する場合があります。
      </p>

      <h2 className="mt-6 text-lg font-semibold text-zinc-900">6. お問い合わせ</h2>
      <p className="mt-3 text-sm leading-relaxed text-zinc-700">
        本ポリシーに関するご質問は、
        <Link href="/contact" className="underline underline-offset-2 text-zinc-900">
          お問い合わせページ
        </Link>
        からご連絡ください。
      </p>
    </section>
    </>
  );
}
