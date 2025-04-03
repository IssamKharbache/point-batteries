import React from "react";
import { getData } from "@/lib/getData";
import BenificeDashboard from "@/components/backend/benifice/BenificeDashboard";
import { Product } from "@prisma/client";
import { VenteType } from "../vente/columns";

const page = async () => {
  const sales: VenteType[] = await getData("/vente");
  const costs = await getData("/frais");

  const salesWithNoReturns = sales.filter(
    (vente) => Array.isArray(vente?.returns) && vente.returns.length === 0
  );
  const products: Product[] = await getData("/product/all");

  return (
    <section className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Statistiques de vente</h1>
      <BenificeDashboard
        initialSales={salesWithNoReturns}
        initialCosts={costs}
        initialProducts={products}
      />
    </section>
  );
};

export default page;
