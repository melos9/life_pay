import type { Metadata } from "next";
import {
  ArticleLayout,
  H2,
  Note,
  P,
  UL,
} from "../_components/ArticleLayout";

export const metadata: Metadata = {
  title: "FIREとは？4%ルールと必要資産の基礎",
  description:
    "FIRE / サイドFIRE / Barista FIRE / Coast FIRE の違いと、必要資産の25倍ルール（4%ルール）の考え方を整理します。",
  alternates: { canonical: "/articles/fire-basics" },
};

export default function FireBasicsPage() {
  return (
    <ArticleLayout
      title="FIREとは？4%ルールと必要資産の基礎"
      lead="FIRE（Financial Independence, Retire Early）の定義、必要資産の概算方法（4%ルール / 25倍ルール）、そして派生形（サイド/Barista/Coast）の違いを、シミュレーターの入力項目と紐づけて解説します。"
      updatedAt="2026年4月"
      related={[
        { slug: "how-to-use", title: "FIREシミュレーターの使い方" },
        { slug: "use-cases", title: "応用例：DINKs/子持ち/独身/Coast FIRE" },
      ]}
    >
      <H2>FIRE とは</H2>
      <P>
        FIRE は「Financial Independence, Retire Early」の頭文字で、
        十分な資産を築いて運用益で生活し、早期に労働から離れるライフスタイルを指します。
        ポイントは「労働から離れること」自体ではなく、<strong>労働の有無を選べる状態（経済的自立）</strong>を作ることです。
      </P>

      <H2>4%ルール（25倍ルール）</H2>
      <P>
        FIRE の必要資産はよく次の式で概算されます。
      </P>
      <Note>
        必要資産 = 年間支出 × 25 ＝ 年間支出 ÷ 4%
      </Note>
      <P>
        これは米国の「Trinity Study」と呼ばれる研究をベースに、
        <strong>株式と債券に分散投資した資産から年4%を取り崩しても、30年程度はほぼ枯渇しなかった</strong>
        という結論を一般化したものです。年間支出が300万円なら 7,500万円、500万円なら 1.25億円が目安となります。
      </P>
      <P>
        本シミュレーターでは、リタイア後の支出と利回りから FIRE 目標額（オレンジの水平線）を自動計算しており、
        <em>支出 ÷ リタイア後の利回り</em> という形で 4%ルールを一般化しています。
      </P>

      <H2>FIRE の派生形</H2>
      <UL>
        <li>
          <strong>Lean FIRE</strong>: 必要最低限の生活費でFIREする倹約型。必要資産は小さい代わりに生活水準は低め。
        </li>
        <li>
          <strong>Fat FIRE</strong>: 余裕のある支出でFIREする贅沢型。必要資産は大きい。
        </li>
        <li>
          <strong>サイドFIRE</strong>: 副業・配当・賃料など、自分が能動的に働かなくても入る収入と取り崩しを併用する。
        </li>
        <li>
          <strong>Barista FIRE</strong>: 軽い労働（健康保険目的のパート等）を続けながら不足分を埋める。
        </li>
        <li>
          <strong>Coast FIRE</strong>: 若いうちに資産を入れ込み、以降は積立をやめても複利で目標到達する状態。労働は続ける。
        </li>
      </UL>

      <H2>日本特有のポイント</H2>
      <UL>
        <li>
          <strong>年金</strong>: 65歳前後から終身で支給される国民年金・厚生年金がある分、純粋な4%ルールよりも必要資産は小さくなりやすい。
        </li>
        <li>
          <strong>健康保険</strong>: 退職後は国民健康保険または任意継続。所得連動の保険料が地味に効くため、サイド収入の設計に注意。
        </li>
        <li>
          <strong>教育費</strong>: 私立化・大学院進学・塾代でブレが大きい。子持ちFIREでは教育費が最大のリスク要因。
        </li>
        <li>
          <strong>住居</strong>: 持ち家ローンの完済年齢、修繕積立、固定資産税はリタイア後キャッシュフローに直結する。
        </li>
      </UL>

      <H2>このサイトでの試算の流れ</H2>
      <UL>
        <li>
          <strong>① 現状把握</strong>: 年齢・資産・年収・年金見込みを「基本情報」へ入力。
        </li>
        <li>
          <strong>② 家族構成</strong>: 配偶者・子供パネルを有効化し、教育プランを入力。
        </li>
        <li>
          <strong>③ 支出設計</strong>: 月次の支出と、リタイア後に生活費が何%になるかをスライダーで調整。
        </li>
        <li>
          <strong>④ 投資前提</strong>: 現役期・リタイア後の利回りを設定。
        </li>
        <li>
          <strong>⑤ 結果検証</strong>: グラフのFIRE線・サマリーカード・寿命時点残高で実現可能性を判断。
        </li>
      </UL>

      <Note>
        本記事は一般的な解説であり、特定の投資商品や運用手法を推奨するものではありません。
        個別の意思決定は、ご自身の状況に応じて専門家にご相談ください。
      </Note>
    </ArticleLayout>
  );
}
