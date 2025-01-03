"use client";

import { sideBarMenu } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PbsLogo from "@/public/pbslogo.svg";
import LogoutButton from "@/components/frontend/buttons/LogoutButton";
import { useSideBarStore } from "@/context/store";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Layers,
  LayoutDashboard,
  Package2,
  ShoppingBasket,
  Store,
  UserRoundPlus,
  Users,
  UsersRound,
} from "lucide-react";
const SideBar = () => {
  const path = usePathname();
  const { openSideBar, setOpenSideBar } = useSideBarStore();
  const { data: session } = useSession();
  if (!session || !session.user) return null;

  let sideBarMenu = [
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
      href: "/dashboard/commande",
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
      name: "Catégorie",
      href: "/dashboard/categorie",
      icon: Layers,
      isMainAdmin: false,
    },

    {
      name: "Boutique",
      href: "/",
      icon: Store,
      isMainAdmin: false,
    },
  ];
  if (session.user.role === "ADMIN") {
    sideBarMenu.push(
      {
        name: "Ajouter Admin",
        href: "/dashboard/ajouter-admin",
        icon: UserRoundPlus,
        isMainAdmin: true,
      },
      {
        name: "Notre staff",
        href: "/dashboard/notre-staff",
        icon: UsersRound,
        isMainAdmin: true,
      }
    );
  }
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: openSideBar ? 0 : "-100%" }}
      transition={{ duration: 0.3 }}
      exit={{ x: "-100%" }}
      className={`flex-col  bg-slate-900 space-y-8 w-64 h-screen text-white  left-0 top-0 overflow-y-scroll fixed z-50 hidden lg:flex`}
    >
      {/* logo */}
      <div className="flex items-center justify-center py-4 border-b border-slate-800">
        <PbsLogo alt="Logo" className="w-72" />
      </div>
      {/* side bar menus */}
      <div className="flex flex-col flex-grow space-y-12 ">
        {sideBarMenu.map((menu, index) => {
          const Icon = menu.icon;
          return (
            <Link
              className={`flex items-center gap-4 hover:bg-slate-800 w-full py-5 px-8 ${
                menu.href === path
                  ? "bg-slate-800 border-l-8  hover:bg-slate-700 duration-300"
                  : ""
              }`}
              key={index}
              href={menu.href}
            >
              <Icon />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>
      {/* log out button */}
      <LogoutButton />
    </motion.div>
  );
};

export default SideBar;
