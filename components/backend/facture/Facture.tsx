"use client";
import React, { useRef } from "react";

import Image from "next/image";
import { VenteProduct } from "@prisma/client";
import { formatFrenchDate } from "@/lib/utils/index";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
    nomDuCaissier,
  } = venteFacture;

  const { totalBeforeRemise, totalAfterRemise, totalRemise } = products.reduce(
    (acc, product) => {
      const validPrice = product.price || 0;
      const validQty = product.qty || 0;
      const remise = product.discount || 0;

      const productTotal = validPrice * validQty; // Total before remise for this product
      const productAfterRemise = productTotal - remise; // Total after remise for this product

      acc.totalBeforeRemise += productTotal; // Accumulate total before remise
      acc.totalAfterRemise += productAfterRemise; // Accumulate total after remise
      acc.totalRemise += remise; // Accumulate total remise

      return acc;
    },
    {
      totalBeforeRemise: 0, // Total before remise
      totalAfterRemise: 0, // Total after remise
      totalRemise: 0, // Total remise
    }
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
        Imprimer / Telecharger
        <Download />
      </Button>
      <div ref={contentRef} className="p-10 m-10 bg-white border-2 ">
        {/* Header */}
        <div className="flex justify-between gap-8">
          <div className="font-medium">
            <div className="capitalize ">
              <p>
                CLient : {clientNom} {clientPrenom}
              </p>
            </div>
            <div className="capitalize">Tel : {clientTel}</div>
            <p className="text-sm mb-4">
              Tanger, le {formatFrenchDate(createdAt)}
            </p>
            <div className="flex text-xl font-bold items-center gap-3">
              <h1>Facture n º </h1>
              <p>{factureCode}</p>
            </div>
          </div>
          <div className="mb-8">
            <Image
              src="/logopbsdark.png"
              alt="Company Logo"
              width={240}
              height={80}
              className="mx-auto"
            />
            <div className="text-xs mt-4 flex flex-col gap-3 font-medium">
              <p className="">
                {" "}
                131. Av Hafid Ibn Abdel bar B 94.R Lots Azahra N13 Souani
              </p>
              <p>Tanger - Maroc</p>
              <p>Tel : +212 656 307 044 </p>
              <p>Fix : +212 531 510 011</p>
            </div>
          </div>
        </div>
        <div>
          <Table className="border ">
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium border">
                  Designation
                </TableHead>
                <TableHead className="font-medium border">Qty</TableHead>
                <TableHead className="font-medium border">Prix</TableHead>
                <TableHead className="font-medium border">%Rem .</TableHead>
                <TableHead className="font-medium border">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venteFacture.products.map((product, idx) => (
                <TableRow key={idx}>
                  <TableCell>{product.designationProduit}</TableCell>
                  <TableCell className="border">{product.qty}</TableCell>
                  <TableCell className="border">{product.price}</TableCell>
                  <TableCell className="border">{product.discount}</TableCell>
                  <TableCell className="border">
                    {product.price &&
                      product.discount &&
                      product.price * product.qty - product.discount}{" "}
                    MAD
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-8">
            <div className="text-md font-semibold uppercase">
              <p>Arretee la presence facture a la somme :</p>
              <p>{totalAfterRemise.toFixed(2)} DH</p>
              <div className="flex items-center gap-2 text-md font-medium ">
                <p>Mode de paiment : </p>
                <p>{paymentType}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="border flex justify-between ">
                <span className="border-r p-2  text-start w-32">
                  Total avant remise
                </span>
                <span className="p-2 ">{totalBeforeRemise.toFixed(2)} DH</span>
              </div>
              <div className="border flex justify-between  ">
                <span className="border-r p-2  text-start w-32">
                  Total remise
                </span>
                <span className="p-2"> -{totalRemise.toFixed(2)} DH</span>
              </div>
              <div className="border flex justify-between font-bold gap-2">
                <span className="border-r p-2  text-start w-32">
                  Total après remise
                </span>
                <span className="p-2 ">{totalAfterRemise.toFixed(2)} DH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Facture;
