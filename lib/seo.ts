import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
};

/**
 * 案内系ページ向けの metadata を OG / Twitter / canonical 付きで生成する。
 * title は layout 側の template により自動で `｜${SITE_NAME}` が付与される。
 */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "ja_JP",
      url,
      siteName: SITE_NAME,
      title: `${title}｜${SITE_NAME}`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title}｜${SITE_NAME}`,
      description,
    },
  };
}

type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ArticleMetaInput = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
};

/**
 * ガイド記事向けの Article 構造化データ。
 * 発行者・更新日を明示し、コンテンツの信頼性シグナルを補強する。
 */
export function articleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleMetaInput) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: "ja",
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}
