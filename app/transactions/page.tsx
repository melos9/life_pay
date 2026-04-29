"use client";

import { startTransition, useEffect, useState } from "react";
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCategories,
  getAccounts,
  formatCurrency,
  generateId,
  getCurrentMonth,
} from "@/lib/storage";
import { Transaction, Account, Category, TransactionType } from "@/lib/types";

const EMPTY_FORM: Omit<Transaction, "id"> = {
  date: new Date().toISOString().split("T")[0],
  amount: 0,
  type: "expense",
  category: "regular_expense",
  description: "",
  accountId: "",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");

  const load = () => {
    startTransition(() => {
      setTransactions(getTransactions());
      setAccounts(getAccounts());
      setCategories(getCategories());
    });
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      accountId: accounts[0]?.id ?? "",
    });
    setShowForm(true);
  };

  const openEdit = (t: Transaction) => {
    setEditingId(t.id);
    setForm({
      date: t.date,
      amount: t.amount,
      type: t.type,
      category: t.category,
      description: t.description,
      accountId: t.accountId,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTransaction({ ...form, id: editingId });
    } else {
      addTransaction({ ...form, id: generateId() });
    }
    setShowForm(false);
    load();
  };

  const handleDelete = (id: string) => {
    if (confirm("この収支を削除しますか？")) {
      deleteTransaction(id);
      load();
    }
  };

  const filteredTransactions = transactions
    .filter((t) => t.date.startsWith(filterMonth))
    .filter((t) => filterType === "all" || t.type === filterType)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const getCategoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;
  const getCategoryIcon = (id: string) =>
    categories.find((c) => c.id === id)?.icon ?? "💰";
  const getAccountName = (id: string) =>
    accounts.find((a) => a.id === id)?.name ?? id;

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");
  const currentCategories =
    form.type === "income" ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">収支記録</h2>
          <p className="text-gray-500 mt-1">収入・支出を記録する</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          ＋ 追加
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-xs text-gray-500 block mb-1">月を選択</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">種別</label>
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "all" | TransactionType)
            }
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">すべて</option>
            <option value="income">収入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        <div className="ml-auto flex gap-4 text-sm">
          <span className="text-green-600 font-medium">
            収入: {formatCurrency(totalIncome)}
          </span>
          <span className="text-red-600 font-medium">
            支出: {formatCurrency(totalExpense)}
          </span>
          <span
            className={`font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-red-600"}`}
          >
            収支: {formatCurrency(totalIncome - totalExpense)}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📋</p>
            <p className="text-lg">収支がありません</p>
            <p className="text-sm mt-1">右上の「追加」ボタンから収支を記録しましょう</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">日付</th>
                <th className="px-6 py-3 text-left">カテゴリ</th>
                <th className="px-6 py-3 text-left">説明</th>
                <th className="px-6 py-3 text-left">口座</th>
                <th className="px-6 py-3 text-right">金額</th>
                <th className="px-6 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2">
                      <span>{getCategoryIcon(t.category)}</span>
                      {getCategoryName(t.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                    {t.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {getAccountName(t.accountId)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "−"}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(t)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-6">
              {editingId ? "収支を編集" : "収支を追加"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">種別</label>
                  <select
                    value={form.type}
                    onChange={(e) => {
                      const newType = e.target.value as TransactionType;
                      const firstCat =
                        newType === "income"
                          ? incomeCategories[0]?.id
                          : expenseCategories[0]?.id;
                      setForm({ ...form, type: newType, category: firstCat ?? "" });
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">支出</option>
                    <option value="income">収入</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">日付</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">金額（円）</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.amount || ""}
                  onChange={(e) =>
                    setForm({ ...form, amount: parseInt(e.target.value, 10) || 0 })
                  }
                  placeholder="例: 5000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">カテゴリ</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currentCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">口座</label>
                <select
                  value={form.accountId}
                  onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">説明（任意）</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="メモ・備考"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "更新" : "追加"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
