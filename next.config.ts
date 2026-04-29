import type { NextConfig } from "next";

// GitHub Pages で https://melos9.github.io/life_pay/ に公開するための設定。
// ローカル開発時に basePath を外したい場合は NEXT_PUBLIC_BASE_PATH="" npm run dev で上書きできる。
const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === "production" ? "/life_pay" : "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages は trailingSlash ありの方がサブパスでの index.html 配信が安定する。
  trailingSlash: true,
  images: { unoptimized: true },
  // クライアント側の Link がアセットパスを作る際に使う。
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
