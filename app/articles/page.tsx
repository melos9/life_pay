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
}[] = [
  {
    slug: "how-to-use",
    title: "FIREシミュレーターの使い方",
    description:
      "基本情報・配偶者・子供・住居・支出・運用利回りの入力ポイントと、グラフの読み方を画面に沿って解説します。",
    emoji: "📘",
  },
  {
    slug: "use-cases",
    title: "応用例：DINKs/子持ち/独身/Coast FIRE",
    description:
      "ライフスタイル別にどんな入力をすれば現実的な試算になるか、設定例と読み解き方を紹介します。",
    emoji: "🧭",
  },
  {
    slug: "fire-basics",
    title: "FIREとは？4%ルールと必要資産の基礎",
    description:
      "FIRE/サイドFIRE/Barista FIRE/Coast FIRE の違いと、必要資産の25倍ルールの考え方を整理します。",
    emoji: "💡",
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
              <div className="text-2xl mb-2" aria-hidden>
                {a.emoji}
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
