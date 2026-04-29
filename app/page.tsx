"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdSlot } from "../components/AdSlot";

// =============================================================================
// Types & constants
// =============================================================================

const SETTINGS_KEY = "life_pay_fire_settings";

type SchoolType = "公立" | "私立";
type HighSchoolType = "公立" | "私立" | "進学しない";
type UniversityType = "国公立" | "私立文系" | "私立理系" | "進学しない";
type GraduateType = "進学しない" | "国公立修士" | "私立修士" | "国公立博士" | "私立博士";

interface Child {
  id: string;
  name: string;
  /** 親が何歳のときに生まれた / 生まれる予定か */
  birthAtParentAge: number;
  elementary: SchoolType;
  juniorHigh: SchoolType;
  highSchool: HighSchoolType;
  university: UniversityType;
  graduate: GraduateType;
  /** 旧スキーマ互換。現在は cramStages を見る。 */
  cramSchool?: boolean;
  /** 各学期で塾に通わせるか */
  cramStages: {
    小学校低学年: boolean;
    小学校高学年: boolean;
    中学校: boolean;
    高校: boolean;
  };
}

interface Spouse {
  enabled: boolean;
  name: string;
  /** 0なら未婚 / 未来の年齢で出会う場合 marryAtSelfAge に未来の自分の年齢を入れる */
  marryAtSelfAge: number;
  /** 現在（または結婚時点）の配偶者年齢 */
  ageAtMarry: number;
  annualIncome: number;
  retireAge: number;
  pensionAnnual: number;
  pensionStartAge: number;
}

interface FireSettings {
  currentAge: number;
  retireAge: number;
  lifeAge: number;
  currentAssets: number;
  annualIncome: number;
  monthlyLiving: number;
  housingType: "賃貸" | "持ち家";
  monthlyHousing: number;
  housingEndAge: number;
  monthlyLivingRetired: number;
  monthlyHousingRetired: number;
  /** サイドFIRE用：リタイア後の労働・事業収入など（年額・現在価値） */
  sideIncomeAnnual: number;
  /** サイド収入をこの年齢まで継続すると仮定 */
  sideIncomeUntilAge: number;
  otherAnnual: number;
  children: Child[];
  /** 取り崩しモード。expense=支出額ベース / percent=資産の一定割合（願望取り崩し率） */
  withdrawalMode: "expense" | "percent";
  withdrawalPercent: number;
  returnRate: number;
  inflationRate: number;
  pensionAnnual: number;
  pensionStartAge: number;
  retireReturnRate: number;
  spouse: Spouse;
}

const TUITION_PER_YEAR: {
  小学校: Record<SchoolType, number>;
  中学校: Record<SchoolType, number>;
  高校: Record<HighSchoolType, number>;
} = {
  小学校: { 公立: 350_000, 私立: 1_670_000 },
  中学校: { 公立: 540_000, 私立: 1_440_000 },
  高校:   { 公立: 510_000, 私立: 1_050_000, 進学しない: 0 },
};
const UNIV_PER_YEAR: Record<UniversityType, number> = {
  国公立: 820_000,
  私立文系: 1_350_000,
  私立理系: 1_780_000,
  進学しない: 0,
};
const GRAD_PER_YEAR: Record<GraduateType, number> = {
  進学しない: 0,
  国公立修士: 820_000,
  私立修士: 1_200_000,
  国公立博士: 820_000,
  私立博士: 1_200_000,
};
const GRAD_DURATION: Record<GraduateType, number> = {
  進学しない: 0,
  国公立修士: 2,
  私立修士: 2,
  国公立博士: 5,
  私立博士: 5,
};
const ENTRANCE_FEE: {
  小学校: Record<SchoolType, number>;
  中学校: Record<SchoolType, number>;
  高校: Record<HighSchoolType, number>;
  大学: Record<UniversityType, number>;
  大学院: Record<GraduateType, number>;
} = {
  小学校: { 公立: 0, 私立: 300_000 },
  中学校: { 公立: 0, 私立: 250_000 },
  高校:   { 公立: 60_000, 私立: 200_000, 進学しない: 0 },
  大学:   { 国公立: 280_000, 私立文系: 230_000, 私立理系: 250_000, 進学しない: 0 },
  大学院: {
    進学しない: 0,
    国公立修士: 280_000,
    私立修士: 230_000,
    国公立博士: 280_000,
    私立博士: 230_000,
  },
};
const CRAM_PER_YEAR = {
  // 文部科学省「子供の学習費調査」令和5年度の「学習塾費」を
  // 参考にした「受験を意識した講習コース」相当の年額目安。
  // 協会集計や主要塾公開資料をもとに中間値を採用。
  小学校低学年: 200_000, // 小1〜小3（週1〜2コマ程度）
  小学校高学年: 400_000, // 小4〜小6（中学受験を問わずの平均）
  中学校:      450_000, // 高校受験・定期試験対策
  高校:        550_000, // 大学受験講習
};

const DEFAULT_CHILD = (id: string, name: string, birthAtParentAge: number): Child => ({
  id,
  name,
  birthAtParentAge,
  elementary: "公立",
  juniorHigh: "私立",
  highSchool: "私立",
  university: "私立文系",
  graduate: "進学しない",
  cramStages: {
    小学校低学年: false,
    小学校高学年: true,
    中学校: true,
    高校: true,
  },
});

const DEFAULT_SETTINGS: FireSettings = {
  currentAge: 30,
  retireAge: 60,
  lifeAge: 95,
  currentAssets: 0,
  annualIncome: 5_000_000,
  monthlyLiving: 200_000,
  housingType: "賃貸",
  monthlyHousing: 100_000,
  housingEndAge: 60,
  monthlyLivingRetired: 180_000,
  monthlyHousingRetired: 80_000,
  sideIncomeAnnual: 0,
  sideIncomeUntilAge: 70,
  otherAnnual: 300_000,
  children: [],
  withdrawalMode: "expense",
  withdrawalPercent: 4.0,
  returnRate: 4.0,
  inflationRate: 1.0,
  pensionAnnual: 2_120_000,
  pensionStartAge: 65,
  retireReturnRate: 3.0,
  spouse: {
    enabled: false,
    name: "配偶者",
    marryAtSelfAge: 30,
    ageAtMarry: 30,
    annualIncome: 4_000_000,
    retireAge: 60,
    pensionAnnual: 1_860_000,
    pensionStartAge: 65,
  },
};

/** 年金加入を開始する年齢（22歳社会人スタート想定）。 */
const PENSION_ACCRUAL_START_AGE = 22;
/** 年金満額の前提となる加入終了年齢。60歳で固定。 */
const PENSION_FULL_WORK_AGE = 60;
/** 国民年金の満額（令和6年度の老齢基礎年金満額 816,000円/年）40年加入、令和6年より。 */
const KOKUMIN_NENKIN_FULL = 816_000;
/** 厚生年金の報酬比例部分の保険料乘率（令和以降、5.481/1000を適用）。 */
const KOUSEI_NENKIN_RATE = 5.481 / 1000;
/** 厚生年金の平均標準報酬月額の上限（65万円）。 */
const KOUSEI_NENKIN_MAX_MONTHLY = 650_000;
/** 年収から手取り控除前の额面年収をザックリ推定する係数。 */
const GROSS_FROM_NET_RATIO = 1.25;

/**
 * 年収（手取り）とリタイア年齢から、老齢年金の仮頻受給額を推定する。
 * ・国民年金：満額（40年加入前提、リタイア後も任意加入で補完）
 * ・厚生年金：平均標準報酬月額 × 5.481/1000 × 加入月数
 */
function estimateFullPension(annualIncomeNet: number): number {
  // 额面推定→平均標準報酬月額（65万円上限）
  const grossAnnual = annualIncomeNet * GROSS_FROM_NET_RATIO;
  const monthlyAvg = Math.min(grossAnnual / 12, KOUSEI_NENKIN_MAX_MONTHLY);
  const months =
    (PENSION_FULL_WORK_AGE - PENSION_ACCRUAL_START_AGE) * 12; // 38年×12=456ヶ月
  const kousei = monthlyAvg * KOUSEI_NENKIN_RATE * months;
  return Math.round((KOKUMIN_NENKIN_FULL + kousei) / 10000) * 10000;
}

/**
 * 早期リタイア時の年金受給額を計算する。
 * 厚生年金部分だけ加入年数に比例減額し、国民年金部分は満額を維持する（
 * リタイア後も第1号被保険者として60歳まで保険料を納付継続する前提）。
 */
function adjustedPension(pensionAnnual: number, retireAge: number): number {
  const kokuminBase = Math.min(pensionAnnual, KOKUMIN_NENKIN_FULL);
  const kouseiFull = Math.max(0, pensionAnnual - KOKUMIN_NENKIN_FULL);
  const assumedYears = Math.max(
    1,
    PENSION_FULL_WORK_AGE - PENSION_ACCRUAL_START_AGE
  );
  const actualYears = Math.max(0, retireAge - PENSION_ACCRUAL_START_AGE);
  const ratio = Math.min(1, actualYears / assumedYears);
  return kokuminBase + kouseiFull * ratio;
}

function formatCurrency(amount: number): string {
  return formatCompactJPY(amount) + "円";
}

function formatCompactJPY(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_0000_0000) return `${sign}${(abs / 1_0000_0000).toFixed(2)}億`;
  if (abs >= 1_0000) {
    const man = abs / 1_0000;
    // 1000万未満は小数点1桁、それ以上は整数
    return `${sign}${man < 1000 ? man.toFixed(1).replace(/\.0$/, "") : Math.round(man)}万`;
  }
  return `${sign}${abs}`;
}

