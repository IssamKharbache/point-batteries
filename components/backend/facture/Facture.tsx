"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { VenteProduct } from "@prisma/client";
import { formatFrenchDate } from "@/lib/utils/index";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
        className="p-10 m-10 bg-white min-h-[95vh] flex flex-col justify-between max-w-full"
      >
        {/* Header Section */}
        <div>
          <div className="flex justify-between gap-8">
            {/* Client Details */}
            <div className="font-medium">
              <p>
                Client : {clientNom} {clientPrenom}
              </p>
              <p>Téléphone : {clientTel}</p>
              <p className="text-sm mb-4">
                Tanger, le {formatFrenchDate(createdAt)}
              </p>
              <div className="flex flex-col text-xl font-bold gap-3">
                <h1>Facture n º </h1>
                <p>{factureCode}</p>
              </div>
            </div>

            {/* Company Details */}
            <div className="mb-8">
              <Image
                src="/logopbsdark.png"
                alt="Company Logo"
                width={240}
                height={80}
                className="mx-auto"
              />
              <div className="text-xs mt-4 flex flex-col gap-3 font-medium">
                <p>131. Av Hafid Ibn Abdel bar B 94.R Lots Azahra N13 Souani</p>
                <p>Tanger - Maroc</p>
                <p>Tél : +212 656 307 044</p>
                <p>Fix : +212 531 510 011</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <Table className="w-full border-collapse">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="border border-black p-2 text-left font-bold">
                  Désignation
                </TableHead>
                <TableHead className="border border-black p-2 text-center font-bold">
                  Quantité
                </TableHead>
                <TableHead className="border border-black p-2 text-center font-bold">
                  Prix
                </TableHead>
                <TableHead className="border border-black p-2 text-center font-bold">
                  % Remise
                </TableHead>
                <TableHead className="border border-black p-2 text-right font-bold">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50">
                    <TableCell className="border border-black p-2 text-left">
                      {product.designationProduit}
                    </TableCell>
                    <TableCell className="border border-black p-2 text-center">
                      {product.qty}
                    </TableCell>
                    <TableCell className="border border-black p-2 text-center">
                      {product.price}
                    </TableCell>
                    <TableCell className="border border-black p-2 text-center">
                      {product.discount}
                    </TableCell>
                    <TableCell className="border border-black p-2 text-right">
                      {product.price &&
                        product.discount &&
                        (
                          product.price * product.qty -
                          product.discount
                        ).toFixed(2)}{" "}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="border border-black p-2 text-center h-64"
                  >
                    Aucun produit
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer Section */}
        <div className="mt-8">
          <div className="flex justify-between">
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
            <div className="text-right border border-black w-64">
              <div className="flex justify-between border-b border-black p-2">
                <span className="text-start">Total avant remise</span>
                <span>{totalBeforeRemise.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between border-b border-black p-2">
                <span className="text-start">Total remise</span>
                <span>-{totalRemise.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between font-bold p-2">
                <span className="text-start">Total après remise</span>
                <span>{totalAfterRemise.toFixed(2)} DH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facture;
