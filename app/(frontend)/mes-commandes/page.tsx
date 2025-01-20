import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { Order, OrderItem } from "@prisma/client";
import OrderList from "@/components/frontend/orders/OrderList";
import BreadcrumbComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";

export interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}

const MesCommandes = async () => {
  const session = await getServerSession(authOptions);
  const orders = await getData(`/order/${session?.user.id}`);

  return (
    <section className="mx-auto max-w-[1200px]">
      <BreadcrumbComponent
        links={[{ name: "Mes Commandes", href: "/mes-commandes" }]}
      />
      <OrderList orders={orders} userId={session?.user.id || ""} pageSize={4} />
    </section>
  );
};

export default MesCommandes;
