export const dynamic = "force-dynamic";

import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";

import CostsByMonth from "@/components/backend/frais/CostByMonth";

const page = async () => {
  return (
    <section>
      <PageHeader name="Frais" href="/dashboard/frais/ajouter" />
      <CostsByMonth />
    </section>
  );
};

export default page;
