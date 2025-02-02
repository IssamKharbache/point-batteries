import UpdateProductForm from "@/components/backend/forms/UpdateProductForm";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";

import React from "react";
import { CategorieData } from "../../ajouter/page";
interface PageParamsProps {
  params: {
    slug: string;
  };
}
export interface CategoryProduct {
  id: string;
  title: string;
}

export type ProductData = {
  productData: {
    id: string;
    title: string;
    capacite: number;
    categoryId: string;
    courantDessai: number;
    description: string;
    imageUrl: string;
    marque: string;
    price: number;
    stock: number;
    designationProduit: string;
    voltage: number;
    garantie: string;
    slug: string;
    imageKey: string;
  };
  categoryData: CategorieData;
};
const page = async ({ params }: PageParamsProps) => {
  const { slug } = await params;

  const product = await getData(`/product/${slug}`);
  const category = await getData(`/categorie`);

  return (
    <section>
      <PageHeader name="Modifier produit" />
      <div className="flex items-center justify-center mt-4">
        <UpdateProductForm productData={product} categoryData={category} />
      </div>
    </section>
  );
};

export default page;
