import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "kfc.lk" },
      { protocol: "https", hostname: "*.kfc.lk" },
      { protocol: "https", hostname: "pizzahut.lk" },
      { protocol: "https", hostname: "*.pizzahut.lk" },
      { protocol: "https", hostname: "burgerking.lk" },
      { protocol: "https", hostname: "*.burgerking.lk" },
      { protocol: "https", hostname: "popeyes.com.lk" },
      { protocol: "https", hostname: "*.popeyes.com.lk" },
      { protocol: "https", hostname: "tacobell.lk" },
      { protocol: "https", hostname: "*.tacobell.lk" },
    ],
  },
};

export default nextConfig;
