import React, { useState } from "react";
import { VenteType } from "@/app/(backend)/dashboard/vente/columns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
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

  const handlePrint = async () => {
    try {
      // Check if QZ Tray is already connected
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      // Find available printers
      const printers = await qz.printers.find();

      if (!printers || printers.length === 0) {
        throw new Error("No printers found.");
      }

      // Set up printer configuration
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
        ...products.flatMap((product) => [
          `${product.marque.toUpperCase()} ${extractTextInParentheses(
            product.designationProduit.toUpperCase()
          )}`.padEnd(30) + // Designation
            `x${product.qty} x${product.price?.toFixed(2)}DH\n`,
          `Code Garantie: ${product.codeGarantie}\n`,
          product.discount
            ? `Remise: ${product.discount.toFixed(2)} DH\n` // Discount (if any)
            : "",
          "--------------------------------------------\n",
        ]),
        "\n",
        "\x1B\x61\x01", // Center alignment for totals
        "\x1B\x21\x10", // Double height and width text
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

      // Send print job
      await qz.print(config, data);

      console.log("Print job sent successfully");
    } catch (error) {
      // Narrow down the type of the error
      if (error instanceof Error) {
        console.error("Error during printing:", error.message);

        if (error.message.includes("No printers found")) {
          alert("No printers found. Please ensure a printer is connected.");
        } else if (error.message.includes("Connection to QZ Tray failed")) {
          alert(
            "Failed to connect to QZ Tray. Please ensure QZ Tray is running."
          );
        } else {
          alert("An error occurred while printing. Please try again.");
        }
      } else {
        // Handle cases where the error is not an instance of Error
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred. Please try again.");
      }
    } finally {
      // Close the connection after printing
      if (qz.websocket.isActive()) {
        await qz.websocket.disconnect();
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
            <DialogDescription></DialogDescription>
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
            style={{
              fontFamily: "monospace",
              margin: "auto",
              padding: "10px",
              border: "1px solid #000",
              width: "400px", // Adjust width to match receipt width
              textAlign: "center", // Center align all text
            }}
          >
            {/* Company Name */}
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Point Batteries
            </div>
            <div
              style={{
                fontSize: "24px",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Services
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Bon de Livraison
            </div>

            {/* Meta Info */}
            <div className="meta-info" style={{ marginBottom: "10px" }}>
              <div>Date: {formatISODate(rowData.createdAt)}</div>
              <div>Ref: {rowData.venteRef}</div>
              <div>
                Client: {clientNom} {clientPrenom}
              </div>
              <div>Servi par : {nomDuCaissier}</div>
            </div>

            {/* Separator */}
            <div
              style={{ borderBottom: "1px solid #000", marginBottom: "10px" }}
            ></div>

            {/* Products Table */}
            <table style={{ width: "100%", marginBottom: "10px" }}>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "left" }}>
                      {` ${product.marque.toUpperCase()}: ${extractTextInParentheses(
                        product.designationProduit
                      )?.toUpperCase()}  `}
                    </td>
                    <td style={{ textAlign: "center" }}>x{product.qty}</td>
                    <td style={{ textAlign: "right" }}>
                      {product.price?.toFixed(2)} DH
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Discount Information */}
            <div style={{ marginBottom: "10px", textAlign: "right" }}>
              {products.map((product, index) =>
                product.discount ? (
                  <div key={index} style={{ fontSize: "12px", color: "red" }}>
                    <p>
                      {" "}
                      Remise sur {product.marque}: -
                      {product.discount.toFixed(2)} DH
                    </p>
                  </div>
                ) : null
              )}
            </div>

            {/* Separator */}
            <div
              style={{ borderBottom: "1px solid #000", marginBottom: "10px" }}
            ></div>

            {/* Total Section */}
            <div className="total-section" style={{ marginBottom: "10px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                Mode: {paymentType.toUpperCase()}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Total:</span>
                <span>{(overallTotal + totalRemise).toFixed(2)} DH</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Remise Totale:</span>
                <span>-{totalRemise.toFixed(2)} DH</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <span>Total Final:</span>
                <span>{overallTotal.toFixed(2)} DH</span>
              </div>
            </div>

            {/* Footer */}
            <div
              className="footer"
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              <div>Merci pour votre confiance!</div>
              <div>Service après-vente: Tel : 0656307044 Fix : 0531510011</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BonDeLivraison;

export function formatISODate(isoDate: Date): string {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year}/${hours}:${minutes}:${seconds}`;
}

function extractTextInParentheses(designation: string) {
  // Use a regular expression to match text between parentheses
  const regex = /\((.*?)\)/;
  const match = designation.match(regex);

  // If a match is found, return the text inside the parentheses
  if (match && match[1]) {
    return match[1];
  }
  return null;
}
