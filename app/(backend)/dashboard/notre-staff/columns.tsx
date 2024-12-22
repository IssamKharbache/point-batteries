"use client";

import TableActions from "@/components/backend/table/TableActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Staff = {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  tel: string;
  email: string;
  identifiant: string;
};

export const columns: ColumnDef<Staff>[] = [
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
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return <TableActions userData={user} />;
    },
  },
];
