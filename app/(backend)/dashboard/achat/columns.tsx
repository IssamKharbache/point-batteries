"use client";
import AchatProductsDetails from "@/components/backend/achat/AchatProductsDetails";
import { ProductData } from "@/components/backend/table/TableActions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/index";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { useState } from "react";

export interface AchatType {
  id: string;
  refAchat: string;
  createdAt: Date;
  products: AchatProduct[];
  updatedAt: Date | null;
}

interface AchatProduct {
  productId: string;
  qty: string;
}

export const columns: ColumnDef<AchatType>[] = [
  {
    accessorKey: "refAchat",
    header: "Reference Achat",
  },
  {
    accessorKey: "createdAt",
    header: "Date de creation",
    cell: ({ row }) => {
      return <div>{formatDate(row.original.createdAt)}</div>;
    },
  },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => {
      const productIds = row.original.products.map(
        (product) => product.productId
      );

      const quantities = row.original.products.map((product) => product.qty);

      return (
        <AchatProductsDetails
          productIds={productIds}
          quantities={quantities}
          refAchat={row.original.refAchat}
        />
      );
    },
  },
];
