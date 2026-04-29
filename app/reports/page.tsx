"use client";

import { startTransition, useEffect, useState } from "react";
import {
  getTransactions,
  getCategories,
  formatCurrency,
} from "@/lib/storage";
import { Transaction, Category } from "@/lib/types";

interface MonthlySummary {
  month: string;
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export default function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);

  useEffect(() => {
    const txs = getTransactions();
    const cats = getCategories();

    // Build monthly summaries from all transactions
    const months = new Set<string>();
    txs.forEach((t) => months.add(t.date.slice(0, 7)));

    // Also include last 6 months even if empty
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.add(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      );
    }

    const summaries: MonthlySummary[] = Array.from(months)
      .sort((a, b) => b.localeCompare(a))
      .map((month) => {
        const monthTxs = txs.filter((t) => t.date.startsWith(month));
        const income = monthTxs
          .filter((t) => t.type === "income")
          .reduce((s, t) => s + t.amount, 0);
        const expense = monthTxs
          .filter((t) => t.type === "expense")
          .reduce((s, t) => s + t.amount, 0);
        const label = new Date(month + "-01").toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
        });
        return { month, label, income, expense, balance: income - expense };
      });

    startTransition(() => {
      setTransactions(txs);
      setCategories(cats);
      setMonthlySummaries(summaries);
      if (summaries.length > 0) setSelectedMonth(summaries[0].month);
    });
  }, []);

  const selectedSummary = monthlySummaries.find((s) => s.month === selectedMonth);

  const monthlyTransactions = transactions
    .filter((t) => t.date.startsWith(selectedMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;
  const getCategoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon ?? "💰";
  const getCategoryColor = (id: string) =>
    categories.find((c) => c.id === id)?.color ?? "#9ca3af";

  // Expense breakdown for selected month
  const expenseByCategory = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

  const expenseBreakdown = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a);

  // Income breakdown for selected month
  const incomeByCategory = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

  const incomeBreakdown = Object.entries(incomeByCategory)
    .sort(([, a], [, b]) => b - a);

  const maxBar = Math.max(
    ...monthlySummaries.map((s) => Math.max(s.income, s.expense)),
    1
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">月次レポート</h2>
        <p className="text-gray-500 mt-1">月別の収支サマリー</p>
      </div>

      {/* Trend Chart (last 6 months bar chart) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">収支トレンド（直近6ヶ月）</h3>
        <div className="flex items-end gap-4 h-40">
          {monthlySummaries.slice(0, 6).reverse().map((s) => {
            const incomePct = (s.income / maxBar) * 100;
            const expensePct = (s.expense / maxBar) * 100;
            return (
              <div
                key={s.month}
                className={`flex-1 flex flex-col items-center gap-1 cursor-pointer ${selectedMonth === s.month ? "opacity-100" : "opacity-60 hover:opacity-80"}`}
                onClick={() => setSelectedMonth(s.month)}
              >
                <div className="w-full flex gap-1 items-end" style={{ height: "120px" }}>
                  <div
                    className="flex-1 rounded-t-md bg-green-400 transition-all"
                    style={{ height: `${incomePct}%`, minHeight: s.income > 0 ? "4px" : "0" }}
                    title={`収入: ${formatCurrency(s.income)}`}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-red-400 transition-all"
                    style={{ height: `${expensePct}%`, minHeight: s.expense > 0 ? "4px" : "0" }}
                    title={`支出: ${formatCurrency(s.expense)}`}
                  />
                </div>
                <span className={`text-xs font-medium ${selectedMonth === s.month ? "text-blue-600" : "text-gray-500"}`}>
                  {s.month.slice(5)}月
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" /> 収入</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> 支出</span>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex gap-2 flex-wrap">
        {monthlySummaries.slice(0, 12).map((s) => (
          <button
            key={s.month}
            onClick={() => setSelectedMonth(s.month)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedMonth === s.month
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Selected Month Details */}
      {selectedSummary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-2xl p-5">
              <p className="text-sm text-green-700 font-medium">収入</p>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {formatCurrency(selectedSummary.income)}
              </p>
            </div>
            <div className="bg-red-50 rounded-2xl p-5">
              <p className="text-sm text-red-700 font-medium">支出</p>
              <p className="text-2xl font-bold text-red-800 mt-1">
                {formatCurrency(selectedSummary.expense)}
              </p>
            </div>
            <div className={`rounded-2xl p-5 ${selectedSummary.balance >= 0 ? "bg-blue-50" : "bg-orange-50"}`}>
              <p className={`text-sm font-medium ${selectedSummary.balance >= 0 ? "text-blue-700" : "text-orange-700"}`}>収支</p>
              <p className={`text-2xl font-bold mt-1 ${selectedSummary.balance >= 0 ? "text-blue-800" : "text-orange-800"}`}>
                {formatCurrency(selectedSummary.balance)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">支出カテゴリ内訳</h4>
              {expenseBreakdown.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">支出なし</p>
              ) : (
                <div className="space-y-3">
                  {expenseBreakdown.map(([catId, amount]) => {
                    const pct = selectedSummary.expense > 0 ? (amount / selectedSummary.expense) * 100 : 0;
                    return (
                      <div key={catId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">
                            {getCategoryIcon(catId)} {getCategoryName(catId)}
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(amount)}{" "}
                            <span className="text-gray-400 text-xs">({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: getCategoryColor(catId) }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Income breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">収入カテゴリ内訳</h4>
              {incomeBreakdown.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">収入なし</p>
              ) : (
                <div className="space-y-3">
                  {incomeBreakdown.map(([catId, amount]) => {
                    const pct = selectedSummary.income > 0 ? (amount / selectedSummary.income) * 100 : 0;
                    return (
                      <div key={catId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">
                            {getCategoryIcon(catId)} {getCategoryName(catId)}
                          </span>
                          <span className="text-sm font-medium">
                            {formatCurrency(amount)}{" "}
                            <span className="text-gray-400 text-xs">({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: getCategoryColor(catId) }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Transaction List for Selected Month */}
          {monthlyTransactions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                {selectedSummary.label}の収支一覧
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 text-xs border-b border-gray-100">
                    <tr>
                      <th className="pb-2 text-left">日付</th>
                      <th className="pb-2 text-left">カテゴリ</th>
                      <th className="pb-2 text-left">説明</th>
                      <th className="pb-2 text-right">金額</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {monthlyTransactions.map((t) => (
                      <tr key={t.id}>
                        <td className="py-2.5 text-gray-500">{t.date}</td>
                        <td className="py-2.5">
                          {getCategoryIcon(t.category)} {getCategoryName(t.category)}
                        </td>
                        <td className="py-2.5 text-gray-500">{t.description || "—"}</td>
                        <td
                          className={`py-2.5 text-right font-medium ${
                            t.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
