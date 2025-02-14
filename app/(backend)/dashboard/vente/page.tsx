export const dynamic = "force-dynamic";

import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "@/lib/getData";

const page = async () => {
  const data = await getData("/vente");

  return (
    <section>
      <PageHeader name="Vente" href="vente/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name="Vente" />
      </div>
    </section>
  );
};

export default page;
