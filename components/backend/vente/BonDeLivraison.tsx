import React, { useRef, useState } from "react";
import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
interface BonDeLivraisonProps {
  rowData: VenteType;
}

const BonDeLivraison = ({ rowData }: BonDeLivraisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clientNom, clientPrenom, products, paymentType } = rowData;

  const { individualTotals, overallTotal } = products.reduce(
    (acc, product) => {
      const validPrice = product.price || 0;
      const validQty = product.qty || 0;
      const productTotal = validPrice * validQty;

      acc.individualTotals.push({
        productId: product.productId,
        total: productTotal,
      });

      acc.overallTotal += productTotal;

      return acc;
    },
    {
      individualTotals: [] as { productId: string; total: number }[],
      overallTotal: 0,
    }
  );

  const contentRef = useRef<HTMLInputElement | null>(null);

  const handlePrint = () => {};
  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>Bon de livraison</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="text-start m-3">
            <DialogTitle>Bon de Livraison</DialogTitle>
          </DialogHeader>
          <div className="flex justify-between items-center p-5">
            <h1 className="text-xl">
              Vente ref :{" "}
              <span className="font-semibold">{rowData.venteRef}</span>
            </h1>
            <Button onClick={handlePrint} className="py-2 rounded text-sm">
              <Download size={20} />
              Télécharger
            </Button>
          </div>

          <div
            className="thermal-receipt"
            ref={contentRef}
            style={{
              fontFamily: "monospace",
              margin: "auto",
              padding: "10px",
              border: "1px solid #000",
            }}
          >
            <div className="header text-center">
              <Image
                src="/logopbsdark.png"
                alt="Logo"
                width={240}
                height={80}
                className="mx-auto"
              />
              <div className="mt-1">
                <p>Adresse: Rue Principale, Casablanca</p>
                <p>Tél: +212 600-000000</p>
              </div>
            </div>

            <div className="meta-info" style={{ marginTop: "10px" }}>
              <div className="flex justify-between">
                <span>Date: {formatISODate(rowData.createdAt)}</span>
                <span>Ref: {rowData.venteRef}</span>
              </div>
              <div className="mt-1">
                Client: {clientNom} {clientPrenom}
              </div>
            </div>

            <table
              style={{
                width: "100%",
                marginTop: "10px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Produit</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Prix UN</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "left" }}>
                      {product.designationProduit.split(" ")[0]}
                    </td>
                    <td style={{ textAlign: "center" }}>{product.qty}</td>
                    <td style={{ textAlign: "right" }}>
                      {product.price?.toFixed(2)} DH
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {(product.price * product.qty).toFixed(2)} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="total-section" style={{ marginTop: "10px" }}>
              <div className="flex justify-between">
                <span>TOTAL:</span>
                <span>{overallTotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Mode de paiement:</span>
                <span>{paymentType.toUpperCase()}</span>
              </div>
            </div>

            <div
              className="footer"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
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

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year}/${hours}:${minutes}:${seconds}`;
}
