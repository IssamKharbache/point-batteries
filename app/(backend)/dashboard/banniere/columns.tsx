"use client";
import TableActions from "@/components/backend/table/TableActions";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export interface BannerType {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export const columns: ColumnDef<BannerType>[] = [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "imageUrl",
    header: "Image bannière",
    cell: ({ row }) => {
      const image = row.original.imageUrl as string;
      return (
        <div>
          <Image
            src={image}
            alt="Bannière image"
            width={500}
            height={500}
            className="w-20 md:w-52 h-16 md:h-24  object-cover"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const categorie = row.original;
      return <TableActions />;
    },
  },
];
