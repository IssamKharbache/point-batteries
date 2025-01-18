import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const page = async () => {
  const data = await getData("/order");

  return (
    <section>
      <PageHeader name="Commandes" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name={"Commande"} />
      </div>
    </section>
  );
};

export default page;
