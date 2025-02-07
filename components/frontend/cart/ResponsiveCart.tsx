import { useCartStore } from "@/context/store";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CartItem {
  item: {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    quantity: number;
    userId: string;
  };
}
const ResponsiveCart = ({ item }: CartItem) => {
  const { deleteItem, incrementQty, decrementQty } = useCartStore();
  return (
    <div className="flex-col space-y-4 m-8 bg-gray-100   flex  relative shadow-md">
      <button
        onClick={() => deleteItem(item.id)}
        className="flex items-center gap-2  text-red-500 hover:bg-gray-200 duration-300 p-4  absolute right-0 top-0"
      >
        <X size={20} />
      </button>

      <div className="flex items-center  justify-center gap-4">
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={500}
          height={500}
          className="w-24 rounded-full"
        />
      </div>
      <p className="text-center w-full text-md line-clamp-1 font-semibold">
        {item.title}
      </p>
      <hr />
      <div className="border-b px-12 py-4">
        <div className="flex flex-col gap-4 items-center sm:flex-row sm:gap-0 sm:items-center sm:justify-between font-semibold">
          <p>Prix</p>
          <p>{item.price}dhs</p>
        </div>
      </div>

      <div className="border-b px-12 py-4">
        <div className="flex flex-col gap-4 items-center sm:flex-row sm:gap-0 sm:items-center sm:justify-between font-semibold">
          <p>Quantité</p>
          <div className="flex items-center gap-4 ">
            <button>
              <Minus
                onClick={() => decrementQty(item.id)}
                className="size-5 bg-gray-300 rounded-full cursor-pointer"
              />
            </button>
            <p>{item.quantity}</p>
            <button>
              {" "}
              <Plus
                onClick={() => incrementQty(item.id)}
                className="size-5 bg-gray-300 rounded-full cursor-pointer"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="px-12 py-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0 sm:items-center sm:justify-between font-semibold">
          <p>Sous-total</p>
          <p> {(Number(item.quantity) * Number(item.price)).toFixed(2)} dhs</p>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveCart;
