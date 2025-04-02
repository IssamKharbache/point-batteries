import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BenificesGraphs = ({ avgSale }: { avgSale: number }) => {
  return (
    <>
      {/* Additional Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Average Sale Card */}
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

        {/* Monthly Trend Card */}
        {/* <Card className="border border-gray-200 rounded-lg shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tendance Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-400">
                [Graphique d'évolution à implémenter]
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </>
  );
};

export default BenificesGraphs;
