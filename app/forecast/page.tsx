"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import {
  getAccounts,
  getTransactions,
  formatCurrency,
  computeTotalAssets,
} from "@/lib/storage";
import { Account, Transaction } from "@/lib/types";

interface MonthAggregate {
  month: string; // YYYY-MM
  income: number;
  regularExpense: number;
  largeExpense: number;
  totalExpense: number;
  net: number;
}

function aggregateByMonth(txs: Transaction[]): MonthAggregate[] {
  const map = new Map<string, MonthAggregate>();
  for (const t of txs) {
    const month = t.date.slice(0, 7);
    if (!map.has(month)) {
      map.set(month, {
        month,
        income: 0,
        regularExpense: 0,
        largeExpense: 0,
        totalExpense: 0,
        net: 0,
      });
    }
    const agg = map.get(month)!;
    if (t.type === "income") {
      agg.income += t.amount;
    } else if (t.category === "large_expense") {
      agg.largeExpense += t.amount;
      agg.totalExpense += t.amount;
    } else {
      agg.regularExpense += t.amount;
      agg.totalExpense += t.amount;
    }
    agg.net = agg.income - agg.totalExpense;
  }
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function addMonths(yyyymm: string, n: number): string {
  const [y, m] = yyyymm.split("-").map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(yyyymm: string): string {
  const [y, m] = yyyymm.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });
}

