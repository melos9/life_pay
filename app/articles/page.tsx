import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "../../components/AdSlot";

export const metadata: Metadata = {
  title: "解説記事一覧",
  description:
    "FIREシミュレーターの使い方、応用例、FIREそのものの基礎知識をまとめた解説記事一覧。",
  alternates: { canonical: "/articles" },
};

const ARTICLES: {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  tag: string;
}[] = [
  {
    slug: "how-to-use",
    title: "FIREシミュレーターを「正しく」使ㄆ10のコツ",
    description:
      "9割の人が誤入力する落とし穴と、シミュレーション精度を一気に上げる入力テクニック。項目ごとに「誤入力 → 直し方 → どれだけ結果が変わるか」を具体例つきで解説。",
    emoji: "✍️",
    tag: "使い方",
  },
  {
    slug: "use-cases",
    title: "ケーススタディ：年収別・家族構成別のFIRE現実解",
    description:
      "年収400万独身、共働きDINKs、子持ち時短世帯、高所得サラリーマンの4ケースについて、必要資産・到達年齢・もっとも効くレバーを実数で提示。",
    emoji: "🔬",
    tag: "事例",
  },
  {
    slug: "fire-basics",
    title: "日本版４％ルール：本家とどこが違うのか",
    description:
      "米国発祥の4%ルールが日本でそのまま当てはまらない5つの理由と、日本人向けに補正した「現実的な取り崩し率」を、研究データと併せて解説。",
    emoji: "🌏",
    tag: "基礎",
  },
  {
    slug: "education-cost",
    title: "子供1人いくら？教育費の本当の数字（2026年版）",
    description:
      "「子供1人1,000万円」は最安シナリオだった。幼稚園から大学院まで、公立・私立の組み合わせで「本当にいくらかかるのか」を文科省データで分解。",
    emoji: "🎓",
    tag: "教育費",
  },
  {
    slug: "post-fire-tax",
    title: "FIRE後の落とし穴：健康保険・住民税・年金の真実",
    description:
      "「資産１億円あればFIREできる」と思っていた人がリタイア初年度にぶつかる4大コストの正体と、賆い回避策をまとめます。",
    emoji: "⚠️",
    tag: "税金・社保",
  },
];

export default function ArticlesIndexPage() {
  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-2 text-[11px] text-zinc-500 mb-3 tracking-widest uppercase">
          <span className="w-1 h-1 rounded-full bg-zinc-900" />
          Articles
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
          解説記事
        </h1>
        <p className="text-zinc-500 mt-2 text-sm">
          FIREシミュレーターの使い方、応用例、FIREそのものの基礎を学べます。
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/articles/${a.slug}`}
              className="block rounded-2xl border border-zinc-200 hover:border-zinc-400 bg-white hover:bg-zinc-50 p-6 transition-colors h-full"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl" aria-hidden>{a.emoji}</div>
                <span className="text-[10px] font-medium tracking-widest uppercase text-zinc-400">
                  {a.tag}
                </span>
              </div>
              <div className="text-base font-semibold text-zinc-900 mb-1">
                {a.title}
              </div>
              <div className="text-sm text-zinc-500">{a.description}</div>
              <div className="mt-3 text-xs text-zinc-400">読む →</div>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot slot="0000000000" />

      <div className="text-sm text-zinc-500">
        <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
          ← シミュレーターに戻る
        </Link>
      </div>
    </div>
  );
}
