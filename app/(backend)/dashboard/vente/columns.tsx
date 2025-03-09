"use client";

import DeleteActionButton from "@/components/backend/table/DeleteActionButton";
import BonDeLivraison from "@/components/backend/vente/BonDeLivraison";
import { UserCreatingVente } from "@/components/backend/vente/UserCreatingVente";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/index";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import Link from "next/link";

export interface VenteType {
  id: string;
  userId: string;
  venteRef: string;
  paymentType: string;
  clientNom: string;
  clientPrenom: string;
  clientTel: string;
  clientCin: string;
  nomDuCaissier: string;
  products: VenteProduct[];
  factureCode: string | null;
  generateFacture: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
interface VenteProduct {
  productId: string;
  qty: number;
  price: number;
  designationProduit: string;
  discount: number;
}

export const columns: ColumnDef<VenteType>[] = [
  {
    accessorKey: "venteRef",
    header: "Ref vente",
  },
  {
    accessorKey: "nomDuCaissier",
    header: "Nom du caissier",
  },
  {
    accessorKey: "clientNom",
    header: "Nom du client",
  },

  {
    accessorKey: "products",
    header: "Montant",
    cell: ({ row }) => {
      const products: VenteProduct[] = row.original.products;
      const price = products.reduce((acc, product) => {
        const validPrice = product.price || 0;
        const validQty = product.qty || 0;
        return acc + validPrice * validQty;
      }, 0);

      return <p className="font-semibold">{price}dhs</p>;
    },
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
  {
    id: "bondeliv",
    header: "Bon de livraison",
    cell: ({ row }) => {
      return <BonDeLivraison rowData={row.original} />;
    },
  },
  {
    id: "facture",
    header: "Facture",
    cell: ({ row }) => {
      if (row.original.generateFacture) {
        return (
          <Link href={`/dashboard/vente/facture/${row.original.factureCode}`}>
            <Button>Facture</Button>
          </Link>
        );
      } else {
        return (
          <div className="bg-gray-200 text-center w-full rounded py-2">
            Facture pas dispo{" "}
          </div>
        );
      }
    },
  },
  {
    id: "delete",
    header: "Supprimer",
    cell: ({ row }) => {
      return <DeleteActionButton endpoint={`/api/vente/${row.original.id}`} />;
    },
  },
];
