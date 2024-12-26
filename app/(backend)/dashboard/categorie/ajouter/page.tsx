import AjouterCategorieForm from "@/components/backend/forms/AjouterCategorie";
import PageHeader from "@/components/backend/UI/PageHeader";
import React from "react";

const page = () => {
  return (
    <section>
      <PageHeader name="Ajouter categorie" />
      <div className="flex items-center justify-center">
        <AjouterCategorieForm />
      </div>
    </section>
  );
};

export default page;
