export type TransactionType = "income" | "expense";
export type AccountType = "bank" | "savings" | "investment" | "cash" | "credit";

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  accountId: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface MonthlyReport {
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}
