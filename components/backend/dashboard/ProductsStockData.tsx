"use client";

import React, { useState, useEffect } from "react";
import { ProductData } from "../table/TableActions";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Copy, RefreshCw, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getData } from "@/lib/getData";

const ProductsStockData = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await getData("/product");
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Statistique des produits</h1>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          {loading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <RefreshCw size={20} />
          )}
          {loading ? "Mise à jour..." : "Actualiser"}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader className="animate-spin text-blue-500" size={40} />
        </div>
      ) : (
        <Table className="mt-12">
          <TableCaption>Liste des produits</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Designation produit</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Ref produit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product, idx) => (
                <TableRow key={idx} className="border-b">
                  <TableCell className="font-medium p-5 ">
                    {product.designationProduit}
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell
                    onClick={() => {
                      navigator.clipboard
                        .writeText(product.refProduct || "")
                        .then(() => {
                          toast({
                            title: "Copié",
                            description: "La référence du produit a été copiée",
                            variant: "success",
                            duration: 4000,
                          });
                          setCopiedRef(product.refProduct);
                          setTimeout(() => setCopiedRef(null), 4000);
                        })
                        .catch((error) =>
                          console.error("Failed to copy: ", error)
                        );
                    }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    {copiedRef === product.refProduct ? (
                      <Check size={20} />
                    ) : (
                      <Copy size={20} />
                    )}
                    <span>{product.refProduct}</span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Aucun produit trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ProductsStockData;
