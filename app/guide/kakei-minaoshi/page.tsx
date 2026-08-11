import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("kakei-minaoshi")!;

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
  datePublished: "2026-02-22",
  dateModified: guide.updated,
});

const FIXED_COST_ROWS: Array<[string, string]> = [
  ["通信費", "格安SIMへの乗り換え、使っていないオプションの解約"],
  ["保険料", "保障の重複を整理し、必要な保障だけに絞る"],
  ["住居費", "家賃の見直し、住宅ローンの借り換え検討"],
  ["サブスク", "使用頻度の低い定額サービスを棚卸しして解約"],
  ["電気・ガス", "料金プランや契約先の見直し"],
];

export default function KakeiMinaoshiPage() {
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
              FIREに到達するスピードを決めるのは、利回りだけではありません。むしろ大きいのが
              <strong>「入金力」＝毎月いくら投資に回せるか</strong>です。入金力は、収入を増やすか、
              支出を減らすことで高められます。この記事では、無理なく続けられる家計見直しの手順と、
              効果が大きい固定費の削り方、そして貯まる仕組みの作り方を具体的に解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">なぜ「入金力」が最重要なのか</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              資産形成の初期は、<strong>運用の利回りよりも入金額のほうが資産の伸びに効きます</strong>。
              たとえば資産100万円のうちは、年5%の利回りでも増えるのは年5万円。一方で毎月3万円多く積み立てれば、
              年36万円もの差が生まれます。土台がまだ小さい時期は、入金力を高めることが最短ルートです。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              入金力を高める方法は2つ。<strong>収入を増やす</strong>か、<strong>支出を減らす</strong>かです。
              収入アップには時間がかかりますが、支出の見直しは今日から始められ、効果もすぐ表れます。
              まずは支出から着手するのが王道です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まずは「固定費」から見直す</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              支出には、毎月ほぼ一定の<strong>固定費</strong>と、月ごとに変わる<strong>変動費</strong>があります。
              節約というと食費や外食を我慢するイメージがありますが、実は<strong>固定費の見直しのほうが効果が大きく、
              しかも一度見直せば効果が続きます</strong>。ストレスも少なく、まさに一石二鳥です。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">見直す項目</th>
                    <th className="py-2 font-medium">主な打ち手</th>
                  </tr>
                </thead>
                <tbody>
                  {FIXED_COST_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100 align-top">
                      <td className="py-3 pr-3 font-semibold text-zinc-900 whitespace-nowrap">
                        {row[0]}
                      </td>
                      <td className="py-3 text-zinc-700">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              なかでも<strong>通信費・保険・住居費</strong>は金額が大きく、見直しの効果が出やすい「三大固定費」です。
              たとえばスマホを格安SIMに替えるだけで、月数千円の削減になることも珍しくありません。
              月5,000円の削減は、年6万円・10年で60万円の差になります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">「先取り貯蓄」で仕組み化する</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              「余ったら貯める」では、なかなかお金は貯まりません。効果的なのは<strong>先取り貯蓄</strong>、
              つまり<strong>給料が入ったらすぐ、決めた金額を先に投資・貯蓄に回してしまう</strong>方法です。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>自動積立を設定する：</strong>
                NISAのつみたて投資枠などで毎月の自動積立を設定すれば、意思の力に頼らず続けられます。
              </li>
              <li>
                <strong>残ったお金で暮らす：</strong>
                先に投資額を差し引き、残りで生活する習慣にすると、自然と支出が引き締まります。
              </li>
              <li>
                <strong>昇給・臨時収入は積立に回す：</strong>
                収入が増えても生活水準を上げすぎず、増えたぶんを投資に振り向けると入金力が伸びます。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">支出の「見える化」から始める</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              見直しの第一歩は、<strong>今、何にいくら使っているかを把握する</strong>ことです。
              家計簿アプリやクレジットカードの明細を使って、1〜2か月分の支出を項目ごとに眺めてみましょう。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              「思ったより使っていた」項目が必ず見つかります。数字にすると、削るべき場所が自然と見えてきます。
              細かく管理するのが苦手な人は、まず<strong>固定費と大きな支出だけ</strong>を把握するところから始めれば十分です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">やりすぎない・削りすぎない</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              節約は続けてこそ意味があります。生活の満足度を極端に下げる我慢は長続きせず、反動で浪費に走りがちです。
              大切なのは、<strong>満足度が下がらない支出（固定費・ムダなサブスクなど）から優先して削り、
              本当に大事なことにはお金を使う</strong>というメリハリです。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              リタイア後の生活費を今の家計から見積もる作業は、そのままFIRE計画の精度を高めます。
              家計の見直しは、目標達成を早めるだけでなく、リタイア後の必要額を正しく知ることにもつながります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>FIREのスピードは入金力（毎月の投資額）で大きく変わる。資産が小さいうちはとくに重要。</li>
              <li>効果が大きく続くのは固定費の見直し。とくに通信・保険・住居の三大固定費。</li>
              <li>先取り貯蓄で仕組み化し、意思の力に頼らず続ける。</li>
              <li>支出を見える化し、満足度を下げない部分から優先して削る。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              見直しで浮いたお金を毎月いくら積み立てれば、いつFIREに届くか——{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                シミュレーター
              </Link>{" "}
              に入力すると、将来の資産推移として確かめられます。達成までの全体像は{" "}
              <Link href="/guide/roadmap" className="underline underline-offset-2 hover:text-zinc-900">
                ロードマップの記事
              </Link>{" "}
              も参考にしてください。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品・サービスを推奨・勧誘するものではありません。
            金額はいずれも目安です。投資には元本割れのリスクがあります。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
