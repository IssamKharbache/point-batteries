"use client";

import TableActions from "@/components/backend/table/TableActions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/index";
import { Cost } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Cost>[] = [
  {
    accessorKey: "natureDuFrais",
    header: "Nature des frais",
  },
  {
    accessorKey: "montant",
    header: "Montant",
  },

  {
    accessorKey: "date",
    header: "Date des frais",
    cell: ({ row }) => {
      const date = row.original.date;

      return <p>{formatDate(date)}</p>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const fraisData = row.original;
      return <TableActions endpoint={`frais/${fraisData.id}`} />;
    },
  },
];
