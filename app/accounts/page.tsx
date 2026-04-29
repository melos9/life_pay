"use client";

import { startTransition, useEffect, useState } from "react";
import {
  getAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  formatCurrency,
  generateId,
  getAccountTypeLabel,
} from "@/lib/storage";
import { Account, AccountType } from "@/lib/types";

const ACCOUNT_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const EMPTY_FORM: Omit<Account, "id"> = {
  name: "",
  type: "bank",
  balance: 0,
  color: ACCOUNT_COLORS[0],
};

const ACCOUNT_TYPE_OPTIONS: { value: AccountType; label: string; icon: string }[] = [
  { value: "bank", label: "銀行口座", icon: "🏦" },
  { value: "savings", label: "貯蓄口座", icon: "💰" },
  { value: "investment", label: "投資口座", icon: "📈" },
  { value: "cash", label: "現金", icon: "💵" },
  { value: "credit", label: "クレジット", icon: "💳" },
];

function getAccountIcon(type: AccountType): string {
  return ACCOUNT_TYPE_OPTIONS.find((o) => o.value === type)?.icon ?? "🏦";
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Account, "id">>(EMPTY_FORM);

  const load = () => {
    startTransition(() => {
      setAccounts(getAccounts());
    });
  };

  useEffect(() => {
    load();
  }, []);

  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (a: Account) => {
    setEditingId(a.id);
    setForm({ name: a.name, type: a.type, balance: a.balance, color: a.color });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateAccount({ ...form, id: editingId });
    } else {
      addAccount({ ...form, id: generateId() });
    }
    setShowForm(false);
    load();
  };

  const handleDelete = (id: string) => {
    if (confirm("この口座を削除しますか？")) {
      deleteAccount(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">資産口座</h2>
          <p className="text-gray-500 mt-1">口座・資産の管理</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          ＋ 口座追加
        </button>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl p-6 text-white">
        <p className="text-blue-100 text-sm">総資産</p>
        <p className="text-4xl font-bold mt-1">{formatCurrency(totalAssets)}</p>
        <p className="text-blue-100 text-sm mt-2">{accounts.length}口座</p>
      </div>

      {/* Account List */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
          <p className="text-5xl mb-3">🏦</p>
          <p className="text-lg">口座がありません</p>
          <p className="text-sm mt-1">右上の「口座追加」ボタンから口座を追加しましょう</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((acc) => {
            const pct = totalAssets > 0 ? Math.max(0, (acc.balance / totalAssets) * 100) : 0;
            return (
              <div
                key={acc.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: acc.color + "22" }}
                    >
                      {getAccountIcon(acc.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{acc.name}</p>
                      <p className="text-xs text-gray-500">{getAccountTypeLabel(acc.type)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(acc)}
                      className="text-xs text-blue-500 hover:text-blue-700"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-3">
                  {formatCurrency(acc.balance)}
                </p>
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: acc.color }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{pct.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-6">
              {editingId ? "口座を編集" : "口座を追加"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">口座名</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例: 三菱UFJ銀行"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">種別</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as AccountType })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ACCOUNT_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.icon} {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">残高（円）</label>
                <input
                  type="number"
                  required
                  value={form.balance || ""}
                  onChange={(e) =>
                    setForm({ ...form, balance: parseFloat(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">カラー</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCOUNT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm({ ...form, color: c })}
                      className={`w-8 h-8 rounded-full transition-transform ${form.color === c ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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
