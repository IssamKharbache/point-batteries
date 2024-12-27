import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const page = async () => {
  const data = await getData("/categorie");

  return (
    <section>
      <PageHeader name="Categorie" href="categorie/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name="Categorie" />
      </div>
    </section>
  );
};

export default page;
