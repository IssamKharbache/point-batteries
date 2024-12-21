import {
  LayoutDashboard,
  Package2,
  ShoppingBasket,
  Store,
  UserPen,
  Users,
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
  {
    name: "Shop",
    href: "/",
    icon: Store,
  },
];

export const mobileBackEndUserMenu = [
  {
    name: "Editer mon profile",
    href: "/dashboard/mon-compte",
    icon: UserPen,
  },
];
