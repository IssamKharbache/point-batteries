import { TableCell, TableRow } from "@/components/ui/table";
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
    stock: number;
  };
}

const CartTable = ({ item }: CartItem) => {
  const { deleteItem, incrementQty, decrementQty } = useCartStore();

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell>
        <div className="flex items-center gap-8">
          <button
            onClick={() => deleteItem(item.id)}
            className="flex items-center gap-2  text-red-500 hover:bg-gray-200 duration-300  p-3 rounded-full"
          >
            <X size={15} />
          </button>

          <Image
            src={item.imageUrl}
            alt={item.title}
            width={500}
            height={500}
            className="w-20 rounded-full object-cover"
          />

          <p className="w-56 line-clamp-1 font-semibold">{item.title}</p>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-4 w-56">
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
              onClick={() => {
                if (item.stock <= item.quantity) {
                  return;
                } else {
                  incrementQty(item.id);
                }
              }}
              className="size-5 bg-gray-300 rounded-full cursor-pointer"
            />
          </button>
        </div>
      </TableCell>
      <TableCell>
        <p className="font-semibold">{Number(item.price).toFixed(2)}</p>
      </TableCell>
      <TableCell className="text-right w-52">
        <p className="font-semibold w-full">
          {(Number(item.quantity) * Number(item.price)).toFixed(2)}
        </p>
      </TableCell>
    </TableRow>
  );
};

export default CartTable;
