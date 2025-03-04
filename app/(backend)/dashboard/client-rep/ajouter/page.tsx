import AjouterClientRep from "@/components/backend/forms/AjouterClientRep";
import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";

const page = () => {
  return (
    <section className="flex flex-col items-center justify-center h-full mt-8">
      <PageHeader name="Client repititive" />
      <div className="mt-8">
        <AjouterClientRep />
      </div>
    </section>
  );
};

export default page;
