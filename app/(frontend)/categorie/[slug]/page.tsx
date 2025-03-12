export const dynamic = "force-dynamic";

import { ProductData } from "@/components/backend/table/TableActions";
import BreadCrumpComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";
import CategoryProducts from "@/components/frontend/products/CategoryProducts";
import FiltersCopy from "@/components/frontend/products/FiltersCopy";
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

export async function generateMetadata({ params }: Props) {
  try {
    const slug = (await params).slug;
    const categorie: catData = await getData(`/categorie/${slug}`);

    const products = await getData(`/product?catId=${categorie.id}`);
    if (products?.length === 0) {
      return {
        title: "Not found",
        description: "The page you are looking for does not exists",
      };
    }
    const firstProduct = products[0];
    return {
      openGraph: {
        title: `${firstProduct.title} - Achat de batteries au Maroc`,
        description: `Achetez ${firstProduct.title} en ligne au meilleur prix au Maroc. Livraison rapide à Casablanca, Marrakech, Fès et dans tout le pays.`,
        keywords:
          `batterie ${categorie.title}, acheter batterie ${categorie.title}, batterie voiture ${categorie.title}, batterie moto ${categorie.title}, batterie électronique ${categorie.title}, batteries Maroc, batterie longue durée, batterie puissante, batterie haute performance, meilleure batterie au Maroc, batterie pas chère, batterie pour ${categorie.title}, ` +
          "بطارية سيارة المغرب, بطارية موتوسيكل المغرب, شراء بطارية اون لاين, أفضل بطاريات المغرب",
        openGraph: {
          title: `${firstProduct.title} - Batterie haute performance au Maroc`,
          description: `Découvrez ${firstProduct.title}, une batterie de qualité avec une longue durée de vie et des performances optimales.`,
          images: firstProduct.imageUrl,
          type: "product",
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      title: "Batterie non trouvée | Point Batteries Maroc",
      description:
        "Le produit recherché n'existe pas. Consultez nos batteries pour voitures, motos et équipements électroniques.",
      keywords:
        "batterie voiture Maroc, batterie moto Maroc, acheter batterie en ligne, batteries pas chères, batterie haute performance",
    };
  }
}

export async function generateStaticParams() {
  try {
    const res = await axios.get("https://www.pointbatteries.com/api/product");

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
  const { marque, page = 1 } = await searchParams;

  const categorie: catData = await getData(`/categorie/${slug}`);

  const products = await getData(
    `/product?catId=${categorie.id}&pageNum=${page}&marque=${marque}`
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
          <FiltersCopy slug={slug} />
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
    </section>
  );
};

export default Page;
