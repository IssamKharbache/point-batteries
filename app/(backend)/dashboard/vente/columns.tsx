
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/index";
import Link from "next/link";
import DeleteActionButton from "@/components/backend/table/DeleteActionButton";
import BonDeLivraison from "@/components/backend/vente/BonDeLivraison";
import { PaymentTypeEdit } from "@/components/backend/vente/PaymentTypeEdit";
import VenteBenefits from "@/components/backend/vente/VenteBenifice";
import { PaymentType, Return } from "@prisma/client";

// Assuming the existing `VenteType` and `VenteProduct` definitions
export interface VenteType {
  id: string;
  userId: string;
  venteRef: string;
  paymentType: PaymentType;
  clientNom: string;
  clientPrenom: string;
  clientTel: string;
  clientCin: string;
  nomDuCaissier: string;
  venteBenifits: number;
  products: VenteProduct[];
  returns: Return[];
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
  codeGarantie: string;
  commission : number;
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
      return <VenteBenefits rowData={row.original} />;
    },
  },
 {
  id: "commission",
  header: "Commission",
  cell: ({ row }) => {
    const hasCommission = row.original.products.some(
      (product) => product && product.commission > 0
    );
    const commissionAmount = row.original.products.reduce((total, product) => {
      return total + (product.commission || 0);
    }, 0);

    // Determine if the background should be red based on paymentType
    const isRedBackground = row.original.paymentType === "ACREDIT";

    return (
      <div
        className={`p-2 rounded-lg ${
          isRedBackground ? "bg-red-500" : "bg-white"
        } ${commissionAmount > 0 ? 'text-green-500' : 'text-gray-500'}`}
      >
        {hasCommission ? (
          <span>{commissionAmount.toFixed(2)} dhs</span>
        ) : (
          <span className={`${isRedBackground ? "text-white" : "text-red-500" }`}>Pas de commission</span>
        )}
      </div>
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
    accessorKey: "paymentType",
    header: "Méthode de paiement",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <PaymentTypeEdit
            currentType={row.original.paymentType}
            venteId={row.original.id}
          />
        </div>
      );
    },
  },
  {
    id: "facture",
    header: `Facture`,
    cell: ({ row }) => {
      if (row.original.generateFacture) {
        const code = row.original.factureCode;
        const encodedCode = encodeURIComponent(code || "");
        const url = `/dashboard/vente/facture/${encodedCode}`;
        return (
          <Link href={url}>
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
            } text-sm`}
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
      return (
        <DeleteActionButton
          paymentType={row.original.paymentType}
          endpoint={`/api/vente/${row.original.id}`}
        />
      );
    },
  },
];
