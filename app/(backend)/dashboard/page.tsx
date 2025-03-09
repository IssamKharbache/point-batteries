export const dynamic = "force-dynamic";

import OrdersStats from "@/components/backend/dashboard/OrdersStats";
import ProductsStockData from "@/components/backend/dashboard/ProductsStockData";
import Statistics from "@/components/backend/dashboard/Statistics";
import { ProductData } from "@/components/backend/table/TableActions";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { Order, User, OrderItem, VenteProduct, Vente } from "@prisma/client";
import { getServerSession } from "next-auth";
import React from "react";

interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}
interface VenteWithProducts extends Vente {
  products: VenteProduct[];
}

const MainPage = async () => {
  const session = await getServerSession(authOptions);
  //users
  const users: User[] = await getData("/user");
  //getting only the users that are normal clients
  const filteredUsers = users.filter((user) => user.role === "USER");

  //orders
  const orders: OrderWithItems[] = await getData("/order");

  //filter orders
  const filteredOrders = orders.filter(
    (order) => order.orderStatus !== "ANNULLE"
  );

  const delivredOrders = orders.filter(
    (order) => order.orderStatus === "EXPEDIE"
  );

  // Fetching ventes
  const ventes: VenteWithProducts[] = await getData("/vente");

  // Calculate total revenue from orders
  const orderRevenue = delivredOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return acc + orderTotal;
  }, 0);

  // Calculate total revenue from ventes
  const venteRevenue = ventes.reduce((acc, vente) => {
    const venteTotal = vente.products.reduce(
      (sum, product) => sum + (product.price ?? 0) * product.qty,
      0
    );
    return acc + venteTotal;
  }, 0);

  // Final total revenue
  const totalRevenue = orderRevenue + venteRevenue;
  if (session?.user.role === "CAISSIER") {
    return (
      <div>
        <h1 className="text-3xl">
          Bonjour,{" "}
          <span className="capitalize font-semibold text-3xl">
            {session.user.nom}
          </span>
        </h1>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">Overview</h1>
      <Statistics
        numberClient={filteredUsers.length}
        ordersNumber={filteredOrders.length}
        total={totalRevenue}
      />
      <OrdersStats orders={orders} />
      <ProductsStockData />
    </div>
  );
};

export default MainPage;
