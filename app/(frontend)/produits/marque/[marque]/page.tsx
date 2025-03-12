import FiltersCopy from "@/components/frontend/products/FiltersCopy";
import MarqueProductCard from "@/components/frontend/products/MarqueProductCard";
import { getData } from "@/lib/getData";

import React from "react";

type Props = {
  params: Promise<{ marque: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
const page = async ({ params, searchParams }: Props) => {
  const marque = (await params).marque;
  const { page = 1 } = await searchParams;
  const products = await getData(
    `/product/marque?marque=${marque}&page=${page}`
  );

  return (
    <section className="max-w-[1200px] mx-auto">
      {/* product */}
      <div className="w-full">
        <MarqueProductCard products={products} marque={marque} />
      </div>
    </section>
  );
};

export default page;
