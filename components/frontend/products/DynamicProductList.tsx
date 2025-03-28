// components/DynamicProductList.tsx
"use client";

import useSWR from "swr";
import axios from "axios"; // Import Axios
import { ProductData } from "@/components/backend/table/TableActions";
import ProductCard from "@/components/frontend/products/ProductCard";
import SectionHeader from "./SectionHeader";

// Axios-based fetcher
const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

export default function DynamicProductList({
  initialProducts,
}: {
  initialProducts: ProductData[];
}) {
  const { data } = useSWR("/api/product", fetcher, {
    fallbackData: initialProducts,
    refreshInterval: 10000, // Revalidate every 10 seconds
    revalidateOnFocus: true,
  });

  const products = data;

  // Ensure `bestSelledProducts` is always an array
  const bestSelledProducts =
    products?.filter(
      (product: ProductData) => product.vente >= 5 && !product.isAchatProduct
    ) || []; // Fallback to an empty array if `products` is undefined
  if (bestSelledProducts.length === 0) return null;
  return (
    <div>
      <SectionHeader header="Meilleures Ventes" />
      <ProductCard productsData={bestSelledProducts} />;
    </div>
  );
}
