import React, { useState } from "react";
import { ProductData } from "../table/TableActions";

interface SelectProductProps {
  productsVente: ProductData[];
}

const SelectProductStep = ({ productsVente }: SelectProductProps) => {
  const [selectedProducts, setSelectedProducts] = useState<{
    [refProduct: string]: boolean;
  }>({});

  // Filter out products with no stock
  const availableProducts = productsVente.filter(
    (product) => product.stock && product.stock > 0
  );

  const toggleProductSelection = (refProduct: string) => {
    setSelectedProducts((prev) => {
      // If product is already selected, remove it by setting to false
      // Otherwise add it by setting to true
      const newSelection = { ...prev, [refProduct]: !prev[refProduct] };

      // Clean up products that are set to false (optional)
      if (!newSelection[refProduct]) {
        delete newSelection[refProduct];
      }

      return newSelection;
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center m-10 gap-8">
      <div className="bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
        <h1 className="text-xl font-semibold text-gray-600 mb-4">
          Produits Disponibles
        </h1>
        <hr className="text-gray-400 mb-4" />
        <div className="container mx-auto py-10 h-80 overflow-scroll">
          {availableProducts.length === 0 ? (
            <div className="text-center font-semibold text-2xl text-gray-500">
              Aucun produit disponible
            </div>
          ) : (
            availableProducts.map((product) => (
              <div
                key={product.refProduct}
                className={`flex gap-4 m-4 cursor-pointer border p-3 hover:bg-slate-100 duration-200 rounded ${
                  selectedProducts[product.refProduct || ""]
                    ? "bg-slate-200 hover:bg-slate-300"
                    : ""
                }`}
                onClick={() => toggleProductSelection(product.refProduct || "")}
              >
                <div className="space-y-4">
                  <h1 className="font-semibold text-gray-700 text-xs md:text-md uppercase">
                    {product.designationProduit}
                  </h1>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="space-y-4 bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
        <h1 className="text-xl font-semibold text-gray-600 mb-4">
          Produits Sélectionnés
        </h1>
        <hr className="text-gray-400 mb-4" />
        <div className="container mx-auto py-10 h-[345px] overflow-scroll">
          {Object.keys(selectedProducts).length === 0 ? (
            <div className="text-center font-semibold text-2xl text-gray-500">
              Aucun produit sélectionné
            </div>
          ) : (
            Object.keys(selectedProducts).map((refProduct) => {
              const product = productsVente.find(
                (p) => p.refProduct === refProduct
              );
              return (
                product && (
                  <div
                    key={refProduct}
                    className="flex gap-4 bg-slate-100 m-4 rounded-lg p-5 shadow-md"
                    onClick={() => toggleProductSelection(refProduct)}
                  >
                    <div className="flex flex-col gap-2">
                      <h1 className="font-semibold text-gray-700 text-sm md:text-md uppercase">
                        {product.designationProduit}
                      </h1>
                    </div>
                  </div>
                )
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectProductStep;
