import {
  Layers,
  LayoutDashboard,
  Package2,
  ShoppingBasket,
  Store,
  UserPen,
  UserRoundPlus,
  Users,
  UsersRound,
} from "lucide-react";
export const menuItems = [
  {
    name: "Accueil",
    href: "/",
  },

  {
    name: "Qui sommes nous ?",
    href: "/apropos",
  },
  {
    name: "contact",
    href: "/contact",
  },
];

export const monCompteItems = [
  {
    name: "Mon panier",
    href: "/mon-panier",
  },
  {
    name: "Ma liste d'envies",
    href: "/favourites",
  },
];

export const categoryData: string[] = [
  "Batteries voiture",
  "Batteries poids lourd",
  "Batteries lithium-ion",
  "Batteries alcalines",
  "Batteries rechargeables",
  "Batteries plomb-acide",
  "Batteries au nickel-cadmium",
  "Batteries au lithium-polymère",
  "Batteries CR2032",
  "Batteries 12V",
];

export const sideBarMenu = [
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
    name: "Categorie",
    href: "/dashboard/categorie",
    icon: Layers,
    isMainAdmin: false,
  },
  {
    name: "Ajouter Admin",
    href: "/dashboard/notre-staff/ajouter-admin",
    icon: UserRoundPlus,
    isMainAdmin: true,
  },
  {
    name: "Notre staff",
    href: "/dashboard/notre-staff",
    icon: UsersRound,
    isMainAdmin: true,
  },
  {
    name: "Shop",
    href: "/",
    icon: Store,
    isMainAdmin: false,
  },
];
