"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  /** data-ad-slot 値（AdSense管理画面で発行） */
  slot: string;
  /** 広告フォーマット (auto, fluid, rectangle, etc.) */
  format?: string;
  /** レスポンシブ広告にする場合 true */
  responsive?: boolean;
  /** 追加の class（マージン等） */
  className?: string;
  /** style 上書き */
  style?: React.CSSProperties;
  /** 広告ラベルを表示するか（AdSense ポリシーで推奨） */
  showLabel?: boolean;
};

/**
 * Google AdSense 表示枠。
 * NEXT_PUBLIC_ADSENSE_CLIENT が未設定のときは、開発時の視認用プレースホルダーを描画する。
 */
export function AdSlot({
  slot,
  format = "auto",
  responsive = true,
  className = "",
  style,
  showLabel = true,
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense SDK 読み込み前 / 二重 push などは無視
    }
  }, [client, slot]);

  if (!client) {
    return (
      <div
        className={`my-6 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 text-xs flex items-center justify-center py-10 ${className}`}
        aria-hidden
      >
        広告枠（AdSense クライアントID未設定）
      </div>
    );
  }

  return (
    <div className={`my-6 ${className}`}>
      {showLabel && (
        <div className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
          広告
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
