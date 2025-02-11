import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "batteryshop.ma",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      // Apply no-store header only on sensitive pages like login
      {
        source: "/connecter", // or other sensitive pages
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      // Apply caching headers for public/static pages
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600", // Cache for 1 hour
          },
        ],
      },
      // Apply caching headers for other public pages (e.g., products, homepage)
      {
        source: "/categorie/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600", // Cache for 1 hour
          },
        ],
      },
      {
        source: "/produit/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600", // Cache for 1 hour
          },
        ],
      },
    ];
  },
};

export default nextConfig;
