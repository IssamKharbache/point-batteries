import AddCostForm from "@/components/backend/frais/AddCostForm";
import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";

const page = () => {
  return (
    <section className="flex flex-col items-center justify-center h-full mt-8">
      <PageHeader name="Frais" />
      <div className="mt-8">
        <AddCostForm />
      </div>
    </section>
  );
};

export default page;
