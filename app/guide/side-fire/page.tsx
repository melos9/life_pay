import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("side-fire")!;

export const metadata = pageMetadata({
  title: guide.title,
  description: guide.description,
  path: `/guide/${guide.slug}`,
});

const BREADCRUMB_JSON_LD = breadcrumbJsonLd([
  { name: "ホーム", path: "/" },
  { name: "FIREガイド", path: "/guide" },
  { name: guide.title, path: `/guide/${guide.slug}` },
]);

const ARTICLE_JSON_LD = articleJsonLd({
  headline: guide.heading,
  description: guide.description,
  path: `/guide/${guide.slug}`,
  datePublished: "2026-02-16",
  dateModified: guide.updated,
});

// 月の労働収入ごとに必要資産がどれだけ減るかの例（年間支出300万円・25倍で試算した目安）
const SIDE_ROWS: Array<[string, string, string]> = [
  ["0円（フルFIRE）", "年0万円", "7,500万円"],
  ["月5万円", "年60万円", "6,000万円"],
  ["月10万円", "年120万円", "4,500万円"],
  ["月15万円", "年180万円", "3,000万円"],
];

export default function SideFirePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="パンくずリスト" className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-900">
            ホーム
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <Link href="/guide" className="hover:text-zinc-900">
            FIREガイド
          </Link>
          <span className="mx-1.5" aria-hidden>
            /
          </span>
          <span className="text-zinc-700">{guide.title}</span>
        </nav>

        <article className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8">
          <header>
            <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
              {guide.category} ・ 約{guide.readingMinutes}分
            </span>
            <h1 className="mt-2 text-2xl font-bold leading-snug tracking-tight text-zinc-900 sm:text-3xl">
              {guide.heading}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              「完全に働かないフルFIREはハードルが高いけれど、もう少し自由に働きたい」——そんな人に
              現実的な選択肢として人気なのが<strong>サイドFIRE</strong>です。
              この記事では、サイドFIREの意味とフルFIREとの違い、必要資金がどれだけ小さくなるか、
              月いくら稼げばよいかの計算方法、始め方のステップと注意点までをまとめます。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">サイドFIREとは？</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              サイドFIREとは、<strong>資産運用による収入（不労所得）と、無理のない範囲の労働収入を組み合わせて
              生活する</strong>スタイルです。生活費のすべてを資産でまかなうフルFIREと違い、
              一部を働いて稼ぐぶん、必要な資産が小さくて済みます。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              「好きな仕事だけを、好きなペースで続けたい」「社会とのつながりや張り合いは保ちたい」という人に向いています。
              フルタイム勤務のストレスから距離を置きつつ、資産の減りを穏やかにできるのが魅力です。
              FIREの種類全体は{" "}
              <Link href="/guide/fire-toha" className="underline underline-offset-2 hover:text-zinc-900">
                FIREとは？の記事
              </Link>{" "}
              で解説しています。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">労働収入があると必要資産はどれだけ減る？</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              サイドFIREの必要資産は、<strong>「（年間支出 − 年間の労働収入）× 25」</strong>で概算できます。
              これは、資産で足りない分だけを25倍の法則で用意すればよい、という考え方です。
              年間支出300万円（月25万円）の人を例にすると、次のようになります。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">月の労働収入</th>
                    <th className="py-2 pr-3 font-medium">年の労働収入</th>
                    <th className="py-2 font-medium">必要資産の目安</th>
                  </tr>
                </thead>
                <tbody>
                  {SIDE_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100">
                      <td className="py-2.5 pr-3 font-medium text-zinc-900">{row[0]}</td>
                      <td className="py-2.5 pr-3 text-zinc-700">{row[1]}</td>
                      <td className="py-2.5 font-semibold text-zinc-900">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              月10万円を稼ぐだけで、必要資産の目安が7,500万円から4,500万円へと、3,000万円も下がります。
              少しの労働収入が、FIRE達成のハードルを大きく下げることがわかります。
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 年4%で取り崩す前提の「25倍の法則」による単純化した目安です。税金・社会保険料・インフレ・
              相場変動は考慮していません。4%ルールの前提と限界は{" "}
              <Link href="/guide/4percent-rule" className="underline underline-offset-2 hover:text-zinc-700">
                4%ルールと25倍の法則の記事
              </Link>{" "}
              で解説しています。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">サイドFIREのメリット</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>必要資産が小さく、早く到達できる：</strong>
                フルFIREより少ない資産で始められるため、達成までの期間を短縮できます。
              </li>
              <li>
                <strong>資産の減りがゆるやか：</strong>
                労働収入があるぶん取り崩し額を抑えられ、相場下落時の精神的な余裕にもつながります。
              </li>
              <li>
                <strong>社会とのつながりを保てる：</strong>
                仕事を通じた人間関係や生活リズム、やりがいを維持しやすくなります。
              </li>
              <li>
                <strong>やり直しがきく：</strong>
                働く力を保っておけるため、想定外の出費や相場の急変にも対応しやすくなります。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">サイドFIREの注意点</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>収入が想定どおり続くとは限らない：</strong>
                体調・景気・案件の有無で収入は変動します。労働収入は少なめに見積もって計画するのが安全です。
              </li>
              <li>
                <strong>社会保険・税金の扱いを確認する：</strong>
                会社員を辞めると健康保険・年金を自分で手当てする必要があります。働き方によって負担が変わります。
              </li>
              <li>
                <strong>「半分リタイア」が中途半端になることも：</strong>
                仕事と自由時間の配分は、始めてから調整が必要になりがちです。無理のない稼働量を探りましょう。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">サイドFIREの始め方（4ステップ）</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>リタイア後の年間支出を把握する：</strong>
                今の家計から、リタイア後に必要な生活費を見積もります。ここがすべての起点です。
              </li>
              <li>
                <strong>続けられる収入源を育てる：</strong>
                会社員のうちから副業・専門スキル・パートなど、リタイア後も無理なく続けられる収入の芽を作ります。
              </li>
              <li>
                <strong>必要資産を計算する：</strong>
                「（年間支出 − 労働収入）× 25」で目標額を出し、NISAなどで資産形成を進めます。
              </li>
              <li>
                <strong>移行はゆるやかに：</strong>
                いきなり退職せず、勤務日数を減らす・副業比率を上げるなど、段階的に移行するとリスクを抑えられます。
              </li>
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>サイドFIREは資産収入と無理のない労働収入を組み合わせるスタイル。</li>
              <li>必要資産は「（年間支出 − 労働収入）× 25」で概算できる。</li>
              <li>月10万円の収入で必要資産が数千万円下がることも。達成のハードルを大きく下げられる。</li>
              <li>労働収入は少なめに見積もり、社会保険・税金の扱いも事前に確認する。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              サイド収入を入れたときに何歳でFIREできるかは、{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              でリタイア後の収入を年ごとに設定して試算できます。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品を推奨・勧誘するものではありません。
            金額はいずれも単純化した目安であり、税・社会保険・相場変動により実際とは異なります。
            制度・税制の最新情報は公的機関の公式サイトをご確認ください。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
