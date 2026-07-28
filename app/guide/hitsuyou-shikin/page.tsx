import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("hitsuyou-shikin")!;

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
  datePublished: "2026-02-20",
  dateModified: guide.updated,
});

const STEPS = [
  {
    no: 1,
    title: "リタイア後の毎月の生活費を洗い出す",
    body: "食費・水道光熱費・通信費・日用品・娯楽・保険など、リタイア後に毎月かかる生活費を見積もります。現役時代の支出をベースに、通勤や仕事関係の出費を差し引くと現実的な数字になります。",
  },
  {
    no: 2,
    title: "住居費・特別支出を加える",
    body: "家賃、または持ち家の固定資産税・修繕費・管理費を上乗せします。加えて、車の買い替え・家電の更新・旅行・冠婚葬祭など、毎月ではないけれど定期的に発生する「特別支出」も年額でならして加えます。",
  },
  {
    no: 3,
    title: "年間支出の合計を25倍する",
    body: "1と2を足した年間支出を25倍すると、4%ルールにもとづく必要資産の目安が出ます。まずはこの「素の必要資産」を把握しましょう。",
  },
  {
    no: 4,
    title: "年金・サイド収入を差し引く",
    body: "公的年金や、リタイア後も続ける副業・パートの収入があれば、その分だけ資産から取り崩す額が減ります。年間の不足額（支出−収入）を25倍し直すと、より現実的な必要資産になります。",
  },
  {
    no: 5,
    title: "インフレと運用を考慮して微調整する",
    body: "将来の物価上昇で支出は増え、運用益で資産は増えます。両方を織り込むと精度が上がります。手計算は難しいため、シミュレーターで年次の推移を確認するのがおすすめです。",
  },
];

export default function HitsuyouShikinPage() {
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
              「FIREにいくら必要か」は、人によって答えがまったく違います。生活水準・住まい・家族構成・年金額が異なるからです。
              大切なのは、他人の正解ではなく<strong>自分の数字で逆算する</strong>こと。
              この記事では、必要資金を求める手順を5つのステップに分けて解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">基本の考え方は「支出からの逆算」</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              FIREの必要資金は、「いくら稼ぐか」ではなく「リタイア後にいくら使うか」から逆算します。
              土台になるのは、
              <Link
                href="/guide/4percent-rule"
                className="mx-0.5 underline underline-offset-2 hover:text-zinc-900"
              >
                4%ルール（25倍の法則）
              </Link>
              です。まずは年間支出を正しくつかむことがスタート地点になります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">必要資金を求める5ステップ</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s) => (
                <li
                  key={s.no}
                  className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
                      {s.no}
                    </span>
                    <h3 className="text-sm font-semibold text-zinc-900 sm:text-base">
                      {s.title}
                    </h3>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-zinc-700">{s.body}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              計算例：会社員・夫婦世帯の場合
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              具体的なイメージをつかむために、簡単な例で計算してみましょう。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <tbody>
                  {[
                    ["リタイア後の月間生活費", "25万円"],
                    ["年間生活費（×12）", "300万円"],
                    ["素の必要資産（×25）", "7,500万円"],
                    ["世帯の年金（受給後・年額）", "▲200万円/年"],
                    ["年金開始後の年間不足額", "100万円"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100">
                      <td className="py-2.5 pr-3 text-zinc-700">{row[0]}</td>
                      <td className="py-2.5 text-right font-semibold text-zinc-900">
                        {row[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              年金を受け取れるようになれば、取り崩しは年100万円ほどで済みます。一方で、
              <strong>年金開始（65歳）までの空白期間</strong>は年金がない分だけ多く取り崩す必要があります。
              つまり必要資産は「年金前」と「年金後」で分けて考えるのがコツです。
              こうした期間ごとの違いは、年次で計算するシミュレーターを使うと一目でわかります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">見落としやすい費用</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>社会保険料：</strong>
                退職後の国民健康保険・国民年金の保険料。前年所得によっては想定より高くなります。
              </li>
              <li>
                <strong>教育費：</strong>
                子育て世帯は、進学のタイミングで支出が大きく跳ねます。
                <Link
                  href="/guide/kyouiku-hi"
                  className="mx-0.5 underline underline-offset-2 hover:text-zinc-900"
                >
                  教育費の目安
                </Link>
                を別枠で見積もりましょう。
              </li>
              <li>
                <strong>住まいの維持費：</strong>
                持ち家は住宅ローン完済後も固定資産税・修繕費がかかります。
              </li>
              <li>
                <strong>医療・介護費：</strong>
                年齢とともに増えやすい費目。予備費として一定額を見込んでおくと安心です。
              </li>
              <li>
                <strong>インフレ：</strong>
                物価が上がれば、同じ暮らしでも必要額は年々増えていきます。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>必要資金は「リタイア後の年間支出」からの逆算で求める。</li>
              <li>年間支出 × 25 が素の目安。年金・副収入があれば必要額は下がる。</li>
              <li>年金前と年金後で必要資産は変わる。空白期間の取り崩しに注意。</li>
              <li>社会保険・教育費・維持費・インフレなど、見落としやすい費用を織り込む。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              ここまでの要素をすべて手計算するのは大変です。本サイトの{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              なら、生活費・住居費・年金・サイド収入・教育費・インフレを入力するだけで、
              何歳でFIREでき、資産が寿命まで持つかを年次のグラフで確認できます。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事の計算例は理解を助けるための簡略的なモデルであり、実際の必要額は個々の状況で異なります。
            税・社会保険・年金額の詳細は公的機関の情報をご確認ください。本記事は投資助言ではありません。
          </p>
        </article>
      </div>
    </>
  );
}
