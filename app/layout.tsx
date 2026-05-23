import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const SITE_NAME = "FIREシミュレーター";
const SITE_DESCRIPTION =
  "FIRE（早期リタイア）にいくら必要か、結婚・子育て・住居費を含めて1分で試算できる無料シミュレーター。年齢・年収・支出・教育費・年金まで細かく入力でき、生涯の資産推移をグラフで可視化します。FIREとは何か、達成までいくら貯めればよいかをシンプルに把握できます。";
const SITE_URL = "https://melos9.github.io/life_pay";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FIREシミュレーター｜FIREにいくら必要か無料で試算（結婚・子育て対応）",
    template: "%s｜FIREシミュレーター",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "FIRE",
    "fire",
    "FIREとは",
    "fireとは",
    "FIREシミュレーター",
    "シミュレーター",
    "シミュレーション",
    "早期リタイア",
    "セミリタイア",
    "サイドFIRE",
    "リーンFIRE",
    "ファットFIRE",
    "結婚",
    "子育て",
    "教育費",
    "いくら",
    "いくら必要",
    "FIRE いくら",
    "FIRE いくら必要",
    "資産形成",
    "ライフプラン",
    "4%ルール",
    "資産運用",
    "老後資金",
  ],
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
    title: "FIREシミュレーター｜FIREにいくら必要か無料で試算",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "FIREシミュレーター｜FIREにいくら必要か無料で試算",
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: "/",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
      inLanguage: "ja",
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
      <head>
        {adsenseClient && (
          <meta name="google-adsense-account" content={adsenseClient} />
        )}
      </head>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {adsenseClient && (
          <Script
            id="adsbygoogle-loader"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <nav className="flex items-center gap-4 text-xs text-zinc-500">
            <Link
              href="/"
              className="hover:text-zinc-900 transition-colors"
            >
              シミュレーター
            </Link>
            <span className="text-zinc-300">/</span>
            <Link
              href="/articles"
              className="hover:text-zinc-900 transition-colors"
            >
              解説記事
            </Link>
          </nav>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </main>
        <footer className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-zinc-500 border-t border-zinc-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} {SITE_NAME}</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-zinc-900">シミュレーター</Link>
              <Link href="/articles" className="hover:text-zinc-900">解説記事</Link>
              <Link href="/articles/how-to-use" className="hover:text-zinc-900">使い方</Link>
              <Link href="/articles/use-cases" className="hover:text-zinc-900">応用例</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
