"use client";

import React, { useEffect, useState } from "react";
import { Cost, Vente } from "@prisma/client";
import BenificeCards from "./BenificeCards";
import BenificesGraphs from "./BenificesGraphs";
import RecentVentes from "./RecentVentes";
import MonthYearSelector from "./MonthYearSelector";
import { useBenificeStore } from "@/context/store";

interface BenificeDashboardProps {
  initialSales: Vente[];
  initialCosts: Cost[];
}

const BenificeDashboard = ({
  initialSales,
  initialCosts,
}: BenificeDashboardProps) => {
  const { selectedMonth, selectedYear } = useBenificeStore();
  const [filteredSales, setFilteredSales] = useState<Vente[]>([]);
  const [filteredCosts, setFilteredCosts] = useState<Cost[]>([]);

  useEffect(() => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const filterByMonthYear = (date: Date) => {
      const itemDate = new Date(date);
      return (
        itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year
      );
    };

    const sales = initialSales.filter((vente) =>
      filterByMonthYear(vente.createdAt)
    );
    const costs = initialCosts.filter((cost) => filterByMonthYear(cost.date));

    setFilteredSales(sales);
    setFilteredCosts(costs);
  }, [selectedMonth, selectedYear, initialSales, initialCosts]);

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
      <MonthYearSelector /> {/* Updated component name */}
      <BenificeCards
        grossBenefit={grossBenefit}
        netBenefit={netBenefit}
        salesCount={salesCount}
        totalCosts={totalCosts}
      />
      <BenificesGraphs avgSale={avgSale} />
      <RecentVentes sales={filteredSales} />
    </>
  );
};

export default BenificeDashboard;
