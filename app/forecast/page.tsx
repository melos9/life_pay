"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  computeTotalAssets,
  formatCurrency,
  getAccounts,
  getTransactions,
} from "@/lib/storage";
import { Account, Transaction } from "@/lib/types";

// =============================================================================
// Types & constants
// =============================================================================

const SETTINGS_KEY = "life_pay_fire_settings";

interface FireSettings {
  currentAge: number;
  retireAge: number;
  lifeAge: number;
  currentAssets: number;
  annualIncome: number; // take-home, current
  annualExpense: number; // current
  retireAnnualExpense: number; // post-retirement
  incomeGrowthRate: number; // % per year (e.g. 1 = 1%)
  returnRate: number; // % per year (investment return)
  inflationRate: number; // % per year
  pensionAnnual: number; // annual pension
  pensionStartAge: number;
  retireReturnRate: number; // % return after retirement (typically lower / safer)
}

const DEFAULT_SETTINGS: FireSettings = {
  currentAge: 30,
  retireAge: 60,
  lifeAge: 95,
  currentAssets: 0,
  annualIncome: 5_000_000,
  annualExpense: 3_000_000,
  retireAnnualExpense: 2_400_000,
  incomeGrowthRate: 1.0,
  returnRate: 4.0,
  inflationRate: 1.0,
  pensionAnnual: 1_500_000,
  pensionStartAge: 65,
  retireReturnRate: 3.0,
};

// =============================================================================
// Helpers
// =============================================================================

function loadSettings(): FireSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FireSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return null;
  }
}

