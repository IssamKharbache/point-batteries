"use client";

import BonDeRetour, {
  ReturnType,
} from "@/components/backend/retour/BonDeRetour";
import TableActions from "@/components/backend/table/TableActions";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils/index";

import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";
const CopyableCell = ({ row }: { row: Row<ReturnType> }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(row.original.returnRef || "")
        .then(() => {
          toast({
            title: "Copié",
            description: "La référence du produit a été copiée",
            variant: "success",
            duration: 4000,
          });
          setCopied(true);
          setTimeout(() => setCopied(false), 4000);
        })
        .catch((error) => {
          console.error("Failed to copy: ", error);
        });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <p>{row.original.returnRef}</p>
      {!copied ? (
        <Copy
          className="hover:text-blue-500 cursor-pointer"
          onClick={copyToClipboard}
          size={20}
        />
      ) : (
        <CheckCheck size={20} />
      )}
    </div>
  );
};

export const columns: ColumnDef<ReturnType>[] = [
  {
    accessorKey: "nomDuCaissier",
    header: "Retourner par",
  },
  {
    accessorKey: "returnFrom",
    header: "Retour de",
    cell: ({ row }) => {
      const from = row.original.returnFrom;
      return <p>{from === "product" ? "Stock" : "Vente"}</p>;
    },
  },
  {
    accessorKey: "returnRef",
    header: "Reference",
    cell: CopyableCell,
  },
  {
    id: "bonRetour",
    header: "Bon de retour",
    cell: ({ row }) => {
      return <BonDeRetour rowData={row.original} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.original.createdAt;

      return <p>{formatDate(date)}</p>;
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const returnData = row.original;
      return <TableActions endpoint={`retour/${returnData.id}`} />;
    },
  },
];
