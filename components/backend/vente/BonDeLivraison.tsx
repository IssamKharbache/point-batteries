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
import { EyeIcon, Printer } from "lucide-react";
import qz from "qz-tray";
import { ProductData } from "../table/TableActions";

interface BonDeLivraisonProps {
  rowData: VenteType;
}

const BonDeLivraison = ({ rowData }: BonDeLivraisonProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clientNom, clientPrenom, products, paymentType, nomDuCaissier } =
    rowData;

  // Calculate totals
  const { overallTotal, totalRemise } = products.reduce(
    (acc, product) => {
      const price = product.price || 0;
      const qty = product.qty || 0;
      const discount = product.discount || 0;

      acc.overallTotal += price * qty;
      acc.totalRemise += discount;
      return acc;
    },
    { overallTotal: 0, totalRemise: 0 }
  );

  // Printer configuration
  const ESC = "\x1B";
  const GS = "\x1D";
  const printer = {
    reset: ESC + "@",
    center: ESC + "a" + "\x01",
    left: ESC + "a" + "\x00",
    doubleHeight: ESC + "!" + "\x30",
    normalText: ESC + "!" + "\x00",
    cut: GS + "V" + "A" + "\x10",
  };

  // Alignment settings
  const COLUMNS = {
    width: 36,
    label: 15,
    product: 20,
    price: 16,
  };

  // Helper functions
  const createLine = (label: string, value: string) => {
    const padding = " ".repeat(COLUMNS.label - label.length);
    const valueSpace = COLUMNS.width - COLUMNS.label;
    const alignedValue = value.padStart(valueSpace, " ");
    return label + padding + alignedValue;
  };

  const createProductLine = (product: any) => {
    const name =
      product.marque.toUpperCase() +
      " " +
      (extractTextInParentheses(product.designationProduit || "") || "")
        .slice(0, COLUMNS.product)
        .padEnd(COLUMNS.product, " ");

    const price = `x${product.qty} x${product.price?.toFixed(2)}DH`.padStart(
      COLUMNS.price,
      " "
    );

    return name + price;
  };

  const handlePrint = async () => {
    try {
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      const printers = await qz.printers.find();
      if (!printers || printers.length === 0) {
        throw new Error("No printers found.");
      }

      const config = qz.configs.create("NCR 7197 Receipt");

      const columnWidth = 20;

      const totalLine =
        `TOTAL:`.padEnd(columnWidth, " ") +
        `${overallTotal.toFixed(2)} DH\n`.padStart(15);

      const remiseLine =
        `REMISE TOTALE:`.padEnd(columnWidth, " ") +
        `-${totalRemise.toFixed(2)} DH\n`.padStart(15);

      const finalTotalLine =
        `TOTAL FINAL:`.padEnd(columnWidth, " ") +
        `${(overallTotal - totalRemise).toFixed(2)} DH\n`.padStart(15); // Build receipt data

      const receiptData = [
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
        printer.left,
        "-".repeat(COLUMNS.width) + "\n",
        ...products.flatMap((product) => {
          const lines = [createProductLine(product) + "\n"];

          if (product.codeGarantie) {
            lines.push(
              createLine("Code Garantie:", product.codeGarantie) + "\n"
            );
          }

          if (product.discount) {
            lines.push(
              createLine("Remise:", `${product.discount.toFixed(2)} DH`) + "\n"
            );
          }

          lines.push("-".repeat(COLUMNS.width) + "\n");
          return lines;
        }),
        "\n",
        "\x1B\x61\x01", // Center alignment for totals
        "\x1B\x21\x10", // Double height and width text
        totalLine,
        remiseLine,
        finalTotalLine,
        "\x1B\x21\x00", // Reset text size
        "\n",
        `Mode de paiement: ${paymentType.toUpperCase()}\n`,
        "\n",
        "Merci pour votre confiance!\n",
        "Service apres-vente: \n",
        "Tel : 0656307044 Fix : 0531510011\n",
        "Site web : www.pointbatteries.com\n",
        "\n",
        printer.cut,
      ];

      await qz.print(config, receiptData);
      console.log("Print job sent successfully");
    } catch (error) {
      console.error("Error during printing:", error);
      alert(
        "Printing error: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
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

          {/* Preview of the receipt */}
          <div className="thermal-receipt-preview">
            <div className="text-center font-bold text-xl mb-2">
              Point Batteries
            </div>
            <div className="text-center font-bold text-xl mb-4">Services</div>
            <div className="text-center font-bold text-lg mb-4">
              Bon de Livraison
            </div>

            <div className="mb-4">
              <div>Date: {formatISODate(rowData.createdAt)}</div>
              <div>Ref: {rowData.venteRef}</div>
              <div>
                Client: {clientNom} {clientPrenom}
              </div>
              <div>Servi par: {nomDuCaissier}</div>
            </div>

            <hr className="my-2" />

            {products.map((product, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <span>
                    {product.marque.toUpperCase()}{" "}
                    {extractTextInParentheses(
                      product.designationProduit
                    )?.toUpperCase()}
                  </span>
                  <span>
                    x{product.qty} {product.price?.toFixed(2)}DH
                  </span>
                </div>
                {product.codeGarantie && (
                  <div className="text-sm">
                    Code Garantie: {product.codeGarantie}
                  </div>
                )}
                {product.discount && (
                  <div className="text-sm text-red-500">
                    Remise: -{product.discount.toFixed(2)} DH
                  </div>
                )}
                <hr className="my-2" />
              </div>
            ))}

            <div className="mt-4">
              <div className="flex justify-between font-bold">
                <span>TOTAL:</span>
                <span>{overallTotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between">
                <span>REMISE TOTALE:</span>
                <span>-{totalRemise.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>TOTAL FINAL:</span>
                <span>{(overallTotal - totalRemise).toFixed(2)} DH</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div>Mode de paiement: {paymentType.toUpperCase()}</div>
              <div className="mt-2">Merci pour votre confiance!</div>
              <div>Service apres-vente: Tel : 0656307044 Fix : 0531510011</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Helper functions
export function formatISODate(isoDate: Date): string {
  const date = new Date(isoDate);
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
}

export function extractTextInParentheses(designation: string) {
  const match = designation?.match(/\((.*?)\)/);
  return match ? match[1] : "";
}

export default BonDeLivraison;
