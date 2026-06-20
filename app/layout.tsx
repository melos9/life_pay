import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const SITE_NAME = "ライフプラン資産シミュレーター";
const SITE_DESCRIPTION =
  "ライフプラン資産シミュレーターは、FIRE・老後資金・教育費までまとめて無料で試算できる資産シミュレーターです。年齢・年収・支出・住居費・子育て費を入力すると、将来の資産推移と必要資金の目安をグラフで確認できます。";
const SITE_URL = "https://melos9.github.io/life_pay";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ライフプラン資産シミュレーター｜FIRE・老後資金を無料試算（結婚・子育て対応）",
    template: `%s｜${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "FIRE",
    "fire",
    "FIREとは",
    "fireとは",
    "ライフプラン資産シミュレーター",
    "ライフプラン資産シュミレーター",
    "資産シミュレーター",
    "ライフプラン シミュレーター",
    "ライフプラン シュミレーター",
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
    title: "ライフプラン資産シミュレーター｜FIRE・老後資金を無料試算",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "ライフプラン資産シミュレーター｜FIRE・老後資金を無料試算",
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
        <header className="no-print border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="text-sm font-semibold text-zinc-900 hover:text-zinc-700 transition-colors">
              {SITE_NAME}
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs text-zinc-600">
              <Link href="/" className="hover:text-zinc-900 transition-colors">シミュレーター</Link>
              <Link href="/how-to-use" className="hover:text-zinc-900 transition-colors">使い方</Link>
              <Link href="/disclaimer" className="hover:text-zinc-900 transition-colors">免責事項</Link>
              <Link href="/privacy-policy" className="hover:text-zinc-900 transition-colors">プライバシーポリシー</Link>
              <Link href="/contact" className="hover:text-zinc-900 transition-colors">お問い合わせ</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {children}
        </main>
        <footer className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-zinc-500 border-t border-zinc-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} {SITE_NAME}</span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-zinc-900">シミュレーター</Link>
              <Link href="/how-to-use" className="hover:text-zinc-900">使い方</Link>
              <Link href="/disclaimer" className="hover:text-zinc-900">免責事項</Link>
              <Link href="/privacy-policy" className="hover:text-zinc-900">プライバシーポリシー</Link>
              <Link href="/contact" className="hover:text-zinc-900">お問い合わせ</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
