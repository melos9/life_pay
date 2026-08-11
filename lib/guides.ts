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
  {
    slug: "nisa-ideco",
    title: "新NISAとiDeCoの使い分け",
    heading: "新NISAとiDeCoの違いと使い分け｜FIRE・老後資金の非課税運用",
    description:
      "2024年に始まった新NISAとiDeCoの制度の違いを、非課税枠・引き出しやすさ・税制メリットの観点から整理。FIREや老後資金づくりでどちらを優先すべきか、併用の考え方と注意点をわかりやすく解説します。",
    category: "制度活用",
    readingMinutes: 10,
    updated: "2026-04-01",
  },
  {
    slug: "index-toushi",
    title: "インデックス投資の始め方",
    heading: "インデックス投資の始め方｜投資信託・全世界株・S&P500の基本",
    description:
      "FIREの土台となるインデックス投資の考え方を、初心者向けにやさしく解説。投資信託の選び方、全世界株とS&P500の違い、信託報酬・長期・分散・積立（ドルコスト平均法）の基本と、避けたい失敗をまとめました。",
    category: "資産運用",
    readingMinutes: 10,
    updated: "2026-04-01",
  },
  {
    slug: "side-fire",
    title: "サイドFIREとは？",
    heading: "サイドFIREとは？必要資金の計算と始め方をやさしく解説",
    description:
      "資産収入と労働収入を組み合わせる「サイドFIRE」の意味と、フルFIREとの違いを解説。必要資金がどれだけ小さくなるか、月いくら稼げばよいかの計算方法、始め方のステップと注意点まで具体的にまとめます。",
    category: "実践",
    readingMinutes: 9,
    updated: "2026-04-01",
  },
  {
    slug: "kakei-minaoshi",
    title: "入金力を高める家計見直し",
    heading: "入金力を高める家計見直し術｜固定費削減と先取り貯蓄のコツ",
    description:
      "FIRE達成のスピードを決める「入金力（毎月の投資額）」を高めるための家計見直しを解説。通信・保険・住居・サブスクなど固定費の削り方、先取り貯蓄の仕組み化、無理なく続けるコツを具体的に紹介します。",
    category: "家計",
    readingMinutes: 9,
    updated: "2026-04-01",
  },
  {
    slug: "rougo-2000man",
    title: "老後2000万円問題と年金",
    heading: "老後2000万円問題とは？公的年金の基礎とFIREとの関係",
    description:
      "話題になった「老後2000万円問題」の中身を、金融審議会の報告書をもとに整理。公的年金の仕組み、平均的な受給額の目安、2000万円という数字の前提と限界、FIRE計画に落とし込むときの考え方を解説します。",
    category: "老後資金",
    readingMinutes: 10,
    updated: "2026-04-01",
  },
  {
    slug: "torikuzushi",
    title: "FIRE後の取り崩し戦略",
    heading: "FIRE後の資産の取り崩し戦略｜定率法・定額法と暴落への備え",
    description:
      "築いた資産をリタイア後にどう使うかを決める「出口戦略」を解説。定額法と定率法の違い、4%ルールの実践、リタイア直後の暴落（シークエンスリスク）への備え方、現金クッションや年金の活かし方までまとめます。",
    category: "出口戦略",
    readingMinutes: 10,
    updated: "2026-04-01",
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/**
 * 指定スラッグ以外のガイドを最大 n 件返す（関連記事用）。
 * 記事ごとに異なる関連記事が出るよう、現在の記事の次から順番に選ぶ。
 */
export function relatedGuides(slug: string, limit = 3): Guide[] {
  const index = GUIDES.findIndex((g) => g.slug === slug);
  if (index === -1) {
    return GUIDES.slice(0, limit);
  }
  const rotated: Guide[] = [];
  for (let i = 1; i < GUIDES.length && rotated.length < limit; i++) {
    rotated.push(GUIDES[(index + i) % GUIDES.length]);
  }
  return rotated;
}
