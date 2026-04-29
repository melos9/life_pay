"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "🏠" },
  { href: "/transactions", label: "収支記録", icon: "💹" },
  { href: "/accounts", label: "資産口座", icon: "🏦" },
  { href: "/reports", label: "月次レポート", icon: "📊" },
  { href: "/forecast", label: "予測ツール", icon: "🔮" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-blue-600">💰 LifePay</h1>
        <p className="text-xs text-gray-500 mt-1">個人資産管理</p>
      </div>
      <ul className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
        あなたの生活に特化した資産管理
      </div>
    </nav>
  );
}
