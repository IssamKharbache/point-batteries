import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import React from "react";

import PbsLogo from "@/public/pbslogo.svg";
import { signOut } from "next-auth/react";
import LogoutButton from "@/components/frontend/buttons/LogoutButton";
import { LayoutDashboard, Package2, ShoppingBasket, Users } from "lucide-react";
import Link from "next/link";

const SideBar = async () => {
  const session = await getServerSession(authOptions);
  const sideBarMenu = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Client",
      href: "/dashboard/client",
      icon: Users,
    },
    {
      name: "Commande",
      href: "/dashboard/commande",
      icon: Package2,
    },
    {
      name: "Produit",
      href: "/dashboard/produit",
      icon: ShoppingBasket,
    },
  ];
  return (
    <div className="flex flex-col fixed bg-black space-y-8 w-64 h-screen text-white  left-0 top-0    overflow-y-scroll ">
      <div className="flex justify-center py-4 border-b border-gray-900">
        <PbsLogo alt="Logo" />
      </div>
      {/* side bar menus */}
      <div className="flex flex-col flex-grow space-y-12 ">
        {sideBarMenu.map((menu, index) => {
          const Icon = menu.icon;
          return (
            <Link
              className="flex items-center gap-4 hover:bg-lightBlack w-full py-5 px-8"
              key={index}
              href={menu.href}
            >
              <Icon />
              <span> {menu.name}</span>
            </Link>
          );
        })}
      </div>
      {/* lower stuff */}
      <LogoutButton />
    </div>
  );
};

export default SideBar;
