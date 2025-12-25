import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Optimization config */
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-select", "@radix-ui/react-icons", "@radix-ui/react-tooltip"],
  },
};

export default nextConfig;
