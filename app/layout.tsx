import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import {
  DEFAULT_OG_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FIRE特化 資産シミュレーター｜FIRE・老後資金を無料試算（結婚・子育て対応）",
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  applicationName: SITE_NAME,
  category: "finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_OG_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_OG_TITLE,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
  other: process.env.NEXT_PUBLIC_ADSENSE_CLIENT
    ? { "google-adsense-account": process.env.NEXT_PUBLIC_ADSENSE_CLIENT }
    : {},
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "ja",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "FIREとは？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "FIRE（Financial Independence, Retire Early）とは、十分な資産を築いて運用益で生活し、早期に労働から離れるライフスタイルです。一般に年間支出の25倍の資産を作り、年4%以内で取り崩せば資産が長持ちすると言われます（4%ルール）。",
          },
        },
        {
          "@type": "Question",
          name: "FIREにはいくら必要？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "目安は『リタイア後の年間支出 × 25倍』。月25万円で暮らすなら年300万円 × 25 = 7,500万円が必要資産の目安です。結婚・子育て・住居費・教育費を含めるとさらに増えるため、本シミュレーターで個別に試算できます。",
          },
        },
        {
          "@type": "Question",
          name: "結婚や子育てがあってもFIREできる？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "可能ですが、教育費・住居費を含めた現実的な試算が不可欠です。本シミュレーターは子供の人数・進学プラン（公立／私立、大学・大学院）・塾代まで反映して必要資産を算出します。",
          },
        },
        {
          "@type": "Question",
          name: "入力したデータは保存・送信される？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "入力したシミュレーションデータはお使いのブラウザ内にのみ保存され、サーバーへは送信されません。個人を特定する情報の入力も不要で、安心してご利用いただけます。",
          },
        },
        {
          "@type": "Question",
          name: "このシミュレーターは無料で使える？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "はい、登録不要ですべての機能を無料で利用できます。年齢・年収・支出・年金・家族構成を入力すると、将来の資産推移とFIREに必要な資金の目安をグラフで確認できます。",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <SiteHeader siteName={SITE_NAME} />
        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {children}
        </main>
        <footer className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-xs text-zinc-500 border-t border-zinc-200">
          <nav aria-label="フッターナビゲーション" className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              シミュレーター
            </Link>
            <Link href="/guide" className="hover:text-zinc-900 transition-colors">
              FIREガイド
            </Link>
            <Link href="/how-to-use" className="hover:text-zinc-900 transition-colors">
              使い方
            </Link>
            <Link href="/disclaimer" className="hover:text-zinc-900 transition-colors">
              免責事項
            </Link>
            <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/contact" className="hover:text-zinc-900 transition-colors">
              お問い合わせ
            </Link>
          </nav>
          <span className="mt-4 block">© {new Date().getFullYear()} {SITE_NAME}</span>
        </footer>
      </body>
    </html>
  );
}
