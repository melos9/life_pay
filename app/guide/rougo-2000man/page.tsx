import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("rougo-2000man")!;

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

export default function Rougo2000manPage() {
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
              数年前に大きな話題になった<strong>「老後2000万円問題」</strong>。
              「年金だけでは2000万円足りない」という文脈で語られましたが、その数字がどこから来たのかを
              正しく理解している人は多くありません。この記事では、報告書の中身と前提を整理し、
              公的年金の仕組み、そしてFIRE計画にどう落とし込むかまでをやさしく解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">「2000万円」はどこから来た数字？</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              この数字は、2019年に金融庁の金融審議会がまとめた報告書がきっかけです。当時のある調査で、
              <strong>高齢夫婦の無職世帯</strong>の家計収支を見ると、年金などの収入だけでは
              毎月およそ5万円ほど支出が上回っていました。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              この「毎月約5万円の不足」が20〜30年続くと仮定すると、
              <strong>5万円 × 12か月 × 30年 ≒ 約1,800万〜2,000万円</strong>になります。
              これが「老後2000万円問題」として広まった数字の正体です。
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ もとになった不足額は、ある年の家計調査の平均値に基づく一例です。年度や世帯構成で金額は変わり、
              すべての人に2000万円が必要という意味ではありません。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">この数字を鵜呑みにしてはいけない理由</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              2000万円はあくまで<strong>「平均的なモデル世帯の、ある一時点の試算」</strong>にすぎません。
              次の点で、実際の必要額は人によって大きく変わります。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>支出は人それぞれ：</strong>
                持ち家か賃貸か、地方か都市部か、趣味や医療費の多寡で、必要額は大きく上下します。
              </li>
              <li>
                <strong>年金額も人それぞれ：</strong>
                現役時代の働き方（会社員か自営業か）や加入期間で、受け取る年金額は変わります。
              </li>
              <li>
                <strong>不足額は取り崩し以外でも埋められる：</strong>
                働いて収入を得たり、支出を見直したりすれば、必要な取り崩し額は小さくなります。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              大切なのは、平均値に振り回されず<strong>「自分の場合はいくら必要か」</strong>を試算することです。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">公的年金の仕組みをおさらい</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              日本の公的年金は<strong>2階建て</strong>と表現されます。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>1階：国民年金（基礎年金）</strong>
                ── 20歳以上の全員が対象。原則65歳から受け取れます。
              </li>
              <li>
                <strong>2階：厚生年金</strong>
                ── 会社員・公務員が加入。給与に応じて保険料を払い、そのぶん受給額も上乗せされます。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              つまり会社員は「基礎年金＋厚生年金」を、自営業などの人は「基礎年金」を受け取るのが基本です。
              自分の見込み額は、日本年金機構の<strong>「ねんきん定期便」やねんきんネット</strong>で確認できます。
              FIRE計画では、この見込み額を必ず前提に入れましょう。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">受け取りを遅らせると年金は増える</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              公的年金は、受け取り開始を65歳より遅らせる<strong>「繰下げ受給」</strong>を選ぶと、
              1か月遅らせるごとに受給額が増え、最大で75歳まで遅らせられます。反対に早く受け取る
              「繰上げ受給」を選ぶと、受給額は減ります。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              長生きに備える意味では繰下げが有力な選択肢ですが、その間の生活費を別に用意する必要があります。
              FIRE後は「年金開始までのつなぎ資金」をどう確保するかが重要なテーマになります。
            </p>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 繰上げ・繰下げの増減率や年齢の上限は制度改正で変わることがあります。最新の内容は日本年金機構の
              公式情報でご確認ください。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIRE計画にどう活かす？</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>年金を前提に必要資産を下げる：</strong>
                65歳以降に年金が入るぶん、それ以降の取り崩し額は小さくできます。年金を織り込むと、
                必要資産の目安は下がります。
              </li>
              <li>
                <strong>年金開始までの「つなぎ資金」を厚めに：</strong>
                早期リタイアするほど、年金が始まるまでの期間が長くなります。この間の生活費を
                いつでも引き出せる資産で確保しておくことが安心につながります。
              </li>
              <li>
                <strong>「2000万円」ではなく自分の数字で：</strong>
                支出・年金・住居の条件を自分に合わせて試算すれば、必要額はもっと具体的に見えてきます。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>「2000万円」は平均的なモデル世帯の一時点の試算にすぎない。</li>
              <li>必要額は支出・年金・住居の条件で大きく変わる。自分の数字で考える。</li>
              <li>公的年金は2階建て。見込み額はねんきん定期便・ねんきんネットで確認できる。</li>
              <li>FIREでは年金を前提に必要資産を下げつつ、年金開始までのつなぎ資金を厚めに用意する。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              年金の受給開始年齢や見込み額を入れて、老後まで資産が持つかを確かめたいときは、{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              が便利です。年金開始年齢・受給額まで反映して資産推移を計算します。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品を推奨・勧誘するものではありません。
            金額はいずれも目安であり、年度・世帯・制度改正により実際とは異なります。年金制度の最新情報は
            日本年金機構・厚生労働省など公的機関の公式サイトをご確認ください。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
