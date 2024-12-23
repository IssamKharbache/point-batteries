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
import { useUserAvatarStore } from "@/context/store";
import { sideBarMenu } from "@/data";
import { getInitials } from "@/lib/utils/index";
import { Icon, UserPen } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const UserAvatarBack = () => {
  const { data: session } = useSession();
  const { nom, prenom } = useUserAvatarStore();

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
          {getInitials(nom, prenom)}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4 w-52">
        <DropdownMenuLabel className="capitalize">
          {nom || ""} {prenom || ""}
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
