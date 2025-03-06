import Facture from "@/components/backend/facture/Facture";
import { getData } from "@/lib/getData";
import React from "react";

interface PageProps {
  params: Promise<{ factureCode: string }>;
}
const page = async ({ params }: PageProps) => {
  const { factureCode } = await params;

  const venteFacture = await getData(`/facture/${factureCode}`);

  return (
    <div>
      <Facture venteFacture={venteFacture} />
    </div>
  );
};

export default page;
