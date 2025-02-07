export const dynamic = "force-dynamic";

import { ProductData } from "@/components/backend/table/TableActions";
import BreadCrumpComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";
import CategoryProducts from "@/components/frontend/products/CategoryProducts";
import Filters from "@/components/frontend/products/Filters";
import SimilarProcuts from "@/components/frontend/products/SimilarProcuts";
import { getData } from "@/lib/getData";
import axios from "axios";
import React from "react";

interface catData {
  id: string;
  title: string;
  products: ProductData[];
  slug: string;
}
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const categorie: catData = await getData(`/categorie/${params.slug}`);
    const products = await getData(`/product?catId=${categorie.id}`);
    if (products?.length === 0) {
      return {
        title: "Not found",
        description: "The page you are looking for does not exists",
      };
    }
    return {
      openGraph: {
        title: products?.[0]?.title,
        description: products?.[0]?.description,
        images: products?.[0]?.imageUrl,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Not found",
      description: "The page you are looking for does not exists",
    };
  }
}

export async function generateStaticParams() {
  try {
    const res = await axios.get("https://www.pointbatteries.com/api/product");

    if (res.status !== 201) {
      throw new Error(`Failed to fetch products : ${res.statusText}`);
    }
    const products = res.data.data;
    if (products.length === 0) return [];

    return products.map((product: ProductData) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
const Page = async ({ params, searchParams }: Props) => {
  const slug = (await params).slug;
  const { sort = "asc", min = 0, max = "", page = 1 } = await searchParams;

  const categorie: catData = await getData(`/categorie/${slug}`);

  const products = await getData(
    `/product?catId=${categorie.id}&pageNum=${page}&sort=${sort}&min=${min}&max=${max}`
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

export default Page;
