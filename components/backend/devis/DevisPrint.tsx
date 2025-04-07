"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Devis, DevisProduct } from "@prisma/client";
import { formatFrenchDate } from "@/lib/utils/index";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface ProductDetails {
  designationProduit: string;
  refProduct: string;
}

interface DevisPrintProps {
  devis: Devis & {
    products?: Array<DevisProduct & { product: ProductDetails }>;
  };
  onClose: () => void;
}

const DevisPrint = ({ devis, onClose }: DevisPrintProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    devisRef,
    clientNom,
    clientPrenom,
    clientTel,
    createdAt,
    products = [],
  } = devis;

  // Calculate total TTC (price × quantity for all products)
  const totalTTC = products.reduce(
    (sum, product) => sum + (product.price || 0) * product.qty,
    0
  );

  // Calculate HT and TVA (assuming 20% TVA rate)
  const montantHT = totalTTC / 1.2;
  const montantTVA = totalTTC - montantHT;

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Devis_${devisRef}`,
    onAfterPrint: onClose,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!products) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-bold mb-4">Erreur</h2>
          <p className="mb-4">
            Les produits du devis n'ont pas pu être chargés
          </p>
          <Button onClick={onClose}>Fermer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-xl">
        <div className="p-4 sticky top-0 bg-white border-b flex justify-between items-center no-print">
          <h2 className="text-xl font-bold">Prévisualisation du Devis</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => handlePrint()}
              className="flex items-center gap-2"
              size="sm"
            >
              <Download size={16} />
              Imprimer
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
              className="flex items-center gap-2"
            >
              <X size={16} />
              Fermer
            </Button>
          </div>
        </div>

        <div ref={contentRef} className="p-8">
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
                  <span className="font-bold">
                    {formatFrenchDate(createdAt)}
                  </span>
                </p>
                <div className="flex text-md gap-3">
                  <h1>Devis n° : </h1>
                  <p className="font-bold">{devisRef}</p>
                </div>
              </div>

              {/* Company Details */}
              <div className="mb-8">
                <div className="text-md mt-4 flex flex-col gap-3 font-medium">
                  <p>
                    131. Av Hafid Ibn Abdel bar B 94.R Lots Azahra N13 Souani
                  </p>
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
                    PU (TTC)
                  </th>
                  <th className="border border-gray-300 p-2 text-center font-bold">
                    TOTAL (TTC)
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
                        {product.price?.toFixed(2)} DH
                      </td>
                      <td className="border border-gray-300 p-2 text-center">
                        {((product.price || 0) * product.qty).toFixed(2)} DH
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
          <div className="mt-24">
            <div className="flex items-center justify-between gap-12">
              {/* Payment Details */}
              <div className="text-md font-semibold uppercase">
                <p>Arrêtée le présent devis à la somme de :</p>
                <p>{totalTTC.toFixed(2)} DH</p>
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
                    {montantHT.toFixed(2)} DH
                  </p>
                  <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                    {montantTVA.toFixed(2)} DH
                  </p>
                  <p className="font-semibold flex flex-col border-2 border-black rounded-2xl p-2  text-center w-28">
                    {totalTTC.toFixed(2)} DH
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisPrint;
