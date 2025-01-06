import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const page = async () => {
  const data = await getData("/banner");
  return (
    <section>
      <PageHeader name="Bannière" href="banniere/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name="Bannière" />
      </div>
    </section>
  );
};

export default page;
