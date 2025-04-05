import AddDevisForm from "@/components/backend/devis/AddDevisForm";
import { ProductData } from "@/components/backend/table/TableActions";
import PageHeader from "@/components/backend/UI/PageHeader";
import AddVenteForm from "@/components/backend/vente/AddVenteForm";
import { getData } from "@/lib/getData";
import React from "react";

const page = async () => {
  const products: ProductData[] = await getData("/product/all");
  const filterProducts = products.filter((product) => !product.isAchatProduct);

  return (
    <section>
      <PageHeader name="Ajouter devis" />
      <AddDevisForm productsVente={filterProducts} />
    </section>
  );
};

export default page;
