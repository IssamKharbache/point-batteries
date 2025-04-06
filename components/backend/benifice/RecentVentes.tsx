import { formatDate } from "@/lib/utils/index";
import { Return } from "@prisma/client";
import React from "react";

interface RecentVente {
  id: string;
  userId: string | null;
  clientNom: string;
  clientPrenom: string;
  venteBenifits: number | null;
  returns: Return[];
  venteRef: string;
  createdAt: Date;
}

interface RecentVentesProps {
  sales: RecentVente[];
}

const RecentVentes = ({ sales }: RecentVentesProps) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Ventes</h2>
          <p className="text-md text-muted-foreground mb-5">
            {sales.length} Ventes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-200 w-5 h-5 rounded-lg" />
          <p>Avec Retour</p>
        </div>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Référence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bénéfice
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((vente) => (
              <tr
                key={vente.id}
                className={`hover:bg-gray-100 ${
                  vente.returns.length > 0
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {vente.venteRef}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vente.clientNom} {vente.clientPrenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(vente.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(vente.venteBenifits || 0).toFixed(2)} DH
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
          <div className="px-6 py-4 text-center text-sm text-gray-500">
            Aucune vente trouvée pour la période sélectionnée
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentVentes;
