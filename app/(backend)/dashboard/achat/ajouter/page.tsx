import AddAchat from "@/components/backend/achat/AddAchat";
import { ProductData } from "@/components/backend/table/TableActions";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";

const page = async () => {
  const data: ProductData[] = await getData("/product");
  //getting the products that have isAchat true
  const filteredProduct = data.filter(
    (product) => product.isAchatProduct === true
  );
  return (
    <section>
      <PageHeader name="Les produit achat" />
      <AddAchat productsAchat={filteredProduct} />
    </section>
  );
};

export default page;
