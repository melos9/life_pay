"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "シミュレーター" },
  { href: "/how-to-use", label: "使い方" },
  { href: "/disclaimer", label: "免責事項" },
  { href: "/privacy-policy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader({ siteName }: { siteName: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="no-print border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm sm:text-base font-semibold text-zinc-900 hover:text-zinc-700 transition-colors truncate min-w-0"
        >
          {siteName}
        </Link>
        <nav className="hidden md:flex items-center justify-end gap-x-4 text-xs text-zinc-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-zinc-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden relative" ref={menuRef}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="site-mobile-nav"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <span aria-hidden className="inline-flex flex-col gap-[3px]">
              <span className="block w-4 h-[1.5px] bg-zinc-700" />
              <span className="block w-4 h-[1.5px] bg-zinc-700" />
              <span className="block w-4 h-[1.5px] bg-zinc-700" />
            </span>
            メニュー
          </button>
          {open && (
            <nav
              id="site-mobile-nav"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-200 bg-white shadow-lg p-2 text-sm text-zinc-700 z-50"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-zinc-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
