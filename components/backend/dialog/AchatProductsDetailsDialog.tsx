"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductAchatDialogStore } from "@/context/store";
import { Download } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";

const AchatProductsDetailsDialog = () => {
  const { open, setOpen, products, refAchat, date } =
    useProductAchatDialogStore();

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Achat_${refAchat}_${formatPrismaDate(date)}`,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg max-w-6xl">
        <DialogHeader className="text-start">
          <DialogTitle>Détails de l'achat</DialogTitle>
          <DialogDescription>
            Voir plus de détails sur l'achat, imprimer ou télécharger aussi
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button
            onClick={() => reactToPrintFn()}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Imprimer / Télécharger
          </Button>
        </div>

        <div ref={contentRef} className="p-8 bg-white rounded-lg">
          {/* Header Section */}
          <div className="mb-8">
            <Image
              src="/logopbsdark.png"
              alt="Company Logo"
              width={240}
              height={80}
              className="mx-auto mb-8"
            />

            <div className="flex justify-between items-start">
              <div className="font-medium">
                <p className="text-sm mb-4">
                  Tanger, le{" "}
                  <span className="font-bold">{formatPrismaDate(date)}</span>
                </p>
                <div className="flex gap-2 text-md">
                  <h1>Référence achat :</h1>
                  <p className="font-bold">{refAchat}</p>
                </div>
              </div>

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
                  QUANTITÉ
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
                      {product.quantity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="border border-gray-300 p-2 text-center h-64"
                  >
                    Aucun produit trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchatProductsDetailsDialog;

function formatPrismaDate(isoDate: Date | string) {
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const days = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  const date = new Date(isoDate);
  const dayNumber = date.getDate();
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayNumber} ${dayName} ${monthName} ${year}`;
}