function saveSettings(s: FireSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

// Estimate annualized values from history (last up-to-12 months of transactions)
function estimateFromHistory(txs: Transaction[]): {
  income: number;
  expense: number;
} {
  if (txs.length === 0) return { income: 0, expense: 0 };
  // Group by month
  const map = new Map<string, { income: number; expense: number }>();
  for (const t of txs) {
    const month = t.date.slice(0, 7);
    if (!map.has(month)) map.set(month, { income: 0, expense: 0 });
    const m = map.get(month)!;
    if (t.type === "income") m.income += t.amount;
    else m.expense += t.amount;
  }
  const months = Array.from(map.values()).slice(-12);
  if (months.length === 0) return { income: 0, expense: 0 };
  const avgIncome = months.reduce((s, m) => s + m.income, 0) / months.length;
  const avgExpense = months.reduce((s, m) => s + m.expense, 0) / months.length;
  return {
    income: Math.round(avgIncome * 12),
    expense: Math.round(avgExpense * 12),
  };
}

interface YearRow {
  age: number;
  phase: "accumulation" | "retirement";
  income: number;
  expense: number;
  pension: number;
  netCashflow: number;
  investmentGain: number;
  endAssets: number;
}

interface SimulationResult {
  rows: YearRow[];
  fireAge: number | null; // age when assets >= 25 × retire annual expense (4% rule)
  assetsAtRetirement: number;
  depletionAge: number | null; // age when assets first go <= 0
  lastsToLifeAge: boolean;
  peakAssets: number;
}

function clampNumber(v: number, fallback = 0): number {
  if (!Number.isFinite(v) || Number.isNaN(v)) return fallback;
  return v;
}

function simulate(s: FireSettings): SimulationResult {
  const rows: YearRow[] = [];
  // Validate / clamp
  const currentAge = Math.max(0, Math.floor(s.currentAge));
  const retireAge = Math.max(currentAge, Math.floor(s.retireAge));
  const lifeAge = Math.max(retireAge, Math.floor(s.lifeAge));
  const r = clampNumber(s.returnRate) / 100;
  const rRet = clampNumber(s.retireReturnRate) / 100;
  const inc = clampNumber(s.incomeGrowthRate) / 100;
  const inf = clampNumber(s.inflationRate) / 100;

  let assets = clampNumber(s.currentAssets);
  let income = clampNumber(s.annualIncome);
  let expense = clampNumber(s.annualExpense);
  let retireExpense = clampNumber(s.retireAnnualExpense);
  const pension = clampNumber(s.pensionAnnual);
  const pensionStartAge = Math.floor(clampNumber(s.pensionStartAge, 65));

  let fireAge: number | null = null;
  let depletionAge: number | null = null;
  // Default: if retiring immediately, nest egg is current assets.
  let assetsAtRetirement = assets;
  let peakAssets = assets;

  for (let age = currentAge; age <= lifeAge; age++) {
    const phase: "accumulation" | "retirement" =
      age < retireAge ? "accumulation" : "retirement";

    let yearIncome = 0;
    let yearExpense = 0;
    let yearPension = 0;

    if (phase === "accumulation") {
      yearIncome = income;
      yearExpense = expense;
    } else {
      yearExpense = retireExpense;
      if (age >= pensionStartAge) yearPension = pension;
    }

    const netCashflow = yearIncome + yearPension - yearExpense;
    // Apply cashflow at start of year, then grow with return
    const rate = phase === "accumulation" ? r : rRet;
    const baseAfterCashflow = assets + netCashflow;
    // Investment gain only on positive remaining (no fictional growth on debt)
    const investmentGain =
      baseAfterCashflow > 0 ? baseAfterCashflow * rate : 0;
    const endAssets = baseAfterCashflow + investmentGain;

    rows.push({
      age,
      phase,
      income: yearIncome,
      expense: yearExpense,
      pension: yearPension,
      netCashflow,
      investmentGain,
      endAssets,
    });

    // FIRE rule: assets cover 25× post-retirement annual expense (4% safe withdrawal)
    // Use today's-money equivalent: compare nominal endAssets vs nominal retireExpense × 25
    if (
      fireAge === null &&
      retireExpense > 0 &&
      endAssets >= retireExpense * 25
    ) {
      fireAge = age;
    }

    if (age === retireAge - 1) {
      // End of the last working year = nest egg entering retirement.
      assetsAtRetirement = endAssets;
    }

    if (depletionAge === null && endAssets <= 0 && phase === "retirement") {
      depletionAge = age;
    }

    if (endAssets > peakAssets) peakAssets = endAssets;

    // Update for next year
    if (phase === "accumulation") {
      income = income * (1 + inc);
      expense = expense * (1 + inf);
      retireExpense = retireExpense * (1 + inf);
    } else {
      retireExpense = retireExpense * (1 + inf);
    }
    assets = endAssets;
  }

  // If we never set assetsAtRetirement (e.g. retireAge beyond lifeAge), use last
  // row's end value as a fallback.
  if (rows.length > 0 && retireAge > lifeAge) {
    assetsAtRetirement = rows[rows.length - 1].endAssets;
  }

  const lastRow = rows[rows.length - 1];
  const lastsToLifeAge = !!lastRow && lastRow.endAssets > 0;

  return {
    rows,
    fireAge,
    assetsAtRetirement,
    depletionAge,
    lastsToLifeAge,
    peakAssets,
  };
}

// =============================================================================
// Component
// =============================================================================

export default function ForecastPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<FireSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      const accs = getAccounts();
      const txs = getTransactions();
      setAccounts(accs);
      setTransactions(txs);

      const stored = loadSettings();
      if (stored) {
        setSettings(stored);
      } else {
        // Auto-fill defaults from existing data
        const totalAssets = computeTotalAssets(accs);
        const { income, expense } = estimateFromHistory(txs);
        setSettings({
          ...DEFAULT_SETTINGS,
          currentAssets: totalAssets || DEFAULT_SETTINGS.currentAssets,
          annualIncome: income || DEFAULT_SETTINGS.annualIncome,
          annualExpense: expense || DEFAULT_SETTINGS.annualExpense,
          retireAnnualExpense:
            expense > 0
              ? Math.round(expense * 0.8)
              : DEFAULT_SETTINGS.retireAnnualExpense,
        });
      }
      setHydrated(true);
    });
  }, []);

  // Persist on change (after hydrated)
  useEffect(() => {
    if (!hydrated) return;
    saveSettings(settings);
  }, [settings, hydrated]);

  const totalAssets = useMemo(
    () => computeTotalAssets(accounts),
    [accounts]
  );
  const historyEstimate = useMemo(
    () => estimateFromHistory(transactions),
    [transactions]
  );

  const result = useMemo(() => simulate(settings), [settings]);

  function update<K extends keyof FireSettings>(key: K, value: FireSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function applyAutoFill() {
    setSettings((s) => ({
      ...s,
      currentAssets: totalAssets || s.currentAssets,
      annualIncome: historyEstimate.income || s.annualIncome,
      annualExpense: historyEstimate.expense || s.annualExpense,
    }));
  }

  function resetSettings() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SETTINGS_KEY);
    }
    const totalAssetsLocal = computeTotalAssets(accounts);
    const est = estimateFromHistory(transactions);
    setSettings({
      ...DEFAULT_SETTINGS,
      currentAssets: totalAssetsLocal || DEFAULT_SETTINGS.currentAssets,
      annualIncome: est.income || DEFAULT_SETTINGS.annualIncome,
      annualExpense: est.expense || DEFAULT_SETTINGS.annualExpense,
      retireAnnualExpense:
        est.expense > 0
          ? Math.round(est.expense * 0.8)
          : DEFAULT_SETTINGS.retireAnnualExpense,
    });
  }

  const yearsToRetire = Math.max(0, settings.retireAge - settings.currentAge);
  const yearsToFire =
    result.fireAge !== null
      ? Math.max(0, result.fireAge - settings.currentAge)
      : null;

  // Chart bounds
  const minA = Math.min(...result.rows.map((r) => r.endAssets), 0);
  const maxA = Math.max(...result.rows.map((r) => r.endAssets), 1);
  const range = maxA - minA || 1;

  const inputsValid =
    settings.retireAge >= settings.currentAge &&
    settings.lifeAge >= settings.retireAge &&
    settings.currentAge >= 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">FIRE 予測シミュレーター</h2>
        <p className="text-gray-500 mt-1">
          経済的自立・早期リタイアまでの道筋を、自分のパラメータでシミュレーションできます
        </p>
      </div>

      {!inputsValid && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-800">
          ⚠️ 入力値に問題があります。「現在年齢 ≤ リタイア年齢 ≤ 寿命」となるよう設定してください。
        </div>
      )}

      {/* Input form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">前提条件</h3>
          <div className="flex gap-2 text-sm">
            <button
              onClick={applyAutoFill}
              className="text-blue-600 hover:underline"
              type="button"
            >
              📥 履歴から自動入力
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={resetSettings}
              className="text-gray-500 hover:underline"
              type="button"
            >
              ↺ リセット
            </button>
          </div>
        </div>

        <Section title="基本情報">
          <NumberField
            label="現在の年齢"
            unit="歳"
            value={settings.currentAge}
            min={0}
            max={120}
            onChange={(v) => update("currentAge", v)}
          />
          <NumberField
            label="リタイア希望年齢"
            unit="歳"
            value={settings.retireAge}
            min={settings.currentAge}
            max={120}
            onChange={(v) => update("retireAge", v)}
          />
          <NumberField
            label="寿命想定"
            unit="歳"
            value={settings.lifeAge}
            min={settings.retireAge}
            max={120}
            onChange={(v) => update("lifeAge", v)}
          />
        </Section>

        <Section title="現在の資産・収支">
          <NumberField
            label="現在の総資産"
            unit="円"
            value={settings.currentAssets}
            step={10000}
            onChange={(v) => update("currentAssets", v)}
            hint={`口座合計: ${formatCurrency(totalAssets)}`}
          />
          <NumberField
            label="年収（手取り）"
            unit="円"
            value={settings.annualIncome}
            step={10000}
            onChange={(v) => update("annualIncome", v)}
            hint={
              historyEstimate.income > 0
                ? `履歴年換算: ${formatCurrency(historyEstimate.income)}`
                : undefined
            }
          />
          <NumberField
            label="年間支出（現在）"
            unit="円"
            value={settings.annualExpense}
            step={10000}
            onChange={(v) => update("annualExpense", v)}
            hint={
              historyEstimate.expense > 0
                ? `履歴年換算: ${formatCurrency(historyEstimate.expense)}`
                : undefined
            }
          />
        </Section>

        <Section title="リタイア後">
          <NumberField
            label="年間支出（リタイア後）"
            unit="円"
            value={settings.retireAnnualExpense}
            step={10000}
            onChange={(v) => update("retireAnnualExpense", v)}
          />
          <NumberField
            label="年金（年額）"
            unit="円"
            value={settings.pensionAnnual}
            step={10000}
            onChange={(v) => update("pensionAnnual", v)}
          />
          <NumberField
            label="年金開始年齢"
            unit="歳"
            value={settings.pensionStartAge}
            min={50}
            max={80}
            onChange={(v) => update("pensionStartAge", v)}
          />
        </Section>

        <Section title="経済前提">
          <NumberField
            label="年収上昇率"
            unit="%"
            value={settings.incomeGrowthRate}
            step={0.1}
            onChange={(v) => update("incomeGrowthRate", v)}
            decimal
          />
          <NumberField
            label="運用利回り（現役時）"
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
        </Section>
      </div>

      {/* Summary cards */}
      {inputsValid && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            label="リタイアまで"
            value={`${yearsToRetire} 年`}
            sub={`${settings.retireAge} 歳`}
            tone="blue"
          />
          <SummaryCard
            label="リタイア時の予測資産"
            value={formatCurrency(Math.round(result.assetsAtRetirement))}
            sub={`必要資産: ${formatCurrency(
              Math.round(settings.retireAnnualExpense * 25)
            )}`}
            tone={
              result.assetsAtRetirement >= settings.retireAnnualExpense * 25
                ? "green"
                : "orange"
            }
          />
          <SummaryCard
            label="FIRE 達成"
            value={
              result.fireAge !== null
                ? `${result.fireAge} 歳`
                : "未達成"
            }
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
                ? `${result.depletionAge} 歳で枯渇`
                : "寿命まで持続 ✅"
            }
            sub={
              result.depletionAge !== null
                ? `想定寿命 ${settings.lifeAge} 歳より早い`
                : `想定寿命 ${settings.lifeAge} 歳`
            }
            tone={result.depletionAge !== null ? "red" : "green"}
          />
        </div>
      )}

      {/* Asset trajectory chart */}
      {inputsValid && result.rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            生涯の資産推移
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            横軸: 年齢 / 縦軸: 年末資産（名目額）
          </p>
          <div className="overflow-x-auto">
            <div
              className="flex items-end gap-px"
              style={{
                height: "240px",
                minWidth: `${Math.max(result.rows.length * 14, 600)}px`,
              }}
            >
              {result.rows.map((r) => {
                const heightPct = ((r.endAssets - minA) / range) * 100;
                const isRetire = r.age === settings.retireAge;
                const isFire = r.age === result.fireAge;
                const isPension = r.age === settings.pensionStartAge;
                const color =
                  r.endAssets <= 0
                    ? "bg-red-400"
                    : r.phase === "accumulation"
                      ? "bg-blue-400"
                      : "bg-emerald-400";
                return (
                  <div
                    key={r.age}
                    className="flex-1 flex flex-col items-center"
                    title={`${r.age}歳: ${formatCurrency(Math.round(r.endAssets))}`}
                  >
                    <div
                      className="w-full flex items-end"
                      style={{ height: "210px" }}
                    >
                      <div
                        className={`w-full ${color} ${
                          isRetire || isFire || isPension
                            ? "ring-2 ring-amber-400"
                            : ""
                        }`}
                        style={{ height: `${Math.max(heightPct, 1)}%` }}
                      />
                    </div>
                    {(r.age % 5 === 0 || isRetire) && (
                      <span className="text-[9px] text-gray-500 mt-1">
                        {r.age}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
            <Legend color="bg-blue-400" label="現役（資産形成期）" />
            <Legend color="bg-emerald-400" label="リタイア後" />
            <Legend color="bg-red-400" label="資産マイナス" />
            <Legend color="bg-amber-400" label="主要イベント年" />
          </div>
        </div>
      )}

      {/* Detail table */}
      {inputsValid && result.rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            年次明細
          </h3>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 text-xs border-b border-gray-100 sticky top-0 bg-white">
                <tr>
                  <th className="pb-2 text-left">年齢</th>
                  <th className="pb-2 text-left">区分</th>
                  <th className="pb-2 text-right">収入</th>
                  <th className="pb-2 text-right">年金</th>
                  <th className="pb-2 text-right">支出</th>
                  <th className="pb-2 text-right">純収支</th>
                  <th className="pb-2 text-right">運用益</th>
                  <th className="pb-2 text-right">年末資産</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {result.rows.map((r) => {
                  const isRetire = r.age === settings.retireAge;
                  const isFire = r.age === result.fireAge;
                  const isDeplete = r.age === result.depletionAge;
                  return (
                    <tr
                      key={r.age}
                      className={
                        isDeplete
                          ? "bg-red-50"
                          : isFire
                            ? "bg-purple-50"
                            : isRetire
                              ? "bg-amber-50"
                              : ""
                      }
                    >
                      <td className="py-2">
                        {r.age}
                        {isRetire && (
                          <span className="ml-2 text-[10px] text-amber-700">
                            リタイア
                          </span>
                        )}
                        {isFire && (
                          <span className="ml-2 text-[10px] text-purple-700">
                            FIRE
                          </span>
                        )}
                        {isDeplete && (
                          <span className="ml-2 text-[10px] text-red-700">
                            枯渇
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-xs text-gray-600">
                        {r.phase === "accumulation" ? "現役" : "リタイア後"}
                      </td>
                      <td className="py-2 text-right text-green-700">
                        {r.income > 0
                          ? formatCurrency(Math.round(r.income))
                          : "—"}
                      </td>
                      <td className="py-2 text-right text-green-700">
                        {r.pension > 0
                          ? formatCurrency(Math.round(r.pension))
                          : "—"}
                      </td>
                      <td className="py-2 text-right text-red-600">
                        {formatCurrency(Math.round(r.expense))}
                      </td>
                      <td
                        className={`py-2 text-right font-medium ${r.netCashflow >= 0 ? "text-green-700" : "text-red-700"}`}
                      >
                        {r.netCashflow >= 0 ? "+" : ""}
                        {formatCurrency(Math.round(r.netCashflow))}
                      </td>
                      <td className="py-2 text-right text-gray-600">
                        {formatCurrency(Math.round(r.investmentGain))}
                      </td>
                      <td className="py-2 text-right font-semibold">
                        {formatCurrency(Math.round(r.endAssets))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 leading-relaxed">
        ※ FIRE 達成判定は「年末資産 ≥ リタイア後年間支出 × 25（4% ルール）」で計算。
        運用益は現役/リタイア後それぞれの利回りに基づく単純複利モデル。インフレは年間支出に毎年適用。
        税・社会保険は考慮していないため目安としてご利用ください。
      </div>
    </div>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

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
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600 block mb-1">
        {label}
        {unit && (
          <span className="text-gray-400 font-normal ml-1">({unit})</span>
        )}
      </span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(0);
            return;
          }
          const parsed = decimal ? parseFloat(raw) : parseInt(raw, 10);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {hint && <span className="text-[11px] text-gray-400 mt-1 block">{hint}</span>}
    </label>
  );
}

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
  const tones: Record<typeof tone, string> = {
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900",
    orange: "bg-orange-50 text-orange-900",
    purple: "bg-purple-50 text-purple-900",
    red: "bg-red-50 text-red-900",
    gray: "bg-gray-50 text-gray-700",
  };
  const labelTones: Record<typeof tone, string> = {
    blue: "text-blue-700",
    green: "text-green-700",
    orange: "text-orange-700",
    purple: "text-purple-700",
    red: "text-red-700",
    gray: "text-gray-500",
  };
  return (
    <div className={`rounded-2xl p-5 ${tones[tone]}`}>
      <p className={`text-sm font-medium ${labelTones[tone]}`}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-75">{sub}</p>}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-3 h-3 rounded-sm ${color} inline-block`} /> {label}
    </span>
  );
}
