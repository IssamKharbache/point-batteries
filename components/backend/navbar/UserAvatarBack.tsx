"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  GalleryVertical,
  Layers,
  LayoutDashboard,
  Package2,
  ShoppingBasket,
  Store,
  Users,
  UsersRound,
} from "lucide-react";
import { getInitials } from "@/lib/utils/index";
import { UserPen } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { FaCashRegister } from "react-icons/fa6";

const UserAvatarBack = () => {
  const { data: session } = useSession();

  const sideBarMenu = [];
  if (session?.user?.role === "CAISSIER") {
    sideBarMenu.push(
      {
        name: "Vente",
        href: "/dashboard/vente",
        icon: FaCashRegister,
        isMainAdmin: false,
      },
      {
        name: "Boutique",
        href: "/",
        icon: Store,
        isMainAdmin: false,
      }
    );
  }

  if (session?.user?.role === "ADMIN" || session?.user?.role === "STAFF") {
    sideBarMenu.push(
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        isMainAdmin: false,
      },
      {
        name: "Client",
        href: "/dashboard/client",
        icon: Users,
        isMainAdmin: false,
      },
      {
        name: "Commande",
        href: "/dashboard/commandes",
        icon: Package2,
        isMainAdmin: false,
      },
      {
        name: "Produit",
        href: "/dashboard/produit",
        icon: ShoppingBasket,
        isMainAdmin: false,
      },
      {
        name: "Notre staff",
        href: "/dashboard/notre-staff",
        icon: UsersRound,
        isMainAdmin: true,
      },
      {
        name: "Catégorie",
        href: "/dashboard/categorie",
        icon: Layers,
        isMainAdmin: false,
      },

      {
        name: "Bannière",
        href: "/dashboard/banniere",
        icon: GalleryVertical,
        isMainAdmin: true,
      },
      {
        name: "Vente",
        href: "/dashboard/vente",
        icon: FaCashRegister,
        isMainAdmin: false,
      },
      {
        name: "Boutique",
        href: "/",
        icon: Store,
        isMainAdmin: false,
      }
    );
  }

  if (!session || !session.user) return null;
  const mobileBackEndUserMenu = [
    {
      name: "Editer mon profile",
      href: `/dashboard/mon-compte/${session?.user?.identifiant}`,
      icon: UserPen,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center  font-semibold bg-slate-800 h-10 w-10 rounded-full text-white uppercase">
          {getInitials(session.user.nom || "", session.user.prenom || "")}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 w-52">
        <DropdownMenuLabel className="capitalize">
          {session.user.nom || ""} {session.user.prenom || ""}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* mobile user avatar */}
        <div className="block lg:hidden">
          {sideBarMenu.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <Link key={index} href={menu.href}>
                <DropdownMenuItem className="flex items-center  gap-4 cursor-pointer">
                  <Icon />
                  <span>{menu.name}</span>
                </DropdownMenuItem>
              </Link>
            );
          })}
          {mobileBackEndUserMenu.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <Link key={index} href={menu.href}>
                <DropdownMenuItem className="flex items-center  gap-4 cursor-pointer">
                  <Icon />
                  <span>{menu.name}</span>
                </DropdownMenuItem>
              </Link>
            );
          })}
        </div>
        {/* large user avar */}

        <div className="hidden lg:block">
          {mobileBackEndUserMenu.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <Link key={index} href={menu.href}>
                <DropdownMenuItem className="flex items-center  gap-4 cursor-pointer">
                  <Icon />
                  <span>{menu.name}</span>
                </DropdownMenuItem>
              </Link>
            );
          })}
        </div>

        <Button
          className="rounded-none  bg-white shadow-none text-black border-t hover:text-white w-full hover:bg-foreground"
          onClick={() => signOut()}
        >
          Deconnexion
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatarBack;
