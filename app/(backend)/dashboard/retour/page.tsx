export const dynamic = "force-dynamic";

import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const page = async () => {
  const data = await getData("/retour");

  return (
    <section>
      <PageHeader href="retour/ajouter" name="Tous les Retours" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name="Retour" />
      </div>
    </section>
  );
};

export default page;
