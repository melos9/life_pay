export const SITE_NAME = "もう夢なんてみない、FIRE特化型資産シミュレーター";

export const SITE_DESCRIPTION =
  "もう夢なんてみない、FIRE特化型資産シミュレーターは、FIRE・老後資金・教育費までまとめて無料で試算できる資産シミュレーターです。年齢・年収・支出・住居費・子育て費を入力すると、将来の資産推移とFIREに必要な資金の目安をグラフで確認できます。";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lifeplan-sim.link";

export const OG_LOCALE = "ja_JP";

export const DEFAULT_OG_TITLE =
  "もう夢なんてみない、FIRE特化型資産シミュレーター｜FIRE・老後資金を無料試算";

/**
 * SEO 用の絶対 URL を生成する。next.config の `trailingSlash: true` に合わせ、
 * 実際に配信される URL と canonical / OG / sitemap を一致させるため末尾スラッシュを付ける。
 */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean.endsWith("/") ? clean : `${clean}/`}`;
}

export const SITE_KEYWORDS = [
  "FIRE",
  "FIREとは",
  "FIREシミュレーター",
  "FIREシミュレーション",
  "もう夢なんてみない",
  "資産シミュレーター",
  "ライフプラン シミュレーター",
  "早期リタイア",
  "セミリタイア",
  "サイドFIRE",
  "リーンFIRE",
  "ファットFIRE",
  "教育費",
  "FIRE いくら必要",
  "資産形成",
  "ライフプラン",
  "4%ルール",
  "資産運用",
  "老後資金",
  "キャッシュフロー表",
  "家計シミュレーション",
];
