"use client";

import { DataTable } from "@/app/(backend)/dashboard/produit/data-table";
import { ProductData } from "../table/TableActions";
import { columns } from "@/app/(backend)/dashboard/produit/columnsTwo";

interface ProductsStockDataProps {
  filteredProducts: ProductData[];
}

const ProductsStockData = ({ filteredProducts }: ProductsStockDataProps) => {
  return (
    <div className="container mx-auto py-10 ">
      <DataTable columns={columns} data={filteredProducts} name="Produits" />
    </div>
  );
};

export default ProductsStockData;
