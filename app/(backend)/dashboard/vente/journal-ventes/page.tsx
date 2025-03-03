import VenteJournal from "@/components/backend/vente/VenteJournal";
import { getData } from "@/lib/getData";
import React from "react";

const page = async () => {
  const ventes = await getData("/vente");

  return (
    <div>
      <VenteJournal ventes={ventes} />
    </div>
  );
};

export default page;
