"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/frontend/buttons/LogoutButton";
import { useSideBarStore } from "@/context/store";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  BaggageClaim,
  ChevronDown,
  GalleryVertical,
  Layers,
  LayoutDashboard,
  Notebook,
  Package,
  Package2,
  ShoppingBasket,
  Store,
  Users,
  UsersRound,
  Contact,
  BadgeDollarSign,
} from "lucide-react";
import { FaCashRegister } from "react-icons/fa6";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
const SideBar = () => {
  const path = usePathname();
  const { openSideBar } = useSideBarStore();
  const { data: session } = useSession();
  if (!session || !session.user) return null;

  const sideBarMenu = [];
  if (session.user.role === "CAISSIER") {
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

  if (session.user.role === "ADMIN" || session.user.role === "STAFF") {
    sideBarMenu.push(
      {
        name: "Catégorie",
        href: "/dashboard/categorie",
        icon: Layers,
        isMainAdmin: false,
      },
      {
        name: "Produit",
        href: "/dashboard/produit",
        icon: ShoppingBasket,
        isMainAdmin: false,
      },
      {
        name: "Frais",
        href: "/dashboard/frais",
        icon: BadgeDollarSign,
        isMainAdmin: true,
      },
      {
        name: "Notre staff",
        href: "/dashboard/notre-staff",
        icon: UsersRound,
        isMainAdmin: true,
      },
      {
        name: "Client Repititive",
        href: "/dashboard/client-rep",
        icon: Contact,
        isMainAdmin: true,
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
        name: "Bannière",
        href: "/dashboard/banniere",
        icon: GalleryVertical,
        isMainAdmin: true,
      },

      {
        name: "Boutique",
        href: "/",
        icon: Store,
        isMainAdmin: false,
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
        <Image
          src="/logopbslight.png"
          alt="Logo"
          width={1000}
          height={1000}
          className="w-52 h-12 object-contain"
        />
      </div>
      {/* side bar menus */}
      <div className="flex flex-col flex-grow space-y-12 ">
        {session?.user?.role === "ADMIN" || session?.user?.role === "STAFF" ? (
          <>
            <Link
              className={`flex items-center gap-4 w-full py-4 px-8 hover:bg-slate-800${
                "/dashboard" === path
                  ? "bg-slate-800 border-l-8  hover:bg-slate-700 duration-300"
                  : ""
              }`}
              href="/dashboard"
            >
              <LayoutDashboard />
              Dashboard
            </Link>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between gap-4 hover:bg-slate-800 w-full py-5 px-8">
                <div className="flex items-center gap-4">
                  <BaggageClaim />
                  <span>Achat</span>
                </div>
                <ChevronDown />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 bg-gray-700 rounded-l mt-5">
                <Link
                  className={`flex items-center gap-4 hover:text-blue-400 w-full py-4 px-5 text-md duration-200 ${
                    "/dashboard/achat/ajouter" === path ? "text-blue-400" : ""
                  }`}
                  href="/dashboard/achat"
                >
                  <BaggageClaim size={18} />
                  Les achats
                </Link>
                <Link
                  className={`flex items-center gap-4 hover:text-blue-400 w-full py-4 px-5 text-sm duration-200 ${
                    "/dashboard/achat/produit/ajouter" === path
                      ? "text-blue-400"
                      : ""
                  }`}
                  href="/dashboard/achat/produit/produit-achat"
                >
                  <Package size={18} />
                  Les produits achat
                </Link>
              </CollapsibleContent>
            </Collapsible>
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between gap-4 hover:bg-slate-800 w-full py-5 px-8">
                <div className="flex items-center gap-4">
                  <FaCashRegister />
                  <span>Vente</span>
                </div>
                <ChevronDown />
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-8 bg-gray-700 rounded-l mt-5">
                <Link
                  className={`flex items-center gap-4 hover:text-blue-400 w-full py-4 px-5 text-md duration-200 ${
                    "/dashboard/vente" === path ? "text-blue-400" : ""
                  }`}
                  href="/dashboard/vente"
                >
                  <FaCashRegister size={18} />
                  Les Ventes
                </Link>
                <Link
                  className={`flex items-center gap-4 hover:text-blue-400 w-full py-4 px-5 text-sm duration-200 ${
                    "/dashboard/vente/journal-ventes" === path
                      ? "text-blue-400"
                      : ""
                  }`}
                  href="/dashboard/vente/journal-ventes"
                >
                  <Notebook size={18} />
                  Journal des ventes
                </Link>
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : null}
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
