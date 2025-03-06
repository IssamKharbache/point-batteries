"use client";

import React from "react";
import useSWR from "swr";
import ProductCard from "./ProductCard";
import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";
import { getData } from "@/lib/getData";
import SectionHeader from "./SectionHeader";

// Axios-based fetcher
const fetcher = async () => await getData("/categorie");

const DynamicCategoryProducts = ({
  initialCategorieData,
}: {
  initialCategorieData: CategorieData;
}) => {
  const { data } = useSWR<CategorieData>("/api/categorie", fetcher, {
    fallbackData: initialCategorieData,
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const filteredCatData = data?.filter((cat) => cat.products.length >= 1);

  return (
    <div>
      {filteredCatData?.map((cat, idx) => (
        <div key={idx}>
          <SectionHeader
            isCategory={true}
            categoryTitle={cat.title}
            catSlug={cat.slug}
          />
          <ProductCard productsData={cat.products} categoryTitle={cat.title} />
        </div>
      ))}
    </div>
  );
};
export default DynamicCategoryProducts;
