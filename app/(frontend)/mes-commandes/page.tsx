import OrderComponent from "@/components/frontend/orders/Order";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { Order, OrderItem } from "@prisma/client";

import { getServerSession } from "next-auth";

interface OrderWithItems extends Order {
  orderItems: OrderItem[];
}
const MesCommandes = async () => {
  const session = await getServerSession(authOptions);
  const orders: OrderWithItems[] = await getData(`/order/${session?.user.id}`);

  return <OrderComponent orders={orders} />;
};

export default MesCommandes;
