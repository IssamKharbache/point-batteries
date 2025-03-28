import React, { useState } from "react";
import { ProductData } from "../table/TableActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSourceRetourStore } from "@/context/store";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";

interface ProductSelection {
  quantity: number;
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
  const [validationErrors, setValidationErrors] = useState<{
    [refProduct: string]: string;
  }>({});

  const [loading, setLoading] = useState<boolean>(false);

  const { setStep } = useSourceRetourStore();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const nomDuCaissier = session?.user.nom;

  const router = useRouter();

  // Filter products based on search and available stock
  const filteredProducts = productsVente.filter(
    (product) =>
      product.stock &&
      product.stock > 0 &&
      ((product.refProduct &&
        product.refProduct.toLowerCase().includes(search.toLowerCase())) ||
        product.designationProduit
          ?.toLowerCase()
          .includes(search.toLowerCase()))
  );

  // Handle selecting or deselecting a product
  const handleSelectedProduct = (product: ProductData) => {
    if (product.stock === 0) return;

    setProductsSelected((prev) => {
      if (prev[product.refProduct || ""]) {
        const newSelection = { ...prev };
        delete newSelection[product.refProduct || ""];
        return newSelection;
      }

      return {
        ...prev,
        [product.refProduct || ""]: {
          quantity: 1,
          selected: true,
        },
      };
    });
  };

  // Handle quantity changes with validation
  const handleQuantityChange = (refProduct: string, value: string) => {
    // Allow empty value for better UX when deleting
    if (value === "") {
      setProductsSelected((prev) => ({
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          quantity: 0, // Temporary value
        },
      }));
      return;
    }

    const quantity = parseInt(value);
    const product = productsVente.find((p) => p.refProduct === refProduct);

    if (!product) return;

    // Validate quantity
    if (isNaN(quantity)) {
      setValidationErrors((prev) => ({
        ...prev,
        [refProduct]: "Veuillez entrer une quantité valide",
      }));
      return;
    }

    if (quantity <= 0) {
      setValidationErrors((prev) => ({
        ...prev,
        [refProduct]: "La quantité doit être supérieure à zéro",
      }));
      return;
    }

    if (product.stock && quantity > product.stock) {
      setValidationErrors((prev) => ({
        ...prev,
        [refProduct]: `Quantité ne peut pas dépasser le stock (${product.stock})`,
      }));
      return;
    }

    // Clear any previous errors
    setValidationErrors((prev) => ({
      ...prev,
      [refProduct]: "",
    }));

    // Update quantity
    setProductsSelected((prev) => ({
      ...prev,
      [refProduct]: {
        ...prev[refProduct],
        quantity,
      },
    }));
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    // First, filter out any products with quantity 0
    const filteredSelections = Object.fromEntries(
      Object.entries(productSelected).filter(([, { quantity }]) => quantity > 0)
    );

    // If no products left after filtering
    if (Object.keys(filteredSelections).length === 0) {
      toast({
        title: "Erreur",
        description:
          "Veuillez sélectionner au moins un produit avec une quantité valide",
        variant: "destructive",
      });
      return;
    }

    // Update state with filtered selections
    setProductsSelected(filteredSelections);

    // Validate all quantities before submission
    let hasErrors = false;
    const newErrors: typeof validationErrors = {};

    Object.entries(filteredSelections).forEach(([refProduct, { quantity }]) => {
      const product = productsVente.find((p) => p.refProduct === refProduct);
      if (!product) return;

      if (quantity <= 0) {
        newErrors[refProduct] = "La quantité doit être supérieure à zéro";
        hasErrors = true;
      }

      if (product.stock && quantity > product.stock) {
        newErrors[
          refProduct
        ] = `Quantité dépasse le stock disponible (${product.stock})`;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setValidationErrors(newErrors);
      toast({
        title: "Erreur",
        description: "Veuillez corriger les quantités invalides",
        variant: "destructive",
      });
      return;
    }

    // Prepare the data that will be sent
    const products = Object.entries(filteredSelections).map(
      ([refProduct, { quantity }]) => {
        const product = productsVente.find((p) => p.refProduct === refProduct);
        return {
          refProduct,
          quantity,
          productId: product?.id,
          designationProduit: product?.designationProduit,
          marque: product?.marque,
        };
      }
    );
    setLoading(true);
    const allData = {
      products,
      userId,
      returnFrom: "product",
      nomDuCaissier,
    };
    try {
      const res = await axios.post("/api/retour", allData);
      if (res.status === 201) {
        setLoading(false);
        setStep(1);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
      }
      router.push("/dashboard/retour");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Chercher par référence ou désignation..."
              className="max-w-sm px-4 border border-gray-300 rounded-md focus:ring-[1px] focus:ring-primary"
            />
          </div>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-80 overflow-scroll">
            {filteredProducts.length === 0 ? (
              <div className="text-center font-semibold text-2xl text-gray-500">
                Aucun produit disponible
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.refProduct}
                  className={`flex justify-between items-center gap-4 m-4 cursor-pointer border p-3 hover:bg-slate-100 duration-200 rounded ${
                    productSelected[product.refProduct || ""]
                      ? "bg-slate-200 hover:bg-slate-300"
                      : ""
                  }`}
                  onClick={() => handleSelectedProduct(product)}
                >
                  <div>
                    <h1 className="font-semibold text-gray-700 text-xs md:text-md uppercase">
                      {product.designationProduit}
                    </h1>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                  {productSelected[product.refProduct || ""] && (
                    <span className="text-green-600">
                      <Check />
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Products */}
        <div className="space-y-4 bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
          <h1 className="text-xl font-semibold text-gray-600 mb-4">
            Produits à Retourner
          </h1>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-[345px] overflow-scroll">
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
                  if (!product) return null;

                  return (
                    <div
                      key={refProduct}
                      className="bg-slate-100 m-4 rounded-lg p-5 shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h1 className="font-semibold text-gray-700 text-sm md:text-md uppercase">
                            {product.designationProduit}
                          </h1>
                          <p className="text-sm text-gray-500">
                            Stock: {product.stock}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectedProduct(product);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X />
                        </button>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantité à retourner
                        </label>
                        <Input
                          type="number"
                          min={1}
                          max={product.stock || 0}
                          value={quantity || ""}
                          onChange={(e) =>
                            handleQuantityChange(refProduct, e.target.value)
                          }
                          className="px-4 bg-white w-full md:w-52 border-2 border-gray-300 rounded-md h-8 md:h-12"
                        />
                        {validationErrors[refProduct] && (
                          <p className="text-red-500 text-sm mt-1">
                            {validationErrors[refProduct]}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={loading}
          variant="outline"
          className="w-full md:w-32"
          onClick={handlePrevious}
        >
          <ChevronLeft size={18} />
          Précédent
        </Button>
        {loading ? (
          <LoadingButton
            bgColor="bg-black"
            textColor="text-white"
            className="px-7 py-2"
          />
        ) : (
          <Button className="w-full md:w-32" onClick={handleSubmit}>
            Valider
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectProductStep;
