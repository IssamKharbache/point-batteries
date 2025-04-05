import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { ProductData } from "../table/TableActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useDevisStepFormStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";

interface ProductSelection {
  quantity: string;
  selected: boolean;
}

interface SelectProductProps {
  productsVente: ProductData[];
}

const SelectProductsForDevis = ({ productsVente }: SelectProductProps) => {
  const [search, setSearch] = useState("");
  const [productSelected, setProductsSelected] = useState<{
    [productId: string]: ProductSelection;
  }>({});
  const [filteredProducts, setFilteredProducts] =
    useState<ProductData[]>(productsVente);

  const { currentStep, setCurrentStep, setProductsToSubmit } =
    useDevisStepFormStore();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.removeItem("devisSelectedProducts");
    const savedProducts = localStorage.getItem("devisSelectedProducts");
    if (savedProducts) {
      setProductsSelected(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    const searchWords = search.toLowerCase().split(/\s+/).filter(Boolean);

    setFilteredProducts(
      productsVente.filter((product) => {
        const productName = product.designationProduit?.toLowerCase() || "";
        const productRef = product.refProduct?.toLowerCase() || "";

        return searchWords.every(
          (word) => productName.includes(word) || productRef.includes(word)
        );
      })
    );
  }, [search, productsVente]);

  const handleSelectedProduct = (productId: string) => {
    setProductsSelected((prev) => {
      const prevProduct = prev[productId];
      const newSelection = prevProduct
        ? omit(prev, productId)
        : {
            ...prev,
            [productId]: {
              quantity: "1",
              selected: true,
            },
          };

      localStorage.setItem(
        "devisSelectedProducts",
        JSON.stringify(newSelection)
      );
      return newSelection;
    });
  };

  const handleInputChange = (productId: string, value: string) => {
    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: value,
        },
      };

      localStorage.setItem(
        "devisSelectedProducts",
        JSON.stringify(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const submit = () => {
    const incompleteProducts = Object.entries(productSelected).filter(
      ([, { quantity }]) => !quantity || quantity === "0"
    );

    if (incompleteProducts.length > 0) {
      toast({
        title: "Erreur",
        description:
          "Veuillez remplir la quantité pour chaque produit sélectionné.",
        variant: "error",
      });
      return;
    }

    const productsToSubmit = Object.keys(productSelected)
      .map((productId) => {
        const product = productsVente.find((p) => p.id === productId);
        if (!product || !product.refProduct || !product.designationProduit)
          return null;

        return {
          refProduct: product.refProduct,
          quantity: productSelected[productId].quantity,
          price: product.price,
          designationProduct: product.designationProduit,
          marque: product.marque,
        };
      })
      .filter(
        (product): product is NonNullable<typeof product> => product !== null
      );

    setProductsToSubmit(productsToSubmit);

    if (productsToSubmit.length > 0) {
      handleNext();
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit au minimum.",
        variant: "error",
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center m-10 gap-8">
        {/* Available Products */}
        <div className="bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
            <h1 className="text-xl font-semibold text-gray-600">
              Produits Disponibles
            </h1>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher par référence our designation..."
              className="max-w-sm px-4 border border-gray-300 rounded-md focus:ring-[1px] focus:ring-primary"
            />
          </div>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-80 overflow-scroll">
            {filteredProducts.length === 0 && (
              <div className="text-center font-semibold text-2xl text-gray-500">
                Aucun résultat
              </div>
            )}
            {filteredProducts.map((product, idx) => (
              <div
                key={idx}
                className={`flex gap-4 m-4 cursor-pointer border p-3 hover:bg-slate-100 duration-200 rounded ${
                  productSelected[product.id] &&
                  "bg-slate-200 hover:bg-slate-300 text-white"
                }`}
                onClick={() => handleSelectedProduct(product.id)}
              >
                <div className="space-y-4">
                  <h1 className="font-semibold text-gray-700 text-xs md:text-md uppercase">
                    {product.designationProduit}
                  </h1>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>Ref: {product.refProduct}</span>
                    <span>|</span>
                    <span>Marque: {product.marque}</span>
                    <span>|</span>
                    <span>Prix: {product.price} DH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Products */}
        <div className="space-y-4 bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
          <h1 className="text-xl font-semibold text-gray-600 mb-4">
            Produits Sélectionnés
          </h1>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-[345px] overflow-scroll">
            {Object.keys(productSelected).length === 0 ? (
              <div className="text-center font-semibold text-2xl text-gray-500">
                Aucun produit sélectionné
              </div>
            ) : (
              Object.entries(productSelected).map(
                ([productId, { quantity }]) => {
                  const product = productsVente.find((p) => p.id === productId);
                  return (
                    product && (
                      <div
                        key={productId}
                        className="flex gap-4 bg-slate-100 m-4 rounded-lg p-5 shadow-md relative"
                      >
                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectedProduct(productId);
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                          <h1 className="font-semibold text-gray-700 text-sm md:text-md uppercase">
                            {product.designationProduit}
                          </h1>
                          <div className="flex gap-2 text-xs text-gray-500 mb-2">
                            <span>Ref: {product.refProduct}</span>
                            <span>|</span>
                            <span>Marque: {product.marque}</span>
                            <span>|</span>
                            <span>Prix: {product.price} DH</span>
                          </div>

                          <div>
                            <Input
                              placeholder="Quantité"
                              className="px-4 bg-white w-full border-2 border-gray-300 rounded-md h-12"
                              type="number"
                              min="1"
                              value={quantity}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleInputChange(productId, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )
                  );
                }
              )
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 gap-4 max-w-xl mx-auto">
        <Button className="w-full md:w-32" onClick={submit}>
          Valider
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SelectProductsForDevis;
