import AjouterAdminForm from "@/components/backend/forms/AjouterAdminForm";
import React from "react";

const page = () => {
  return (
    <section className="flex items-center justify-center min-h-[750px] px-4 w-full ">
      <AjouterAdminForm role="CAISSIER" />
    </section>
  );
};

export default page;
