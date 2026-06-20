import type { Metadata } from "next";
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
    default: "ライフプラン資産シミュレーター｜FIRE・老後資金を無料試算（結婚・子育て対応）",
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
          <span>© {new Date().getFullYear()} {SITE_NAME}</span>
        </footer>
      </body>
    </html>
  );
}
