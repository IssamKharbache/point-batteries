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
export const menuItems = [
  {
    name: "Accueil",
    href: "/",
  },
];

export const monCompteItems = [
  {
    name: "Mon panier",
    href: "/mon-panier",
  },
  {
    name: "Ma liste d'envies",
    href: "/liste-denvies",
  },
  {
    name: "Mes commandes",
    href: "/mes-commandes",
  },
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
    name: "Commandes",
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
    name: "Boutique",
    href: "/",
    icon: Store,
    isMainAdmin: false,
  },
];
