"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  LayoutDashboard,
  Package,
  UserCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const UserAvatar = () => {
  const [open, setisOpen] = React.useState(false);
  const { data: session, status } = useSession();

  const handleOpenChange = (open: boolean) => {
    setisOpen(open);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger
        asChild
        className="focus:outline-none hidden md:flex"
      >
        <button className="flex items-center justify-between gap-2 hover:bg-gray-100 py-3 px-4 rounded">
          <UserCheck />
          <div>
            Bonjour,{" "}
            <span className="capitalize font-semibold ">
              {session?.user.prenom}
            </span>
          </div>
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-gray-600 text-sm px-4 py-3">
          {session?.user.nom} {session?.user.prenom}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/mon-compte">
          <DropdownMenuItem className="cursor-pointer gap-4">
            <UserRound />
            <span>Votre compte</span>
          </DropdownMenuItem>
        </Link>
        <Link href="/mes-commandes">
          <DropdownMenuItem className="cursor-pointer gap-4">
            <Package />
            <span>Votre commandes</span>
          </DropdownMenuItem>
        </Link>
        {session?.user.role === "ADMIN" && (
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer gap-4">
              <LayoutDashboard className="" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        {session?.user.role === "STAFF" && (
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer gap-4">
              <LayoutDashboard className="" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <Link href="/mes-commandes">
          <DropdownMenuItem className="cursor-pointer gap-4">
            <Heart className="" />
            <span>Votre liste d'envies</span>
          </DropdownMenuItem>
        </Link>

        <Button
          onClick={() => signOut()}
          className="w-full mt-2 rounded bg-white text-black shadow-none hover:bg-black hover:text-white"
        >
          Deconnexion
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
