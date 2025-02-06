import { ProductData } from "@/components/backend/table/TableActions";
import BreadCrumpComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";
import CategoryProducts from "@/components/frontend/products/CategoryProducts";
import Filters from "@/components/frontend/products/Filters";
import SimilarProcuts from "@/components/frontend/products/SimilarProcuts";
import { getData } from "@/lib/getData";

import React from "react";

interface catData {
  id: string;
  title: string;
  products: ProductData[];
  slug: string;
}
const page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { slug } = await params;
  const { sort = "asc", min = 0, max = "", page = 1 } = await searchParams;

  const categorie: catData = await getData(`/categorie/${slug}`);

  const products = await getData(
    `product?catId=${categorie.id}&pageNum=${page}&sort=${sort}&min=${min}&max=${max}`
  );

  return (
    <section className="max-w-[1200px] mx-auto">
      <BreadCrumpComponent links={[{ name: categorie.title }]} />
      <h1 className="text-3xl font-bold text-center mb-4 mt-8 capitalize">
        {categorie.title}
      </h1>

      <div className="grid grid-cols-12">
        {/*  filters */}
        <div className="col-span-12 md:col-span-4 mt-8">
          <Filters slug={slug} />
        </div>

        {/* product */}
        <div className={"col-span-12 md:col-span-8 p-8 "}>
          <CategoryProducts
            products={products}
            catId={categorie.id}
            pageSize={10}
          />
        </div>
      </div>

      <SimilarProcuts />
    </section>
  );
};

export default page;
