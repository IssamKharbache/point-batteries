"use client";
import { useCartStore } from "@/context/store";
import CartProductTable from "./CartProductTable";
import TotalPanier from "./TotalPanier";

const Cart = () => {
  const { cartItems } = useCartStore();
  return (
    <div className="grid grid-cols-12 p-4 mb-6 gap-8 md:gap-0 ">
      <div
        className={`${
          cartItems.length === 0 ? "col-span-12" : "col-span-12 xl:col-span-8"
        }`}
      >
        <h2 className="text-xl md:text-4xl font-semibold ">Votre panier</h2>
        <CartProductTable />
      </div>

      <TotalPanier />
    </div>
  );
};

export default Cart;
