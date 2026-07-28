import Link from "next/link";
import { relatedGuides } from "@/lib/guides";

/**
 * ガイド記事末尾に置く「関連ガイド」+ シミュレーターへの導線。
 * currentSlug を除いた記事を最大3件表示する。
 */
export function RelatedGuides({ currentSlug }: { currentSlug: string }) {
  const items = relatedGuides(currentSlug);
  return (
    <section className="mt-10 border-t border-zinc-200 pt-8">
      <h2 className="text-lg font-semibold text-zinc-900">関連ガイド</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((g) => (
          <li key={g.slug}>
            <Link
              href={`/guide/${g.slug}`}
              className="block h-full rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                {g.category}
              </span>
              <span className="mt-1 block text-sm font-semibold text-zinc-900">
                {g.title}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-zinc-500 line-clamp-2">
                {g.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-5 sm:p-6">
        <h3 className="text-base font-semibold text-zinc-900">
          読んだら、自分の数字で試算してみましょう
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
          年齢・年収・支出・教育費・年金を入力すると、将来の資産推移とFIREに必要な資金の目安を無料でグラフ化できます。
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          シミュレーターを使ってみる
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
