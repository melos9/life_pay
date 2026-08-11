import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getGuide } from "@/lib/guides";
import { RelatedGuides } from "@/components/RelatedGuides";

const guide = getGuide("nisa-ideco")!;

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

// 制度の主な違い。金額は目安で、最新は公的機関の公式情報を確認する前提。
const COMPARE_ROWS: Array<[string, string, string]> = [
  ["非課税で入れる上限", "年360万円／生涯1,800万円", "月1.2〜6.8万円（職業で異なる）"],
  ["運用益への課税", "非課税", "非課税"],
  ["掛金の所得控除", "なし", "全額が所得控除の対象"],
  ["引き出しやすさ", "いつでも引き出せる", "原則60歳まで引き出せない"],
  ["受け取り時の課税", "非課税", "退職所得控除・公的年金等控除の対象"],
  ["主な用途", "FIRE資金・教育費・老後まで幅広く", "老後資金づくりに特化"],
];

export default function NisaIdecoPage() {
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
              FIREや老後資金づくりで欠かせないのが、運用益が非課税になる<strong>NISA</strong>と
              <strong>iDeCo</strong>です。名前は似ていても役割はまったく違い、
              「どちらを先に使うべきか」で迷う人は少なくありません。この記事では、2024年に生まれ変わった
              新NISAとiDeCoの違いを、非課税枠・引き出しやすさ・税制メリットの3つの軸で整理し、
              FIREを目指すときの使い分けを解説します。
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まず結論：役割が違う2つの制度</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              ざっくり言うと、<strong>NISAは「いつでも使える自由な非課税口座」</strong>、
              <strong>iDeCoは「税優遇が手厚い代わりに60歳まで引き出せない年金口座」</strong>です。
              FIREのようにリタイア時期を自分で決めたい人にとって、この「引き出しやすさ」の差はとても重要です。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="py-2 pr-3 font-medium">比較項目</th>
                    <th className="py-2 pr-3 font-medium">新NISA</th>
                    <th className="py-2 font-medium">iDeCo</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr key={row[0]} className="border-b border-zinc-100 align-top">
                      <td className="py-2.5 pr-3 font-medium text-zinc-900">{row[0]}</td>
                      <td className="py-2.5 pr-3 text-zinc-700">{row[1]}</td>
                      <td className="py-2.5 text-zinc-700">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-zinc-400">
              ※ 制度の内容・上限額は改正されることがあります。最新の正確な情報は金融庁「NISA特設ウェブサイト」や
              iDeCo公式サイト（国民年金基金連合会）でご確認ください。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">新NISA（2024年〜）のポイント</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              2024年から始まった新NISAは、それまでの制度から大きく拡充されました。おさえておきたいのは次の点です。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>2つの枠を併用できる：</strong>
                コツコツ積み立てる「つみたて投資枠（年120万円）」と、個別株や幅広い投資信託も買える
                「成長投資枠（年240万円）」があり、合わせて<strong>年間最大360万円</strong>まで投資できます。
              </li>
              <li>
                <strong>生涯の非課税枠は1,800万円：</strong>
                一生涯で非課税にできる保有額の上限は1,800万円（うち成長投資枠は最大1,200万円）です。
              </li>
              <li>
                <strong>非課税期間は無期限：</strong>
                以前のような期限がなくなり、長期でじっくり運用を続けられます。
              </li>
              <li>
                <strong>売れば枠が復活する：</strong>
                保有商品を売却すると、その分（買ったときの金額ベース）の非課税枠が翌年以降に再利用できます。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              最大の魅力は<strong>いつでも引き出せる自由さ</strong>です。FIRE後の生活費、教育費、住宅資金など、
              使う時期を自分でコントロールしたいお金と相性が良い制度です。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">iDeCo（個人型確定拠出年金）のポイント</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              iDeCoは、自分で積み立てて運用する私的年金制度です。税制メリットが3段階（拠出時・運用時・受取時）で
              受けられるのが最大の特徴です。
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>掛金が全額所得控除：</strong>
                積み立てた金額はその年の所得から差し引かれ、所得税・住民税が軽くなります。これはNISAにはない、
                iDeCo最大のメリットです。
              </li>
              <li>
                <strong>運用益は非課税：</strong>
                通常およそ20%かかる運用益への税金がかかりません。
              </li>
              <li>
                <strong>受け取り時にも控除：</strong>
                一時金で受け取れば退職所得控除、年金形式なら公的年金等控除の対象になります。
              </li>
              <li>
                <strong>掛金の上限は職業で異なる：</strong>
                自営業（第1号被保険者）は月6.8万円、会社員（企業年金がない場合）は月2.3万円などが目安です。
                企業年金の有無や制度改正で変わるため、加入前に必ず最新の上限を確認しましょう。
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              注意点は<strong>原則60歳まで引き出せない</strong>ことです。老後資金としては強力ですが、
              「早期リタイア後、年金開始までのつなぎ資金」には使いにくい面があります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">FIREを目指すならどう使い分ける？</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              引き出しやすさと税メリットのバランスから、FIREを目指す人には次のような優先順位が一つの目安になります。
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>生活防衛資金を現金で確保：</strong>
                投資の前に、生活費の半年〜1年分は預金で確保しておきます。急な出費で投資を取り崩さないためです。
              </li>
              <li>
                <strong>まずはNISAを軸に：</strong>
                リタイア時期を自分で決めたいなら、いつでも引き出せるNISAを中心に据えるのが基本です。
              </li>
              <li>
                <strong>節税メリットが大きい人はiDeCoも併用：</strong>
                所得が高く節税効果が大きい人や、60歳以降に使う老後資金として割り切れる部分は、iDeCoの所得控除が効きます。
              </li>
            </ol>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              ポイントは<strong>「いつ使うお金か」で置き場所を分ける</strong>ことです。
              60歳より前に使う可能性があるお金はNISA・課税口座に、老後まで動かさないお金はiDeCoに、と整理すると迷いにくくなります。
            </p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">よくある注意点</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>
                <strong>非課税枠は「損益通算」できない：</strong>
                NISA口座で出た損失は、他の口座の利益と相殺できません。値動きの大きい短期売買には向きません。
              </li>
              <li>
                <strong>iDeCoには手数料がかかる：</strong>
                加入時・運用中に所定の手数料がかかります。掛金が少額すぎると相対的に負担が重くなる点に注意します。
              </li>
              <li>
                <strong>「非課税だから」と無理をしない：</strong>
                枠を埋めることが目的化して生活を圧迫しては本末転倒です。続けられる金額から始めましょう。
              </li>
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-zinc-900">まとめ</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-zinc-700">
              <li>NISAは「いつでも引き出せる自由な非課税口座」、iDeCoは「税優遇が手厚い年金口座」。</li>
              <li>新NISAは年360万円・生涯1,800万円・非課税無期限と大幅に拡充された。</li>
              <li>iDeCoは掛金が全額所得控除される一方、原則60歳まで引き出せない。</li>
              <li>FIREを目指すなら「いつ使うお金か」で置き場所を分けるのが基本。</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-700">
              自分の年収・支出でどれくらい資産が育つかは、{" "}
              <Link href="/" className="underline underline-offset-2 hover:text-zinc-900">
                FIREシミュレーター
              </Link>{" "}
              に入力すると将来の資産推移としてグラフで確認できます。
            </p>
          </section>

          <RelatedGuides currentSlug={guide.slug} />

          <p className="mt-8 text-xs leading-relaxed text-zinc-400">
            ※ 本記事は一般的な情報提供を目的としたものであり、特定の投資手法や金融商品を推奨・勧誘するものではありません。
            NISA・iDeCoの制度内容や上限額・手数料は改正されることがあります。最新の正確な情報は金融庁・iDeCo公式サイト
            （国民年金基金連合会）など公的機関の公式情報をご確認ください。投資判断はご自身の責任でお願いします。
          </p>
        </article>
      </div>
    </>
  );
}
