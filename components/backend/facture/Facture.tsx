"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { VenteProduct } from "@prisma/client";
import { formatFrenchDate } from "@/lib/utils/index";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export interface Vente {
  id: string;
  userId: string;
  clientNom: string;
  clientPrenom: string;
  clientTel: string;
  nomDuCaissier: string;
  venteRef: string;
  paymentType: string;
  products: VenteProduct[];
  createdAt: Date;
  updatedAt: Date;
  generateFacture: boolean;
  ice: string;
  factureCode: string | null;
}

interface FactureProps {
  venteFacture: Vente;
}

const Facture = ({ venteFacture }: FactureProps) => {
  const {
    clientNom,
    clientPrenom,
    clientTel,
    createdAt,
    factureCode,
    products,
    paymentType,
  } = venteFacture;

  const { totalBeforeRemise, totalAfterRemise, totalRemise } = products.reduce(
    (acc, product) => {
      const validPrice = product.price || 0;
      const validQty = product.qty || 0;
      const remise = product.discount || 0;
      const productTotal = validPrice * validQty;
      const productAfterRemise = productTotal - remise;

      acc.totalBeforeRemise += productTotal;
      acc.totalAfterRemise += productAfterRemise;
      acc.totalRemise += remise;
      return acc;
    },
    { totalBeforeRemise: 0, totalAfterRemise: 0, totalRemise: 0 }
  );

  // Calculate Montant HT, TVA, and TTC
  const montantTTC = totalAfterRemise;
  const montantHT = montantTTC / 1.2;
  const montantTVA = montantTTC - montantHT;

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${venteFacture.factureCode}`,
  });

  return (
    <>
      <Button
        onClick={() => reactToPrintFn()}
        type="button"
        className="flex items-center justify-end mb-6 rounded"
      >
        Imprimer / Télécharger
        <Download />
      </Button>
      <div
        ref={contentRef}
        className="p-10 m-10 bg-white max-w-full  rounded-lg"
      >
        {/* Header Section */}
        <div>
          <Image
            src="/logopbsdark.png"
            alt="Company Logo"
            width={240}
            height={80}
            className="mx-auto mb-12"
          />
          <div className="flex justify-between gap-8">
            {/* Client Details */}
            <div className="font-medium">
              <p>
                Client :{" "}
                <span className="font-bold">
                  {clientNom} {clientPrenom}
                </span>
              </p>
              <p>
                Téléphone : <span className="font-bold">{clientTel}</span>
              </p>
              <p className="text-sm mb-4">
                Tanger, le{" "}
                <span className="font-bold">{formatFrenchDate(createdAt)}</span>
              </p>
              <div className="flex  text-md gap-3">
                <h1>Facture n º : </h1>
                <p className="font-bold">{factureCode}</p>
              </div>
              <div className="flex gap-2 text-md  mt-2">
                <h1>ICE : </h1>
                <p className="font-bold">{venteFacture.ice}</p>
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-8">
              <div className="text-xs mt-4 flex flex-col gap-3 font-medium">
                <p>131. Av Hafid Ibn Abdel bar B 94.R Lots Azahra N13 Souani</p>
                <p>Tanger - Maroc</p>
                <p>Tél : +212 656 307 044</p>
                <p>Fix : +212 531 510 011</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <table className="w-full border-collapse border border-gray-300 mt-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left font-bold">
                  REFERENCE
                </th>
                <th className="border border-gray-300 p-2 text-left font-bold">
                  DESIGNATION
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  QTE
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  PU.(TTC)
                </th>
                <th className="border border-gray-300 p-2 text-center font-bold">
                  MT (TTC)
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 text-left">
                      {product.refProduct}
                    </td>
                    <td className="border border-gray-300 p-2 text-left">
                      {product.designationProduit}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.qty}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {product.price?.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {(product.price && product.price * product.qty)?.toFixed(
                        2
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border border-gray-300 p-2 text-center h-64"
                  >
                    Aucun produit
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        {/* Footer Section */}
        <div className="mt-24">
          <div className="flex items-center justify-between gap-12">
            {/* Payment Details */}
            <div className="text-md font-semibold uppercase">
              <p>Arrêtée la présente facture à la somme de :</p>
              <p>{totalAfterRemise.toFixed(2)} DH</p>
              <div className="flex items-center gap-2 text-md font-medium">
                <p>Mode de paiement :</p>
                <p>{paymentType}</p>
              </div>
            </div>

            {/* Totals Section */}

            <div className="space-y-3">
              <div className="flex gap-3">
                <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                  Montant
                  <span>HT</span>
                </p>
                <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                  Montant
                  <span>TVA</span>
                </p>
                <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                  Montant
                  <span>TTC</span>
                </p>
              </div>
              <div className="flex gap-3">
                <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                  {montantHT.toFixed(2)}DH
                </p>
                <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                  {montantTVA.toFixed(2)}DH
                </p>
                <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                  {montantTTC.toFixed(2)}DH
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facture;
