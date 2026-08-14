import Link from "next/link";
import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/seo";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "FIREガイド｜早期リタイア・資産形成の基礎知識",
  description:
    "FIRE（経済的自立と早期リタイア）を目指す人向けの解説記事一覧。FIREの意味と種類、4%ルール、必要資金の計算、教育費、達成までのロードマップまで、はじめての人にもわかりやすくまとめています。",
  alternates: { canonical: absoluteUrl("/guide") },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: absoluteUrl("/guide"),
    siteName: SITE_NAME,
    title: `FIREガイド｜早期リタイア・資産形成の基礎知識｜${SITE_NAME}`,
    description:
      "FIREの意味と種類、4%ルール、必要資金の計算、教育費、達成までのロードマップをまとめたガイド記事一覧。",
  },
};

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "ホーム", path: "/" },
  { name: "FIREガイド", path: "/guide" },
]);

const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: GUIDES.map((g, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(`/guide/${g.slug}`),
    name: g.heading,
  })),
};

export default function GuideIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEM_LIST_JSON_LD) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="パンくずリスト" className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">
            ホーム
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="text-zinc-700">FIREガイド</span>
        </nav>

        <header className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            FIREガイド
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-700">
            FIRE（Financial Independence, Retire
            Early＝経済的自立と早期リタイア）は、十分な資産を築いて運用益で生活し、働き方を自由に選べる状態を指します。
            とはいえ「結局いくら必要なのか」「自分の家計で本当に実現できるのか」は、言葉の意味を知るだけではわかりません。
            このガイドでは、FIREの基礎から必要資金の計算、教育費の備え、達成までの具体的な手順までを、
            はじめての人にもわかりやすい順番で解説します。読み終えたら、
            <Link href="/" className="mx-0.5 underline underline-offset-2 hover:text-zinc-900">
              資産シミュレーター
            </Link>
            で自分の数字を当てはめてみてください。
          </p>
        </header>

        <section className="mt-8 space-y-4">
          {GUIDES.map((g, index) => (
            <Link
              key={g.slug}
              href={`/guide/${g.slug}`}
              className="block rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:p-6"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
                  {index + 1}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
                  {g.category}
                </span>
                <span className="text-[11px] text-zinc-400">
                  約{g.readingMinutes}分で読めます
                </span>
              </div>
              <h2 className="mt-3 text-base font-semibold text-zinc-900 sm:text-lg">
                {g.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {g.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-900">
                続きを読む
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </section>

        <p className="mt-8 text-xs leading-relaxed text-zinc-400">
          ※ 本ガイドは資産形成・ライフプランを考えるための一般的な情報提供を目的としており、特定の金融商品の勧誘や投資助言ではありません。
          制度や税制の最新の内容は、必ず公的機関の公式情報をご確認ください。
        </p>
      </div>
    </>
  );
}
