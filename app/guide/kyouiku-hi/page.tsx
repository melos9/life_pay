import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("kyouiku-hi")!;

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
  datePublished: "2026-02-26",
  dateModified: guide.updated,
});

// アプリ本体（app/page.tsx）と同じ、文部科学省・JASSO・e-Gov を参照した標準額（年額）に基づく目安。
const STAGE_ROWS: Array<[string, string, string]> = [
  ["小学校（6年）", "約11万円/年", "約101万円/年"],
  ["中学校（3年）", "約17万円/年", "約107万円/年"],
  ["高校（3年）", "約31万円/年", "約75万円/年"],
];

const UNIV_ROWS: Array<[string, string]> = [
  ["国公立大学（4年）", "約240万円"],
  ["私立大学・文系（4年）", "約410万円"],
  ["私立大学・理系（4年）", "約550万円"],
];

export default function KyouikuHiPage() {
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
              FIREや老後の計画を立てるうえで、教育費は避けて通れない大きな出費です。
              進路が公立か私立か、文系か理系かで総額は大きく変わります。
              この記事では、文部科学省やJASSO（日本学生支援機構）の調査をもとにした段階別の目安と、
              無理なく備えるための考え方を整理します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">段階別の教育費（年額の目安）</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              まずは学校に通うことでかかる費用（授業料・給食費など、塾や習い事を除く）の目安です。
              私立は公立の数倍になることがわかります。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">段階</th>
                    <th className="py-2 pr-3 font-medium">公立</th>
                    <th className="py-2 font-medium">私立</th>
                  </tr>
                </thead>
                <tbody>
                  {STAGE_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100">
                      <td className="py-2.5 pr-3 font-medium text-zinc-900">{row[0]}</td>
                      <td className="py-2.5 pr-3 text-zinc-700">{row[1]}</td>
                      <td className="py-2.5 text-zinc-700">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 文部科学省「子供の学習費調査」の学校教育費＋学校給食費を参考にした標準額。学習塾・習い事などの
              学校外活動費は含みません（別途下記で解説）。金額は年度や地域で変動します。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">大学でかかる費用（4年間の目安）</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              教育費のもっとも大きな山は大学です。入学料と授業料を合わせた4年間の目安は次のとおりです
              （自宅通学を想定。下宿する場合は家賃・生活費が別途かかります）。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[360px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">進路</th>
                    <th className="py-2 font-medium">4年間の目安</th>
                  </tr>
                </thead>
                <tbody>
                  {UNIV_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100">
                      <td className="py-2.5 pr-3 font-medium text-zinc-900">{row[0]}</td>
                      <td className="py-2.5 font-semibold text-zinc-900">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 国公立は文部科学省令の標準額（入学料・授業料）、私立はJASSO「学生生活調査」等を参考にした目安。
              医歯薬系や一人暮らしの場合はさらに大きくなります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">塾・習い事の費用も忘れずに</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              学校の費用に加えて、多くの家庭で発生するのが<strong>塾・習い事</strong>です。
              受験を意識した学習塾は、学年が上がるほど費用も増える傾向があります（目安：小学校高学年で年30〜40万円、
              中学・高校で年40〜55万円程度）。英会話・スイミング・ピアノといった習い事も、
              1つあたり月5,000〜10,000円ほどが相場です。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              これらは選ぶかどうかを家庭で決められる費用です。すべてを詰め込むと負担が大きくなるため、
              優先順位をつけて計画に織り込みましょう。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">教育費を無理なく備える3つの方法</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>児童手当を使わずに貯める：</strong>
                受け取った児童手当を生活費に使わず、そのまま積み立てるだけでもまとまった額になります。
              </li>
              <li>
                <strong>早く・自動で積み立てる：</strong>
                子どもが小さいうちから毎月一定額を自動でよけておくと、大学入学時の大きな支出に備えられます。
                長い時間をかけられるほど、運用の効果も期待できます。
              </li>
              <li>
                <strong>制度の使い分け：</strong>
                元本の安全性を重視するなら学資保険や預金、値動きを許容できるならNISAでの積立など、
                リスク許容度に応じて手段を選びます。使う時期が決まっているお金なので、取り崩す数年前からは
                安全資産の比率を高めるのが定石です。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIRE計画に組み込むときの注意</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              教育費は<strong>発生する時期が集中する</strong>のが特徴です。とくに大学入学の年は、入学料・前期授業料・
              引っ越し費用などが重なり、家計への負担がピークになります。FIRE後にこの山が来ると、
              資産の取り崩しペースが一気に速まることもあります。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              そのため、教育費は生活費とは<strong>別枠</strong>で見積もり、いつ・いくら必要になるかを
              時系列で把握しておくことが重要です。本サイトの{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                シミュレーター
              </Link>{" "}
              は、子どもの人数・進学プラン（公立／私立、大学・大学院）・塾・習い事を入力すると、
              教育費を含めた年次の資産推移を自動で計算します。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>教育費は公立か私立か、文理でかかる額が大きく変わる。</li>
              <li>最大の山は大学。4年間で国公立約240万円〜私立理系約550万円が目安。</li>
              <li>塾・習い事は選択できる費用。優先順位をつけて計画に反映する。</li>
              <li>発生時期が集中するため、生活費とは別枠で時系列に備える。</li>
            </ul>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 金額はいずれも文部科学省「子供の学習費調査」、JASSO「学生生活調査」、文部科学省令の標準額などを
            参考にした目安であり、年度・地域・学校により異なります。最新の数値は各機関の公式資料をご確認ください。
            本記事は投資助言ではありません。
          </p>
        </article>
      </div>
    </>
  );
}
