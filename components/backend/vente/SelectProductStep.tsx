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
  discount: string; // New discount field for each selected product
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
  const [validationErrors, setValidationErrors] = useState<{
    [refProduct: string]: string;
  }>({});

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

  useEffect(() => {
    setFilteredProducts(
      productsVente.filter(
        (product) =>
          product.stock &&
          product.stock > 0 &&
          ((product.refProduct &&
            product.refProduct.toLowerCase().includes(search.toLowerCase())) ||
            product.designationProduit
              ?.toLocaleLowerCase()
              .includes(search.toLowerCase()))
      )
    );
  }, [search, productsVente]);

  // Handle selecting or deselecting a product
  const handleSelectedProduct = (refProduct: string) => {
    const product = productsVente.find((p) => p.refProduct === refProduct);
    if (product && product.stock === 0) return;

    setProductsSelected((prev) => {
      const prevProduct = prev[refProduct];
      const newSelection = prevProduct
        ? omit(prev, refProduct)
        : {
            ...prev,
            [refProduct]: { quantity: "", selected: true, discount: "" },
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
    field: "quantity" | "discount",
    value: string
  ) => {
    if (!refProduct) return;

    // Get the product details to check the stock
    const product = productsVente.find((p) => p.refProduct === refProduct);

    // If field is 'quantity' and exceeds stock, show error message
    if (field === "quantity" && product) {
      const quantity = parseInt(value);
      if (product.stock && quantity > product.stock) {
        setValidationErrors((prev) => ({
          ...prev,
          [refProduct]: `La quantité ne peut pas dépasser le stock disponible (${product.stock}).`,
        }));
        return;
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          [refProduct]: "", // Clear error if valid
        }));
      }
    }

    // Continue with normal input update
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
    let hasErrors = false;
    const newValidationErrors: { [refProduct: string]: string } = {};

    // Check if the quantity exceeds stock for any product
    Object.entries(productSelected).forEach(([refProduct, { quantity }]) => {
      const product = productsVente.find((p) => p.refProduct === refProduct);
      if (product?.stock && parseInt(quantity) > product.stock) {
        newValidationErrors[
          refProduct
        ] = `La quantité ne peut pas dépasser le stock disponible (${product.stock}).`;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors((prev) => ({
        ...prev,
        ...newValidationErrors,
      }));
      return; // Prevent form submission if errors exist
    }

    const zeroQuantityProducts = Object.entries(productSelected).filter(
      ([, { quantity }]) => parseInt(quantity) === 0
    );

    if (zeroQuantityProducts.length > 0) {
      toast({
        title: "Erreur",
        description:
          "La quantité de certains produits ne peut pas être égale à zéro.",
        variant: "error",
      });
      return;
    }

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

    // Include the price and discount from productsVente
    const productsToSubmit = Object.keys(productSelected)
      .map((refProduct) => {
        const product = productsVente.find((p) => p.refProduct === refProduct);
        return product
          ? {
              refProduct,
              quantity: productSelected[refProduct].quantity,
              price: calculateDiscountedPrice(
                product.price,
                productSelected[refProduct].discount
              ),
              designationProduit: product.designationProduit,
              discount: productSelected[refProduct].discount, // Add the discount here
            }
          : null;
      })
      .filter(
        (
          product
        ): product is {
          refProduct: string;
          quantity: string;
          price: number;
          designationProduit: string;
          discount: string;
        } => product !== null
      );

    // Update the store with productsToSubmit that includes discount
    setProductsToSubmit(productsToSubmit);

    const isAnyProductSelected = Object.keys(productSelected).length > 0;
    if (isAnyProductSelected) {
      handleNext();
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez  sélectionner un produit au minimum.",
        variant: "error",
      });
    }
  };

  // Calculate the discounted price
  const calculateDiscountedPrice = (price: number, discount: string) => {
    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      return price; // Return the original price if the discount is invalid
    }
    return price - (price * discountValue) / 100;
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center m-10 gap-8">
        {/* Right Side: Available Products */}
        <div className=" bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%] ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-5">
            <h1 className="text-xl font-semibold text-gray-600 ">
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
                  productSelected[product.refProduct || ""] &&
                  "bg-slate-200 hover:bg-slate-300 text-white"
                }`}
                onClick={() => handleSelectedProduct(product.refProduct || "")}
              >
                <div className="space-y-4">
                  <h1 className="font-semibold text-gray-700 text-xs md:text-md uppercase">
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
          <div className="container mx-auto py-10 h-[345px] overflow-scroll">
            {Object.keys(productSelected).length === 0 ? (
              <div className="text-center font-semibold text-2xl text-gray-500">
                Aucun produit sélectionné
              </div>
            ) : (
              Object.entries(productSelected).map(
                ([refProduct, { quantity, discount }]) => {
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
                          <h1 className="font-semibold text-gray-700 text-sm md:text-md uppercase ">
                            {product.designationProduit}
                          </h1>

                          <div>
                            <Input
                              placeholder="Quantité"
                              className="px-4 bg-white w-full md:w-52 border-2 border-gray-300 rounded-md h-8 md:h-12 "
                              type="number"
                              min={0}
                              max={product.stock || 0}
                              value={quantity}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleInputChange(
                                  refProduct,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              disabled={product.stock === 0} // Disable input if stock is 0
                            />
                            {validationErrors[refProduct] && (
                              <div className="text-red-500 text-sm mt-1">
                                {validationErrors[refProduct]}
                              </div>
                            )}
                          </div>

                          <div>
                            <Input
                              placeholder="Remise"
                              className="px-4 bg-white w-full md:w-52 border-2 border-gray-300 rounded-md h-8 md:h-12 "
                              type="number"
                              min={0}
                              value={discount}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleInputChange(
                                  refProduct,
                                  "discount",
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
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          className="w-full md:w-32"
          onClick={handlePrevious}
        >
          <ChevronLeft size={18} />
          Précédent
        </Button>
        <Button className="w-full md:w-32" onClick={submit}>
          Valider
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default SelectProductStep;
