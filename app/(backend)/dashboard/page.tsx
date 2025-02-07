export const dynamic = "force-dynamic";

import OrdersStats from "@/components/backend/dashboard/OrdersStats";
import Statistics from "@/components/backend/dashboard/Statistics";
import { getData } from "@/lib/getData";
import { Order, User, OrderItem } from "@prisma/client";
import React from "react";

interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}

const MainPage = async () => {
  //users
  const users: User[] = await getData("/user");
  //getting only the users that are not admin and staff
  const filteredUsers = users.filter(
    (user) => user.role !== "ADMIN" && user.role !== "STAFF"
  );

  //orders
  const orders: OrderWithItems[] = await getData("/order");

  //filter orders
  const filteredOrders = orders.filter(
    (order) => order.orderStatus !== "ANNULLE"
  );

  const delivredOrders = orders.filter(
    (order) => order.orderStatus === "EXPEDIE"
  );

  //total revenue
  const totalRevenue = delivredOrders.reduce((acc, order) => {
    const orderTotal = order.orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return acc + orderTotal;
  }, 0);

  return (
    <div>
      <h1 className="text-4xl font-semibold mb-8">Overview</h1>
      <Statistics
        numberClient={filteredUsers.length}
        ordersNumber={filteredOrders.length}
        total={totalRevenue}
      />
      <OrdersStats orders={orders} />
    </div>
  );
};

export default MainPage;
