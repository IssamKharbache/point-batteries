"use client";

import React, { useEffect, useState } from "react";
import { BaggageClaim, Loader2 } from "lucide-react";
import Link from "next/link";
import MyOrders from "@/components/frontend/orders/MyOrders";
import { Button } from "@/components/ui/button";
import { OrderWithItems } from "@/app/(frontend)/mes-commandes/page";
import { useOrderPaginationStore } from "@/context/store";
import axios from "axios";
import PaginationComponent from "../pagination/Pagination";

interface OrderListProps {
  orders: OrderWithItems[] | undefined;
  userId: string;
  pageSize: number;
}

const OrderList: React.FC<OrderListProps> = ({ orders, userId, pageSize }) => {
  const { page, setPage, trackOrder, setTrackOrder } =
    useOrderPaginationStore();
  const [orderData, setOrderData] = useState<OrderWithItems[]>(orders || []);
  const [resultLength, setResultLength] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil((orders?.length || 0) / pageSize);

  // Fetch paginated data on page change
  useEffect(() => {
    const fetchPaginationData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/order/${userId}?pageNum=${page}&pageSize=${pageSize}`
        );
        const data = res.data.data;
        setOrderData(data);
        setResultLength(res.data.totalCount);
        setTrackOrder(false);
      } catch (error) {
        console.error("Failed to fetch paginated orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaginationData();
  }, [page, userId, pageSize, trackOrder, setTrackOrder]);

  return (
    <div>
      {/* Empty state */}
      {!loading && orderData.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 space-y-8">
          <div className="bg-gray-200 p-6 rounded-full">
            <BaggageClaim size={40} />
          </div>
          <h1 className="font-semibold text-2xl md:text-4xl mt-8 text-center">
            Vous n&apos;avez placé aucune commande !
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
      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-[550px]">
          <Loader2 className="animate-spin" size={45} />
        </div>
      ) : (
        <>
          {/* Orders List */}
          {orders && orders?.length >= 1 && (
            <div className="p-8">
              <h1 className=" font-semibold text-2xl mb-8">Mes Commandes</h1>

              {orderData.map((order, idx) => (
                <MyOrders order={order} key={idx} />
              ))}
            </div>
          )}

          {/* Pagination Component */}
          {orders && orders?.length >= 1 && (
            <div className="p-8">
              <PaginationComponent
                pageSize={pageSize}
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                resultLength={resultLength}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderList;
