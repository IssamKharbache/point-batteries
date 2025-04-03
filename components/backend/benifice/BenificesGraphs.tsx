"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBenificeStore } from "@/context/store";

interface BenificesGraphsProps {
  avgSale: number;
  stockValue: number;
}

const BenificesGraphs = ({ avgSale, stockValue }: BenificesGraphsProps) => {
  const { isAllTime } = useBenificeStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Average Sale Card (unchanged) */}
      <Card className="border border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Vente Moyenne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgSale.toFixed(2)} DH</div>
          <p className="text-xs text-gray-500 mt-1">Par transaction</p>
        </CardContent>
      </Card>

      {/* Stock Value Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Stock numeraires
          </CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stockValue.toFixed(2)} DH</div>
          <p className="text-xs text-muted-foreground">
            {isAllTime
              ? "Valeur totale du stock"
              : "Valeur des produits du mois"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenificesGraphs;