function childYearlyCost(
  child: Child,
  childAge: number,
): { tuition: number; cram: number; entrance: number; stage: string } {
  let tuition = 0;
  let cram = 0;
  let entrance = 0;
  let stage = "";

  if (childAge >= 6 && childAge <= 11) {
    stage = "小学校";
    tuition = TUITION_PER_YEAR.小学校[child.elementary];
    if (childAge === 6) entrance = ENTRANCE_FEE.小学校[child.elementary];
    if (childAge <= 8 && child.cramStages.小学校低学年)
      cram = CRAM_PER_YEAR.小学校低学年;
    if (childAge >= 9 && child.cramStages.小学校高学年)
      cram = CRAM_PER_YEAR.小学校高学年;
  } else if (childAge >= 12 && childAge <= 14) {
    stage = "中学校";
    tuition = TUITION_PER_YEAR.中学校[child.juniorHigh];
    if (childAge === 12) entrance = ENTRANCE_FEE.中学校[child.juniorHigh];
    if (child.cramStages.中学校) cram = CRAM_PER_YEAR.中学校;
  } else if (childAge >= 15 && childAge <= 17 && child.highSchool !== "進学しない") {
    stage = "高校";
    tuition = TUITION_PER_YEAR.高校[child.highSchool];
    if (childAge === 15) entrance = ENTRANCE_FEE.高校[child.highSchool];
    if (child.cramStages.高校) cram = CRAM_PER_YEAR.高校;
  } else if (childAge >= 18 && childAge <= 21 && child.university !== "進学しない") {
    stage = "大学";
    tuition = UNIV_PER_YEAR[child.university];
    if (childAge === 18) entrance = ENTRANCE_FEE.大学[child.university];
  } else if (
    child.graduate !== "進学しない" &&
    childAge >= 22 &&
    childAge < 22 + GRAD_DURATION[child.graduate]
  ) {
    stage = child.graduate.includes("博士") ? "大学院(博士)" : "大学院(修士)";
    tuition = GRAD_PER_YEAR[child.graduate];
    if (childAge === 22) entrance = ENTRANCE_FEE.大学院[child.graduate];
  }

  return { tuition, cram, entrance, stage };
}

// =============================================================================
// Helpers
// =============================================================================

function loadSettings(): FireSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FireSettings> & {
      // 互換: 旧 currentAge を持つ子供データを移行
      children?: Array<Partial<Child> & { currentAge?: number }>;
    };
    const merged: FireSettings = { ...DEFAULT_SETTINGS, ...parsed } as FireSettings;
    merged.spouse = {
      ...DEFAULT_SETTINGS.spouse,
      ...(parsed.spouse ?? {}),
    };
    if (parsed.children) {
      merged.children = parsed.children.map((rawChild) => {
        const c = rawChild as Partial<Child> & { currentAge?: number; cramSchool?: boolean };
        return {
        id: c.id ?? crypto.randomUUID(),
        name: c.name ?? "子",
        birthAtParentAge:
          c.birthAtParentAge ??
          // 旧スキーマからの推定: 親の現在年齢 - 子の現在年齢
          (typeof c.currentAge === "number"
            ? Math.max(0, (merged.currentAge ?? 30) - c.currentAge)
            : 30),
        elementary: (c.elementary as SchoolType) ?? "公立",
        juniorHigh: (c.juniorHigh as SchoolType) ?? "私立",
        highSchool: (c.highSchool as HighSchoolType) ?? "私立",
        university: (c.university as UniversityType) ?? "私立文系",
        graduate: (c.graduate as GraduateType) ?? "進学しない",
        cramStages: c.cramStages ?? {
          // 旧 cramSchool=true は「小4以降通塾」相当だったので移行
          小学校低学年: false,
          小学校高学年: c.cramSchool ?? true,
          中学校: c.cramSchool ?? true,
          高校: c.cramSchool ?? true,
        },
        };
      });
    }
    return merged;
  } catch {
    return null;
  }
}

function saveSettings(s: FireSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

interface YearRow {
  age: number;
  phase: "accumulation" | "retirement";
  income: number;
  expense: number;
  livingCost: number;
  housingCost: number;
  childrenCost: number;
  otherCost: number;
  childrenDetail: string;
  pension: number;
  netCashflow: number;
  investmentGain: number;
  endAssets: number;
}

interface SimulationResult {
  rows: YearRow[];
  fireAge: number | null;
  assetsAtRetirement: number;
  requiredAssetsAtRetirement: number;
  depletionAge: number | null;
  lastsToLifeAge: boolean;
  peakAssets: number;
}

function clampNumber(v: number, fallback = 0): number {
  if (!Number.isFinite(v) || Number.isNaN(v)) return fallback;
  return v;
}

function simulate(s: FireSettings): SimulationResult {
  const rows: YearRow[] = [];
  const currentAge = Math.max(0, Math.floor(s.currentAge));
  const retireAge = Math.max(currentAge, Math.floor(s.retireAge));
  const lifeAge = Math.max(retireAge, Math.floor(s.lifeAge));
  const r = clampNumber(s.returnRate) / 100;
  const rRet = clampNumber(s.retireReturnRate) / 100;
  const inf = clampNumber(s.inflationRate) / 100;

  let assets = clampNumber(s.currentAssets);
  const income = clampNumber(s.annualIncome);
  const pension = clampNumber(s.pensionAnnual);
  const pensionStartAge = Math.floor(clampNumber(s.pensionStartAge, 65));

  // ===== \u914d\u5076\u8005 =====
  const sp = s.spouse;
  const spouseEnabled = !!sp?.enabled;
  const spouseMarryAtSelfAge = spouseEnabled
    ? Math.max(currentAge, Math.floor(clampNumber(sp.marryAtSelfAge, currentAge)))
    : Infinity;
  const spouseAgeAtMarry = spouseEnabled
    ? Math.floor(clampNumber(sp.ageAtMarry, 30))
    : 0;
  const spouseRetireAge = spouseEnabled
    ? Math.floor(clampNumber(sp.retireAge, 60))
    : 0;
  const spousePension = spouseEnabled
    ? clampNumber(sp.pensionAnnual)
    : 0;
  const spousePensionStartAge = spouseEnabled
    ? Math.floor(clampNumber(sp.pensionStartAge, 65))
    : 0;
  const spouseIncome = spouseEnabled ? clampNumber(sp.annualIncome) : 0;

  const baseLiving = clampNumber(s.monthlyLiving) * 12;
  const baseHousing = clampNumber(s.monthlyHousing) * 12;
  const baseLivingRetired = clampNumber(s.monthlyLivingRetired) * 12;
  const baseHousingRetired = clampNumber(s.monthlyHousingRetired) * 12;
  const baseOther = clampNumber(s.otherAnnual);
  const housingType = s.housingType ?? "賃貸";
  const housingEndAge =
    housingType === "持ち家"
      ? Math.floor(clampNumber(s.housingEndAge, 200))
      : lifeAge;

  const retireExpenseTodayValue = baseLivingRetired + baseHousingRetired + baseOther;
  // リタイア時点（retireAge）に必要な名目資産額を事前計算。
  // これをグラフのオレンジ水平線・FIRE達成判定の両方で共通に使うことで、
  // 「資産推移グラフがこの線を上回った時点 = FIRE」に揃える。
  const yearsToRetireForCalc = Math.max(0, retireAge - currentAge);
  const fireTarget =
    retireExpenseTodayValue * Math.pow(1 + inf, yearsToRetireForCalc) * 25;

  let fireAge: number | null = null;
  let depletionAge: number | null = null;
  let assetsAtRetirement = assets;
  let requiredAssetsAtRetirement = fireTarget;
  let peakAssets = assets;

  for (let age = currentAge; age <= lifeAge; age++) {
    const phase: "accumulation" | "retirement" =
      age < retireAge ? "accumulation" : "retirement";

    const yearsFromNow = age - currentAge;
    const inflFactor = Math.pow(1 + inf, yearsFromNow);

    let yearIncome = 0;
    let yearPension = 0;

    if (phase === "accumulation") {
      yearIncome = income;
    } else if (age >= pensionStartAge) {
      yearPension = pension;
    }

    // サイドFIRE: リタイア後の継続収入（インフレ調整）
    if (
      phase === "retirement" &&
      clampNumber(s.sideIncomeAnnual) > 0 &&
      age <= clampNumber(s.sideIncomeUntilAge, lifeAge)
    ) {
      yearIncome += clampNumber(s.sideIncomeAnnual) * inflFactor;
    }

    // 配偶者の収入・年金（結婚成立後のみ反映）
    if (spouseEnabled && age >= spouseMarryAtSelfAge) {
      const spouseAge =
        spouseAgeAtMarry + (age - spouseMarryAtSelfAge);
      if (spouseAge < spouseRetireAge) {
        yearIncome += spouseIncome;
      }
      if (spouseAge >= spousePensionStartAge) {
        yearPension += spousePension;
      }
    }

    const living =
      (phase === "accumulation" ? baseLiving : baseLivingRetired) * inflFactor;
    const housing =
      age <= housingEndAge
        ? (phase === "accumulation" ? baseHousing : baseHousingRetired) * inflFactor
        : 0;
    const other = baseOther * inflFactor;

    let childrenCost = 0;
    const detailParts: string[] = [];
    for (const child of s.children) {
      const childAge = age - child.birthAtParentAge;
      if (childAge < 0) continue;
      const cost = childYearlyCost(child, childAge);
      const yearly = (cost.tuition + cost.cram + cost.entrance) * inflFactor;
      if (yearly > 0) {
        childrenCost += yearly;
        const tags: string[] = [cost.stage];
        if (cost.cram > 0) tags.push("塾");
        if (cost.entrance > 0) tags.push("入学金");
        detailParts.push(
          `${child.name || "子"}(${childAge}歳:${tags.join("/")})`,
        );
      }
    }

    let yearExpense = living + housing + other + childrenCost;
    let withdrawalAmount = 0;
    if (phase === "retirement" && s.withdrawalMode === "percent") {
      // 資産の ○% を取り崩し。4%ルールなど。
      // 取り崩し額は生活費・住居費・その他をカバーするその期の資産代理コストとして
      // expense を上書きし、教育費のみ上乗せする。
      withdrawalAmount = Math.max(
        0,
        assets * (clampNumber(s.withdrawalPercent) / 100),
      );
      yearExpense = withdrawalAmount + childrenCost;
    }

    const netCashflow = yearIncome + yearPension - yearExpense;
    const rate = phase === "accumulation" ? r : rRet;
    const baseAfterCashflow = assets + netCashflow;
    const investmentGain =
      baseAfterCashflow > 0 ? baseAfterCashflow * rate : 0;
    const endAssets = baseAfterCashflow + investmentGain;

    rows.push({
      age,
      phase,
      income: yearIncome,
      expense: yearExpense,
      livingCost:
        phase === "retirement" && s.withdrawalMode === "percent"
          ? withdrawalAmount
          : living,
      housingCost:
        phase === "retirement" && s.withdrawalMode === "percent" ? 0 : housing,
      childrenCost,
      otherCost:
        phase === "retirement" && s.withdrawalMode === "percent" ? 0 : other,
      childrenDetail: detailParts.join(" / "),
      pension: yearPension,
      netCashflow,
      investmentGain,
      endAssets,
    });

    const retireExpenseNominalNow = retireExpenseTodayValue * inflFactor;
    void retireExpenseNominalNow;
    if (
      fireAge === null &&
      fireTarget > 0 &&
      endAssets >= fireTarget
    ) {
      fireAge = age;
    }

    if (age === retireAge - 1) {
      assetsAtRetirement = endAssets;
      requiredAssetsAtRetirement = fireTarget;
    }

    if (depletionAge === null && endAssets <= 0 && phase === "retirement") {
      depletionAge = age;
    }

    if (endAssets > peakAssets) peakAssets = endAssets;

    assets = endAssets;
  }

  const lastRow = rows[rows.length - 1];
  const lastsToLifeAge = !!lastRow && lastRow.endAssets > 0;

  return {
    rows,
    fireAge,
    assetsAtRetirement,
    requiredAssetsAtRetirement,
    depletionAge,
    lastsToLifeAge,
    peakAssets,
  };
}

// =============================================================================
// URL Share (設定をURLハッシュに埋め込む)
// =============================================================================

function encodeSettingsToHash(s: FireSettings): string {
  const json = JSON.stringify(s);
  // UTF-8 → base64url
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa !== "undefined" ? btoa(bin) : "";
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeSettingsFromHash(hash: string): Partial<FireSettings> | null {
  try {
    const padded =
      hash.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (hash.length % 4)) % 4);
    const bin = typeof atob !== "undefined" ? atob(padded) : "";
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as Partial<FireSettings>;
  } catch {
    return null;
  }
}



