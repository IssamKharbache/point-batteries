import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Printer } from "lucide-react";
import React, { useEffect, useState } from "react";
import { formatISODate } from "../vente/BonDeLivraison";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { formatFrenchDate } from "@/lib/utils/index";
import { getData } from "@/lib/getData";

export type ReturnProduct = {
  productId: string;
  qty: number;
  designationProduit: string;
  marque: string;
  refProduct: string;
};

export type ReturnType = {
  id: string;
  userId: string;
  returnRef: string;
  nomDuCaissier: string;
  returnFrom: string;
  products: ReturnProduct[];
  sourceId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

interface BonDeRetourProps {
  rowData: ReturnType;
}
const BonDeRetour = ({ rowData }: BonDeRetourProps) => {
  const [venteRef, setVenteRef] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `${rowData.returnRef}_Bon_de_retour`,
  });

  useEffect(() => {
    const getVenteRef = async () => {
      if (rowData.sourceId === null) return;
      const vente = await getData(`/vente/${rowData.sourceId}`);

      if (vente) {
        setVenteRef(vente.venteRef);
      }
    };
    getVenteRef();
  }, []);

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="rounded-2xl">
        Bon de retour
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="text-start m-3">
            <DialogTitle>Bon de Retour</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-8 p-5">
            <h1 className="text-xl">
              Reference :{" "}
              <span className="font-semibold">{rowData.returnRef}</span>
            </h1>
            <Button
              onClick={() => reactToPrintFn()}
              className="py-2 rounded text-sm"
            >
              <Printer size={20} />
              Imprimer / Télécharger
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div ref={contentRef} className="p-5 hidden print:block">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold uppercase">Bon de retour</h1>
          <Image
            src="/logopbsdark.png"
            alt="Company Logo"
            width={240}
            height={80}
            className="mx-auto mb-12"
          />
        </div>

        {/* Company Info */}
        <div className="flex items-start justify-between mt-5">
          {/* Left Side */}
          <div className="flex flex-col gap-3">
            <div>
              <h1 className="font-bold mb-1">Point Batteries Service</h1>
              <p className="text-sm">131.Av Hafid ibn abdel bar B 94</p>
              <p className="text-sm">R Lots Azahra Nº13 Souani Tanger</p>
              <p className="text-sm">
                <span className="font-bold">Téléphone : </span> 0656307044
              </p>
            </div>
            <div className="text-sm mt-4">
              <p>
                <span className="font-bold">Bon de retour Nº :</span>{" "}
                {rowData.returnRef}
              </p>
              <p>
                <span className="font-bold">Date : </span>
                {formatFrenchDate(rowData.createdAt)}
              </p>
              {venteRef ? (
                <p>
                  <span className="font-bold">Reference vente: </span>
                  {venteRef}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex justify-between">
          <p></p>
          <div className="text-sm">
            <p className="font-bold">A : CASANORD SERVICES BATTERIE</p>
            <p>
              <span className="font-bold">Adresse : </span>268, rue al mahata
              derb el kabir
            </p>
            <p>Casablanca</p>
            <p className="mt-1">
              <span className="font-bold">Téléphone : </span> 0661337296
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="mt-8">
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-600 p-2 text-left">
                  Référence
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Désignation
                </th>
                <th className="border border-gray-600 p-2 text-left">
                  Quantité
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Map through the products and display them in the table */}
              {rowData.products.map((product, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-600 p-2">
                    {product.refProduct}
                  </td>
                  <td className="border border-gray-600 p-2">
                    {product.designationProduit}
                  </td>
                  <td className="border border-gray-600 p-2">{product.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature Line */}
        <div className="mt-16 flex flex-col items-end">
          <div className="w-64 "></div>
          <div className="text-sm italic text-gray-600 mr-8">
            <p className="text-center mt-6 ">Signature</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BonDeRetour;
