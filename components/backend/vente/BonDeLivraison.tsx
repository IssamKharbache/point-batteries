import React, { useRef, useState } from "react";

import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { formatPrismaDate } from "../dialog/AchatProductsDetailsDialog";
import Image from "next/image";
import "@/app/styles/ticket.css";

interface BonDeLivraisonProps {
  rowData: VenteType;
}

const BonDeLivraison = ({ rowData }: BonDeLivraisonProps) => {
  const { clientNom, clientPrenom, products, paymentType } = rowData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { individualTotals, overallTotal } = products.reduce(
    (acc, product) => {
      const validPrice = product.price || 0;
      const validQty = product.qty || 0;
      const productTotal = validPrice * validQty;

      // Add individual product total to the array
      acc.individualTotals.push({
        productId: product.productId,
        total: productTotal,
      });

      // Add to the overall total
      acc.overallTotal += productTotal;

      return acc;
    },
    {
      individualTotals: [] as { productId: string; total: number }[],
      overallTotal: 0,
    }
  );

  const contentRef = useRef<HTMLInputElement | null>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Vente_${clientNom}_${formatPrismaDate(rowData.createdAt)}`,
    pageStyle: `@media print {
      @page {
        size: auto;
        margin: 0 !important;
  }
   body {
        width: 80mm !important; /* Fixed width */
        min-height: 50mm !important; /* Minimum height */
        margin: 0 auto !important; /* Center content */
        padding: 2mm !important;
        transform: scale(1); /* Disable scaling */
        transform-origin: top left;
      }
      .thermal-receipt {
        width: 80mm !important; 
        margin: 0 auto !important; 
        font-size: 9px;
        padding:15px;
      }
      /* Firefox Fix */
      @-moz-document url-prefix() {
        body { 
          width: 80mm !important;
          height: auto !important;
        }
      }
      /* Chrome/Safari Fix */
      @media print and (-webkit-min-device-pixel-ratio:0) {
        body {
          width: 80mm !important;
        }
      }
    }      
  `,
  });

  return (
    <>
      {/* Button to open the dialog */}
      <Button onClick={() => setIsDialogOpen(true)}>Bon de livraison</Button>

      {/* Dialog for the current row */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
      >
        <DialogContent>
          <DialogHeader className="text-start m-3">
            <DialogTitle>Bon de Livraison</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between items-center p-5">
            <h1 className="text-xl">
              Vente ref :{" "}
              <span className="font-semibold">{rowData.venteRef}</span>
            </h1>
            <Button
              onClick={() => reactToPrintFn()}
              className="py-2 rounded text-sm"
            >
              <Download size={20} />
              <span>Imprimer / Télécharger</span>
            </Button>
          </div>
          <div
            className="thermal-receipt"
            ref={contentRef}
            style={{ width: "80mm" }}
          >
            <div className="text-center mb-4 mt-8">
              <Image
                src="/logopbsdark.png"
                alt="Logo"
                width={300}
                height={100}
                className="mx-auto"
                style={{ maxWidth: "70mm" }}
              />
              <div className="mt-2 text-[10px]">
                <p>Adresse:....</p>
                <p>Tél: +212 600-000000</p>
              </div>
            </div>

            <div className="border-b border-black mb-2 pb-2">
              <div className="flex justify-between text-[9px]">
                <span>Date: {formatISODate(rowData.createdAt)}</span>
                <span>Ref: {rowData.venteRef}</span>
              </div>
              <div className="text-[9px] mt-1">
                Client: {clientNom} {clientPrenom}
              </div>
            </div>

            {/* Products Table */}
            <table className="w-full text-[9px] mb-4">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-1">Produit</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Prix UN</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody className="text-[8px]">
                {products.map((product, index) => (
                  <tr key={index} className="border-b border-dashed">
                    <td className="py-1">
                      {product.designationProduit.split(" ")[0]}
                    </td>
                    <td className="text-center py-1">{product.qty}</td>
                    <td className="text-right py-1">
                      {product.price?.toFixed(2)} DH
                    </td>
                    <td className="text-right py-1">
                      {(product.price * product.qty).toFixed(2)} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Section */}
            <div className="text-[10px] font-bold border-t border-black pt-2">
              <div className="flex justify-between">
                <span>TOTAL:</span>
                <span>{overallTotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Mode de paiement:</span>
                <span>{paymentType}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[8px] mt-4">
              <p>Merci pour votre confiance!</p>
              <p>Service après-vente: +212 600-000000</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BonDeLivraison;

function formatISODate(isoDate: Date): string {
  const date = new Date(isoDate);

  // Extract date components
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format as "13.02.2025/17:40:32"
  return `${day}.${month}.${year}/${hours}:${minutes}:${seconds}`;
}
