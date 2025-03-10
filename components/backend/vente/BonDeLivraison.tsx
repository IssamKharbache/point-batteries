import React, { useRef, useState } from "react";
import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import Image from "next/image";
import qz from "qz-tray";

interface BonDeLivraisonProps {
  rowData: VenteType;
}

const BonDeLivraison = ({ rowData }: BonDeLivraisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clientNom, clientPrenom, products, paymentType, nomDuCaissier } =
    rowData;

  const { individualTotals, overallTotal, totalRemise } = products.reduce(
    (acc, product) => {
      const validPrice = product.price || 0;
      const validQty = product.qty || 0;
      const remise = product.discount || 0; // Ensure remise exists

      const productTotal = validPrice * validQty;
      const productAfterRemise = productTotal - remise;

      acc.individualTotals.push({
        productId: product.productId,
        total: productAfterRemise,
        remise,
      });

      acc.totalRemise += remise;
      acc.overallTotal += productAfterRemise;

      return acc;
    },
    {
      individualTotals: [] as {
        productId: string;
        total: number;
        remise: number;
      }[],
      overallTotal: 0,
      totalRemise: 0,
    }
  );

  const contentRef = useRef<HTMLInputElement | null>(null);

  const handlePrint = async () => {
    try {
      await qz.websocket.connect();
      const printers = await qz.printers.find();

      if (!printers || printers.length === 0) {
        throw new Error("No printers found.");
      }

      const config = qz.configs.create("NCR 7197 Receipt");

      const columnWidth = 20; // Adjust as needed for alignment

      const totalLine =
        `TOTAL:`.padEnd(columnWidth, " ") +
        `${overallTotal.toFixed(2)} DH\n`.padStart(15);
      const remiseLine =
        `REMISE TOTALE:`.padEnd(columnWidth, " ") +
        `-${totalRemise.toFixed(2)} DH\n`.padStart(15);
      const finalTotalLine =
        `TOTAL FINAL:`.padEnd(columnWidth, " ") +
        `${(overallTotal - totalRemise).toFixed(2)} DH\n`.padStart(15);

      const data = [
        "\x1B\x40", // Reset printer
        "\x1B\x61\x01", // Center alignment
        "\x1B\x21\x30", // Double height and width text
        "Point Batteries\n", // Company name in large font
        "Services\n",
        "\x1B\x21\x00", // Reset text size
        "\n",
        "\x1B\x61\x01", // Center alignment for title
        "Bon de Livraison\n", // Title
        "\n",
        "\x1B\x61\x01", // Center alignment for header data
        `Date: ${formatISODate(rowData.createdAt)}\n`, // Date
        `Ref: ${rowData.venteRef}\n`, // Reference
        `Client: ${clientNom} ${clientPrenom}\n`, // Client name
        `Servi par: ${nomDuCaissier} \n`, // Cashier name
        "\n",
        "--------------------------------------------\n",
        ...products.map(
          (product) =>
            `${product.designationProduit
              .toUpperCase()
              .replace(/batterie/gi, "")
              .trim()}\n` + // Product name
            `x${product.qty} x ${product.price?.toFixed(2)} DH`.padStart(20) + // Qty & price
            `${(product.price * product.qty).toFixed(2).padStart(20)} DH\n` + // Total price aligned
            `Remise: ${product.discount?.toFixed(2)} DH\n`.padStart(40) + // Show Remise below price
            "--------------------------------------------\n"
        ),
        "\n",
        "\x1B\x61\x01",
        "\x1B\x21\x10",
        totalLine,
        remiseLine,
        finalTotalLine,
        "\x1B\x21\x00", // Reset text size
        "\n",
        "\x1B\x61\x01", // Center alignment for footer
        `Mode de paiement: ${paymentType.toUpperCase()}\n`, // Payment method
        "\n",
        "\x1B\x61\x01", // Center alignment for footer
        "Merci pour votre confiance!\n", // Thank you message
        "\x1B\x61\x01", // Center alignment for footer
        "Service apres-vente: \n", // Contact info
        "Tel : 0656307044 Fix : 0531510011\n",
        "\n",
        "\x1D\x56\x41\x10", // Full cut
      ];

      await qz.print(config, data);
      await qz.websocket.disconnect();
    } catch (error: any) {
      console.error("Error during printing:", error);
      if (error.message.includes("No printers found")) {
        alert("No printers found. Please ensure a printer is connected.");
      } else if (error.message.includes("Connection to QZ Tray failed")) {
        alert(
          "Failed to connect to QZ Tray. Please ensure QZ Tray is running."
        );
      } else {
        alert("An error occurred while printing. Please try again.");
      }
    }
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="rounded-2xl">
        Bon de livraison
      </Button>
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
              <Printer size={20} />
              Imprimer
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
                      {product.designationProduit}
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

            {/* Show Remise Information */}
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              {products.map((product, index) =>
                product.discount ? (
                  <p key={index} style={{ fontSize: "12px", color: "red" }}>
                    Remise sur {product.designationProduit}: -
                    {product.discount.toFixed(2)} DH
                  </p>
                ) : null
              )}
            </div>

            {/* Show Total, Remise Totale, and Final Total */}
            <div className="total-section" style={{ marginTop: "10px" }}>
              <div className="flex justify-between mt-1 font-bold">
                <span>Mode:</span>
                <span>{paymentType}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{(overallTotal + totalRemise).toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Remise Totale:</span>
                <span>-{totalRemise.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between mt-1 font-bold">
                <span>Total Final:</span>
                <span>{overallTotal.toFixed(2)} DH</span>
              </div>
            </div>

            <div
              className="footer"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              <p>Merci pour votre confiance!</p>
              <p>Service après-vente: Tel : 0656307044 Fix : 0531510011</p>
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
