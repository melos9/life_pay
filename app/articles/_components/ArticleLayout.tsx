import Link from "next/link";
import type { ReactNode } from "react";
import { AdSlot } from "../../../components/AdSlot";

type ArticleLayoutProps = {
  title: string;
  lead: string;
  updatedAt?: string;
  children: ReactNode;
  /** 末尾に表示する関連記事 */
  related?: { slug: string; title: string }[];
};

/**
 * 解説記事の共通レイアウト。Tailwind の typography は導入していないので
 * 必要なタイポグラフィを直接 className で当てる。
 */
export function ArticleLayout({
  title,
  lead,
  updatedAt,
  children,
  related = [],
}: ArticleLayoutProps) {
  return (
    <article className="space-y-8">
      <header className="pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-2 text-[11px] text-zinc-500 mb-3 tracking-widest uppercase">
          <span className="w-1 h-1 rounded-full bg-zinc-900" />
          <Link href="/articles" className="hover:text-zinc-900">
            Articles
          </Link>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
          {title}
        </h1>
        <p className="text-zinc-500 mt-3 text-sm leading-relaxed">{lead}</p>
        {updatedAt && (
          <p className="text-zinc-400 mt-2 text-xs">最終更新: {updatedAt}</p>
        )}
      </header>

      <div className="prose-fire space-y-6 text-zinc-700 leading-relaxed text-[15px]">
        {children}
      </div>

      <AdSlot slot="0000000000" />

      {related.length > 0 && (
        <section className="pt-6 border-t border-zinc-200">
          <h2 className="text-sm font-semibold text-zinc-900 mb-3">
            関連記事
          </h2>
          <ul className="space-y-2 text-sm">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/articles/${r.slug}`}
                  className="text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex items-center justify-between text-sm text-zinc-500">
        <Link
          href="/articles"
          className="underline underline-offset-2 hover:text-zinc-900"
        >
          ← 記事一覧
        </Link>
        <Link
          href="/"
          className="underline underline-offset-2 hover:text-zinc-900"
        >
          シミュレーターを開く →
        </Link>
      </div>
    </article>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-2 scroll-mt-24">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-zinc-900 mt-6 mb-1">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-7 text-zinc-700">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc pl-6 space-y-1 text-[15px] text-zinc-700">
      {children}
    </ul>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
      {children}
    </div>
  );
}

/** 章の冒頭に置く番号付きカード。タイトル＋要旨を視認しやすく示す。 */
export function ChapterCard({
  number,
  label,
  title,
  summary,
}: {
  number: string;
  label?: string;
  title: string;
  summary: string;
}) {
  return (
    <div className="mt-10 mb-4 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white px-5 py-5 lg:px-6 lg:py-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900 leading-none">
          {number}
        </div>
        <div className="flex-1 min-w-0">
          {label && (
            <div className="text-[10px] font-medium tracking-widest uppercase text-zinc-400 mb-1">
              {label}
            </div>
          )}
          <h2 className="text-lg lg:text-xl font-semibold text-zinc-900 leading-snug">
            {title}
          </h2>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{summary}</p>
        </div>
      </div>
    </div>
  );
}

/** 数字を強調する小さなスタッツカード。横並びで使う。 */
export function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">{children}</div>
  );
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <div className="text-[11px] tracking-wider uppercase text-zinc-400">
        {label}
      </div>
      <div className="text-xl font-semibold text-zinc-900 mt-1 tabular-nums">
        {value}
      </div>
      {hint && <div className="text-xs text-zinc-500 mt-1">{hint}</div>}
    </div>
  );
}

/** 重要数値のインラインハイライト。 */
export function Hi({ children }: { children: ReactNode }) {
  return (
    <span className="bg-yellow-100/70 px-1 rounded font-medium text-zinc-900">
      {children}
    </span>
  );
}

/** カラー付きコールアウト。type で色を切り替え。 */
export function Callout({
  title,
  children,
  type = "info",
}: {
  title?: string;
  children: ReactNode;
  type?: "info" | "tip" | "warn";
}) {
  const styles: Record<string, string> = {
    info: "border-zinc-300 bg-zinc-50",
    tip: "border-emerald-300 bg-emerald-50/60",
    warn: "border-amber-300 bg-amber-50/60",
  };
  const labels: Record<string, string> = {
    info: "POINT",
    tip: "TIP",
    warn: "CAUTION",
  };
  return (
    <div className={`rounded-xl border-l-4 ${styles[type]} px-4 py-3 my-4`}>
      <div className="text-[10px] font-semibold tracking-widest text-zinc-500 mb-1">
        {labels[type]}
      </div>
      {title && (
        <div className="text-sm font-semibold text-zinc-900 mb-1">{title}</div>
      )}
      <div className="text-sm text-zinc-700 leading-relaxed">{children}</div>
    </div>
  );
}

/** 比較などに使うシンプルな表。 */
export function DataTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-zinc-200">
      <table className="w-full text-sm">
        {caption && (
          <caption className="text-left text-xs text-zinc-500 px-4 py-2 bg-zinc-50 border-b border-zinc-200">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-zinc-50 text-zinc-600">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left font-medium px-3 py-2 border-b border-zinc-200"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="odd:bg-white even:bg-zinc-50/40 border-b last:border-b-0 border-zinc-100"
            >
              {row.map((c, ci) => (
                <td
                  key={ci}
                  className="px-3 py-2 text-zinc-700 tabular-nums whitespace-nowrap"
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** チェック項目を視覚的に並べるリスト（絵文字なし、CSSバッジ）。 */
export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-4 space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-1 inline-flex shrink-0 w-5 h-5 items-center justify-center rounded-full bg-zinc-900 text-white text-[11px] font-semibold tabular-nums">
            {i + 1}
          </span>
          <div className="text-[15px] leading-7 text-zinc-700">{it}</div>
        </li>
      ))}
    </ul>
  );
}

/** 引用ブロック。出典提示用。 */
export function Quote({
  children,
  source,
}: {
  children: ReactNode;
  source?: string;
}) {
  return (
    <blockquote className="my-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600">
      <div>{children}</div>
      {source && (
        <div className="text-xs not-italic text-zinc-400 mt-2">— {source}</div>
      )}
    </blockquote>
  );
}
