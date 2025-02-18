import React, { useRef, useState } from "react";

import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import "jspdf-autotable";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";

interface BonDeLivraisonProps {
  rowData: VenteType;
}

const BonDeLivraison = ({ rowData }: BonDeLivraisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const { clientNom, clientPrenom, products, paymentType } = rowData;

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

  const downloadPdf = () => {
    setLoadingPDF(true);

    const dynamicHeight = 80 + products.length * 10;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, dynamicHeight], // Auto height
    });

    let y = 10; // Start Y position
    const startX = 5;

    // Store header
    doc.setFont("Courier", "bold");
    doc.setFontSize(12);
    doc.text("Point batteries services", 35, y, { align: "center" });
    y += 6;

    doc.setFont("Courier", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${formatISODate(rowData.createdAt)}`, startX, y);
    y += 6;
    doc.text(`Vente Ref: ${rowData.venteRef}`, startX, y);
    y += 6;
    doc.text(`Client: ${clientNom} ${clientPrenom}`, startX, y);
    y += 6;

    doc.line(startX, y, 75, y); // Divider line (extended to full width)
    y += 4;

    // Table Headers
    const headers = [["Produit", "QTY", "PRIX UN", "TOTAL"]];
    const data = products.map((product) => [
      product.designationProduit.split(" ")[0], // Product name
      product.qty.toString(), // Quantity
      product.price?.toFixed(2) + " DH", // Unit price
      (product.price * product.qty).toFixed(2) + " DH", // Total
    ]);

    // Generate the table
    doc.autoTable({
      head: headers,
      body: data,
      startY: y,
      theme: "grid",
      styles: {
        font: "courier",
        fontSize: 9,
        cellPadding: 1,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Product column width
        1: { cellWidth: 10, halign: "right" }, // QTY column width
        2: { cellWidth: 20, halign: "right" }, // PRIX column width
        3: { cellWidth: 20, halign: "right" }, // TOTAL column width
      },
      margin: { left: startX }, // Align table with the left margin
    });

    y = doc.lastAutoTable.finalY + 6;

    doc.setFont("Courier", "bold");
    doc.text(`TOTAL: ${overallTotal.toFixed(2)} DH`, startX, y);
    y += 6;
    doc.text(`Mode de paiement: ${paymentType.toUpperCase()}`, startX, y);
    y += 10;

    doc.setFont("Courier", "italic");
    doc.setFontSize(8);
    doc.text("Merci pour votre confiance!", startX, y);
    y += 6;
    doc.text("Service après-vente: +212 600-000000", startX, y);

    setLoadingPDF(false);
    doc.save(`${rowData.venteRef}_${clientNom}.pdf`);
  };

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
            <Button onClick={downloadPdf} className="py-2 rounded text-sm">
              <Download size={20} />
              <span>
                {loadingPDF ? (
                  <LoadingButton bgColor="bg-black" textColor="text-white" />
                ) : (
                  "Télécharger"
                )}
              </span>
            </Button>
          </div>
          <div className="thermal-receipt" ref={contentRef}>
            <div className="text-center mb-4 mt-8">
              <Image
                src="/logopbsdark.png"
                alt="Logo"
                width={300}
                height={100}
                className="mx-auto"
                style={{ maxWidth: "70mm" }}
              />
              <div className="mt-2 text-[8px]">
                <p>Adresse:....</p>
                <p>Tél: +212 600-000000</p>
              </div>
            </div>

            <div className="border-b border-black mb-2 pb-2">
              <div className="flex justify-between text-[8px]">
                <span>Date: {formatISODate(rowData.createdAt)}</span>
                <span>Ref: {rowData.venteRef}</span>
              </div>
              <div className="text-[8px] mt-1">
                Client: {clientNom} {clientPrenom}
              </div>
            </div>

            {/* Products Table */}
            <table className="w-full text-[8px] mb-4">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-1">Produit</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Prix UN</th>
                  <th className="text-right py-1">Total</th>
                </tr>
              </thead>
              <tbody className="text-[10px]">
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
            <div className="text-[12px] font-bold border-t border-black pt-2">
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
            <div className="text-center text-[7px] mt-4">
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
