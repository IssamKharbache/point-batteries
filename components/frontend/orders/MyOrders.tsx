"use client";
import { Button } from "@/components/ui/button";
import { getStatus } from "@/lib/getStatus";
import { Order, OrderItem } from "@prisma/client";
import Image from "next/image";

interface OrderProps {
  order: Order & { orderItems: OrderItem[] };
}
const MyOrders = ({ order }: OrderProps) => {
  const orderItems = order.orderItems;
  const price = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <div className="flex flex-col md:flex-row justify-between md:items-center bg-gray-100 border p-4 rounded mb-8 gap-4">
      <div>
        {orderItems.map((orderItem, idx) => (
          <div key={orderItem.id}>
            <div className="flex space-y-4 justify-between  gap-2">
              <div className="flex gap-12 items-center ">
                <div>
                  <Image
                    src={orderItem.imageUrl || ""}
                    alt="produit"
                    width={500}
                    height={500}
                    className="w-10 m-4 rounded-full"
                  />
                </div>
                <div className="flex flex-col md:flex-row">
                  <h1 className="text-xl md:text-md line-clamp-1 w-60 ">
                    {orderItem.title}
                  </h1>
                  <p className="font-medium text-md">
                    x{orderItem.quantity}
                    {idx !== order.orderItems.length - 1 && ", "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="font-semibold p-4 text-xl">{price}dhs</p>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div>{getStatus(order.orderStatus)}</div>
        <Button className="rounded-sm">Suivre la commande</Button>
      </div>
    </div>
  );
};

export default MyOrders;
