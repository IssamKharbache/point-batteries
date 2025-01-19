"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import OrderDetailsActions from "@/components/backend/dialog/OrderDetailsActions";
import UpdateStatus from "@/components/backend/table/UpdateStatus";

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "telephone",
    header: "Telephone",
  },
  {
    accessorKey: "orderStatus",
    header: "Commande status",
    cell: ({ row }) => {
      const data = row.original;
      return <UpdateStatus data={data} />;
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original as Order;
      return <OrderDetailsActions order={data} />;
    },
  },
];
