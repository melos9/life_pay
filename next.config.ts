import type { NextConfig } from "next";
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/life_pay" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // trailingSlash を false にすることで /guide/slug.html として出力され、
  // GitHub Pages がリダイレクトなしで直接 200 を返す。
  trailingSlash: false,
  images: { unoptimized: true },
  // クライアント側の Link がアセットパスを作る際に使う。
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
