import AjouterBannerForm from "@/components/backend/forms/AjouterBannerForm";
import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";

const page = () => {
  return (
    <section>
      <PageHeader name="Ajouter Bannière" />
      <div className="flex items-center justify-center">
        <AjouterBannerForm />
      </div>
    </section>
  );
};

export default page;
