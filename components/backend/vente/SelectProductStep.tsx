import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { ProductData } from "../table/TableActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useStepFormStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";

interface ProductSelection {
  quantity: string;
  selected: boolean;
  discount: string;
  codeGarantie: string;
  useManualPrice: boolean;
  manualPrice: string;
  hasCommission: boolean;
  commission: string;
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

  useEffect(() => {
    localStorage.removeItem("selectedProducts");
    const savedProducts = localStorage.getItem("selectedProducts");
    if (savedProducts) {
      setProductsSelected(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    const searchWords = search.toLowerCase().split(/\s+/).filter(Boolean);

    setFilteredProducts(
      productsVente.filter((product) => {
        if (!product.stock || product.stock <= 0) return false;

        const productName = product.designationProduit?.toLowerCase() || "";
        const productRef = product.refProduct?.toLowerCase() || "";

        return searchWords.every(
          (word) => productName.includes(word) || productRef.includes(word)
        );
      })
    );
  }, [search, productsVente]);

  const handleSelectedProduct = (refProduct: string) => {
    const product = productsVente.find((p) => p.refProduct === refProduct);
    if (product && product.stock === 0) return;

    setProductsSelected((prev) => {
      const prevProduct = prev[refProduct];
      const newSelection = prevProduct
        ? omit(prev, refProduct)
        : {
            ...prev,
            [refProduct]: {
              quantity: "",
              selected: true,
              discount: "",
              codeGarantie: "",
              useManualPrice: false,
              manualPrice: "",
              hasCommission: false,
              commission: "0",
            },
          };

      localStorage.setItem("selectedProducts", JSON.stringify(newSelection));
      return newSelection;
    });
  };

  const handleCommissionCheckboxChange = (
    refProduct: string,
    checked: boolean
  ) => {
    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          hasCommission: checked,
          commission: checked ? prev[refProduct].commission || "0" : "0",
        },
      };

      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleCommissionChange = (refProduct: string, value: string) => {
    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          commission: value,
        },
      };

      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleInputChange = (
    refProduct: string | null | undefined,
    field: "quantity" | "discount" | "codeGarantie",
    value: string
  ) => {
    if (!refProduct) return;

    const product = productsVente.find((p) => p.refProduct === refProduct);

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
          [refProduct]: "",
        }));
      }
    }

    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          [field]: value,
        },
      };

      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleCheckboxChange = (refProduct: string, checked: boolean) => {
    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          useManualPrice: checked,
        },
      };

      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleManualPriceChange = (refProduct: string, value: string) => {
    setProductsSelected((prev) => {
      const updatedSelection = {
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          manualPrice: value,
        },
      };

      localStorage.setItem(
        "selectedProducts",
        JSON.stringify(updatedSelection)
      );
      return updatedSelection;
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const submit = () => {
    let hasErrors = false;
    const newValidationErrors: { [refProduct: string]: string } = {};

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
      return;
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

    const productsToSubmit = Object.keys(productSelected)
      .map((refProduct) => {
        const product = productsVente.find((p) => p.refProduct === refProduct);
        if (!product) return null;

        const quantity = parseInt(productSelected[refProduct].quantity);
        const discount = parseFloat(productSelected[refProduct].discount);
        const commission = productSelected[refProduct].hasCommission
          ? parseFloat(productSelected[refProduct].commission) || 0
          : 0;

        const price =
          productSelected[refProduct].useManualPrice &&
          productSelected[refProduct].manualPrice &&
          !isNaN(parseFloat(productSelected[refProduct].manualPrice))
            ? parseFloat(productSelected[refProduct].manualPrice)
            : product.price;

        const totalAchatPrice = product.achatPrice * quantity;
        const totalPriceAfterDiscount = price * quantity - (discount || 0);
        const productVenteBenifit =
          totalPriceAfterDiscount - totalAchatPrice - commission;

        return {
          refProduct,
          quantity: productSelected[refProduct].quantity,
          price,
          designationProduit: product.designationProduit,
          marque: product.marque,
          discount: productSelected[refProduct].discount,
          codeGarantie: productSelected[refProduct].codeGarantie,
          productVenteBenifit,
          commission: productSelected[refProduct].hasCommission
            ? commission
            : 0,
        };
      })
      .filter(
        (product): product is NonNullable<typeof product> => product !== null
      );
    setProductsToSubmit(productsToSubmit);

    setProductsToSubmit(productsToSubmit);

    if (productsToSubmit.length > 0) {
      handleNext();
      console.log(productsToSubmit);
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
                  productSelected[product.refProduct || ""] &&
                  "bg-slate-200 hover:bg-slate-300 text-white"
                }`}
                onClick={() => handleSelectedProduct(product.refProduct || "")}
              >
                <div className="space-y-4">
                  <h1 className="font-semibold text-gray-700 text-xs md:text-md uppercase">
                    {product.designationProduit}
                  </h1>
                  <div className="flex gap-2 text-xs text-gray-500 mb-2">
                    <span>Ref: {product.refProduct}</span>
                    <span>|</span>
                    <span>Marque: {product.marque}</span>
                    <span>|</span>
                    <span>Prix: {product.price} DH</span>
                    <span>|</span>
                    <span>Stock: {product.stock}</span>
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
                ([refProduct, { quantity, discount }]) => {
                  const product = productsVente.find(
                    (p) => p.refProduct === refProduct
                  );
                  return (
                    product && (
                      <div
                        key={refProduct}
                        className="flex gap-4 bg-slate-100 m-4 rounded-lg p-5 shadow-md relative"
                      >
                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectedProduct(refProduct);
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <X size={18} />
                          </button>
                          <h1 className="font-semibold text-gray-700 text-sm md:text-md uppercase">
                            {product.designationProduit}
                          </h1>
                          <div>
                            <Input
                              placeholder="Quantité"
                              className="px-4 bg-white w-full border-2 border-gray-300 rounded-md h-12"
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
                              disabled={product.stock === 0}
                            />
                            {validationErrors[refProduct] && (
                              <div className="text-red-500 text-sm mt-1">
                                {validationErrors[refProduct]}
                              </div>
                            )}
                          </div>
                          <div>
                            <Input
                              placeholder="Code Garantie"
                              className="px-4 bg-white w-full border-2 border-gray-300 rounded-md h-12 mt-2"
                              value={productSelected[refProduct].codeGarantie}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleInputChange(
                                  refProduct,
                                  "codeGarantie",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Remise"
                              className="px-4 bg-white w-full border-2 border-gray-300 rounded-md h-12"
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
                          <div className="flex flex-col ">
                            {/* Manual Price Checkbox */}
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`manual-price-${refProduct}`}
                                checked={
                                  productSelected[refProduct].useManualPrice
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    refProduct,
                                    e.target.checked
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <label
                                htmlFor={`manual-price-${refProduct}`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Prix manuel
                              </label>
                            </div>
                            {productSelected[refProduct].useManualPrice && (
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Prix normal: {product.price} DH
                                </p>
                                <Input
                                  placeholder="Prix manuel"
                                  className="px-4 bg-white w-full border-2 border-gray-300 rounded-md h-12"
                                  type="number"
                                  min={0}
                                  value={
                                    productSelected[refProduct].manualPrice
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    handleManualPriceChange(
                                      refProduct,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            )}

                            {/* Commission Checkbox */}
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`commission-${refProduct}`}
                              checked={
                                productSelected[refProduct].hasCommission
                              }
                              onChange={(e) =>
                                handleCommissionCheckboxChange(
                                  refProduct,
                                  e.target.checked
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                              htmlFor={`commission-${refProduct}`}
                              className="text-sm font-medium text-gray-700"
                            >
                              Commission
                            </label>
                          </div>
                          {productSelected[refProduct].hasCommission && (
                            <div className="w-full max-w-xs">
                              <label
                                htmlFor={`commission-amount-${refProduct}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Montant de commission (DH)
                              </label>
                              <Input
                                id={`commission-amount-${refProduct}`}
                                placeholder="50.00"
                                className="px-4 bg-white w-full border-2 border-gray-300 rounded-md h-10"
                                type="number"
                                min={0}
                                step="0.01"
                                value={productSelected[refProduct].commission}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleCommissionChange(
                                    refProduct,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
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

export default SelectProductStep;
