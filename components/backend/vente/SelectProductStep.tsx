import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { ProductData } from "../table/TableActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStepFormStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";

interface ProductSelection {
  quantity: string;
  selected: boolean;
}
interface SelectProductProps {
  productsVente: ProductData[];
}

const SelectProductStep = ({ productsVente }: SelectProductProps) => {
  const [search, setSearch] = useState("");
  const [productSelected, setProductsSelected] = useState<{
    [refProduct: string]: ProductSelection;
  }>({});
  const [filteredProducts, setFilteredProducts] =
    useState<ProductData[]>(productsVente);

  const { currentStep, setCurrentStep, setProductsToSubmit } =
    useStepFormStore();
  const { toast } = useToast();

  // Load data from local storage when the component mounts
  useEffect(() => {
    const savedProducts = localStorage.getItem("selectedProducts");
    if (savedProducts) {
      setProductsSelected(JSON.parse(savedProducts));
    }
  }, []);

  // useEffect to filter products based on search input
  useEffect(() => {
    setFilteredProducts(
      productsVente.filter(
        (product) =>
          product.refProduct &&
          product.refProduct.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, productsVente]);

  // Handle selecting or deselecting a product
  const handleSelectedProduct = (refProduct: string) => {
    setProductsSelected((prev) => {
      const prevProduct = prev[refProduct];
      const newSelection = prevProduct
        ? omit(prev, refProduct)
        : {
            ...prev,
            [refProduct]: { quantity: "", selected: true },
          };

      // Save the updated selection to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
      }

      return newSelection;
    });
  };

  // Handle changes to quantity input for a product
  const handleInputChange = (
    refProduct: string | null | undefined,
    field: "quantity",
    value: string
  ) => {
    if (!refProduct) return;

    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          [field]: value,
        },
      };

      // Save the updated selection to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "selectedProducts",
          JSON.stringify(updatedSelection)
        );
      }

      return updatedSelection;
    });
  };

  const handlePrevious = () => {
    if (currentStep === 1) {
      return;
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const submit = () => {
    // Validate if all selected products have both price and quantity filled
    const incompleteProducts = Object.entries(productSelected).filter(
      ([, { quantity }]) => !quantity
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

    const productsToSubmit = Object.keys(productSelected).map((refProduct) => ({
      refProduct,
      quantity: productSelected[refProduct].quantity,
    }));
    setProductsToSubmit(productsToSubmit);
    handleNext();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center m-10 gap-8">
        {/* Right Side: Available Products */}
        <div className=" bg-white p-8 rounded-md border-2 w-full   shadow-lg md:w-[50%] ">
          <div className="flex flex-col md:flex-row  justify-between items-center gap-4 mb-5">
            <h1 className="text-xl font-semibold text-gray-600 mb-4">
              Produits Disponibles
            </h1>
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher par référence..."
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
                  productSelected[product.refProduct || ""] &&
                  "bg-slate-200 hover:bg-slate-300 text-white"
                }`}
                onClick={() => handleSelectedProduct(product.refProduct || "")}
              >
                <div className="space-y-4">
                  <h1 className="font-semibold text-gray-700 text-xs md:text-md">
                    {product.designationProduit}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Left Side: Selected Products */}
        <div className="space-y-4 bg-white p-8 rounded-md border-2  w-full   shadow-lg md:w-[50%] ">
          <h1 className="text-xl font-semibold text-gray-600 mb-4">
            Produits Sélectionnés
          </h1>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-[368px] overflow-scroll">
            {Object.keys(productSelected).length === 0 ? (
              <div className="text-center font-semibold text-2xl text-gray-500">
                Aucun produit sélectionné
              </div>
            ) : (
              Object.entries(productSelected).map(
                ([refProduct, { quantity }]) => {
                  const product = productsVente.find(
                    (p) => p.refProduct === refProduct
                  );
                  return (
                    product && (
                      <div
                        key={refProduct}
                        className="flex gap-4 bg-slate-100 m-4 rounded-lg p-5 shadow-md"
                      >
                        <div className="flex flex-col gap-2">
                          <h1 className="font-semibold text-gray-700 text-sm md:text-md ">
                            {product.designationProduit}
                          </h1>

                          <div>
                            <Input
                              placeholder="Quantité"
                              className="px-4 bg-white w-full md:w-52 border-2 border-gray-300 rounded-md h-8 md:h-12 "
                              type="number"
                              min={0}
                              value={quantity}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleInputChange(
                                  refProduct,
                                  "quantity",
                                  e.target.value
                                )
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
      <div className="flex justify-center items-center gap-10">
        <Button disabled={currentStep === 1} onClick={handlePrevious}>
          <ChevronLeft />
          <span>Précédent</span>
        </Button>
        <Button
          disabled={Object.values(productSelected).every(
            (product) => !product.selected
          )}
          onClick={submit}
        >
          <span>Suivant</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default SelectProductStep;
