import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, UserPen } from "lucide-react";
import React from "react";
import DeleteActionButton from "./DeleteActionButton";
import Link from "next/link";
import { Category, Product } from "@prisma/client";

interface TableActionsProps {
  userData?: {
    id: string;
    nom: string;
    prenom: string;
    role: string;
    tel: string;
    email: string;
    identifiant: string;
  };
  categoryData?: Category;
  productData?: ProductData;
  typeForm?: string;
}

export type UserData = {
  id: string;
  nom: string;
  prenom: string;
  role: string;
  tel: string;
  email: string;
  identifiant: string;
};
export type ProductData = {
  id: string;
  title: string;
  slug: string;
  description: string | null; // Ensure this is string | null
  createdAt: Date;
  updatedAt: Date | null;
  imageUrl: string | null; // Ensure this is string | null
  imageKey: string | null; // Ensure this is string | null
  price: number;
  stock: number | null;
  capacite: number | null;
  courantDessai: number | null;
  marque: string;
  variationProduct: string | null;
  voltage: number | null;
  garantie: string | null;
  categoryId: string;
  userId: string | null;
};
const TableActions = ({
  userData,
  typeForm,
  categoryData,
  productData,
}: TableActionsProps) => {
  const endPoint = productData
    ? `/api/product/${productData.slug}`
    : categoryData
    ? `/api/categorie/${categoryData?.slug}`
    : `/api/user/${userData?.id}`;

  const href = productData
    ? `produit/modifier/${productData.slug}`
    : categoryData
    ? `categorie/modifier/${categoryData.slug}`
    : typeForm === "client"
    ? `client/modifier/${userData?.identifiant}`
    : `notre-staff/modifier/${userData?.identifiant}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-2 focus:outline-none focus:border-none py-4 mt-2 mr-2"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem className="py-4 px-4">
          <DeleteActionButton endpoint={endPoint} title={`Supprimer`} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link className="w-full cursor-pointer" href={href}>
          <DropdownMenuItem className="flex items-center gap-2 py-4 px-4">
            <UserPen />
            <span>Modifier</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
