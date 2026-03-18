import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "kfc.lk" },
      { protocol: "https", hostname: "*.kfc.lk" },
      { protocol: "https", hostname: "pizzahut.lk" },
      { protocol: "https", hostname: "*.pizzahut.lk" },
      { protocol: "https", hostname: "adminsc.pizzahut.lk" },
      { protocol: "https", hostname: "phapis.pizzahut.lk" },
      { protocol: "https", hostname: "burgerking.lk" },
      { protocol: "https", hostname: "*.burgerking.lk" },
      { protocol: "https", hostname: "popeyes.com.lk" },
      { protocol: "https", hostname: "*.popeyes.com.lk" },
    ],
  },
};

export default nextConfig;
