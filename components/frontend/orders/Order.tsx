import Link from "next/link";
import React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BaggageClaim } from "lucide-react";
import MyOrders from "@/components/frontend/orders/MyOrders";
import { Button } from "@/components/ui/button";
import { Order, OrderItem } from "@prisma/client";

interface OrderProps {
  orders: Order[];
}

const OrderComponent = ({ orders }: OrderProps) => {
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
        {orders?.map((order, idx) => {
          return <MyOrders order={order} key={idx} />;
        })}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

export default OrderComponent;
