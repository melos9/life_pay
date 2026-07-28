import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("fire-toha")!;

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
  datePublished: "2026-02-10",
  dateModified: guide.updated,
});

const FIRE_TYPES = [
  {
    name: "フルFIRE",
    target: "生活費のすべてを資産収入でまかなう",
    feature: "完全に働かなくても生活できる状態。必要資産がもっとも大きい。",
  },
  {
    name: "リーンFIRE",
    target: "支出を抑えたミニマルな生活",
    feature: "生活費を小さくして必要資産を下げる。倹約志向の人向け。",
  },
  {
    name: "ファットFIRE",
    target: "ゆとりのある生活水準を維持",
    feature: "旅行や趣味も楽しむ前提。必要資産は大きいが自由度が高い。",
  },
  {
    name: "サイドFIRE",
    target: "資産収入＋一部の労働収入",
    feature: "好きな仕事や副業を続けながら、足りない分を資産で補う。",
  },
  {
    name: "バリスタFIRE",
    target: "パート等の給与＋資産収入",
    feature: "社会保険に入れる働き方を続け、生活費の一部を賃金でまかなう。",
  },
  {
    name: "コーストFIRE",
    target: "追加投資をやめても老後資金が育つ",
    feature: "若いうちに元手を作り、あとは働いて生活費だけ稼ぐ。運用は継続。",
  },
];

