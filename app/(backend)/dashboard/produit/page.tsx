import PageHeader from "@/components/backend/UI/PageHeader";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "@/lib/getData";

const page = async () => {
  const data = await getData("/product");

  return (
    <section>
      <PageHeader href="produit/ajouter" name="Tous les produits" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name="Products" />
      </div>
    </section>
  );
};

export default page;
