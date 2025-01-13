"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/context/store";
import CartTable from "./CartTable";
import ResponsiveCart from "./ResponsiveCart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const CartProductTable = () => {
  const { cartItems } = useCartStore();
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div>
          <Image
            src="/empty-cart.png"
            alt="Pannier vide"
            width={500}
            height={500}
            className="w-72"
          />
        </div>
        <h1 className="font-semibold text-2xl md:text-4xl mt-8 text-center">
          Votre panier est vide
        </h1>
        <p className="text-sm text-gray-400 mt-4 text-center">
          Il semble que vous n'ayez rien ajouté à votre panier
        </p>
        <Link href="/" className="mt-4">
          <Button>Accueil</Button>
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className="hidden lg:block gap-4  m-8">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead className="text-right">Sous-total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems &&
              cartItems.map((item, index) => (
                <CartTable key={index} item={item} />
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden">
        {cartItems &&
          cartItems.map((item, index) => (
            <ResponsiveCart key={index} item={item} />
          ))}
      </div>
    </>
  );
};

export default CartProductTable;
