"use client";
import TableActions, {
  ProductData,
} from "@/components/backend/table/TableActions";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef, Row } from "@tanstack/react-table";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

const CopyableCell = ({ row }: { row: Row<ProductData> }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();

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
    accessorKey: "refProduct",
    header: "Reference",
    cell: CopyableCell,
  },
  {
    accessorKey: "marque",
    header: "Marque",
  },
  {
    accessorKey: "designationProduit",
    header: "Designation",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <TableActions
          editEndpoint={`/dashboard/produit/modifier/${product.slug}`}
          endpoint={`product/${product.slug}`}
        />
      );
    },
  },
];
