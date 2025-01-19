"use client";

import TableActions from "@/components/backend/table/TableActions";
import { Button } from "@/components/ui/button";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export type User = {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  tel: string;
  email: string;
  identifiant: string;
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: "Email",
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
      }
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <TableActions editEndpoint={`client/modifier/${user.identifiant}`} />
      );
    },
  },
];
