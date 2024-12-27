"use client";
import TableActions from "@/components/backend/table/TableActions";
import { ColumnDef } from "@tanstack/react-table";

interface Category {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const categorie = row.original;
      return <TableActions typeForm={"client"} categoryData={categorie} />;
    },
  },
];
