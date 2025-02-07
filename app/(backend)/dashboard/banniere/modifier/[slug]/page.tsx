import AjouterBannerForm from "@/components/backend/forms/AjouterBannerForm";
import PageHeader from "@/components/backend/UI/PageHeader";
import { getData } from "@/lib/getData";
import React from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const bannerData = await getData(`/banner/${slug}`);

  return (
    <section>
      <PageHeader name="Ajouter categorie" />
      <div className="flex items-center justify-center">
        <AjouterBannerForm bannerData={bannerData} />
      </div>
    </section>
  );
};

export default page;
