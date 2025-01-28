"use client";
import TableActions, {
  ProductData,
} from "@/components/backend/table/TableActions";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

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
    cell: ({ row }) => (
      <div>
        <p className="line-clamp-1 w-32 md:w-60">{row.original.refProduct}</p>
      </div>
    ),
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