// =============================================================================
// Component
// =============================================================================

export default function ForecastPage() {
  const [settings, setSettings] = useState<FireSettings>(DEFAULT_SETTINGS);
  const [appliedSettings, setAppliedSettings] = useState<FireSettings | null>(
    null
  );
  const [hydrated, setHydrated] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    // 1) URLハッシュ（#s=...）優先で読み込み（共有リンク経由）
    let initial: FireSettings | null = null;
    if (typeof window !== "undefined" && window.location.hash) {
      const m = window.location.hash.match(/[#&]s=([^&]+)/);
      if (m) {
        const decoded = decodeSettingsFromHash(decodeURIComponent(m[1]));
        if (decoded) {
          initial = { ...DEFAULT_SETTINGS, ...decoded } as FireSettings;
          // 共有リンクからの読み込み時は即座に結果を表示
          setAppliedSettings(initial);
        }
      }
    }
    // 2) ハッシュが無ければ localStorage
    if (!initial) {
      const stored = loadSettings();
      if (stored) initial = stored;
    }
    if (initial) setSettings(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
  }, [settings, hydrated]);

  const result = useMemo(
    () => (appliedSettings ? simulate(appliedSettings) : null),
    [appliedSettings]
  );

  const isDirty = useMemo(
    () =>
      appliedSettings !== null &&
      JSON.stringify(settings) !== JSON.stringify(appliedSettings),
    [settings, appliedSettings]
  );

  function update<K extends keyof FireSettings>(key: K, value: FireSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function applyChanges() {
    setAppliedSettings(settings);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function resetSettings() {
    if (!window.confirm("保存された入力内容をすべて削除し、初期状態に戻します。よろしいですか？")) {
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(SETTINGS_KEY);
      // 共有URLハッシュもクリアして、リロードしても復元されないようにする
      try {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      } catch {
        /* noop */
      }
    }
    setSettings(DEFAULT_SETTINGS);
    // appliedSettings は null に戻して、グラフはプレビュー（サンプル）状態へ
    setAppliedSettings(null);
    setShareCopied(false);
  }

  function exportPDF() {
    if (typeof window === "undefined" || !appliedSettings || !result) return;
    const hash = encodeSettingsToHash(appliedSettings);
    const url = `${window.location.origin}${window.location.pathname}#s=${hash}`;
    // URLバーも更新
    try {
      window.history.replaceState(null, "", `#s=${hash}`);
    } catch {
      /* noop */
    }
    const copy = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          setShareCopied(true);
          window.setTimeout(() => setShareCopied(false), 2000);
          return;
        }
      } catch {
        /* fallback below */
      }
      // フォールバック: prompt で表示
      window.prompt("このURLをコピーして保存・共有できます", url);
    };
    void copy();
  }

  const inputsValid =
    settings.retireAge >= settings.currentAge &&
    settings.lifeAge >= settings.retireAge &&
    settings.currentAge >= 0;

  const yearsToRetire = appliedSettings
    ? Math.max(0, appliedSettings.retireAge - appliedSettings.currentAge)
    : 0;
  const yearsToFire =
    result && result.fireAge !== null && appliedSettings
      ? Math.max(0, result.fireAge - appliedSettings.currentAge)
      : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-end justify-between flex-wrap gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] text-zinc-500 mb-3 tracking-widest uppercase">
            <span className="w-1 h-1 rounded-full bg-zinc-900" />
            FIRE Simulator
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-900">
            ライフプラン<span className="text-zinc-400">シミュレーター</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            支出の内訳・教育費・住居費を細かく入力して、生涯の資産推移を可視化
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportPDF}
            disabled={!inputsValid || !result}
            className="text-xs text-zinc-700 bg-white hover:bg-zinc-50 disabled:text-zinc-300 disabled:cursor-not-allowed px-3 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors inline-flex items-center gap-1.5"
            type="button"
            title="現在の入力内容を含む共有URLをクリップボードにコピーします"
          >
            <span aria-hidden>{shareCopied ? "✓" : "🔗"}</span>
            {shareCopied ? "URLをコピーしました" : "URLで保存"}
          </button>
          <button
            onClick={resetSettings}
            className="text-xs text-zinc-500 hover:text-zinc-900 px-3 py-2 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors bg-white"
            type="button"
          >
            ↺ リセット
          </button>
        </div>
      </header>

      {!inputsValid && (
        <div className="rounded-xl p-4 text-sm border border-red-200 bg-red-50 text-red-700">
          ⚠️ 入力値に問題があります。「現在年齢 ≤ リタイア年齢 ≤ 寿命」となるよう設定してください。
        </div>
      )}

      {isDirty && inputsValid && result && (
        <div className="rounded-lg p-2.5 px-3 text-xs border border-zinc-200 bg-zinc-50 text-zinc-600 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            入力に変更があります（グラフは前回の計算結果のままです）
          </span>
          <button
            onClick={applyChanges}
            className="text-[11px] text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
            type="button"
          >
            再計算する →
          </button>
        </div>
      )}

      {/* Summary cards (top) */}
      {inputsValid && result && appliedSettings && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <SummaryCard
            label="リタイアまで"
            value={`${yearsToRetire} 年`}
            sub={`${appliedSettings.retireAge} 歳`}
            tone="blue"
          />
          <SummaryCard
            label="リタイア時の予測資産"
            value={formatCompactJPY(Math.round(result.assetsAtRetirement)) + "円"}
            sub={`必要: ${formatCompactJPY(Math.round(result.requiredAssetsAtRetirement))}円`}
            tone={
              result.assetsAtRetirement >= result.requiredAssetsAtRetirement
                ? "green"
                : "orange"
            }
          />
          <SummaryCard
            label="FIRE 達成"
            value={result.fireAge !== null ? `${result.fireAge} 歳` : "未達成"}
            sub={
              yearsToFire !== null
                ? `あと ${yearsToFire} 年`
                : "前提条件では達成不可"
            }
            tone={result.fireAge !== null ? "purple" : "gray"}
          />
          <SummaryCard
            label="資産寿命"
            value={
              result.depletionAge !== null
                ? `${result.depletionAge} 歳`
                : "寿命まで持続"
            }
            sub={
              result.depletionAge !== null
                ? `想定寿命 ${appliedSettings.lifeAge} 歳より早い`
                : `想定寿命 ${appliedSettings.lifeAge} 歳`
            }
            tone={result.depletionAge !== null ? "red" : "green"}
          />
        </div>
      )}

      {/* Chart */}
      {inputsValid && result && appliedSettings && result.rows.length > 0 && (
        <AssetsChart
          rows={result.rows}
          retireAge={appliedSettings.retireAge}
          fireAge={result.fireAge}
          pensionStartAge={appliedSettings.pensionStartAge}
          depletionAge={result.depletionAge}
          requiredAtRetirement={result.requiredAssetsAtRetirement}
        />
      )}

      {!result && inputsValid && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:p-7 relative">
          {/* 実際のチャートと同じカード/ヘッダー構造 */}
          <div className="flex items-start justify-between flex-wrap gap-2 mb-5">
            <div>
              <h3 className="text-base font-semibold text-zinc-400">
                資産推移
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-[10px] font-medium text-zinc-500 align-middle">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  プレビュー
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                年末資産（名目額）/ 横軸: 年齢
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400">
              <Legend dotClass="bg-zinc-400" label="資産推移" />
              <Legend dotClass="bg-amber-400" label="リタイア" />
              <Legend dotClass="bg-violet-400" label="FIRE" />
              <Legend dotClass="bg-emerald-400" label="年金開始" />
            </div>
          </div>

          {/* 実チャートと同寸の SVG ダミー */}
          <div className="relative">
            <svg
              viewBox="0 0 1000 360"
              className="w-full h-auto"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="placeholderArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#18181b" stopOpacity="0.10" />
                  <stop offset="60%" stopColor="#18181b" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Y grid + labels（実チャート同様） */}
              {[24, 105, 186, 267, 324].map((yPos, i) => (
                <g key={i}>
                  <line
                    x1={70}
                    x2={976}
                    y1={yPos}
                    y2={yPos}
                    stroke="#f4f4f5"
                    strokeDasharray="2 3"
                  />
                  <text x={62} y={yPos + 4} fontSize="10" fill="#d4d4d8" textAnchor="end">
                    {["1.2億円", "9000万円", "6000万円", "3000万円", "0円"][i]}
                  </text>
                </g>
              ))}

              {/* リタイア後背景バンド */}
              <rect x={620} y={24} width={356} height={300} fill="#fafafa" />

              {/* 必要資産ライン */}
              <line x1={70} x2={976} y1={140} y2={140} stroke="#fbbf24" strokeOpacity="0.5" strokeDasharray="4 4" strokeWidth="1" />
              <text x={972} y={134} fontSize="10" fill="#d97706" textAnchor="end" opacity="0.6">
                必要資産（4%ルール）
              </text>

              {/* エリア */}
              <path
                d="M 70 300 L 130 290 L 200 270 L 280 235 L 360 195 L 440 155 L 520 120 L 580 100 L 620 95 L 700 130 L 780 175 L 860 220 L 920 260 L 976 290 L 976 324 L 70 324 Z"
                fill="url(#placeholderArea)"
              />

              {/* メインライン */}
              <polyline
                points="70,300 130,290 200,270 280,235 360,195 440,155 520,120 580,100 620,95 700,130 780,175 860,220 920,260 976,290"
                fill="none"
                stroke="#a1a1aa"
                strokeWidth="1.75"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* イベント縦線 */}
              {[
                { x: 440, color: "#a78bfa", label: "FIRE" },
                { x: 620, color: "#fbbf24", label: "リタイア" },
                { x: 760, color: "#34d399", label: "年金開始" },
              ].map((ev, i) => (
                <g key={i}>
                  <line
                    x1={ev.x}
                    x2={ev.x}
                    y1={24}
                    y2={324}
                    stroke={ev.color}
                    strokeOpacity="0.35"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={ev.x}
                    y={36}
                    fontSize="10"
                    fill={ev.color}
                    textAnchor="middle"
                    fontWeight="600"
                    opacity="0.7"
                  >
                    {ev.label}
                  </text>
                </g>
              ))}

              {/* X 軸ラベル */}
              {[
                { x: 70, label: "30" },
                { x: 250, label: "40" },
                { x: 440, label: "50" },
                { x: 620, label: "60" },
                { x: 800, label: "70" },
                { x: 976, label: "85" },
              ].map((t, i) => (
                <text
                  key={i}
                  x={t.x}
                  y={348}
                  fontSize="10"
                  fill="#d4d4d8"
                  textAnchor="middle"
                >
                  {t.label}
                </text>
              ))}
            </svg>

            {/* 中央の案内 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
              <div className="bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-xl px-5 py-4 shadow-sm text-center max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-medium text-emerald-700 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  完全無料・メールアドレス登録不要
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  下にスクロールして各項目を入力し、最後の<br className="hidden sm:block" />
                  <span className="font-medium text-zinc-800">「計算する」</span>ボタンを押すと、<br />
                  あなたの入力値に基づいたグラフが表示されます。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inputs */}
      <Panel>
        <PanelHeader title="基本情報" subtitle="あなたの現状・リタイア計画・年金" />

        {/* 1) 現在のあなた */}
        <SubSection label="現在のあなた">
          <Grid>
            <NumberField
              label="現在の年齢"
              unit="歳"
              value={settings.currentAge}
              min={0}
              max={120}
              onChange={(v) => update("currentAge", v)}
            />
            <NumberField
              label="現在の総資産"
              unit="万円"
              value={settings.currentAssets}
              scale={10000}
              step={10}
              onChange={(v) => update("currentAssets", v)}
            />
            <NumberField
              label="年収（手取り）"
              unit="万円"
              value={settings.annualIncome}
              scale={10000}
              step={10}
              onChange={(v) => update("annualIncome", v)}
            />
          </Grid>
        </SubSection>

        {/* 2) リタイア計画 */}
        <SubSection label="リタイア計画">
          <Grid cols={2}>
            <NumberField
              label="リタイア希望年齢"
              unit="歳"
              value={settings.retireAge}
              min={settings.currentAge}
              max={120}
              onChange={(v) => update("retireAge", v)}
              hint={`現在から ${Math.max(0, settings.retireAge - settings.currentAge)}年後にリタイア`}
            />
            <NumberField
              label="寿命想定"
              unit="歳"
              value={settings.lifeAge}
              min={settings.retireAge}
              max={120}
              onChange={(v) => update("lifeAge", v)}
              hint={`リタイア後 ${Math.max(0, settings.lifeAge - settings.retireAge)}年間の生活費を試算`}
            />
          </Grid>
        </SubSection>

        {/* 3) 年金 */}
        <SubSection label="年金">
          <Grid cols={2}>
            <NumberField
              label="年金（年額・実際の受給見込み）"
              unit="万円"
              value={settings.pensionAnnual}
              scale={10000}
              step={10}
              onChange={(v) => update("pensionAnnual", v)}
              hint={(() => {
                const fullEst = estimateFullPension(settings.annualIncome);
                const adjEst = adjustedPension(fullEst, settings.retireAge);
                const fullMan = Math.round(fullEst / 10000);
                const adjMan = Math.round(adjEst / 10000);
                return [
                  `※ ここには「実際に受給する見込み額」を入力します（既に早期リタイアによる減額を反映済みの値）。`,
                  `【目安】年収${Math.round(
                    settings.annualIncome / 10000
                  )}万円（手取り）から、60歳まで加入すれば 約 ${fullMan}万円/年 が満額目安。リタイア ${settings.retireAge}歳の場合は厚生年金部分のみ加入年数で比例減額され 約 ${adjMan}万円/年 が見込み。`,
                  `内訳：年収×1.25で額面推定 → 平均標準報酬月額×5.481/1000×加入月数で老齢厚生年金 → 老齢基礎年金満額（816,000円/年、令和6年度）を加算。国民年金は60歳まで任意加入で満額と仮定。`,
                  `出典：日本年金機構「老齢厚生年金の計算式」、厚生労働省「令和6年度の年金額改定」。`,
                ].join("\n");
              })()}
            />
            <NumberField
              label="年金開始年齢"
              unit="歳"
              value={settings.pensionStartAge}
              min={50}
              max={80}
              onChange={(v) => update("pensionStartAge", v)}
            />
          </Grid>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => {
                const est = adjustedPension(
                  estimateFullPension(settings.annualIncome),
                  settings.retireAge
                );
                update("pensionAnnual", est);
              }}
              className="text-xs px-3 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 hover:border-zinc-300 transition-colors inline-flex items-center gap-1.5"
            >
              <span aria-hidden>🧮</span>
              年収とリタイア希望年齢から自動推定を適用（約 {Math.round(
                adjustedPension(
                  estimateFullPension(settings.annualIncome),
                  settings.retireAge
                ) / 10000
              )}万円）
            </button>
          </div>
        </SubSection>
      </Panel>

      <Panel>
        <PanelHeader
          title="配偶者"
          subtitle="既婚 / 結婚予定の場合に有効化（収入・年金がシミュレーションに加算されます）"
        />
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.spouse.enabled}
            onChange={(e) =>
              update("spouse", { ...settings.spouse, enabled: e.target.checked })
            }
            className="w-4 h-4 accent-zinc-900"
          />
          <span className="text-sm text-zinc-800">配偶者の情報を含める</span>
        </label>
        {settings.spouse.enabled && (
          <Grid>
            <NumberField
              label="結婚時の自分の年齢"
              unit="歳"
              value={settings.spouse.marryAtSelfAge}
              min={0}
              max={120}
              onChange={(v) =>
                update("spouse", { ...settings.spouse, marryAtSelfAge: v })
              }
              hint={
                settings.spouse.marryAtSelfAge <= settings.currentAge
                  ? "既婚（現在から計算）"
                  : `${settings.spouse.marryAtSelfAge - settings.currentAge}年後に結婚`
              }
            />
            <NumberField
              label="結婚時の配偶者の年齢"
              unit="歳"
              value={settings.spouse.ageAtMarry}
              min={0}
              max={120}
              onChange={(v) =>
                update("spouse", { ...settings.spouse, ageAtMarry: v })
              }
            />
            <NumberField
              label="配偶者の年収（手取り）"
              unit="万円"
              value={settings.spouse.annualIncome}
              scale={10000}
              step={10}
              onChange={(v) =>
                update("spouse", { ...settings.spouse, annualIncome: v })
              }
            />
            <NumberField
              label="配偶者のリタイア年齢"
              unit="歳"
              value={settings.spouse.retireAge}
              min={0}
              max={120}
              onChange={(v) =>
                update("spouse", { ...settings.spouse, retireAge: v })
              }
            />
            <NumberField
              label="配偶者の年金（年額・実際の受給見込み）"
              unit="万円"
              value={settings.spouse.pensionAnnual}
              scale={10000}
              step={10}
              onChange={(v) =>
                update("spouse", { ...settings.spouse, pensionAnnual: v })
              }
              hint={(() => {
                const fullEst = estimateFullPension(
                  settings.spouse.annualIncome
                );
                const adjEst = adjustedPension(
                  fullEst,
                  settings.spouse.retireAge
                );
                const fullMan = Math.round(fullEst / 10000);
                const adjMan = Math.round(adjEst / 10000);
                return [
                  `※ ここには「配偶者が実際に受給する見込み額」を入力します。`,
                  `【目安】配偶者年収${Math.round(
                    settings.spouse.annualIncome / 10000
                  )}万円から、60歳まで加入で 約 ${fullMan}万円/年 が満額目安。リタイア ${settings.spouse.retireAge}歳の場合は 約 ${adjMan}万円/年。`,
                ].join("\n");
              })()}
            />
            <div className="md:col-span-3 -mt-2">
              <button
                type="button"
                onClick={() => {
                  const est = adjustedPension(
                    estimateFullPension(settings.spouse.annualIncome),
                    settings.spouse.retireAge
                  );
                  update("spouse", {
                    ...settings.spouse,
                    pensionAnnual: est,
                  });
                }}
                className="text-xs px-3 py-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 hover:border-zinc-300 transition-colors inline-flex items-center gap-1.5"
              >
                <span aria-hidden>🧮</span>
                配偶者の年収とリタイア年齢から自動推定を適用（約 {Math.round(
                  adjustedPension(
                    estimateFullPension(settings.spouse.annualIncome),
                    settings.spouse.retireAge
                  ) / 10000
                )}万円）
              </button>
            </div>
            <NumberField
              label="配偶者の年金開始年齢"
              unit="歳"
              value={settings.spouse.pensionStartAge}
              min={50}
              max={80}
              onChange={(v) =>
                update("spouse", { ...settings.spouse, pensionStartAge: v })
              }
            />
          </Grid>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="リタイア前の支出"
          subtitle="月額・現在価値（インフレは自動適用）。「生活費」と「住居費」は別々に入力してください"
        />
        <Grid>
          <NumberField
            label="生活費（住居費除く）"
            unit="万円/月"
            value={settings.monthlyLiving}
            scale={10000}
            step={1}
            onChange={(v) => update("monthlyLiving", v)}
            hint={`食費・水道光熱費・通信費など。家賃/ローンは下で別途設定 / 年換算 ${formatCurrency(settings.monthlyLiving * 12)}`}
          />
          <SelectField
            label="住居形態"
            value={settings.housingType}
            options={["賃貸", "持ち家"]}
            onChange={(v) => update("housingType", v as "賃貸" | "持ち家")}
          />
          <NumberField
            label={settings.housingType === "持ち家" ? "住居費（ローン）" : "住居費（家賃）"}
            unit="万円/月"
            value={settings.monthlyHousing}
            scale={10000}
            step={1}
            onChange={(v) => update("monthlyHousing", v)}
            hint={`年換算 ${formatCurrency(settings.monthlyHousing * 12)}`}
          />
          {settings.housingType === "持ち家" ? (
            <NumberField
              label="ローン完済年齢"
              unit="歳"
              value={settings.housingEndAge}
              min={settings.currentAge}
              max={120}
              onChange={(v) => update("housingEndAge", v)}
              hint="完済以降は住居費0として計算"
            />
          ) : (
            <div className="hidden lg:block" />
          )}
          <NumberField
            label="その他（旅行・車・冠婚葬祭）"
            unit="万円/年"
            value={settings.otherAnnual}
            scale={10000}
            step={5}
            onChange={(v) => update("otherAnnual", v)}
          />
        </Grid>
        <SubTotal
          label="リタイア前の年間支出（教育費除く）"
          value={
            settings.monthlyLiving * 12 +
            settings.monthlyHousing * 12 +
            settings.otherAnnual
          }
        />
      </Panel>

      <Panel>
        <PanelHeader
          title="子供の教育費"
          subtitle="文科省「子供の学習費調査」「学生生活調査」を元にした標準額で自動計算"
        />
        <ChildrenSection
          childrenList={settings.children}
          onChange={(children) => update("children", children)}
          parentCurrentAge={settings.currentAge}
        />
      </Panel>

      <Panel>
        <PanelHeader
          title="リタイア後の支出 / 取り崩し"
          subtitle="支出額ベースか、資産の一定割合（取り崩し率）ベースかを選択"
        />
        <div className="flex gap-2 mb-5">
          {([
            { v: "expense", label: "支出額で指定" },
            { v: "percent", label: "取り崩し率で指定" },
          ] as const).map((opt) => {
            const active = settings.withdrawalMode === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                onClick={() => update("withdrawalMode", opt.v)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  active
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {settings.withdrawalMode === "expense" ? (
          <>
            <Grid>
              <NumberField
                label="生活費（住居費除く）"
                unit="万円/月"
                value={settings.monthlyLivingRetired}
                scale={10000}
                step={1}
                onChange={(v) => update("monthlyLivingRetired", v)}
                hint={`食費・水道光熱費・通信費など。家賃/ローンは右で別途設定 / 年換算 ${formatCurrency(settings.monthlyLivingRetired * 12)}`}
              />
              <NumberField
                label="住居費"
                unit="万円/月"
                value={settings.monthlyHousingRetired}
                scale={10000}
                step={1}
                onChange={(v) => update("monthlyHousingRetired", v)}
                hint={`年換算 ${formatCurrency(settings.monthlyHousingRetired * 12)}`}
              />
            </Grid>
            <SubTotal
              label="リタイア後の年間支出"
              value={
                settings.monthlyLivingRetired * 12 +
                settings.monthlyHousingRetired * 12 +
                settings.otherAnnual
              }
              hint="4%ルールの必要資産はこの額の25倍"
            />
          </>
        ) : (
          <>
            <Grid>
              <NumberField
                label="取り崩し率"
                unit="%/年"
                value={settings.withdrawalPercent}
                step={0.1}
                decimal
                onChange={(v) => update("withdrawalPercent", v)}
                hint="一般的な目安: 4%（インデックス運用）"
              />
            </Grid>

            {/* 取り崩し額の可視化 */}
            {inputsValid && result && result.rows.length > 0 && (
              <WithdrawalPreview
                rows={result.rows}
                retireAge={settings.retireAge}
                pct={settings.withdrawalPercent}
              />
            )}
          </>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="リタイア後の収入"
          subtitle="完全リタイアではなく、軽い労働や事業収入を継続する場合に入力"
        />
        <Grid>
          <NumberField
            label="年間サイド収入（手取り）"
            unit="万円/年"
            value={settings.sideIncomeAnnual}
            scale={10000}
            step={10}
            onChange={(v) => update("sideIncomeAnnual", v)}
            hint={
              settings.sideIncomeAnnual > 0
                ? `月換算 約 ${formatCurrency(Math.round(settings.sideIncomeAnnual / 12))}（手取り）`
                : "0 のままなら通常のFIRE（リタイア後収入なし）として計算"
            }
          />
          <NumberField
            label="サイド収入を続ける年齢の上限"
            unit="歳まで"
            value={settings.sideIncomeUntilAge}
            min={settings.retireAge}
            max={settings.lifeAge}
            step={1}
            onChange={(v) => update("sideIncomeUntilAge", v)}
            hint={`${settings.retireAge}歳〜${settings.sideIncomeUntilAge}歳の期間に上記収入を計上`}
          />
        </Grid>
        {settings.sideIncomeAnnual > 0 && (
          <p className="text-[11px] text-zinc-500 mt-3 leading-relaxed">
            ※ 趣味・好きな仕事を月数日だけ続ける、フリーランスや顧問業、不動産・配当などの定期収入を想定。
            年金開始年齢に達した後はサイド収入と年金が両方計上されます。インフレ調整は自動適用。
          </p>
        )}
      </Panel>

      <Panel>
        <PanelHeader
          title="経済前提"
          subtitle="運用利回りはリタイア前後で別々に設定できます"
        />
        <Grid cols={3}>
          <NumberField
            label="運用利回り（リタイア前）"
            unit="%"
            value={settings.returnRate}
            step={0.1}
            onChange={(v) => update("returnRate", v)}
            decimal
          />
          <NumberField
            label="運用利回り（リタイア後）"
            unit="%"
            value={settings.retireReturnRate}
            step={0.1}
            onChange={(v) => update("retireReturnRate", v)}
            decimal
          />
          <NumberField
            label="インフレ率"
            unit="%"
            value={settings.inflationRate}
            step={0.1}
            onChange={(v) => update("inflationRate", v)}
            decimal
          />
        </Grid>
        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs leading-relaxed text-amber-900">
          <p className="font-semibold mb-1.5 text-amber-800">
            なぜリタイア前後で利回りを分けるのか
          </p>
          <p>
            リタイア前は給与収入で生活費をまかなえるため、株式比率を高めにして
            <strong className="font-semibold">期待リターン重視（例: 4〜6%）</strong>
            の運用ができます。一方リタイア後は資産の取り崩しが始まるため、
            暴落直後に売却すると元本が大きく毀損する
            <strong className="font-semibold">「シーケンス・オブ・リターン・リスク」</strong>
            が発生します。
          </p>
          <p className="mt-2">
            これを避けるため、株式の比率を下げて債券・現金を厚くし、
            <strong className="font-semibold">期待リターンと引き換えに値動きを抑える</strong>
            アプローチが取られることがあります。当シミュレーターでは安全マージンを織り込みたい場合、
            リタイア後利回りを 2〜3% 程度に控えめに設定して試算するのがおすすめです
            （実際の最適配分は個々のリスク許容度・他の収入源によって異なります）。
          </p>
        </div>
      </Panel>

      {/* Calculate CTA */}
      <div className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-6 lg:p-8 text-center">
        <p className="text-xs text-zinc-500 mb-3">
          すべての項目を入力したら、下のボタンで結果を計算しましょう
        </p>
        <button
          onClick={applyChanges}
          disabled={!inputsValid}
          className="text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed px-8 py-3 rounded-lg transition-colors inline-flex items-center gap-2 relative"
          type="button"
        >
          <span aria-hidden>▶</span>
          {result ? "再計算する" : "計算する"}
          {isDirty && result && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </button>
      </div>

      {/* Detail table */}
      {inputsValid && result && result.rows.length > 0 && (
        <Panel>
          <PanelHeader
            title="年次明細"
            subtitle="全費目の内訳と年末資産"
          />
          <div className="overflow-x-auto max-h-[420px] overflow-y-auto -mx-2 px-2">
            <table className="w-full text-sm">
              <thead className="text-zinc-500 text-xs sticky top-0 bg-white/95 backdrop-blur z-10">
                <tr className="border-b border-zinc-200">
                  <th className="py-2 pr-2 text-left font-medium">年齢</th>
                  <th className="py-2 px-2 text-left font-medium">区分</th>
                  <th className="py-2 px-2 text-right font-medium">収入</th>
                  <th className="py-2 px-2 text-right font-medium">年金</th>
                  <th className="py-2 px-2 text-right font-medium">生活費</th>
                  <th className="py-2 px-2 text-right font-medium">住居費</th>
                  <th className="py-2 px-2 text-right font-medium">教育費</th>
                  <th className="py-2 px-2 text-right font-medium">その他</th>
                  <th className="py-2 px-2 text-right font-medium">支出計</th>
                  <th className="py-2 px-2 text-right font-medium">純収支</th>
                  <th className="py-2 px-2 text-right font-medium">運用益</th>
                  <th className="py-2 pl-2 text-right font-medium">年末資産</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {result.rows.map((r) => {
                  const isRetire = r.age === settings.retireAge;
                  const isFire = r.age === result.fireAge;
                  const isDeplete = r.age === result.depletionAge;
                  const rowBg = isDeplete
                    ? "bg-red-50"
                    : isFire
                      ? "bg-violet-50"
                      : isRetire
                        ? "bg-amber-50"
                        : "";
                  return (
                    <tr key={r.age} className={`${rowBg} hover:bg-zinc-50 transition-colors`}>
                      <td className="py-2 pr-2 text-zinc-800">
                        {r.age}
                        {isRetire && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                            退
                          </span>
                        )}
                        {isFire && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">
                            FIRE
                          </span>
                        )}
                        {isDeplete && (
                          <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                            枯渇
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-xs text-zinc-500">
                        {r.phase === "accumulation" ? "リタイア前" : "リタイア後"}
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-600">
                        {r.income > 0 ? formatCompactJPY(Math.round(r.income)) : "—"}
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-600">
                        {r.pension > 0 ? formatCompactJPY(Math.round(r.pension)) : "—"}
                      </td>
                      <td className="py-2 px-2 text-right text-zinc-700">
                        {formatCompactJPY(Math.round(r.livingCost))}
                      </td>
                      <td className="py-2 px-2 text-right text-zinc-700">
                        {r.housingCost > 0
                          ? formatCompactJPY(Math.round(r.housingCost))
                          : "—"}
                      </td>
                      <td
                        className="py-2 px-2 text-right text-amber-600"
                        title={r.childrenDetail || undefined}
                      >
                        {r.childrenCost > 0
                          ? formatCompactJPY(Math.round(r.childrenCost))
                          : "—"}
                      </td>
                      <td className="py-2 px-2 text-right text-zinc-700">
                        {formatCompactJPY(Math.round(r.otherCost))}
                      </td>
                      <td className="py-2 px-2 text-right text-red-600 font-medium">
                        {formatCompactJPY(Math.round(r.expense))}
                      </td>
                      <td
                        className={`py-2 px-2 text-right font-medium ${r.netCashflow >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {r.netCashflow >= 0 ? "+" : ""}
                        {formatCompactJPY(Math.round(r.netCashflow))}
                      </td>
                      <td className="py-2 px-2 text-right text-zinc-500">
                        {formatCompactJPY(Math.round(r.investmentGain))}
                      </td>
                      <td className="py-2 pl-2 text-right font-semibold text-zinc-900">
                        {formatCompactJPY(Math.round(r.endAssets))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <p className="text-xs text-zinc-400 leading-relaxed">
        ※ 教育費は文部科学省「子供の学習費調査」「学生生活調査」を参考にした標準額（年額）。塾は小4〜高3、入学金は小1・中1・高1・大1・院1の各時点で計上。住居費は終了年齢を超えると0（住宅ローン完済を想定）。
        FIRE 判定は「年末資産 ≥ リタイア後年間支出（教育費除く・現在価値）× 25」のインフレ補正版。インフレは全費目に毎年適用。税・社会保険は考慮していないため目安としてご利用ください。
      </p>

      <AdSlot slot="0000000000" />

      {/* 解説記事への導線 */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8">
        <h2 className="text-lg font-semibold text-zinc-900 mb-2">
          もっと知りたい方へ：解説記事
        </h2>
        <p className="text-sm text-zinc-600 mb-4">
          シミュレーターの詳しい使い方、ライフスタイル別の応用例、FIREそのものの基礎知識を別ページで解説しています。
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <li>
            <Link
              href="/articles/how-to-use"
              className="block rounded-xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 p-4 transition-colors"
            >
              <span aria-hidden className="mr-1">📘</span>
              使い方ガイド
            </Link>
          </li>
          <li>
            <Link
              href="/articles/use-cases"
              className="block rounded-xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 p-4 transition-colors"
            >
              <span aria-hidden className="mr-1">🧭</span>
              応用例（DINKs / 子持ち / Coast FIRE 等）
            </Link>
          </li>
          <li>
            <Link
              href="/articles/fire-basics"
              className="block rounded-xl border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 p-4 transition-colors"
            >
              <span aria-hidden className="mr-1">💡</span>
              FIREとは？4%ルールの基礎
            </Link>
          </li>
        </ul>
      </section>

      {/* SEO: FIRE 解説セクション */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            FIREとは？早期リタイアの基礎知識
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed">
            <strong>FIRE</strong>（Financial Independence, Retire Early）とは、
            十分な資産を築いてその運用益で生活し、早期に労働から離れるライフスタイルです。
            一般に「年間支出の25倍」の資産を作り、年4%以内で取り崩せば資産が長持ちするとされます（4%ルール）。
            本ページの<strong>FIREシミュレーター</strong>は、年齢・年収・支出・教育費・住居費・年金まで入力して
            <strong>FIREにいくら必要か</strong>をその場で試算できる無料ツールです。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            FIREにいくら必要？目安と計算方法
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed mb-3">
            必要額の目安は <strong>「リタイア後の年間支出 × 25」</strong>。
            たとえば月25万円で暮らすなら、年300万円 × 25 = <strong>7,500万円</strong>が必要資産の目安です。
            結婚・子育て・住居費（賃貸／持ち家）・教育費を含めるとさらに増えるため、
            ライフプランに沿った個別試算が欠かせません。
          </p>
          <ul className="text-sm text-zinc-700 list-disc pl-5 space-y-1">
            <li>月20万円で暮らす場合 → 年240万円 × 25 = <strong>6,000万円</strong></li>
            <li>月30万円で暮らす場合 → 年360万円 × 25 = <strong>9,000万円</strong></li>
            <li>月40万円で暮らす場合 → 年480万円 × 25 = <strong>1.2億円</strong></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            結婚・子育て世帯のFIRE
          </h2>
          <p className="text-sm text-zinc-700 leading-relaxed">
            <strong>結婚</strong>や子供の有無は必要資産を大きく変えます。子供1人を大学卒業まで育てる
            費用は概ね <strong>1,000万〜2,500万円</strong>（進学先と塾代次第）。
            本シミュレーターは公立／私立の選択、大学・大学院の進路、塾通いまで反映し、
            出産時の親年齢から生涯教育費を自動算出します。共働き・片働き・住居形態（賃貸／持ち家）も切り替えて、
            現実的な FIRE 目標額を把握しましょう。
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">
            FIREの種類（Lean / Fat / Side / Coast）
          </h2>
          <ul className="text-sm text-zinc-700 list-disc pl-5 space-y-1">
            <li><strong>Lean FIRE</strong>：質素な生活で支出を抑え、比較的少ない資産で達成するFIRE</li>
            <li><strong>Fat FIRE</strong>：余裕のある暮らしを維持するため、より多くの資産を必要とするFIRE</li>
            <li><strong>Side FIRE（サイドFIRE）</strong>：完全リタイアではなく副業や軽い労働を続けるスタイル</li>
            <li><strong>Barista FIRE（バリスタFIRE）</strong>：パートタイムや軽労働で社会保険を確保しつつ、不足分を資産収入で補うスタイル</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// Layout primitives
// =============================================================================

function WithdrawalPreview({
  rows,
  retireAge,
  pct,
}: {
  rows: YearRow[];
  retireAge: number;
  pct: number;
}) {
  const retireRows = rows.filter((r) => r.phase === "retirement");
  if (retireRows.length === 0) return null;
  const first = retireRows[0];
  const mid = retireRows[Math.floor(retireRows.length / 2)];
  const last = retireRows[retireRows.length - 1];
  const total = retireRows.reduce((s, r) => s + r.livingCost, 0);
  const avg = total / retireRows.length;

  const samples = [
    { label: `リタイア初年度 (${first.age}歳)`, v: first.livingCost },
    { label: `中盤 (${mid.age}歳)`, v: mid.livingCost },
    { label: `想定寿命 (${last.age}歳)`, v: last.livingCost },
  ];

  return (
    <div className="mt-5 rounded-xl bg-zinc-50 border border-zinc-200 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
          年間取り崩し額の予測（{pct}% / 年）
        </span>
        <span className="text-[11px] text-zinc-400">
          リタイア期間平均 {formatCurrency(Math.round(avg))} / 年
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {samples.map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-white border border-zinc-200 px-3 py-2.5"
          >
            <div className="text-[11px] text-zinc-500">{s.label}</div>
            <div className="text-lg font-semibold text-zinc-900 tabular-nums mt-0.5">
              {formatCurrency(Math.round(s.v))}
            </div>
            <div className="text-[10px] text-zinc-400 tabular-nums">
              月換算 {formatCurrency(Math.round(s.v / 12))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-zinc-400 mt-3 leading-relaxed">
        ※ 各年の年初資産の {pct}% を生活費・住居費・その他としてまとめて取り崩した想定。
        資産の増減に応じて取り崩し額も変動します（教育費は別途加算）。
      </p>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 lg:p-7">
      {children}
    </section>
  );
}

function PanelHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function Grid({
  children,
  cols = 3,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const colsClass =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-4`}>{children}</div>
  );
}

function SubSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-[0.15em]">
          {label}
        </span>
        <span className="flex-1 h-px bg-zinc-200" />
      </div>
      {children}
    </div>
  );
}

function SubTotal({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="mt-5 flex items-baseline justify-between gap-3 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-sm">
      <span className="text-zinc-600">{label}</span>
      <div className="text-right">
        <span className="font-semibold text-zinc-900 text-base tabular-nums">
          {formatCurrency(value)}
        </span>
        {hint && <span className="text-xs text-zinc-400 ml-2">{hint}</span>}
      </div>
    </div>
  );
}

// =============================================================================
// NumberField: empty input stays empty until blur
// =============================================================================

function NumberField({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
  hint,
  decimal = false,
  scale = 1,
}: {
  label: string;
  unit?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
  decimal?: boolean;
  scale?: number;
}) {
  // 表示値 = 保持値 / scale
  const toDisplay = (v: number) =>
    !Number.isFinite(v)
      ? ""
      : scale === 1
        ? String(v)
        : String(Number((v / scale).toFixed(4)));
  const isDecimal = decimal || scale !== 1;

  // Local string state allows the field to be empty / partially-typed
  // without forcibly resetting to 0.
  const [text, setText] = useState<string>(() => toDisplay(value));
  const [focused, setFocused] = useState(false);

  // Sync from outside (e.g. reset) when not focused
  useEffect(() => {
    if (!focused) {
      setText(toDisplay(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, focused]);

  return (
    <label className="block group">
      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1.5">
        {label}
        {unit && <span className="text-zinc-400 normal-case ml-1">({unit})</span>}
      </span>
      <input
        type="text"
        inputMode={isDecimal ? "decimal" : "numeric"}
        value={text}
        min={min}
        max={max}
        step={step}
        onFocus={() => setFocused(true)}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);
          if (raw === "") return;
          const parsed = isDecimal ? parseFloat(raw) : parseInt(raw, 10);
          if (Number.isFinite(parsed)) onChange(Math.round(parsed * scale));
        }}
        onBlur={() => {
          setFocused(false);
          const parsed = isDecimal ? parseFloat(text) : parseInt(text, 10);
          if (text === "" || !Number.isFinite(parsed)) {
            onChange(0);
            setText("0");
          } else {
            const stored = Math.round(parsed * scale);
            onChange(stored);
            setText(toDisplay(stored));
          }
        }}
        className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 transition-all tabular-nums"
      />
      {hint && (
        <span className="text-[11px] text-zinc-400 mt-1.5 block whitespace-pre-line leading-relaxed">{hint}</span>
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1.5">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 hover:border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 transition-all appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a1a1aa%22 stroke-width=%222%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_12px_center] pr-10"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {hint && (
        <span className="block mt-1 text-[10px] text-zinc-500 tabular-nums">
          {hint}
        </span>
      )}
    </label>
  );
}

// =============================================================================
// Summary card
// =============================================================================

function SummaryCard({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  tone: "blue" | "green" | "orange" | "purple" | "red" | "gray";
}) {
  const accent: Record<typeof tone, string> = {
    blue: "text-blue-600",
    green: "text-emerald-600",
    orange: "text-amber-600",
    purple: "text-violet-600",
    red: "text-red-600",
    gray: "text-zinc-500",
  };
  const dot: Record<typeof tone, string> = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    orange: "bg-amber-500",
    purple: "bg-violet-500",
    red: "bg-red-500",
    gray: "bg-zinc-400",
  };
  return (
    <div className="relative rounded-2xl p-5 bg-white border border-zinc-200">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dot[tone]}`} />
        <p className={`text-[11px] uppercase tracking-wider font-medium ${accent[tone]}`}>
          {label}
        </p>
      </div>
      <p className="text-2xl font-semibold text-zinc-900 tabular-nums">
        {value}
      </p>
      {sub && <p className="text-xs mt-1 text-zinc-500">{sub}</p>}
    </div>
  );
}

// =============================================================================
// Assets chart (SVG)
// =============================================================================

function AssetsChart({
  rows,
  retireAge,
  fireAge,
  pensionStartAge,
  depletionAge,
  requiredAtRetirement,
}: {
  rows: YearRow[];
  retireAge: number;
  fireAge: number | null;
  pensionStartAge: number;
  depletionAge: number | null;
  requiredAtRetirement: number;
}) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Chart dimensions (responsive via viewBox)
  const W = 1000;
  const H = 360;
  const PAD_L = 70;
  const PAD_R = 24;
  const PAD_T = 24;
  const PAD_B = 36;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const minAge = rows[0].age;
  const maxAge = rows[rows.length - 1].age;
  const ageSpan = Math.max(1, maxAge - minAge);

  const minVal = Math.min(0, ...rows.map((r) => r.endAssets));
  const maxVal = Math.max(1, ...rows.map((r) => r.endAssets));
  const valSpan = maxVal - minVal || 1;

  function x(age: number) {
    return PAD_L + ((age - minAge) / ageSpan) * innerW;
  }
  function y(v: number) {
    return PAD_T + (1 - (v - minVal) / valSpan) * innerH;
  }

  // Path builder: smooth area for endAssets
  const linePoints = rows.map((r) => `${x(r.age)},${y(r.endAssets)}`).join(" ");
  const areaPath = `M ${x(rows[0].age)},${y(0)} L ${rows
    .map((r) => `${x(r.age)},${y(r.endAssets)}`)
    .join(" L ")} L ${x(rows[rows.length - 1].age)},${y(0)} Z`;

  // Y-axis ticks (5)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minVal + (valSpan * i) / 4;
    return { v, y: y(v) };
  });

  // X-axis ticks: every 5 years
  const xTicks = rows
    .filter((r) => r.age % 5 === 0 || r.age === minAge || r.age === maxAge)
    .map((r) => ({ age: r.age, x: x(r.age) }));

  const hover = hoverIdx !== null ? rows[hoverIdx] : null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:p-7">
      <div className="flex items-start justify-between flex-wrap gap-2 mb-5">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">資産推移</h3>
          <p className="text-xs text-zinc-500 mt-1">
            年末資産（名目額）/ 横軸: 年齢
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-zinc-500">
          <Legend dotClass="bg-zinc-900" label="資産推移" />
          <Legend dotClass="bg-amber-500" label="リタイア" />
          <Legend dotClass="bg-violet-500" label="FIRE" />
          <Legend dotClass="bg-emerald-500" label="年金開始" />
          <Legend dotClass="bg-red-500" label="枯渇" />
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIdx(null)}
          onMouseMove={(e) => {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * W;
            const ageF = ((px - PAD_L) / innerW) * ageSpan + minAge;
            const idx = Math.max(
              0,
              Math.min(rows.length - 1, Math.round(ageF - minAge)),
            );
            setHoverIdx(idx);
          }}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#18181b" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#18181b" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y grid + labels */}
          {yTicks.map((t, i) => (
            <g key={i}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={t.y}
                y2={t.y}
                stroke={t.v === 0 ? "#e4e4e7" : "#f4f4f5"}
                strokeDasharray={t.v === 0 ? "0" : "2 3"}
              />
              <text
                x={PAD_L - 8}
                y={t.y + 4}
                fontSize="10"
                fill="#a1a1aa"
                textAnchor="end"
              >
                {formatCompactJPY(Math.round(t.v))}円
              </text>
            </g>
          ))}

          {/* Required-at-retirement reference line */}
          {requiredAtRetirement > 0 && y(requiredAtRetirement) > PAD_T && y(requiredAtRetirement) < PAD_T + innerH && (
            <g>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y(requiredAtRetirement)}
                y2={y(requiredAtRetirement)}
                stroke="#f59e0b"
                strokeOpacity="0.7"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={W - PAD_R - 4}
                y={y(requiredAtRetirement) - 4}
                fontSize="10"
                fill="#b45309"
                textAnchor="end"
              >
                必要資産（4%ルール）
              </text>
            </g>
          )}

          {/* Phase background bands */}
          <rect
            x={x(retireAge)}
            y={PAD_T}
            width={Math.max(0, W - PAD_R - x(retireAge))}
            height={innerH}
            fill="#fafafa"
          />

          {/* Area */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Zero line */}
          {minVal < 0 && (
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={y(0)}
              y2={y(0)}
              stroke="#ef4444"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          )}

          {/* Line */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="#18181b"
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Event vertical lines */}
          {[
            { age: retireAge, color: "#f59e0b", label: "リタイア" },
            ...(fireAge !== null
              ? [{ age: fireAge, color: "#8b5cf6", label: "FIRE" }]
              : []),
            ...(pensionStartAge >= minAge && pensionStartAge <= maxAge
              ? [{ age: pensionStartAge, color: "#10b981", label: "年金開始" }]
              : []),
            ...(depletionAge !== null
              ? [{ age: depletionAge, color: "#ef4444", label: "枯渇" }]
              : []),
          ].map((ev, i) => (
            <g key={i}>
              <line
                x1={x(ev.age)}
                x2={x(ev.age)}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke={ev.color}
                strokeOpacity="0.4"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={x(ev.age)}
                y={PAD_T + 12}
                fontSize="10"
                fill={ev.color}
                textAnchor="middle"
                fontWeight="600"
              >
                {ev.label}
              </text>
            </g>
          ))}

          {/* X labels */}
          {xTicks.map((t) => (
            <text
              key={t.age}
              x={t.x}
              y={H - 12}
              fontSize="10"
              fill="#a1a1aa"
              textAnchor="middle"
            >
              {t.age}
            </text>
          ))}

          {/* Hover indicator */}
          {hover && (
            <g>
              <line
                x1={x(hover.age)}
                x2={x(hover.age)}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke="#71717a"
                strokeWidth="1"
              />
              <circle
                cx={x(hover.age)}
                cy={y(hover.endAssets)}
                r="4"
                fill="#fff"
                stroke="#18181b"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover tooltip */}
        {hover && (
          <div
            className="absolute pointer-events-none rounded-xl bg-white border border-zinc-200 shadow-lg px-3.5 py-3 text-xs min-w-[200px]"
            style={{
              left: `${(x(hover.age) / W) * 100}%`,
              top: 8,
              transform:
                x(hover.age) / W > 0.7
                  ? "translateX(-105%)"
                  : "translateX(8px)",
            }}
          >
            <div className="font-semibold text-zinc-900 mb-1.5 flex items-baseline gap-2">
              {hover.age} 歳
              <span className="text-[10px] text-zinc-500 font-normal">
                {hover.phase === "accumulation" ? "リタイア前" : "リタイア後"}
              </span>
            </div>
            <Row label="年末資産" value={formatCurrency(Math.round(hover.endAssets))} bold />
            <Row label="収入＋年金" value={formatCurrency(Math.round(hover.income + hover.pension))} tone="emerald" />
            <Row label="支出" value={formatCurrency(Math.round(hover.expense))} tone="red" />
            {hover.childrenCost > 0 && (
              <Row
                label="うち教育費"
                value={formatCurrency(Math.round(hover.childrenCost))}
                tone="orange"
                small
              />
            )}
            <Row
              label="純収支"
              value={`${hover.netCashflow >= 0 ? "+" : ""}${formatCurrency(Math.round(hover.netCashflow))}`}
              tone={hover.netCashflow >= 0 ? "emerald" : "red"}
            />
            <Row label="運用益" value={formatCurrency(Math.round(hover.investmentGain))} small />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  bold,
  small,
}: {
  label: string;
  value: string;
  tone?: "emerald" | "red" | "orange";
  bold?: boolean;
  small?: boolean;
}) {
  const c =
    tone === "emerald"
      ? "text-emerald-600"
      : tone === "red"
        ? "text-red-600"
        : tone === "orange"
          ? "text-amber-600"
          : "text-zinc-900";
  return (
    <div className={`flex items-baseline justify-between gap-3 ${small ? "text-[10px]" : ""}`}>
      <span className="text-zinc-500">{label}</span>
      <span className={`${c} ${bold ? "font-bold" : "font-medium"} tabular-nums`}>
        {value}
      </span>
    </div>
  );
}

function Legend({ dotClass, label }: { dotClass: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${dotClass}`} /> {label}
    </span>
  );
}

// =============================================================================
// Children section
// =============================================================================

function ChildrenSection({
  childrenList,
  onChange,
  parentCurrentAge,
}: {
  childrenList: Child[];
  onChange: (children: Child[]) => void;
  parentCurrentAge: number;
}) {
  function add() {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `child-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const idx = childrenList.length + 1;
    // 既定: 親の現在年齢で出産（=今年子供が生まれる）
    onChange([...childrenList, DEFAULT_CHILD(id, `子${idx}`, parentCurrentAge)]);
  }
  function remove(id: string) {
    onChange(childrenList.filter((c) => c.id !== id));
  }
  function patch(id: string, p: Partial<Child>) {
    onChange(childrenList.map((c) => (c.id === id ? { ...c, ...p } : c)));
  }

  function totalLifetimeCost(c: Child): number {
    let total = 0;
    const maxChildAge = c.graduate === "進学しない" ? 22 : 22 + GRAD_DURATION[c.graduate];
    for (let age = 0; age <= maxChildAge; age++) {
      const r = childYearlyCost(c, age);
      total += r.tuition + r.cram + r.entrance;
    }
    return total;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500">
          {childrenList.length === 0
            ? "子供がいる場合は追加してください"
            : `${childrenList.length} 人の子供`}
        </span>
        <button
          type="button"
          onClick={add}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
        >
          + 子供を追加
        </button>
      </div>

      {childrenList.length === 0 ? (
        <div className="text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 border-dashed rounded-xl p-6 text-center">
          子供がいる場合は「+ 子供を追加」を押して、出産時の親年齢と進学プラン（小・中・高・大学・大学院）を設定してください。
          <br />
          文科省の標準額を元に、入学金・塾代・大学院も含めた年次費用が自動で支出に反映されます。
        </div>
      ) : (
        <div className="space-y-3">
          {childrenList.map((c, idx) => {
            const currentChildAge = parentCurrentAge - c.birthAtParentAge;
            return (
              <div
                key={c.id}
                className="rounded-xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => patch(c.id, { name: e.target.value })}
                      placeholder={`子${idx + 1}`}
                      className="text-sm font-semibold text-zinc-900 border-b border-transparent hover:border-zinc-300 focus:border-zinc-900 focus:outline-none bg-transparent px-1 min-w-[80px]"
                    />
                    <span className="text-[11px] text-zinc-500">
                      現在
                      <span className="ml-1 font-semibold text-zinc-800">
                        {currentChildAge < 0
                          ? `${-currentChildAge}年後に出生`
                          : `${currentChildAge}歳`}
                      </span>
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      生涯教育費
                      <span className="ml-1 font-semibold text-amber-600">
                        {formatCurrency(totalLifetimeCost(c))}
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <NumberField
                    label="出産時の親年齢"
                    unit="歳"
                    value={c.birthAtParentAge}
                    min={0}
                    max={70}
                    onChange={(v) => patch(c.id, { birthAtParentAge: v })}
                    hint={
                      currentChildAge < 0
                        ? `${-currentChildAge}年後に誕生`
                        : `現在${currentChildAge}歳`
                    }
                  />
                  <SelectField
                    label="小学校"
                    value={c.elementary}
                    options={["公立", "私立"]}
                    onChange={(v) => patch(c.id, { elementary: v as SchoolType })}
                    hint={`年額 約 ${formatCurrency(
                      TUITION_PER_YEAR.小学校[c.elementary]
                    )} × 6年間${
                      ENTRANCE_FEE.小学校[c.elementary]
                        ? `（入学金 約 ${formatCurrency(
                            ENTRANCE_FEE.小学校[c.elementary]
                          )}）`
                        : ""
                    }`}
                  />
                  <SelectField
                    label="中学校"
                    value={c.juniorHigh}
                    options={["公立", "私立"]}
                    onChange={(v) => patch(c.id, { juniorHigh: v as SchoolType })}
                    hint={`年額 約 ${formatCurrency(
                      TUITION_PER_YEAR.中学校[c.juniorHigh]
                    )} × 3年間${
                      ENTRANCE_FEE.中学校[c.juniorHigh]
                        ? `（入学金 約 ${formatCurrency(
                            ENTRANCE_FEE.中学校[c.juniorHigh]
                          )}）`
                        : ""
                    }`}
                  />
                  <SelectField
                    label="高校"
                    value={c.highSchool}
                    options={["公立", "私立", "進学しない"]}
                    onChange={(v) => patch(c.id, { highSchool: v as HighSchoolType })}
                    hint={
                      c.highSchool === "進学しない"
                        ? "高校費用は計上されません"
                        : `年額 約 ${formatCurrency(
                            TUITION_PER_YEAR.高校[c.highSchool]
                          )} × 3年間（入学金 約 ${formatCurrency(
                            ENTRANCE_FEE.高校[c.highSchool]
                          )}）`
                    }
                  />
                  <SelectField
                    label="大学"
                    value={c.university}
                    options={["国公立", "私立文系", "私立理系", "進学しない"]}
                    onChange={(v) => patch(c.id, { university: v as UniversityType })}
                    hint={
                      c.university === "進学しない"
                        ? "大学費用は計上されません"
                        : `年額 約 ${formatCurrency(
                            UNIV_PER_YEAR[c.university]
                          )} × 4年間（入学金 約 ${formatCurrency(
                            ENTRANCE_FEE.大学[c.university]
                          )}）`
                    }
                  />
                  <SelectField
                    label="大学院"
                    value={c.graduate}
                    options={[
                      "進学しない",
                      "国公立修士",
                      "私立修士",
                      "国公立博士",
                      "私立博士",
                    ]}
                    onChange={(v) => patch(c.id, { graduate: v as GraduateType })}
                    hint={
                      c.graduate === "進学しない"
                        ? "大学院費用は計上されません"
                        : `年額 約 ${formatCurrency(
                            GRAD_PER_YEAR[c.graduate]
                          )} × ${GRAD_DURATION[c.graduate]}年間（入学金 約 ${formatCurrency(
                            ENTRANCE_FEE.大学院[c.graduate]
                          )}）`
                    }
                  />
                </div>

                {/* 塾セクション */}
                <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-200 p-3">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="text-[11px] font-medium text-zinc-600 uppercase tracking-wider">
                      塾に通わせる学期
                    </span>
                    <a
                      href="https://www.mext.go.jp/b_menu/toukei/chousa03/gakushuuhi/1268091.htm"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-zinc-500 hover:text-zinc-900 underline"
                    >
                      出典: 文部科学省「子供の学習費調査」
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(
                      [
                        { key: "小学校低学年", label: "小1〜3", cost: CRAM_PER_YEAR.小学校低学年 },
                        { key: "小学校高学年", label: "小4〜6", cost: CRAM_PER_YEAR.小学校高学年 },
                        { key: "中学校", label: "中1〜3", cost: CRAM_PER_YEAR.中学校 },
                        { key: "高校", label: "高1〜3", cost: CRAM_PER_YEAR.高校 },
                      ] as const
                    ).map((opt) => {
                      const checked = c.cramStages[opt.key];
                      return (
                        <label
                          key={opt.key}
                          className={`flex flex-col gap-0.5 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                            checked
                              ? "bg-white border-zinc-900"
                              : "bg-white border-zinc-200 hover:border-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                patch(c.id, {
                                  cramStages: {
                                    ...c.cramStages,
                                    [opt.key]: e.target.checked,
                                  },
                                })
                              }
                              className="w-3.5 h-3.5 accent-zinc-900"
                            />
                            <span className="text-xs font-medium text-zinc-800">
                              {opt.label}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 ml-5 tabular-nums">
                            約 {formatCurrency(opt.cost)} / 年
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                    ※ 受験を意識した進学塾の年額目安。低学年は週1〜2回（補習中心）、
                    高学年以降は中学/高校/大学受験対応の標準コースを想定。
                    実費は通塾頻度・季節講習・志望校レベルで大きく変動します。
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
