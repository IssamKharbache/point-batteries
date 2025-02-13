"use client";

import { UserCreatingVente } from "@/components/backend/vente/UserCreatingVente";
import { formatDate } from "@/lib/utils/index";
import { ColumnDef } from "@tanstack/react-table";

export interface VenteType {
  id: string;
  userId: string;
  venteRef: string;
  paymentType: string;
  clientNom: string;
  clientCin: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export const columns: ColumnDef<VenteType>[] = [
  {
    accessorKey: "venteRef",
    header: "Ref vente",
  },
  {
    accessorKey: "userId",
    header: "Nom du caissier",

    cell: ({ row, table }) => {
      const data = table.getRowModel().rows.map((r) => r.original);
      return (
        <UserCreatingVente currentUserId={row.original.userId} rowData={data} />
      );
    },
  },
  {
    accessorKey: "clientNom",
    header: "Nom du client",
  },

  {
    accessorKey: "clientCin",
    header: "CIN du client",
  },
  {
    accessorKey: "createdAt",
    header: "Date de creation",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createdAt)}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true; // If no filter value, show all rows
      const rowDate = new Date(row.getValue(columnId)); // Get the row's createdAt date
      const filterDate = new Date(filterValue); // Get the selected filter date
      // Compare dates by year, month, and day (ignore time)
      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
    },
  },
];
