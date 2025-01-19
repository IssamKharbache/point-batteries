"use client";

import React from "react";
import { useOrderDetailsStore } from "@/context/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailsDialog from "./OrderDetailsDialog";
import { Order } from "@prisma/client";

interface OrderDetailsActionsProps {
  order: Order;
}

const OrderDetailsActions = ({ order }: OrderDetailsActionsProps) => {
  const { setOpenDialog, setSelectedOrder } = useOrderDetailsStore();

  const handleViewDetails = () => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-2 focus:outline-none focus:border-none py-4 mt-2 mr-2"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleViewDetails}>
            Voir les détails
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <OrderDetailsDialog />
    </>
  );
};

export default OrderDetailsActions;
