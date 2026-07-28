// =============================================================================
// ガイド記事のメタ情報。一覧ページ・サイトマップ・関連記事リンクで共有する。
// 本文は各 app/guide/<slug>/page.tsx に持たせ、ここでは目次情報のみを管理する。
// =============================================================================

export type Guide = {
  slug: string;
  /** カード・ナビ・パンくず用の短いタイトル */
  title: string;
  /** ページ h1 / OG 用のフルタイトル */
  heading: string;
  /** meta description と一覧の説明文 */
  description: string;
  /** 一覧でのカテゴリバッジ */
  category: string;
  /** 想定読了時間（分） */
  readingMinutes: number;
  /** 最終更新日（ISO） */
  updated: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "fire-toha",
    title: "FIREとは？種類と特徴",
    heading: "FIREとは？意味・種類・メリットとデメリットをやさしく解説",
    description:
      "FIRE（経済的自立と早期リタイア）の意味を、フルFIRE・サイドFIRE・リーンFIRE・ファットFIRE・コーストFIRE・バリスタFIREの6タイプに分けて解説。メリットと注意点、日本で目指すときのポイントまでまとめました。",
    category: "基礎知識",
    readingMinutes: 8,
    updated: "2026-04-01",
  },
  {
    slug: "4percent-rule",
    title: "4%ルールと25倍の法則",
    heading: "4%ルールと「25倍の法則」とは？根拠と日本で使うときの注意点",
    description:
      "FIREの必要資産を求める「4%ルール」と「25倍の法則」の考え方を、トリニティスタディの結果を踏まえて解説。取り崩し率の決め方、暴落・インフレ・税金・為替のリスク、日本で使う際の調整方法まで整理します。",
    category: "考え方",
    readingMinutes: 9,
    updated: "2026-04-01",
  },
  {
    slug: "hitsuyou-shikin",
    title: "FIREに必要な資金の計算",
    heading: "FIREにいくら必要？必要資金の計算手順を5ステップで解説",
    description:
      "FIREに必要な金額を、リタイア後の支出から逆算する手順を5ステップで解説。生活費・住居費・年金・サイド収入を織り込んだ現実的な試算のやり方と、月々の支出別・必要資産の早見表を紹介します。",
    category: "計算",
    readingMinutes: 8,
    updated: "2026-04-01",
  },
  {
    slug: "kyouiku-hi",
    title: "子供の教育費の目安",
    heading: "子供の教育費はいくら？幼稚園から大学までの目安と貯め方",
    description:
      "幼稚園から大学卒業までにかかる教育費の目安を、公立・私立、文系・理系別に整理。文部科学省やJASSOの調査をもとにした標準額と、塾・習い事を含めた総額の考え方、無理なく備える方法を解説します。",
    category: "教育費",
    readingMinutes: 9,
    updated: "2026-04-01",
  },
  {
    slug: "roadmap",
    title: "FIRE達成までのロードマップ",
    heading: "FIRE達成までのロードマップ｜家計改善・入金力・NISA/iDeCoの活かし方",
    description:
      "FIREを目指すための現実的な進め方を、家計の把握・支出の見直し・入金力アップ・NISA/iDeCoの活用・出口戦略の5段階で解説。今日から始められる具体的なアクションに落とし込みます。",
    category: "実践",
    readingMinutes: 10,
    updated: "2026-04-01",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 指定スラッグ以外のガイドを最大 n 件返す（関連記事用） */
export function relatedGuides(slug: string, limit = 3): Guide[] {
  return GUIDES.filter((g) => g.slug !== slug).slice(0, limit);
}
