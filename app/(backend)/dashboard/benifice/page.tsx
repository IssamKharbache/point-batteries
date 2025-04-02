import React from "react";
import { getData } from "@/lib/getData";
import BenificeDashboard from "@/components/backend/benifice/BenificeDashboard";
import { Product } from "@prisma/client";

const page = async () => {
  const sales = await getData("/vente");
  const costs = await getData("/frais");

  const products: Product[] = await getData("/product/all");
  const overallTotal = products.reduce(
    (acc, product) => (product.achatPrice ? acc + product.achatPrice : 0),
    0
  );

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Statistiques de vente</h1>
      <BenificeDashboard
        overallTotal={overallTotal}
        initialSales={sales}
        initialCosts={costs}
      />
    </section>
  );
};

export default page;
