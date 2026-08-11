import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("torikuzushi")!;

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
  datePublished: "2026-02-24",
  dateModified: guide.updated,
});

const METHOD_ROWS: Array<[string, string, string]> = [
  [
    "定額法",
    "毎年決まった金額を取り崩す",
    "生活費が読みやすい。ただし暴落時も同額を売るため資産が early に減りやすい。",
  ],
  [
    "定率法",
    "毎年、資産残高の一定割合を取り崩す",
    "資産が減れば取り崩し額も自動で減り、枯渇しにくい。ただし収入が年ごとに上下する。",
  ],
];

export default function TorikuzushiPage() {
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
              資産を「貯める」ことばかりに注目が集まりますが、FIRE後に本当に大切なのは
              <strong>「どう使う（取り崩す）か」</strong>という出口戦略です。取り崩し方しだいで、
              同じ資産でも長持ちするかどうかが変わります。この記事では、定額法と定率法の違い、
              4%ルールの実践、そしてリタイア直後の暴落への備え方をわかりやすく解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">2つの取り崩し方：定額法と定率法</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              資産の取り崩し方には、大きく分けて<strong>定額法</strong>と<strong>定率法</strong>の2つがあります。
              それぞれに長所と短所があります。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">方法</th>
                    <th className="py-2 pr-3 font-medium">取り崩し方</th>
                    <th className="py-2 font-medium">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {METHOD_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100 align-top">
                      <td className="py-3 pr-3 font-semibold text-zinc-900 whitespace-nowrap">
                        {row[0]}
                      </td>
                      <td className="py-3 pr-3 text-zinc-700">{row[1]}</td>
                      <td className="py-3 text-zinc-600">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              生活費の安定を重視するなら定額法、資産を長持ちさせることを重視するなら定率法が向いています。
              実際には、<strong>基本は定率で取り崩しつつ、下限・上限を設ける</strong>など、両者を組み合わせる人も多くいます。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">「4%ルール」は取り崩しの目安</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              FIREでよく使われる<strong>4%ルール</strong>は、「年間支出の25倍の資産を作り、毎年4%ずつ取り崩せば、
              長期間資産が枯渇しにくい」という考え方です。取り崩し戦略としては、この4%を
              <strong>出発点の目安</strong>ととらえると実践しやすくなります。
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>資産6,000万円 → 年240万円（月20万円）が取り崩しの目安</li>
              <li>資産7,500万円 → 年300万円（月25万円）が取り崩しの目安</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              ただし4%はアメリカの過去データに基づく試算で、税金・為替・インフレは別途考える必要があります。
              日本で使うときの注意点は{" "}
              <Link href="/guide/4percent-rule" className="underline underline-offset-2 hover:text-zinc-900">
                4%ルールと25倍の法則の記事
              </Link>{" "}
              で詳しく解説しています。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              最大の敵「シークエンスリスク」とは
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              取り崩し期の最大のリスクが<strong>シークエンス・オブ・リターン（収益率配列）リスク</strong>です。
              これは、<strong>リタイア直後に大きな下落が来ると、値下がりと取り崩しが同時に進み、
              資産の寿命が大きく縮む</strong>という問題です。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              同じ平均リターンでも、暴落が「早い時期」に来るか「遅い時期」に来るかで、資産が持つかどうかは大きく変わります。
              下がった資産を売って生活費にあてると、価格が戻っても取り返せる元本が減ってしまうためです。
              リタイア直後の数年間は、とくに慎重な取り崩しが求められます。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">暴落に負けないための備え</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>現金クッションを持つ：</strong>
                生活費の2〜3年分を現金で確保しておくと、暴落時に値下がりした資産を売らずに、
                現金から生活費をまかなえます。相場の回復を待つ余裕が生まれます。
              </li>
              <li>
                <strong>下落時は取り崩しを減らす（変動取り崩し）：</strong>
                相場が悪い年は取り崩し額を抑え、良い年に少し多めに使うと、資産寿命が延びやすくなります。
              </li>
              <li>
                <strong>少しの労働収入を組み合わせる：</strong>
                サイドFIREのように一部を働いて稼げば、取り崩し額そのものを減らせます。暴落時の支えになります。
              </li>
              <li>
                <strong>年金を「後半の土台」にする：</strong>
                65歳以降の公的年金を前提にすれば、それまでの期間に集中して備えればよく、計画が立てやすくなります。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">取り崩しの順番も意識する</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              どの口座・資産から使うかも、資産寿命に影響します。一般には、
              <strong>課税口座や現金から先に使い、非課税で運用できるNISAはできるだけ長く運用を続ける</strong>と、
              非課税メリットを長く享受しやすくなります。iDeCoは60歳以降の受け取りになるため、
              受け取り時期の税負担も考えて計画します。
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 最適な順番は資産構成や税制で変わります。制度の詳細は公的機関の公式情報をご確認ください。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>取り崩しには定額法と定率法があり、安定重視なら定額、長持ち重視なら定率。</li>
              <li>4%ルールは取り崩しの出発点の目安。税・為替・インフレは別途考える。</li>
              <li>リタイア直後の暴落（シークエンスリスク）が最大の敵。</li>
              <li>現金クッション・変動取り崩し・労働収入・年金で備える。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              自分の資産と支出で、想定寿命まで資産が持つかどうかは、{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              で年ごとの資産推移として確認できます。取り崩しペースを変えたときの違いも試してみてください。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品を推奨・勧誘するものではありません。
            取り崩しの試算はいずれも目安であり、将来の結果を保証するものではありません。税制の最新情報は公的機関の公式サイトを
            ご確認ください。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
