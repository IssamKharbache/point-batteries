"use client";

import DeleteActionButton from "@/components/backend/table/DeleteActionButton";
import BonDeLivraison from "@/components/backend/vente/BonDeLivraison";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/index";
import { ColumnDef } from "@tanstack/react-table";
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
  venteBenifits: number;
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
  marque: string;
  refProduct: string;
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
    accessorKey: "paymentType",
    header: "",
    cell: () => null,
  },

  {
    accessorKey: "createdAt",
    header: "Date de creation",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createdAt)}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;
      const rowDate = new Date(row.getValue(columnId));
      const filterDate = new Date(filterValue);

      return (
        rowDate.getFullYear() === filterDate.getFullYear() &&
        rowDate.getMonth() === filterDate.getMonth() &&
        rowDate.getDate() === filterDate.getDate()
      );
    },
  },
  {
    accessorKey: "venteBenifits",
    header: "Benifices",
    cell: ({ row }) => {
      const ben = row.original.venteBenifits;
      return (
        <p
          className={`font-semibold text-center rounded-full w-fit py-2 px-3 ${
            ben < 0 ? "bg-red-500 text-white" : "bg-green-500"
          }`}
        >
          {ben < 0 ? `- ${ben}` : `+ ${ben}`}dhs
        </p>
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
    header: `Facture`,
    cell: ({ row }) => {
      if (row.original.generateFacture) {
        return (
          <Link href={`/dashboard/vente/facture/${row.original.factureCode}`}>
            <Button className="rounded-2xl">Facture</Button>
          </Link>
        );
      } else {
        return (
          <p
            className={`${
              row.original.paymentType === "ACREDIT"
                ? "text-white"
                : "text-red-500"
            }  text-sm`}
          >
            X
          </p>
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
