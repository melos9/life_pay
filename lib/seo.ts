import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

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
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
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
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
