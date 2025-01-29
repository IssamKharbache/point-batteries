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
  BaggageClaim,
  ChevronDown,
  GalleryVertical,
  Layers,
  LayoutDashboard,
  Package,
  Package2,
  Plus,
  ShoppingBasket,
  Store,
  UserRoundPlus,
  Users,
  UsersRound,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
const SideBar = () => {
  const path = usePathname();
  const { openSideBar, setOpenSideBar } = useSideBarStore();
  const { data: session } = useSession();
  if (!session || !session.user) return null;

  let sideBarMenu = [
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
      name: "Boutique",
      href: "/",
      icon: Store,
      isMainAdmin: false,
    },
  ];
  if (session.user.role === "ADMIN") {
    sideBarMenu.push(
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
        name: "Notre staff",
        href: "/dashboard/notre-staff",
        icon: UsersRound,
        isMainAdmin: true,
      },
      {
        name: "Bannière",
        href: "/dashboard/banniere",
        icon: GalleryVertical,
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
        {session.user.role === "ADMIN" && (
          <>
            <Link
              className={`flex items-center gap-4  w-full py-4 px-8 ${
                "/dashboard" === path
                  ? "bg-slate-800 border-l-8   duration-300"
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
              <CollapsibleContent className="ml-8 bg-gray-700 rounded-l mt-5 ">
                <Link
                  className={`flex items-center gap-4 hover:text-blue-400  w-full py-4 px-5 text-md duration-200 ${
                    "/dashboard/achat/ajouter" === path ? "text-blue-400" : ""
                  }`}
                  href="/dashboard/achat"
                >
                  <BaggageClaim size={18} />
                  Les achats
                </Link>
                <Link
                  className={`flex items-center  gap-4 hover:text-blue-400  w-full py-4 px-5 text-sm duration-200 ${
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
          </>
        )}
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
