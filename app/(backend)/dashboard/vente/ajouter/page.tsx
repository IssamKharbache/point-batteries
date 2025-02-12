import PageHeader from "@/components/backend/UI/PageHeader";
import AddVenteForm from "@/components/backend/vente/AddVenteForm";
import { getData } from "@/lib/getData";
import React from "react";

const page = async () => {
  const products = await getData("/product");

  return (
    <section>
      <PageHeader name="Ajouter vente" />
      <AddVenteForm productsVente={products} />
    </section>
  );
};

export default page;
