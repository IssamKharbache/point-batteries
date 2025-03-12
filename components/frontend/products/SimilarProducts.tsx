"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import { getData } from "@/lib/getData";
import { ProductData } from "@/components/backend/table/TableActions";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";
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
    <div className="m-8  xl:m-10">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full md:h-[500px] md:w-[500px]">
          <Loader2 className="animate-spin" size={45} />
        </div>
      ) : (
        <>
          <SectionHeader header="Produits similaire" />
          <ProductCard productsData={products} />
        </>
      )}
    </div>
  );
};

export default SimilarProducts;
