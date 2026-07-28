import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("roadmap")!;

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
  datePublished: "2026-03-04",
  dateModified: guide.updated,
});

const SAVINGS_RATE_ROWS: Array<[string, string]> = [
  ["10%", "約50年"],
  ["20%", "約37年"],
  ["30%", "約28年"],
  ["40%", "約22年"],
  ["50%", "約17年"],
  ["60%", "約12〜13年"],
  ["70%", "約8〜9年"],
];

export default function RoadmapPage() {
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
              FIREは一発逆転ではなく、「支出を整える → 入金力を上げる → 効率よく運用する → 上手に取り崩す」という
              地道な積み重ねで近づいていきます。この記事では、今の状態からFIREを目指すための現実的な進め方を
              5つのステップに分けて解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              カギを握るのは「貯蓄率」
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              FIREに到達するまでの年数は、収入の多さよりも<strong>貯蓄率（手取りのうち投資に回す割合）</strong>に
              大きく左右されます。貯蓄率が高いほど、必要資産が小さくなり（支出が少ない）、同時に貯まるスピードも速くなる
              ――この二重の効果で到達年数が一気に縮むためです。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[360px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">貯蓄率</th>
                    <th className="py-2 font-medium">FIRE到達までの年数（目安）</th>
                  </tr>
                </thead>
                <tbody>
                  {SAVINGS_RATE_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100">
                      <td className="py-2.5 pr-3 font-medium text-zinc-900">{row[0]}</td>
                      <td className="py-2.5 text-zinc-700">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 資産ゼロから、実質利回り年5%・取り崩し率4%を仮定した場合のイメージです。前提が変われば年数も変わります。
              あくまで貯蓄率の影響の大きさを示すための概算です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">ステップ1：現在地を把握する</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              最初にやるべきは、<strong>純資産（資産−負債）</strong>と<strong>年間支出</strong>、そして
              <strong>貯蓄率</strong>を数字で把握することです。ゴール（必要資産）と現在地がわかって初めて、
              残りの距離が見えてきます。家計簿アプリや口座の集計機能を使えば、細かくつけなくても大枠はつかめます。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">ステップ2：支出を最適化する</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              支出の見直しは<strong>固定費から</strong>が鉄則です。一度見直せば効果がずっと続くうえ、
              我慢によるストレスが小さいからです。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li><strong>通信費：</strong>格安SIMや料金プランの見直し。</li>
              <li><strong>保険：</strong>保障の重複や過剰な保障を整理する。</li>
              <li><strong>住居費：</strong>家賃の割合が高すぎないか、更新時に見直す。</li>
              <li><strong>サブスク：</strong>使っていない定額サービスを解約する。</li>
              <li><strong>車：</strong>本当に必要か、維持費まで含めて再検討する。</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              支出を下げると、貯蓄に回せる額が増えるだけでなく、必要資産（年間支出×25）そのものも小さくなります。
              まさに一石二鳥のステップです。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">ステップ3：入金力を上げる</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              支出の削減には下限がありますが、収入の伸びしろには上限がありません。
              <strong>入金力（投資に回せる金額）</strong>を高めることは、FIREを早める強力なエンジンです。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>昇給・昇格や、条件のよい会社への転職を検討する。</li>
              <li>スキルを磨いて市場価値を高める（資格・専門性）。</li>
              <li>副業で収入の柱を増やす。将来のサイドFIREの土台にもなる。</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              ここで大切なのは、収入が増えても生活水準を同じペースで上げない（ライフスタイル・インフレを避ける）ことです。
              増えた分をそのまま投資に回せば、貯蓄率が上がりFIREが近づきます。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              ステップ4：非課税制度で効率よく増やす
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              同じ金額・同じ利回りでも、税金の有無で手元に残るお金は変わります。日本には運用益が非課税になる
              制度があり、これを使わない手はありません。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>NISA：</strong>
                2024年からの新しいNISAは、非課税で保有できる期間が無期限になり、生涯の非課税保有限度額は
                1,800万円（うち成長投資枠は1,200万円まで）です。年間の投資枠はつみたて投資枠120万円＋成長投資枠240万円の
                合計360万円まで。長期・分散・積立の土台として使いやすい制度です。
              </li>
              <li>
                <strong>iDeCo（個人型確定拠出年金）：</strong>
                掛金が全額所得控除になり、運用益も非課税、受け取り時にも控除があります。
                ただし原則60歳まで引き出せないため、FIREで早期に取り崩したい資金とは役割を分けて考えます。
                掛金の上限は働き方（会社員・公務員・自営業など）によって異なります。
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 制度の内容・上限額・対象は改正されることがあります。最新の情報は金融庁・iDeCo公式サイト等でご確認ください。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">ステップ5：出口戦略を決めておく</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              資産を「貯める」だけでなく「使う」段階の設計も、FIREでは同じくらい重要です。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>取り崩しルールを決める：</strong>
                4%ルールを基準に、相場が悪い年は引き出しを控えるなど、柔軟な運用ルールを用意しておく。
              </li>
              <li>
                <strong>サイドFIREを検討する：</strong>
                完全リタイアにこだわらず、一部を労働収入でまかなえば必要資産を大きく減らせます。
              </li>
              <li>
                <strong>現金クッションを持つ：</strong>
                数年分の生活費を現金で確保し、暴落時に安値で売らずに済むようにする。
              </li>
              <li>
                <strong>定期的にリバランスする：</strong>
                値上がり・値下がりで崩れた資産配分を、年1回など決めたタイミングで元に戻す。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>FIRE到達年数を決めるのは収入より貯蓄率。</li>
              <li>現在地の把握 → 固定費の最適化 → 入金力アップ → 非課税運用 → 出口戦略、の順で進める。</li>
              <li>NISA・iDeCoを役割分担して活用し、税引き後の効率を高める。</li>
              <li>取り崩しルールと現金クッションを事前に決めておくと安心。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              自分の貯蓄率や積立額だと何歳でFIREできるのか――それを一番早く知る方法は、実際に数字を入れてみることです。
              本サイトの{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              で、あなたの計画を試算してみてください。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の金融商品の勧誘や投資助言ではありません。
            NISA・iDeCo等の制度内容は改正される場合があります。最新情報は公的機関の公式サイトをご確認のうえ、
            投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
