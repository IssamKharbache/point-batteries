import { Order } from "@prisma/client";
import React from "react";
import { FaCheck, FaShippingFast } from "react-icons/fa";
import { IoCart } from "react-icons/io5";
import { MdOutlineDoNotDisturb, MdOutlinePendingActions } from "react-icons/md";
import SingleSmallCard from "./SingleSmallCard";
import { CheckCheck, RefreshCcw } from "lucide-react";
interface OrderStatsProps {
  orders: Order[];
}
const OrdersStats = ({ orders }: OrderStatsProps) => {
  const orderStatus = {
    pending: "EN_ATTENTE",
    confirmed: "CONFIRMER",
    processing: "EN_COURS",
    delivering: "EXPEDIE",
    shipping: "LIVRE",
    cancelled: "ANNULLE",
  };
  const getOrdersCountByStatus = (status: string) => {
    const filteredOrders = orders.filter(
      (order) => order.orderStatus === status
    );
    const count = filteredOrders.length;
    return count;
  };
  const pending = getOrdersCountByStatus(orderStatus.pending);
  const confirmed = getOrdersCountByStatus(orderStatus.confirmed);
  const processedOrdersCount = getOrdersCountByStatus(orderStatus.processing);
  const deliveringOrdersCount = getOrdersCountByStatus(orderStatus.delivering);
  const shippedOrdersCount = getOrdersCountByStatus(orderStatus.shipping);
  const cancelledOrdersCount = getOrdersCountByStatus(orderStatus.cancelled);

  const ordersStats = [
    {
      title: "Total Commande",
      orders: orders.length,
      iconBg: "bg-slate-500   text-white text-xl",
      icon: <IoCart />,
    },
    {
      title: "Commande en attente",
      orders: pending,
      iconBg: "bg-gray-400 text-white text-xl",
      icon: <MdOutlinePendingActions />,
    },
    {
      title: "Commande confirmer",
      orders: confirmed,
      iconBg: "bg-gray-500  text-white text-xl",
      icon: <FaCheck />,
    },

    {
      title: "Commande en cours",
      orders: processedOrdersCount,
      iconBg: "bg-blue-400  text-white text-xl",
      icon: <RefreshCcw />,
    },
    {
      title: "Commande expedié",
      orders: shippedOrdersCount,
      iconBg: "bg-green-400  text-white text-xl",
      icon: <FaShippingFast />,
    },
    {
      title: "Commande Livré",
      orders: deliveringOrdersCount,
      iconBg: "bg-green-600  text-white text-xl",
      icon: <CheckCheck />,
    },
    {
      title: "Commande annulé",
      orders: cancelledOrdersCount,
      iconBg: "bg-red-500  text-white text-xl",
      icon: <MdOutlineDoNotDisturb />,
    },
  ];
  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3  gap-4 py-8">
      {ordersStats.map((orders, i) => {
        return <SingleSmallCard key={i} data={orders} />;
      })}
    </div>
  );
};

export default OrdersStats;
