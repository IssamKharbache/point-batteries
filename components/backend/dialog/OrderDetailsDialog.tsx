"use client";

import { OrderWithItems } from "@/app/(frontend)/mes-commandes/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrderDetailsStore } from "@/context/store";
import { Printer } from "lucide-react";
import qz from "qz-tray";

const OrderDetailsDialog = () => {
  const { openDialog, setOpenDialog, selectedOrder } = useOrderDetailsStore();

  const onChange = () => {
    setOpenDialog(!openDialog);
  };

  if (!selectedOrder) return null;

  const orderWithItems = selectedOrder as OrderWithItems;
  const total = orderWithItems.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
        `${total.toFixed(2)} DH\n`.padStart(15);

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
        `Date: ${formatISODate(selectedOrder.createdAt)}\n`, // Date
        `Ref : ${selectedOrder.orderNumber}\n`, // Reference
        `Client: ${selectedOrder.nom} ${selectedOrder.prenom}\n`, // Client name
        `Adresse: ${selectedOrder.adresse}, ${selectedOrder.ville}\n`, // Address
        `Tel: ${selectedOrder.telephone}\n`, // Phone number
        `Email: ${selectedOrder.email}\n`, // Email
        "\n",
        "--------------------------------------------\n",
        ...orderWithItems.orderItems.map(
          (product) =>
            `${
              product.title &&
              product.title
                .toUpperCase()
                .replace(/batterie/gi, "")
                .trim()
            }\n` + // Product name
            `x${product.quantity} x ${product.price?.toFixed(2)} DH`.padStart(
              20
            ) + // Qty & price
            `${(product.price * product.quantity)
              .toFixed(2)
              .padStart(20)} DH\n` + // Total price aligned
            "--------------------------------------------\n"
        ),
        "\n",
        "\x1B\x61\x01",
        "\x1B\x21\x10",
        totalLine,
        "\x1B\x21\x00", // Reset text size
        "\n",
        "\x1B\x61\x01", // Center alignment for footer
        `Mode de paiement: Paiement a la livraison`, // Payment method
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
    <Dialog onOpenChange={onChange} open={openDialog}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-start m-3">
          <DialogTitle>Détails de la commande</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col mt-8 gap-8 text-xs md:text-lg">
          {selectedOrder.orderStatus !== "EN_ATTENTE" &&
            selectedOrder.orderStatus !== "ANNULLE" && (
              <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
                <p>Bon de livraison</p>
                <Button onClick={handlePrint} className="py-2 rounded text-sm">
                  <Printer size={20} />
                  Imprimer
                </Button>
              </div>
            )}
          <div className="flex items-center gap-8">
            <div className="flex gap-4 flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
              <p>Nom</p>
              <p className="font-semibold">{selectedOrder.nom}</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
              <p>Prenom</p>
              <p className="font-semibold">{selectedOrder.prenom}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Adresse</p>
            <p className="font-semibold">{selectedOrder.adresse}</p>
          </div>
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Code postal</p>
            <p className="font-semibold">{selectedOrder.codePostal}</p>
          </div>
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Telephone</p>
            <p className="font-semibold">{selectedOrder.telephone}</p>
          </div>
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Email</p>
            <p className="font-semibold">{selectedOrder.email}</p>
          </div>
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>No du commande</p>
            <p className="font-semibold">#{selectedOrder.orderNumber}</p>
          </div>
          {selectedOrder.notesCommande && (
            <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
              <p>Note du commande</p>
              <p className="text-xs md:text-sm">
                {selectedOrder.notesCommande}
              </p>
            </div>
          )}
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Total</p>
            <p className=" font-bold text-xl">{total}dhs</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;

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
