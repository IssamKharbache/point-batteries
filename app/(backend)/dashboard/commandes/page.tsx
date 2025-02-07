export const dynamic = "force-dynamic";

import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";
import TableComponent from "./Table";

const page = async () => {
  const data = await getData("/order");

  return (
    <section>
      <PageHeader name="Commandes" />
      <TableComponent data={data} />
    </section>
  );
};

export default page;
