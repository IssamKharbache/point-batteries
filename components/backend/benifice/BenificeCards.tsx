import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BenificeCardProps {
  grossBenefit: number;
  netBenefit: number;
  totalCosts: number;
  creditSalesTotal: number;
  creditSalesCount: number;
}

const BenificeCards = ({
  grossBenefit,
  netBenefit,
  totalCosts,
  creditSalesTotal,
  creditSalesCount,
}: BenificeCardProps) => {
  const adjustedNetBenefit = netBenefit - creditSalesTotal;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full">
      {/* Gross Benefit Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-gray-500 truncate">
              Bénéfice Brut
            </CardTitle>
          </div>
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

      {/* Credit Sales Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-gray-500 truncate">
              Ventes à Crédit
            </CardTitle>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Montant total des ventes non encore payées</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate text-red-600">
            -{creditSalesTotal.toFixed(2)} DH
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            {creditSalesCount} vente(s) à crédit
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
          <div className="text-lg sm:text-xl lg:text-2xl font-bold truncate text-amber-600">
            {totalCosts.toFixed(2)} DH
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">Dépenses</p>
        </CardContent>
      </Card>

      {/* Adjusted Net Benefit Card */}
      <Card className="min-w-0 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 px-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-gray-500 truncate">
              Bénéfice Net
            </CardTitle>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Après déduction des frais et des ventes à crédit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div
            className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${
              adjustedNetBenefit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {adjustedNetBenefit.toFixed(2)} DH
          </div>
          <p className="text-xs text-gray-500 mt-1 truncate">
            Bénéfice disponible
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BenificeCards;
