export const dynamic = "force-dynamic";
import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "@/lib/getData";
import AchatProductsDetailsDialog from "@/components/backend/dialog/AchatProductsDetailsDialog";

const page = async () => {
  const data = await getData("/achat");
  return (
    <section>
      <PageHeader name="Les achats" href="/dashboard/achat/ajouter" />
      <div className="container mx-auto py-10 ">
        <DataTable columns={columns} data={data} name={"Achats"} />
      </div>
      <AchatProductsDetailsDialog />
    </section>
  );
};

export default page;
