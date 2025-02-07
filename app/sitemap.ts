import { ProductData } from "@/components/backend/table/TableActions";
import { getData } from "@/lib/getData";
import { Category } from "@prisma/client";
export default async function sitemap() {
  const baseUrl = "https://pointbatteries.com";
  const products = await getData("/product");
  const cat = await getData("/categorie");

  const progProducts = products.map((product: ProductData) => {
    return {
      url: `${baseUrl}/produit/${product.slug}`,
      lastModified: product.createdAt,
    };
  });

  const progCat = cat.map((cat: Category) => {
    return {
      url: `${baseUrl}/categorie/${cat.slug}`,
      lastModified: cat.createdAt,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...progProducts,
    ...progCat,
  ];
}
