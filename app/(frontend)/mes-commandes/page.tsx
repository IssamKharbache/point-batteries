import MyOrders from "@/components/frontend/orders/MyOrders";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { Order, OrderItem } from "@prisma/client";
import { BaggageClaim, ShoppingBag } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}
const MesCommandes = async () => {
  const session = await getServerSession(authOptions);
  const orders: OrderWithItems[] = await getData(`/order/${session?.user.id}`);

  return (
    <section className="mx-auto max-w-[1200px] ">
      {orders?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
          <div className="bg-gray-200 p-6 rounded-full">
            <BaggageClaim size={40} />
          </div>
          <h1 className="font-semibold text-2xl md:text-4xl mt-8 text-center">
            Vous n'avez placé aucune commande !
          </h1>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Toutes vos commandes seront sauvegardées ici pour que vous puissiez
            consulter leur statut à tout moment.
          </p>
          <Link href="/" className="mt-4">
            <Button>Poursuivez vos achats</Button>
          </Link>
        </div>
      )}
      <div className="p-8">
        {orders?.map((order, idx) => (
          <MyOrders order={order} key={idx} />
        ))}
      </div>
    </section>
  );
};

export default MesCommandes;
