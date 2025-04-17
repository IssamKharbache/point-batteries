"use client";

import React, { useEffect, useState } from "react";
import { Cost, Product } from "@prisma/client";
import BenificeCards from "./BenificeCards";
import BenificesGraphs from "./BenificesGraphs";
import RecentVentes from "./RecentVentes";
import { useBenificeStore } from "@/context/store";
import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import MonthYearSelector from "./MonthYearSelector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { getData } from "@/lib/getData";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";

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
  const [sales, setSales] = useState<VenteType[]>(initialSales);
  const [costs, setCosts] = useState<Cost[]>(initialCosts);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredSales, setFilteredSales] = useState<VenteType[]>([]);
  const [filteredCosts, setFilteredCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newSales, newCosts, newProducts] = await Promise.all([
        getData("/vente"), // Include returns for display purposes
        getData("/frais"),
        getData("/product/all"),
      ]);
      const filtereredNewProducts = newProducts.filter(
        (product: Product) => !product.isAchatProduct
      );
      setSales(newSales);
      setCosts(newCosts);
      setProducts(filtereredNewProducts);
      setFilteredSales(newSales);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Initial filtering based on props
    setFilteredSales(initialSales);
    setFilteredCosts(initialCosts);
  }, [initialSales, initialCosts]);

  useEffect(() => {
    if (isAllTime) {
      setFilteredSales(sales);
      setFilteredCosts(costs);
      return;
    }

    // Normal month/year filtering
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    lastDay.setHours(23, 59, 59, 999);

    const filteredSales = sales.filter((vente) => {
      const saleDate = new Date(vente.createdAt);
      return saleDate >= firstDay && saleDate <= lastDay;
    });

    const filteredCosts = costs.filter((cost) => {
      const costDate = new Date(cost.date);
      return costDate >= firstDay && costDate <= lastDay;
    });

    setFilteredSales(filteredSales);
    setFilteredCosts(filteredCosts);
  }, [selectedMonth, selectedYear, isAllTime, sales, costs]);

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

  // Calculate total stock value
  const totalStockValue = products.reduce(
    (acc, product) => acc + (product.achatPrice || 0) * (product.stock || 0),
    0
  );

  const creditSales = filteredSales.filter(
    (vente) => vente.paymentType === "ACREDIT"
  );
  const creditSalesTotal = creditSales.reduce(
    (sum, vente) =>
      sum +
      vente.products.reduce(
        (productSum, product) =>
          productSum + product.price * product.qty - product.discount,
        0
      ),
    0
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <MonthYearSelector />
        <Button onClick={fetchData} variant="outline" disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Actualisation..." : "Actualiser"}
        </Button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
        {isAllTime
          ? "Affichage de toutes les données historiques"
          : `Affichage des statistiques pour ${new Date(
              parseInt(selectedYear),
              parseInt(selectedMonth) - 1
            ).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`}
      </div>

      {loading ? (
        <LoadingButton />
      ) : (
        <>
          <BenificeCards
            grossBenefit={grossBenefit}
            netBenefit={netBenefit}
            totalCosts={totalCosts}
            creditSalesTotal={creditSalesTotal}
            creditSalesCount={creditSales.length}
          />
          <BenificesGraphs stockValue={totalStockValue} avgSale={avgSale} />
          <RecentVentes sales={filteredSales} />
        </>
      )}
    </>
  );
};

export default BenificeDashboard;
