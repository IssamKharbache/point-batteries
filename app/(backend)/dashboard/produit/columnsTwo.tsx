"use client";
import TableActions, {
  ProductData,
} from "@/components/backend/table/TableActions";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

// CopyableCell Component (Handles Copying Logic)
const CopyableCell = ({ row }: { row: Row<ProductData> }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(row.original.refProduct || "")
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
      <p>{row.original.refProduct}</p>
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

export const columns: ColumnDef<ProductData>[] = [
  {
    accessorKey: "designationProduit",
    header: "Designation",
    cell: ({ row }) => (
      <p className="uppercase">{row.original.designationProduit}</p>
    ),
  },

  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "price",
    header: "Prix",
  },

  {
    accessorKey: "refProduct",
    header: "Reference",
    cell: CopyableCell,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <TableActions
        editEndpoint={`/dashboard/produit/modifier/${row.original.slug}`}
        endpoint={`product/${row.original.slug}`}
      />
    ),
  },
];
