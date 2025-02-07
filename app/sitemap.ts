import { ProductData } from "@/components/backend/table/TableActions";
import { getData } from "@/lib/getData";
export default async function sitemap() {
  const baseUrl = "https://pointbatteries.com";
  const products = await getData("/product");

  const progProducts = products.map((product: ProductData) => {
    return {
      url: `${baseUrl}/produit/${product.slug}`,
      lastModified: product.createdAt,
    };
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...progProducts,
  ];
}
