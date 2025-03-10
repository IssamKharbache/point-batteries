import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "@/lib/getData";

const page = async () => {
  const data = await getData("/frais");

  return (
    <section>
      <PageHeader name="Frais" href="/dashboard/frais/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name={"Frais"} />
      </div>
    </section>
  );
};

export default page;
