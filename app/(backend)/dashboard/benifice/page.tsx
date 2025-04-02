import React from "react";
import { getData } from "@/lib/getData";
import BenificeDashboard from "@/components/backend/benifice/BenificeDashboard";

const page = async () => {
  const sales = await getData("/vente");
  const costs = await getData("/frais");

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Statistiques de vente</h1>
      <BenificeDashboard initialSales={sales} initialCosts={costs} />
    </section>
  );
};

export default page;
