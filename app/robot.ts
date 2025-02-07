import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://pointbatteries.com";
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/produit"],
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
