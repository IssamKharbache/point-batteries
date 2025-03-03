"use client";
import React, { useEffect } from "react";
import SectionHeader from "./SectionHeader";
import { getData } from "@/lib/getData";
import ProductCard from "./ProductCard";
import { ProductData } from "@/components/backend/table/TableActions";

const SimilarProcuts = () => {
  const [products, setProducts] = React.useState<ProductData[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const products = await getData(`/product`);
      setProducts(products);
    };
    getProducts();
  }, []);

  return (
    <div className="m-8 xl:m-0">
      <SectionHeader header="Produits similaire" />
      <ProductCard productsData={products} />
    </div>
  );
};

export default SimilarProcuts;
