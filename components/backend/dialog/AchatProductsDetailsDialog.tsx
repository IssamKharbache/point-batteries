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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-lg">
          <DialogHeader className="text-start m-3">
            <DialogTitle>Détails de l&apos;achat</DialogTitle>
            <DialogDescription>
              Voir plus de détails sur l&apos;achat, imprimer ou télécharger
              aussi
            </DialogDescription>
            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-4">
                <p>Ref achat :</p>
                <h1 className="font-semibold">{refAchat}</h1>
              </div>
              <Button
                onClick={() => reactToPrintFn()}
                className="py-2 rounded text-xs"
              >
                <Download size={20} />
                <span>Imprimer / Télécharger</span>
              </Button>
            </div>
          </DialogHeader>
          <div>
            <div className="max-h-[60vh] overflow-y-auto">
              <div ref={contentRef} className="space-y-8 p-8">
                <div className="flex justify-between items-center bg-white ">
                  <h1 className="font-bold text-3xl">
                    Points batteries service
                  </h1>
                  <Image
                    src="/logopbsdark.png"
                    alt="Logo"
                    width={1000}
                    height={1000}
                    className="w-60 md:w-72"
                    priority
                  />
                </div>
                <p>
                  Tanger, le{" "}
                  <span className="font-semibold">
                    {formatPrismaDate(date)}
                  </span>
                </p>
                <div className="flex items-center gap-8 border-2 border-black/40 p-2">
                  <p>Reference achat : </p>
                  <p className="font-semibold">{refAchat}</p>
                </div>

                <Table className="border-2">
                  <TableHeader className="border-2">
                    <TableRow>
                      <TableHead className="font-semibold border-r-2 text-xl text-black">
                        Ref
                      </TableHead>
                      <TableHead className="font-semibold border-r-2 text-xl text-black">
                        Designation
                      </TableHead>
                      <TableHead className="font-semibold border-r-2 text-xl text-black">
                        QTE
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium border-r-2">
                          {product.refProduct}
                        </TableCell>
                        <TableCell className="font-medium border-r-2">
                          {product.designationProduit}
                        </TableCell>
                        <TableCell>{product.quantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {products.length === 0 && (
                  <p className="text-muted-foreground">Aucun produit trouvé</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AchatProductsDetailsDialog;

export function formatPrismaDate(isoDate: Date | string) {
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

  const date = new Date(isoDate); // Automatically converts Prisma's timestamp

  const dayNumber = date.getDate();
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  return `${dayNumber} ${dayName} ${monthName} ${year}`;
}
