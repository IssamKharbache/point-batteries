"use client";

import { DataTable } from "@/app/(backend)/dashboard/produit/data-table";
import { ProductData } from "../table/TableActions";
import { columns } from "@/app/(backend)/dashboard/produit/columnsTwo";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

import { CSVLink } from "react-csv";

import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
interface ProductsStockDataProps {
  filteredProducts: ProductData[];
}

const ProductsStockData = ({ filteredProducts }: ProductsStockDataProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Fiche de stock`,
  });

  const extractProductData = (products: ProductData[]) => {
    return products.map((product) => ({
      designation: product.designationProduit,
      refProduit: product.refProduct,
      prix: product.price,
      stock: product.stock,
    }));
  };
  const simplifiedProducts = extractProductData(filteredProducts);

  return (
    <div className="container mx-auto py-10 ">
      {/* Print Button */}
      <div className="flex items-center justify-end">
        <Button className="mb-4 rounded-xl" onClick={() => reactToPrintFn()}>
          <Printer />
          <span>Imprimer</span>
        </Button>

        <CSVLink filename="Fiche de stock" data={simplifiedProducts}>
          <Button className="mb-4 rounded-xl ml-2 bg-green-600 hover:bg-green-700">
            <PiMicrosoftExcelLogoFill />
            <span>Exporter</span>
          </Button>
        </CSVLink>
      </div>
      <p className="text-xl">
        <span className="font-semibold">{filteredProducts.length}</span> Produit
      </p>
      <DataTable columns={columns} data={filteredProducts} name="Produits" />

      {/* Hidden Table for Printing */}
      <div style={{ display: "none" }}>
        <div className="m-5" ref={contentRef}>
          <div className="flex justify-between items-center">
            <h1 className="mb-8 text-3xl font-semibold">Fiche de stock</h1>
            <p className="text-xl">
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              Produit
            </p>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Désignation Produit
                </th>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Stock
                </th>
                <th style={{ border: "1px solid #000", padding: "8px" }}>
                  Référence
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {product.designationProduit}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {product.stock}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px" }}>
                    {product.refProduct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsStockData;