export default function ForecastPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // User-tunable forecast inputs
  const [horizon, setHorizon] = useState(12); // months
  const [overrideIncome, setOverrideIncome] = useState<number | null>(null);
  const [overrideRegularExpense, setOverrideRegularExpense] = useState<
    number | null
  >(null);

  // Planned upcoming large expenses (e.g. 学費)
  const [plannedLargeExpenses, setPlannedLargeExpenses] = useState<
    { id: string; month: string; label: string; amount: number }[]
  >([]);
  const [newPlanMonth, setNewPlanMonth] = useState<string>(() => {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
  });
  const [newPlanLabel, setNewPlanLabel] = useState<string>("");
  const [newPlanAmount, setNewPlanAmount] = useState<number>(0);

  // Savings goal
  const [savingsGoal, setSavingsGoal] = useState<number>(0);

  useEffect(() => {
    startTransition(() => {
      setTransactions(getTransactions());
      setAccounts(getAccounts());
    });
  }, []);

  const monthly = useMemo(() => aggregateByMonth(transactions), [transactions]);

  // Use last up-to-6 months for averaging (excluding large expenses for "regular" base)
  const recent = useMemo(() => monthly.slice(-6), [monthly]);

  const avgIncome = useMemo(() => average(recent.map((m) => m.income)), [recent]);
  const avgRegularExpense = useMemo(
    () => average(recent.map((m) => m.regularExpense)),
    [recent]
  );
  const avgLargeExpense = useMemo(
    () => average(recent.map((m) => m.largeExpense)),
    [recent]
  );

  const projectedIncome = overrideIncome ?? avgIncome;
  const projectedRegularExpense =
    overrideRegularExpense ?? avgRegularExpense;

  const totalAssets = computeTotalAssets(accounts);

  // Build forecast series
  const forecast = useMemo(() => {
    const now = new Date();
    const startMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    type Row = {
      month: string;
      label: string;
      income: number;
      regularExpense: number;
      largeExpense: number;
      net: number;
      cumulativeAssets: number;
      isHistoric: boolean;
    };

    const rows: Row[] = [];

    // Add a few historic months for context
    const historic = monthly.slice(-3);
    let runningAssets = totalAssets;
    // Walk back to compute starting point before historic window
    const historicNetSum = historic.reduce((s, m) => s + m.net, 0);
    let historicStart = totalAssets - historicNetSum;
    for (const h of historic) {
      historicStart += h.net;
      rows.push({
        month: h.month,
        label: formatMonthLabel(h.month),
        income: h.income,
        regularExpense: h.regularExpense,
        largeExpense: h.largeExpense,
        net: h.net,
        cumulativeAssets: historicStart,
        isHistoric: true,
      });
    }

    // Forecast horizon months starting from current month +1
    for (let i = 1; i <= horizon; i++) {
      const month = addMonths(startMonth, i);
      const planned = plannedLargeExpenses
        .filter((p) => p.month === month)
        .reduce((s, p) => s + p.amount, 0);
      const expense = projectedRegularExpense + planned;
      const net = projectedIncome - expense;
      runningAssets += net;
      rows.push({
        month,
        label: formatMonthLabel(month),
        income: projectedIncome,
        regularExpense: projectedRegularExpense,
        largeExpense: planned,
        net,
        cumulativeAssets: runningAssets,
        isHistoric: false,
      });
    }
    return rows;
  }, [
    monthly,
    horizon,
    projectedIncome,
    projectedRegularExpense,
    plannedLargeExpenses,
    totalAssets,
  ]);

  const forecastOnly = forecast.filter((r) => !r.isHistoric);
  const finalAssets =
    forecastOnly[forecastOnly.length - 1]?.cumulativeAssets ?? totalAssets;
  const totalForecastNet = forecastOnly.reduce((s, r) => s + r.net, 0);

  // Savings goal calculation
  const monthsToGoal = useMemo(() => {
    if (savingsGoal <= 0) return null;
    if (totalAssets >= savingsGoal) return 0;
    const monthlyNet = projectedIncome - projectedRegularExpense;
    if (monthlyNet <= 0) return Infinity;
    const remaining = savingsGoal - totalAssets;
    return Math.ceil(remaining / monthlyNet);
  }, [savingsGoal, totalAssets, projectedIncome, projectedRegularExpense]);

  const minAssets = Math.min(...forecast.map((r) => r.cumulativeAssets), 0);
  const maxAssets = Math.max(...forecast.map((r) => r.cumulativeAssets), 1);
  const range = maxAssets - minAssets || 1;

  function addPlan(e: React.FormEvent) {
    e.preventDefault();
    if (!newPlanMonth || newPlanAmount <= 0) return;
    setPlannedLargeExpenses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        month: newPlanMonth,
        label: newPlanLabel || "大型支出",
        amount: newPlanAmount,
      },
    ]);
    setNewPlanLabel("");
    setNewPlanAmount(0);
  }

  function removePlan(id: string) {
    setPlannedLargeExpenses((prev) => prev.filter((p) => p.id !== id));
  }

  const hasHistory = monthly.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">予測ツール</h2>
        <p className="text-gray-500 mt-1">
          過去の収支から将来の資産推移を予測します
        </p>
      </div>

      {!hasHistory && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
          ⚠️ 予測の精度を上げるには、まず「収支記録」から数ヶ月分のデータを入力してください。
          現在は過去データがないため、入力した想定値のみで予測します。
        </div>
      )}

      {/* Forecast Inputs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">予測の前提</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              予測期間（ヶ月）
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(parseInt(e.target.value, 10))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={3}>3ヶ月</option>
              <option value={6}>6ヶ月</option>
              <option value={12}>12ヶ月</option>
              <option value={24}>24ヶ月</option>
              <option value={36}>36ヶ月</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              月収（想定）
            </label>
            <input
              type="number"
              value={overrideIncome ?? Math.round(avgIncome)}
              onChange={(e) =>
                setOverrideIncome(parseInt(e.target.value, 10) || 0)
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              直近平均: {formatCurrency(Math.round(avgIncome))}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              月の通常支出（想定）
            </label>
            <input
              type="number"
              value={
                overrideRegularExpense ?? Math.round(avgRegularExpense)
              }
              onChange={(e) =>
                setOverrideRegularExpense(parseInt(e.target.value, 10) || 0)
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              直近平均: {formatCurrency(Math.round(avgRegularExpense))}
            </p>
          </div>
        </div>

        <div className="flex gap-3 text-sm">
          <button
            onClick={() => {
              setOverrideIncome(null);
              setOverrideRegularExpense(null);
            }}
            className="text-blue-600 hover:underline"
          >
            ↺ 平均値にリセット
          </button>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            参考: 直近の大型支出平均{" "}
            {formatCurrency(Math.round(avgLargeExpense))} / 月
          </span>
        </div>
      </div>

      {/* Planned Large Expenses */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          予定している大型支出
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          学費・引越し・税金など、特定の月に発生する大きな支出を登録できます
        </p>

        <form
          onSubmit={addPlan}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4"
        >
          <input
            type="month"
            required
            value={newPlanMonth}
            onChange={(e) => setNewPlanMonth(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="例: 学費"
            value={newPlanLabel}
            onChange={(e) => setNewPlanLabel(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            min="1"
            placeholder="金額（円）"
            required
            value={newPlanAmount || ""}
            onChange={(e) => setNewPlanAmount(parseInt(e.target.value, 10) || 0)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            ＋ 追加
          </button>
        </form>

        {plannedLargeExpenses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-3">
            予定している大型支出はありません
          </p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {plannedLargeExpenses
              .sort((a, b) => a.month.localeCompare(b.month))
              .map((p) => (
                <li
                  key={p.id}
                  className="py-2.5 flex items-center justify-between text-sm"
                >
                  <span>
                    <span className="text-gray-500">
                      {formatMonthLabel(p.month)}
                    </span>
                    <span className="ml-3 font-medium">{p.label}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-semibold text-red-600">
                      −{formatCurrency(p.amount)}
                    </span>
                    <button
                      onClick={() => removePlan(p.id)}
                      className="text-xs text-gray-400 hover:text-red-500"
                    >
                      削除
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-5">
          <p className="text-sm text-blue-700 font-medium">現在の総資産</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {formatCurrency(totalAssets)}
          </p>
        </div>
        <div
          className={`rounded-2xl p-5 ${totalForecastNet >= 0 ? "bg-green-50" : "bg-red-50"}`}
        >
          <p
            className={`text-sm font-medium ${totalForecastNet >= 0 ? "text-green-700" : "text-red-700"}`}
          >
            {horizon}ヶ月後までの累計収支
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${totalForecastNet >= 0 ? "text-green-900" : "text-red-900"}`}
          >
            {totalForecastNet >= 0 ? "+" : ""}
            {formatCurrency(totalForecastNet)}
          </p>
        </div>
        <div
          className={`rounded-2xl p-5 ${finalAssets >= totalAssets ? "bg-purple-50" : "bg-orange-50"}`}
        >
          <p
            className={`text-sm font-medium ${finalAssets >= totalAssets ? "text-purple-700" : "text-orange-700"}`}
          >
            {horizon}ヶ月後の予測資産
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${finalAssets >= totalAssets ? "text-purple-900" : "text-orange-900"}`}
          >
            {formatCurrency(finalAssets)}
          </p>
        </div>
      </div>

      {/* Asset Projection Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          総資産の推移予測
        </h3>
        <div className="overflow-x-auto">
          <div
            className="flex items-end gap-1"
            style={{ height: "200px", minWidth: `${forecast.length * 40}px` }}
          >
            {forecast.map((r) => {
              const heightPct =
                ((r.cumulativeAssets - minAssets) / range) * 100;
              return (
                <div
                  key={r.month}
                  className="flex-1 flex flex-col items-center gap-1"
                  title={`${r.label}: ${formatCurrency(r.cumulativeAssets)}`}
                >
                  <div
                    className="w-full flex items-end"
                    style={{ height: "170px" }}
                  >
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        r.isHistoric
                          ? "bg-gray-300"
                          : r.cumulativeAssets >= 0
                            ? "bg-blue-400"
                            : "bg-red-400"
                      }`}
                      style={{ height: `${Math.max(heightPct, 2)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">
                    {r.month.slice(2).replace("-", "/")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" />{" "}
            実績
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />{" "}
            予測（黒字）
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" />{" "}
            予測（赤字）
          </span>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">貯蓄目標</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              目標金額（円）
            </label>
            <input
              type="number"
              min="0"
              value={savingsGoal || ""}
              onChange={(e) =>
                setSavingsGoal(parseInt(e.target.value, 10) || 0)
              }
              placeholder="例: 1000000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            {monthsToGoal === null ? (
              <p className="text-sm text-gray-400">
                目標金額を入力してください
              </p>
            ) : monthsToGoal === 0 ? (
              <p className="text-sm font-medium text-green-700">
                ✅ すでに目標を達成しています
              </p>
            ) : monthsToGoal === Infinity ? (
              <p className="text-sm font-medium text-red-700">
                ⚠️ 現在のペースでは目標に到達できません（月の収支が赤字です）
              </p>
            ) : (
              <p className="text-sm">
                <span className="font-semibold text-blue-700">
                  約 {monthsToGoal} ヶ月後
                </span>{" "}
                <span className="text-gray-500">に目標達成見込み</span>
                <span className="block text-xs text-gray-400 mt-1">
                  （月の純収支:{" "}
                  {formatCurrency(
                    Math.round(projectedIncome - projectedRegularExpense)
                  )}
                  ）
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">月別予測</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-xs border-b border-gray-100">
              <tr>
                <th className="pb-2 text-left">月</th>
                <th className="pb-2 text-right">収入</th>
                <th className="pb-2 text-right">通常支出</th>
                <th className="pb-2 text-right">大型支出</th>
                <th className="pb-2 text-right">月収支</th>
                <th className="pb-2 text-right">予測総資産</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {forecast.map((r) => (
                <tr
                  key={r.month}
                  className={r.isHistoric ? "bg-gray-50/50" : ""}
                >
                  <td className="py-2.5">
                    {r.label}
                    {r.isHistoric && (
                      <span className="ml-2 text-[10px] text-gray-400">
                        実績
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-right text-green-600">
                    {formatCurrency(Math.round(r.income))}
                  </td>
                  <td className="py-2.5 text-right text-gray-700">
                    {formatCurrency(Math.round(r.regularExpense))}
                  </td>
                  <td className="py-2.5 text-right text-red-600">
                    {r.largeExpense > 0
                      ? formatCurrency(Math.round(r.largeExpense))
                      : "—"}
                  </td>
                  <td
                    className={`py-2.5 text-right font-medium ${r.net >= 0 ? "text-green-700" : "text-red-700"}`}
                  >
                    {r.net >= 0 ? "+" : ""}
                    {formatCurrency(Math.round(r.net))}
                  </td>
                  <td className="py-2.5 text-right font-semibold">
                    {formatCurrency(Math.round(r.cumulativeAssets))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
