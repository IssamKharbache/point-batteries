import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BenificeCardProps {
  grossBenefit: number;
  netBenefit: number;
  totalCosts: number;
  salesCount: number;
}

const BenificeCards = ({
  grossBenefit,
  netBenefit,
  totalCosts,
  salesCount,
}: BenificeCardProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
      {/* Gross Benefit Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm font-medium text-gray-500 truncate">
            Bénéfice Brut
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
            {grossBenefit.toFixed(2)} DH
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            Bénéfice des ventes
          </p>
        </CardContent>
      </Card>

      {/* Total Costs Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm font-medium text-gray-500 truncate">
            Frais Totaux
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
            {totalCosts.toFixed(2)} DH
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">Dépenses</p>
        </CardContent>
      </Card>

      {/* Net Benefit Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm font-medium text-gray-500 truncate">
            Bénéfice Net
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div
            className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${
              netBenefit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netBenefit.toFixed(2)} DH
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            Après déduction des frais
          </p>
        </CardContent>
      </Card>

      {/* Sales Count Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <CardTitle className="text-sm font-medium text-gray-500 truncate">
            Nombre de Ventes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
            {salesCount}
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            Total des ventes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenificeCards;
