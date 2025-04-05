"use client";
import DevisPrint from "@/components/backend/devis/DevisPrint";
import TableActions from "@/components/backend/table/TableActions";
import { Devis, DevisProduct } from "@prisma/client";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Printer } from "lucide-react";
import { useState } from "react";

export type DevisWithProducts = Devis & {
  products: (DevisProduct & {
    product: {
      designationProduit: string;
      refProduct: string;
    };
  })[];
};

const PrintButtonCell = ({ row }: { row: Row<Devis> }) => {
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const handlePrintClick = () => {
    setShowPrintDialog(true);
  };

  return (
    <>
      <button
        onClick={handlePrintClick}
        className="flex items-center gap-2 text-blue-500 hover:underline"
      >
        <Printer size={16} />
        Imprimer
      </button>

      {showPrintDialog && (
        <DevisPrint
          devis={row.original}
          onClose={() => setShowPrintDialog(false)}
        />
      )}
    </>
  );
};

export const columns: ColumnDef<Devis>[] = [
  {
    accessorKey: "devisRef",
    header: "Reference",
  },
  {
    accessorKey: "clientNom",
    header: "Pour client",
    cell: ({ row }) => {
      return (
        <p className="capitalize">{row.original.clientNom.toLowerCase()}</p>
      );
    },
  },
  {
    accessorKey: "clientTel",
    header: "Telephone du client",
  },
  {
    accessorKey: "nomDuCaissier",
    header: "Creé par",
  },
  {
    accessorKey: "id",
    header: "Impression",
    cell: PrintButtonCell,
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const devis = row.original;
      return <TableActions endpoint={`devis/${devis.id}`} />;
    },
  },
];
