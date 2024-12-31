import AjouterProduit from "@/components/backend/forms/AjouterProduit";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";
interface PageParamsProps {
  params: {
    slug: string;
  };
}
const page = async ({ params }: PageParamsProps) => {
  const { slug } = await params;
  const product = await getData(`/product/${slug}`);
  console.log(product);

  return (
    <section>
      <PageHeader name="Modifier produit" />
      <div className="flex items-center justify-center mt-4">
        <AjouterProduit productData={product} />
      </div>
    </section>
  );
};

export default page;
