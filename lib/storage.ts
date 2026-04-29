import { Transaction, Account, Category } from "./types";

const TRANSACTIONS_KEY = "life_pay_transactions";
const ACCOUNTS_KEY = "life_pay_accounts";
const CATEGORIES_KEY = "life_pay_categories";

// Default categories
export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: "salary", name: "給与", type: "income", color: "#10b981", icon: "💼" },
  { id: "bonus", name: "賞与", type: "income", color: "#059669", icon: "🎁" },
  { id: "investment_income", name: "投資収益", type: "income", color: "#0d9488", icon: "📈" },
  { id: "side_job", name: "副業", type: "income", color: "#0891b2", icon: "💻" },
  { id: "other_income", name: "その他収入", type: "income", color: "#6366f1", icon: "💰" },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: "food", name: "食費", type: "expense", color: "#ef4444", icon: "🍽️" },
  { id: "housing", name: "住居費", type: "expense", color: "#f97316", icon: "🏠" },
  { id: "transport", name: "交通費", type: "expense", color: "#eab308", icon: "🚃" },
  { id: "utilities", name: "光熱費", type: "expense", color: "#f59e0b", icon: "💡" },
  { id: "entertainment", name: "娯楽費", type: "expense", color: "#8b5cf6", icon: "🎮" },
  { id: "clothing", name: "衣類", type: "expense", color: "#ec4899", icon: "👗" },
  { id: "health", name: "医療・健康", type: "expense", color: "#06b6d4", icon: "🏥" },
  { id: "education", name: "教育", type: "expense", color: "#3b82f6", icon: "📚" },
  { id: "communication", name: "通信費", type: "expense", color: "#64748b", icon: "📱" },
  { id: "insurance", name: "保険", type: "expense", color: "#78716c", icon: "🛡️" },
  { id: "other_expense", name: "その他支出", type: "expense", color: "#9ca3af", icon: "📦" },
];

export const DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_INCOME_CATEGORIES,
  ...DEFAULT_EXPENSE_CATEGORIES,
];

// Default accounts
export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "main_bank", name: "メインバンク", type: "bank", balance: 0, color: "#3b82f6" },
  { id: "savings", name: "貯蓄口座", type: "savings", balance: 0, color: "#10b981" },
  { id: "cash", name: "現金", type: "cash", balance: 0, color: "#f59e0b" },
];

function isClient(): boolean {
  return typeof window !== "undefined";
}

// Transactions
export function getTransactions(): Transaction[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(transactions: Transaction[]): void {
  if (!isClient()) return;
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction): void {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
}

export function updateTransaction(updated: Transaction): void {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === updated.id);
  if (index !== -1) {
    transactions[index] = updated;
    saveTransactions(transactions);
  }
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions().filter((t) => t.id !== id);
  saveTransactions(transactions);
}

// Accounts
export function getAccounts(): Account[] {
  if (!isClient()) return [];
  const data = localStorage.getItem(ACCOUNTS_KEY);
  if (!data) {
    saveAccounts(DEFAULT_ACCOUNTS);
    return DEFAULT_ACCOUNTS;
  }
  return JSON.parse(data);
}

export function saveAccounts(accounts: Account[]): void {
  if (!isClient()) return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function addAccount(account: Account): void {
  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);
}

export function updateAccount(updated: Account): void {
  const accounts = getAccounts();
  const index = accounts.findIndex((a) => a.id === updated.id);
  if (index !== -1) {
    accounts[index] = updated;
    saveAccounts(accounts);
  }
}

export function deleteAccount(id: string): void {
  const accounts = getAccounts().filter((a) => a.id !== id);
  saveAccounts(accounts);
}

// Categories
export function getCategories(): Category[] {
  if (!isClient()) return DEFAULT_CATEGORIES;
  const data = localStorage.getItem(CATEGORIES_KEY);
  if (!data) {
    saveCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  }
  return JSON.parse(data);
}

export function saveCategories(categories: Category[]): void {
  if (!isClient()) return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// Utility functions
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getAccountTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    bank: "銀行口座",
    savings: "貯蓄口座",
    investment: "投資口座",
    cash: "現金",
    credit: "クレジット",
  };
  return labels[type] || type;
}

// Compute total assets from accounts
export function computeTotalAssets(accounts: Account[]): number {
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}
