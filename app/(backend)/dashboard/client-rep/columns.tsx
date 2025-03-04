"use client";

import TableActions from "@/components/backend/table/TableActions";
import { Button } from "@/components/ui/button";
import { CompanyClient } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<CompanyClient>[] = [
  {
    accessorKey: "nom",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "prenom",
    header: "Prenom",
  },

  {
    accessorKey: "tel",
    header: "Telephone",
    cell: ({ row }) => {
      const tel = row.original.tel;
      if (tel === null) {
        return (
          <div className="bg-red-500 w-fit rounded py-2 px-4 text-white font-semibold">
            Pas de numéro
          </div>
        );
      } else {
        return tel;
      }
    },
  },
];
