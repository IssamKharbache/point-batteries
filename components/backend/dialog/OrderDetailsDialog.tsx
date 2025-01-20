"use client";

import { OrderWithItems } from "@/app/(frontend)/mes-commandes/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrderDetailsStore } from "@/context/store";

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

  return (
    <Dialog onOpenChange={onChange} open={openDialog}>
      <DialogContent>
        <DialogHeader className="text-start m-3">
          <DialogTitle>Détails de la commande</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col mt-8 gap-8 text-xs md:text-lg">
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Nom</p>
            <p className="font-semibold">{selectedOrder.nom}</p>
          </div>
          <div className="flex flex-wrap justify-between items-center bg-gray-100/80 py-4 px-8 rounded-lg">
            <p>Prenom</p>
            <p className="font-semibold">{selectedOrder.prenom}</p>
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
