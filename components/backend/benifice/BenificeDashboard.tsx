"use client";

import React, { useEffect, useState } from "react";
import { Cost, Product, Vente } from "@prisma/client";
import BenificeCards from "./BenificeCards";
import BenificesGraphs from "./BenificesGraphs";
import RecentVentes from "./RecentVentes";
import { useBenificeStore } from "@/context/store";
import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import MonthYearSelector from "./MonthYearSelector";

interface BenificeDashboardProps {
  initialSales: VenteType[];
  initialCosts: Cost[];
  initialProducts: Product[];
}

const BenificeDashboard = ({
  initialSales,
  initialCosts,
  initialProducts,
}: BenificeDashboardProps) => {
  const { selectedMonth, selectedYear, isAllTime } = useBenificeStore();
  const [filteredSales, setFilteredSales] = useState<VenteType[]>([]);
  const [filteredCosts, setFilteredCosts] = useState<Cost[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [overallTotal, setOverallTotal] = useState(0);

  useEffect(() => {
    if (isAllTime) {
      // Show all data when "All Time" is selected
      setFilteredSales(initialSales);
      setFilteredCosts(initialCosts);
      setFilteredProducts(initialProducts);

      // Calculate all-time stock value
      const total = initialProducts.reduce(
        (acc, product) =>
          acc + (product.achatPrice || 0) * (product.stock || 0),
        0
      );
      setOverallTotal(total);
      return;
    }

    // Normal month/year filtering
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    lastDay.setHours(23, 59, 59, 999);

    // Filter sales
    const sales = initialSales.filter((vente) => {
      const saleDate = new Date(vente.createdAt);
      return saleDate >= firstDay && saleDate <= lastDay;
    });

    // Filter costs
    const costs = initialCosts.filter((cost) => {
      const costDate = new Date(cost.date);
      return costDate >= firstDay && costDate <= lastDay;
    });

    // Filter products
    const products = initialProducts.filter((product) => {
      if (!product.createdAt) return false;
      const productDate = new Date(product.createdAt);
      return productDate >= firstDay && productDate <= lastDay;
    });

    // Calculate total stock value
    const total = products.reduce(
      (acc, product) => acc + (product.achatPrice || 0) * (product.stock || 0),
      0
    );

    setFilteredSales(sales);
    setFilteredCosts(costs);
    setFilteredProducts(products);
    setOverallTotal(total);
  }, [
    selectedMonth,
    selectedYear,
    isAllTime,
    initialSales,
    initialCosts,
    initialProducts,
  ]);

  // Calculate statistics
  const grossBenefit = filteredSales.reduce(
    (sum, vente) => sum + (vente.venteBenifits || 0),
    0
  );

  const totalCosts = filteredCosts.reduce(
    (sum, cost) => sum + (cost.montant || 0),
    0
  );

  const netBenefit = grossBenefit - totalCosts;
  const salesCount = filteredSales.length;
  const avgSale = salesCount > 0 ? grossBenefit / salesCount : 0;

  return (
    <>
      <MonthYearSelector />

      <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
        {isAllTime
          ? "Affichage de toutes les données historiques"
          : `Affichage des statistiques pour ${new Date(
              parseInt(selectedYear),
              parseInt(selectedMonth) - 1
            ).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`}
      </div>

      <BenificeCards
        grossBenefit={grossBenefit}
        netBenefit={netBenefit}
        salesCount={salesCount}
        totalCosts={totalCosts}
      />

      <BenificesGraphs stockValue={overallTotal} avgSale={avgSale} />
      <RecentVentes sales={filteredSales} />
    </>
  );
};

export default BenificeDashboard;
