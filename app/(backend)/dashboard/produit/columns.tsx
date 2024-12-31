"use client";
import TableActions from "@/components/backend/table/TableActions";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "title",
    header: "Titre",
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
            className="w-16 h-16 rounded-full object-contain"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div>
        <p className="line-clamp-1 w-32 md:w-60">{row.original.description}</p>
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
      return <TableActions typeForm="product" productData={product} />;
    },
  },
];
