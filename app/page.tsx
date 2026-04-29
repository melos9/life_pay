"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import {
  getAccounts,
  getTransactions,
  getCategories,
  formatCurrency,
  getCurrentMonth,
  computeTotalAssets,
} from "@/lib/storage";
import { Account, Transaction, Category } from "@/lib/types";

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentMonth] = useState(getCurrentMonth());

  useEffect(() => {
    startTransition(() => {
      setAccounts(getAccounts());
      setTransactions(getTransactions());
      setCategories(getCategories());
    });
  }, []);

  const monthlyTransactions = transactions.filter((t) =>
    t.date.startsWith(currentMonth)
  );

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyBalance = monthlyIncome - monthlyExpense;
  const totalAssets = computeTotalAssets(accounts);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;
  const getCategoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon ?? "💰";

  const currentMonthLabel = new Date(currentMonth + "-01").toLocaleDateString(
    "ja-JP",
    { year: "numeric", month: "long" }
  );

  const expenseByCategory = monthlyTransactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

  const topExpenses = Object.entries(expenseByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">ダッシュボード</h2>
        <p className="text-gray-500 mt-1">{currentMonthLabel}の概要</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="総資産"
          value={formatCurrency(totalAssets)}
          icon="🏦"
          color="blue"
          subtitle={`${accounts.length}口座`}
        />
        <SummaryCard
          title="今月の収入"
          value={formatCurrency(monthlyIncome)}
          icon="📈"
          color="green"
          subtitle={`${monthlyTransactions.filter((t) => t.type === "income").length}件`}
        />
        <SummaryCard
          title="今月の支出"
          value={formatCurrency(monthlyExpense)}
          icon="📉"
          color="red"
          subtitle={`${monthlyTransactions.filter((t) => t.type === "expense").length}件`}
        />
        <SummaryCard
          title="今月の収支"
          value={formatCurrency(monthlyBalance)}
          icon={monthlyBalance >= 0 ? "✅" : "⚠️"}
          color={monthlyBalance >= 0 ? "green" : "red"}
          subtitle={monthlyBalance >= 0 ? "黒字" : "赤字"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">直近の収支</h3>
            <Link href="/transactions" className="text-sm text-blue-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>まだ収支がありません</p>
              <Link href="/transactions" className="mt-2 inline-block text-blue-600 hover:underline text-sm">
                収支を追加する
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentTransactions.map((t) => (
                <li key={t.id} className="py-3 flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(t.category)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {t.description || getCategoryName(t.category)}
                    </p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">口座残高</h3>
            <Link href="/accounts" className="text-sm text-blue-600 hover:underline">
              管理する →
            </Link>
          </div>
          {accounts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">🏦</p>
              <p>口座がありません</p>
              <Link href="/accounts" className="mt-2 inline-block text-blue-600 hover:underline text-sm">
                口座を追加する
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {accounts.map((acc) => {
                const pct = totalAssets > 0 ? Math.max(0, (acc.balance / totalAssets) * 100) : 0;
                return (
                  <li key={acc.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{acc.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(acc.balance)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: acc.color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {topExpenses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">今月の支出カテゴリ</h3>
          <div className="space-y-3">
            {topExpenses.map(([catId, amount]) => {
              const pct = monthlyExpense > 0 ? (amount / monthlyExpense) * 100 : 0;
              const cat = categories.find((c) => c.id === catId);
              return (
                <div key={catId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">
                      {cat?.icon} {cat?.name ?? catId}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(amount)}{" "}
                      <span className="text-gray-400 text-xs">({pct.toFixed(0)}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%`, backgroundColor: cat?.color ?? "#9ca3af" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string;
  icon: string;
  color: "blue" | "green" | "red" | "yellow";
  subtitle: string;
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className={`text-2xl p-2 rounded-xl ${colorMap[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
