"use client";
import { Order } from "@prisma/client";
import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getData } from "@/lib/getData";
import { useLoadingStore, useOrderBackendStore } from "@/context/store";
import axios from "axios";

type TableData = {
  data: Order[];
};

const TableComponent = ({ data }: TableData) => {
  const [orderData, setOrderData] = useState<Order[]>(data);
  const { isRefresh, setIsRefresh } = useOrderBackendStore();
  const { setLoading } = useLoadingStore();

  React.useEffect(() => {
    const refreshData = async () => {
      try {
        const res = await axios.get("/api/order");
        setOrderData(res.data.data);
        setIsRefresh(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    refreshData();
  }, [isRefresh, setIsRefresh]);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orderData} name={"Commande"} />
    </div>
  );
};

export default TableComponent;
