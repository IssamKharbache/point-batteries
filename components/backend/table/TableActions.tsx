import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPen } from "lucide-react";
import React from "react";
import DeleteActionButton from "./DeleteActionButton";
import Link from "next/link";

interface TableActionsProps {
  endpoint?: string;
  editEndpoint?: string;
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
  description: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  imageUrl: string | null;
  imageKey: string | null;
  price: number;
  achatPrice: number;
  stock: number | null;
  capacite: number | null;
  courantDessai: number | null;
  marque: string;
  designationProduit: string | null;
  voltage: number | null;
  garantie: string | null;
  categoryId: string;
  userId: string | null;
  vente: number;
  refProduct: string | null;
  isAchatProduct: boolean;
  qty: number;
  bookmarks: [
    {
      id: string;
      userId: string;
      productId: string;
    }
  ];
};
const TableActions = ({ endpoint, editEndpoint }: TableActionsProps) => {
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
        {endpoint && (
          <DropdownMenuItem className="py-4 px-4">
            <DeleteActionButton
              endpoint={`/api/${endpoint}`}
              title={`Supprimer`}
            />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {editEndpoint ? (
          <Link className="w-full cursor-pointer" href={editEndpoint ?? ""}>
            <DropdownMenuItem className="flex items-center gap-2 py-4 px-4">
              <UserPen />
              <span>Modifier</span>
            </DropdownMenuItem>
          </Link>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
