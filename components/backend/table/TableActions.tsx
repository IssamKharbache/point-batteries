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
}

const TableActions = ({ userData }: TableActionsProps) => {
  if (!userData) {
    return (
      <div>
        <Loader2 className="animate-spin text-black" />
      </div>
    );
  }

  const endPoint = `/api/user/${userData?.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-2 focus:outline-none focus:border-none"
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
        <DropdownMenuItem className="py-4 px-4">
          <Link
            className="flex items-center gap-2"
            href={`client/modifier/${userData?.identifiant}`}
          >
            <UserPen />
            <span>Modifier</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableActions;
