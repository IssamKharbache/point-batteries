"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import { getData } from "@/lib/getData";
import { ProductData } from "@/components/backend/table/TableActions";
import ProductCard from "./ProductCard";
interface SimilarProcuts {
  marque: string;
}
const SimilarProducts = ({ marque }: SimilarProcuts) => {
  const [products, setProducts] = React.useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      const products = await getData(`/product/productByBrand/${marque}`);
      setProducts(products);
      setLoading(false);
    };
    getProducts();
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] p-10 lg:p-0 ">
      <SectionHeader header="Produits similaire" />
      <ProductCard productsData={products} />
    </div>
  );
};

export default SimilarProducts;
