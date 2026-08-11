import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("index-toushi")!;

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
  datePublished: "2026-02-18",
  dateModified: guide.updated,
});

const INDEX_ROWS: Array<[string, string, string]> = [
  ["全世界株式（オルカン型）", "世界中の株式にまとめて分散", "1本で世界に広く分散したい人"],
  ["米国株式（S&P500型）", "米国の主要500社に投資", "成長を続けてきた米国に集中したい人"],
  ["バランス型", "株式・債券などを一定比率で保有", "値動きをやや抑えたい人"],
];

export default function IndexToushiPage() {
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
              FIREや資産形成の土台としてよく選ばれるのが<strong>インデックス投資</strong>です。
              「難しそう」「損をしそう」と身構える人も多いですが、仕組みはとてもシンプルです。
              この記事では、インデックス投資とは何か、投資信託の選び方、全世界株とS&P500の違い、
              長期・分散・積立という基本の考え方、そして初心者が避けたい失敗を、専門用語をかみくだいて解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">インデックス投資とは？</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              インデックス投資とは、<strong>市場全体の動きを示す指数（インデックス）に連動する投資信託などを買い、
              市場に丸ごと投資する</strong>方法です。指数とは、たとえば米国の主要企業をまとめた「S&P500」や、
              世界中の株式をまとめた指数など、市場の平均点のようなものです。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              値上がりしそうな個別銘柄を当てにいくのではなく、<strong>市場全体の成長をまるごと受け取る</strong>のが
              インデックス投資の発想です。プロでも市場平均に勝ち続けるのは難しいとされ、
              手間をかけずに世界経済の成長に乗れる点が、長期の資産形成と相性が良い理由です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">代表的な投資対象</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              インデックス投資でよく選ばれるのは、次のようなタイプの投資信託です。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">タイプ</th>
                    <th className="py-2 pr-3 font-medium">中身</th>
                    <th className="py-2 font-medium">向いている人</th>
                  </tr>
                </thead>
                <tbody>
                  {INDEX_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100 align-top">
                      <td className="py-3 pr-3 font-semibold text-zinc-900">{row[0]}</td>
                      <td className="py-3 pr-3 text-zinc-700">{row[1]}</td>
                      <td className="py-3 text-zinc-600">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              <strong>全世界株</strong>は1本で世界中に分散でき、地域の偏りを気にせず持ち続けられるのが利点です。
              一方<strong>S&P500</strong>は米国に集中するぶん、米国が好調なときの伸びが期待できますが、米国頼みになる点は理解しておきましょう。
              どちらが正解というものではなく、自分が長く持ち続けられる方を選ぶのが大切です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">投資信託を選ぶときのチェックポイント</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>信託報酬（運用コスト）が低いか：</strong>
                投資信託を持っている間、毎年かかる手数料です。同じ指数に連動するなら、
                信託報酬が低いほど手元に残るお金が増えます。長期では差が大きくなるため、最重要のチェック項目です。
              </li>
              <li>
                <strong>純資産総額が十分に大きいか：</strong>
                資金が集まっているファンドは運用が安定しやすく、運用終了（繰上償還）のリスクも低い傾向があります。
              </li>
              <li>
                <strong>連動する指数がわかりやすいか：</strong>
                「全世界株」「S&P500」など、中身が明快な指数に連動するものは、値動きの理由を理解しやすくなります。
              </li>
              <li>
                <strong>NISAのつみたて投資枠で買えるか：</strong>
                つみたて投資枠の対象商品は、長期・積立・分散に適したものが選ばれています。初心者の目印になります。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              基本は「長期・分散・積立」の3つ
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>長期：</strong>
                短期の値動きに一喜一憂せず、10年・20年と持ち続けることで、世界経済の成長を取り込みやすくなります。
              </li>
              <li>
                <strong>分散：</strong>
                1つの国や企業に集中せず、幅広く投資することで、どこかが不調でも全体で支え合えます。
              </li>
              <li>
                <strong>積立（ドルコスト平均法）：</strong>
                毎月一定額を機械的に買い続けると、価格が高いときは少なく、安いときは多く買えます。
                買うタイミングを悩まなくて済み、高値づかみを避けやすくなります。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              この3つを守るだけで、投資の再現性はぐっと高まります。特別なテクニックよりも、
              <strong>「淡々と続けられる仕組み」</strong>を作ることが成功の近道です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">初心者が避けたい失敗</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>下落時に慌てて売る：</strong>
                相場は必ず上下します。下がったときに売ってしまうと損失が確定します。積立を淡々と続けることが大切です。
              </li>
              <li>
                <strong>生活費まで投資に回す：</strong>
                近い将来に使うお金や生活防衛資金まで投資すると、下落時に取り崩さざるを得なくなります。
                投資は「当面使わないお金」で行います。
              </li>
              <li>
                <strong>コストの高い商品を選ぶ：</strong>
                手数料が高い商品は、長期ではリターンを大きく削ります。低コストのインデックスファンドが基本です。
              </li>
              <li>
                <strong>頻繁に売買する：</strong>
                売買のたびにタイミングを当てるのは困難です。長期保有を前提に、いじりすぎないことが結果につながります。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>インデックス投資は市場全体にまるごと投資するシンプルな方法。</li>
              <li>全世界株かS&P500か、自分が持ち続けられる方を選ぶ。信託報酬の低さが最重要。</li>
              <li>基本は「長期・分散・積立」。淡々と続けられる仕組みを作る。</li>
              <li>下落時に売らない・生活費は投資に回さない・コストを抑えることが失敗を防ぐ。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              非課税で積み立てられる制度は{" "}
              <Link href="/guide/nisa-ideco" className="underline underline-offset-2 hover:text-zinc-900">
                新NISAとiDeCoの記事
              </Link>{" "}
              で、毎月いくら積み立てるとFIREにいつ届くかは{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                シミュレーター
              </Link>{" "}
              で確認できます。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品を推奨・勧誘するものではありません。
            投資には元本割れのリスクがあり、将来の運用成果を保証するものではありません。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
