export const dynamic = "force-dynamic";

import PageHeader from "@/components/backend/UI/PageHeader";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "@/lib/getData";
import { ProductData } from "@/components/backend/table/TableActions";

const page = async () => {
  const data: ProductData[] = await getData("/product/all");
  const filteredProducts = data.filter((product) => !product.isAchatProduct);

  return (
    <section>
      <PageHeader href="produit/ajouter" name="Tous les produits" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={filteredProducts} name="Produits" />
      </div>
    </section>
  );
};

export default page;
