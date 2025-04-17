export const dynamic = "force-dynamic";
import AddAchat from "@/components/backend/achat/AddAchat";
import { ProductData } from "@/components/backend/table/TableActions";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";

const page = async () => {
  const data: ProductData[] = await getData("/product/all");

  return (
    <section>
      <PageHeader name="Les produit achat" />
      <AddAchat productsAchat={data} />
    </section>
  );
};

export default page;
