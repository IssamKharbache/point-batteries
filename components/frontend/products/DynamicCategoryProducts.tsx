"use client";
import { ProductData } from "@/components/backend/table/TableActions";
import axios from "axios";
import React from "react";
import useSWR from "swr";
import ProductCard from "./ProductCard";
import { Category } from "@prisma/client";
import { CategorieData } from "@/app/(backend)/dashboard/produit/ajouter/page";
import { getData } from "@/lib/getData";
import SectionHeader from "./SectionHeader";

// Axios-based fetcher
const fetcher = async (url: string) => await getData("/categorie");

const DynamicCategoryProducts = ({
  initialCategorieData,
}: {
  initialCategorieData: CategorieData;
}) => {
  const { data, mutate } = useSWR<CategorieData>("/api/categorie", fetcher, {
    fallbackData: initialCategorieData,
    refreshInterval: 10000,
    revalidateOnFocus: true,
  });

  const filteredCatData = data?.filter((cat) => cat.products.length > 2);

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
