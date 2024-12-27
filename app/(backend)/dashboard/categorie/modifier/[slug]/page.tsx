import AjouterCategorieForm from "@/components/backend/forms/AjouterCategorie";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const categorie = await getData(`/categorie/${slug}`);

  return (
    <section>
      <PageHeader name="Ajouter categorie" />
      <div className="flex items-center justify-center">
        <AjouterCategorieForm categoryData={categorie} />
      </div>
    </section>
  );
};

export default page;
