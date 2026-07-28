import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("4percent-rule")!;

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
  datePublished: "2026-02-14",
  dateModified: guide.updated,
});

export default function FourPercentRulePage() {
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
              FIREの必要資産を語るときに必ず出てくるのが「4%ルール」と「25倍の法則」です。
              便利な目安ですが、そのまま鵜呑みにすると危険な面もあります。
              この記事では、ルールの根拠になった研究から、取り崩し率の決め方、
              そして日本で使うときに調整すべきポイントまでを整理します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">4%ルールとは？</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              4%ルールとは、
              <strong>
                リタイア初年度に資産の4%を引き出し、翌年以降はその金額を物価上昇に合わせて調整して取り崩していけば、
                資産が長期間（目安30年）底をつきにくい
              </strong>
              とする考え方です。米国の大学（トリニティ大学）の研究者らが、株式と債券を組み合わせたポートフォリオで
              過去の相場を検証した「トリニティスタディ」がよく知られた根拠です。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              この研究では、株式と債券に分散したポートフォリオで年4%程度の取り崩しなら、
              多くの期間で30年後も資産が残っていた、という結果が示されました。
              ここから「年4%まで」という取り崩しの目安が広まりました。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">「25倍の法則」との関係</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              4%ルールを裏返すと、必要資産の目安が求められます。年間支出が資産の4%に収まればよいので、
              必要資産は年間支出の <strong>1 ÷ 0.04 ＝ 25倍</strong> になります。これが「25倍の法則」です。
            </p>
            <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800">
              <p className="font-semibold text-zinc-900">計算のイメージ</p>
              <p className="mt-2">
                必要資産 ＝ リタイア後の年間支出 × 25
                <br />
                年間取り崩し可能額 ＝ 資産 × 4%
              </p>
              <p className="mt-2 text-zinc-600">
                例）年間支出300万円なら、300万円 × 25 ＝ 7,500万円が目安。
                7,500万円の4%＝300万円を毎年引き出すイメージです。
              </p>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">支出別・必要資産の早見表</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">月の支出</th>
                    <th className="py-2 pr-3 font-medium">年間支出</th>
                    <th className="py-2 font-medium">必要資産（25倍）</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["15万円", "180万円", "4,500万円"],
                    ["20万円", "240万円", "6,000万円"],
                    ["25万円", "300万円", "7,500万円"],
                    ["30万円", "360万円", "9,000万円"],
                    ["40万円", "480万円", "1億2,000万円"],
                  ].map((row) => (
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
              年金やサイド収入があれば、その分だけ資産から取り崩す額を減らせるので、必要資産はもっと小さくなります。
              年金・副収入を織り込んだ現実的な計算は{" "}
              <Link
                href="/guide/hitsuyou-shikin"
                className="underline underline-offset-2 hover:text-zinc-900"
              >
                「FIREに必要な資金の計算」
              </Link>{" "}
              で解説しています。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">4%ルールの注意点・限界</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              4%ルールはあくまで<strong>過去データにもとづく目安</strong>であり、将来を保証するものではありません。
              次のような限界を理解して使うことが大切です。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>米国・過去30年が前提：</strong>
                元の研究は米国市場の歴史的リターンと30年という期間が前提です。より長い期間や別の国では結果が変わり得ます。
              </li>
              <li>
                <strong>暴落のタイミングに弱い：</strong>
                リタイア直後に大きな下落が来ると、取り崩しと値下がりが重なって資産寿命が縮みます（収益率配列リスク）。
              </li>
              <li>
                <strong>税金・手数料が含まれない：</strong>
                日本では運用益に約20%の税金がかかります（NISA等の非課税枠を除く）。実質の取り崩し余力は目減りします。
              </li>
              <li>
                <strong>為替リスク：</strong>
                米国株中心で運用しつつ円で生活する場合、円高になると円ベースの資産・取り崩し額が減ります。
              </li>
              <li>
                <strong>インフレ想定：</strong>
                元ルールは物価上昇に合わせて引き出し額を増やす前提です。想定以上のインフレでは負担が増えます。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">日本で使うときの調整方法</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>取り崩し率を少し保守的にする：</strong>
                不安が大きい人は、4%ではなく3〜3.5%を目安にすると安全余裕が増えます（必要資産は約28〜33倍）。
              </li>
              <li>
                <strong>年金を戦力に数える：</strong>
                日本には公的年金があるため、受給開始後は取り崩しを抑えられます。年金前提なら必要資産の目安は下がります。
              </li>
              <li>
                <strong>NISA・iDeCoで非課税運用：</strong>
                非課税枠を活用すると、税引き後の取り崩し余力が実質的に増えます。
              </li>
              <li>
                <strong>下落時は支出を柔軟に：</strong>
                相場が悪い年は旅行や大きな買い物を控えるなど、引き出し額を機械的に固定しない工夫が有効です。
              </li>
              <li>
                <strong>現金クッションを持つ：</strong>
                2〜3年分の生活費を現金・預金で確保しておくと、暴落時に安値で資産を売らずに済みます。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>4%ルールは「資産の4%までなら長期でも底をつきにくい」という取り崩しの目安。</li>
              <li>裏返すと必要資産は「年間支出の25倍」。</li>
              <li>米国・過去・30年が前提で、税・為替・暴落・インフレのリスクは別途考慮が必要。</li>
              <li>日本では取り崩し率をやや保守的にし、年金・非課税制度・現金クッションで補強すると安心。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              取り崩し率を変えると必要資産や資産寿命がどう動くかは、実際に数字を動かして確かめるのが一番わかりやすいです。
              本サイトの{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                シミュレーター
              </Link>{" "}
              では、取り崩し率・利回り・インフレ率を変えながら将来の資産推移を確認できます。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 4%ルールは過去の市場データにもとづく一般的な目安であり、将来の運用成果を保証するものではありません。
            本記事は情報提供を目的としたもので、特定の金融商品の勧誘や投資助言ではありません。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
