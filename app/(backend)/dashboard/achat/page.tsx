import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";
import { DataTable } from "../produit/data-table";
import { columns } from "../produit/columns";
import { ProductData } from "@/components/backend/table/TableActions";
import { getData } from "@/lib/getData";

const page = async () => {
  const data: ProductData[] = await getData("/product");
  const filteredProduct = data.filter(
    (product) => product.isAchatProduct === true
  );
  return (
    <section>
      <PageHeader name="Achat" href="achat/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable
          columns={columns}
          data={filteredProduct}
          name="Produits achat"
        />
      </div>
    </section>
  );
};

export default page;