export default function FireTohaPage() {
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
              「FIRE」という言葉を最近よく見かけるけれど、具体的に何を指すのかはあいまい――そんな人は少なくありません。
              この記事では、FIREの意味と成り立ち、代表的な6つのタイプ、メリットと見落としがちな注意点、
              そして日本で目指すときのポイントを、専門用語をかみくだいて解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIREとは？言葉の意味</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              FIREは <strong>Financial Independence, Retire Early</strong>{" "}
              の頭文字で、日本語では「経済的自立と早期リタイア」と訳されます。ポイントは、次の2つの要素に分けて考えることです。
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700">
              <li className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <strong className="text-zinc-900">FI（経済的自立）</strong>
                ：働かなくても、資産からの収入（配当・利息・取り崩し）で生活費をまかなえる状態。
              </li>
              <li className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <strong className="text-zinc-900">RE（早期リタイア）</strong>
                ：定年を待たず、自分の意思で働き方を選べるようになること。完全に仕事を辞めることだけを意味しません。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              大切なのは、FIREは「二度と働かないこと」ではなく、
              <strong>お金のために働く必要がない状態＝選択肢を持つこと</strong>だという点です。
              リタイア後も好きな仕事を続ける人は多く、そのスタイルの違いが次に紹介する「FIREのタイプ」に表れます。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              必要資産の目安は「年間支出の25倍」
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              FIREに必要な資産は、ざっくりと{" "}
              <strong>「リタイア後の年間支出 × 25倍」</strong>{" "}
              が目安とされます。これは、資産を年4%ずつ取り崩しても長期間なくならないとする
              「4%ルール」の裏返しです（25倍＝1 ÷ 4%）。
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>月20万円で暮らす → 年240万円 × 25 ＝ <strong>6,000万円</strong></li>
              <li>月25万円で暮らす → 年300万円 × 25 ＝ <strong>7,500万円</strong></li>
              <li>月30万円で暮らす → 年360万円 × 25 ＝ <strong>9,000万円</strong></li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              ただしこの目安には前提と限界があります。4%ルールの根拠や、日本で使うときの注意点は{" "}
              <Link
                href="/guide/4percent-rule"
                className="underline underline-offset-2 hover:text-zinc-900"
              >
                「4%ルールと25倍の法則」
              </Link>{" "}
              で詳しく解説しています。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIREの6つのタイプ</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              ひと口にFIREといっても、目指す生活水準や働き方によっていくつかのタイプに分かれます。
              自分に合うのはどれかをイメージしながら読んでみてください。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">タイプ</th>
                    <th className="py-2 pr-3 font-medium">生活の考え方</th>
                    <th className="py-2 font-medium">特徴</th>
                  </tr>
                </thead>
                <tbody>
                  {FIRE_TYPES.map((t) => (
                    <tr key={t.name} className="border-b border-zinc-100 align-top">
                      <td className="py-3 pr-3 font-semibold text-zinc-900 whitespace-nowrap">
                        {t.name}
                      </td>
                      <td className="py-3 pr-3 text-zinc-700">{t.target}</td>
                      <td className="py-3 text-zinc-600">{t.feature}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              近年の日本で現実的な選択肢として人気なのが、<strong>サイドFIRE</strong>です。
              資産をすべての生活費でまかなうフルFIREに比べて必要資産が小さく、
              好きな仕事や副業を続けることで社会とのつながりや張り合いを保ちやすいのが理由です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIREのメリット</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>時間の自由が手に入る：</strong>
                通勤や望まない残業から解放され、家族・健康・学び直しなど、お金では買えない時間に投資できます。
              </li>
              <li>
                <strong>働き方を選べる：</strong>
                「生活のために我慢する仕事」から「やりたいからやる仕事」へ切り替えやすくなります。
              </li>
              <li>
                <strong>お金の不安が減る：</strong>
                十分な資産と支出の見通しがあると、収入が途切れることへの過度な不安がやわらぎます。
              </li>
              <li>
                <strong>家計の解像度が上がる：</strong>
                FIREを目指す過程で家計を見直すこと自体が、生涯にわたって役立つスキルになります。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIREのデメリット・注意点</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              メリットばかりが強調されがちですが、始める前に知っておきたい注意点もあります。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>相場下落のリスク：</strong>
                リタイア直後に大きな下落が来ると、資産の取り崩しと値下がりが重なって寿命が縮む
                「シークエンス・オブ・リターン（収益率配列）リスク」があります。
              </li>
              <li>
                <strong>インフレで支出が増える：</strong>
                物価が上がれば同じ生活でも必要額は増えます。25倍の目安は将来の物価上昇も見込んで考える必要があります。
              </li>
              <li>
                <strong>社会保険・税金の負担：</strong>
                会社を辞めると健康保険や年金を自分で手当てする必要があり、想定より支出が増えることがあります。
              </li>
              <li>
                <strong>収入を再び得にくい場合がある：</strong>
                長いブランクの後に以前と同じ条件で復職するのは簡単ではありません。サイドFIREはこの弱点を補えます。
              </li>
              <li>
                <strong>やりがい・つながりの喪失：</strong>
                仕事が生活のリズムや人間関係の中心だった人は、リタイア後に張り合いを失うこともあります。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">
              日本でFIREを目指すときのポイント
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>NISA・iDeCoを活用する：</strong>
                運用益が非課税になる制度を使うと、同じ利回りでも手元に残るお金が増え、資産形成のスピードが上がります。
              </li>
              <li>
                <strong>公的年金を織り込む：</strong>
                日本には老齢年金があるため、65歳以降は取り崩し額を減らせます。年金を前提にすると必要資産の目安は下がります。
              </li>
              <li>
                <strong>退職後の社会保険を確認する：</strong>
                国民健康保険・国民年金への切り替えや、任意継続などの選択肢と保険料を事前に把握しておきましょう。
              </li>
              <li>
                <strong>教育費・住居費を別枠で考える：</strong>
                子育て世帯は教育費の山を、持ち家なら維持費を、生活費とは分けて見積もることが失敗しないコツです。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              これらの要素は一つひとつを暗算するのが難しいため、まとめて試算できるツールを使うのが近道です。
              本サイトの{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              は、年金・サイド収入・配偶者・教育費まで含めて将来の資産推移を計算できます。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>FIREは「経済的自立」と「早期リタイア」の2要素。働かない自由ではなく、選べる自由。</li>
              <li>必要資産の目安は「年間支出 × 25倍」。ただし前提と限界がある。</li>
              <li>フル／リーン／ファット／サイド／バリスタ／コーストの6タイプから自分に合う形を選ぶ。</li>
              <li>相場・インフレ・社会保険などのリスクを踏まえ、余裕を持った計画を立てる。</li>
            </ul>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品を推奨・勧誘するものではありません。
            制度・税制の最新情報は公的機関の公式サイトをご確認ください。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
