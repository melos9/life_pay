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
