"use client";
// components/dialog/AchatProductsDetailsDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductAchatDialogStore } from "@/context/store";

const AchatProductsDetailsDialog = () => {
  const { open, setOpen, products, refAchat } = useProductAchatDialogStore();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-lg">
        <DialogHeader className="text-start m-3">
          <DialogTitle>Détails de l'achat</DialogTitle>
          <div className="flex items-center gap-4">
            <p>Ref achat :</p>
            <h1 className="font-semibold">{refAchat}</h1>
          </div>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {products.map((product) => (
            <div key={product.id} className="space-y-4 mb-4 p-2 border-b">
              <h3 className="font-medium">{product.title}</h3>
              <p className="text-muted-foreground">
                {/* Display quantity */}
                Quantité:{" "}
                <span className="font-semibold"> {product.quantity}</span>{" "}
              </p>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchatProductsDetailsDialog;
