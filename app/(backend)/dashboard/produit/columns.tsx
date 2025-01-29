"use client";
import TableActions, {
  ProductData,
} from "@/components/backend/table/TableActions";
import { useToast } from "@/hooks/use-toast";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCheck, ClipboardCheck, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const columns: ColumnDef<ProductData>[] = [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => (
      <div className="line-clamp-1 w-56">{row.original.title}</div>
    ),
  },
  {
    accessorKey: "imageUrl",
    header: "Image produit",
    cell: ({ row }) => {
      const image = row.original.imageUrl as string;
      return (
        <div>
          <Image
            src={image}
            alt="produit image"
            width={500}
            height={500}
            className="w-16 h-16 rounded-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "refProduct",
    header: "Reference",
    cell: ({ row }) => {
      const [copied, setCopied] = useState<boolean>(false);
      const { toast } = useToast();
      // Function to copy the current URL to clipboard
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
    },
  },
  {
    accessorKey: "marque",
    header: "Marque",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <TableActions
          editEndpoint={`produit/modifier/${product.slug}`}
          endpoint={`product/${product.slug}`}
        />
      );
    },
  },
];
