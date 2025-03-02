import Filters from "@/components/frontend/products/Filters";
import MarqueProductCard from "@/components/frontend/products/MarqueProductCard";
import { getData } from "@/lib/getData";

import React from "react";

type Props = {
  params: Promise<{ marque: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
const page = async ({ params, searchParams }: Props) => {
  const marque = (await params).marque;
  const { sort = "asc", min = 0, max = "", page = 1 } = await searchParams;
  const products = await getData(
    `/product/marque?marque=${marque}&sort=${sort}&min=${min}&max=${max}&page=${page}`
  );

  return (
    <section className="max-w-[1200px] mx-auto">
      <div className="grid grid-cols-12">
        {/*  filters */}
        <div className="col-span-12 md:col-span-4 mt-8">
          <Filters marque={marque} />
        </div>

        {/* product */}
        <div className={"col-span-12 md:col-span-8 p-8 "}>
          <MarqueProductCard products={products} marque={marque} />
        </div>
      </div>
    </section>
  );
};

export default page;
