"use client";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { ProductData } from "../table/TableActions";
import { Button } from "@/components/ui/button";
import { omit } from "lodash";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface addAchatProps {
  productsAchat: ProductData[];
}

interface ProductSelection {
  quantity: string;
  selected: boolean;
}

const AddAchat = ({ productsAchat }: addAchatProps) => {
  const [search, setSearch] = React.useState("");
  const [productSelected, setProductsSelected] = React.useState<{
    [refProduct: string]: ProductSelection;
  }>({});
  const [filteredProducts, setFilteredProducts] =
    React.useState<ProductData[]>(productsAchat);
  const [loading, setLoading] = useState<boolean>(false);
  const [productType, setProductType] = useState<"achat" | "all">("achat");
  // Router and toast
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;

  // Filter products based on search and product type
  React.useEffect(() => {
    const searchWords = search
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    let filtered = productsAchat.filter((product) => {
      const searchableText = [product.designationProduit, product.refProduct]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchWords.every((word) => searchableText.includes(word));
    });

    filtered = filtered.filter((product) =>
      productType === "achat" ? product.isAchatProduct : !product.isAchatProduct
    );

    setFilteredProducts(filtered);
  }, [search, productsAchat, productType]);

  // Handlers
  const handleSelectedProduct = (refProduct: string) => {
    setProductsSelected((prev) => {
      const prevProduct = prev[refProduct];
      return prevProduct
        ? omit(prev, refProduct)
        : {
            ...prev,
            [refProduct]: { quantity: "", selected: true },
          };
    });
  };

  const handleInputChange = (
    refProduct: string | null | undefined,
    field: "quantity",
    value: string
  ) => {
    if (!refProduct) return;

    setProductsSelected((prev) => ({
      ...prev,
      [refProduct]: {
        ...prev[refProduct],
        [field]: value,
      },
    }));
  };

  const resetInputs = () => {
    setProductsSelected({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Validate if all selected products have quantity filled
    const incompleteProducts = Object.entries(productSelected).filter(
      ([, { quantity }]) => !quantity
    );

    if (incompleteProducts.length > 0) {
      setLoading(false);
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

    try {
      const res = await axios.post("/api/achat", {
        products: productsToSubmit,
        userId,
      });
      if (res.status === 201) {
        router.push("/dashboard/achat");
        resetInputs();
        setLoading(false);
        setProductsSelected((prev) =>
          Object.fromEntries(
            Object.entries(prev).map(([key, value]) => [
              key,
              { ...value, selected: false },
            ])
          )
        );
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
      }
    } catch (__error) {
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "error",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with tabs and search */}
      <div className="flex flex-col gap-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ajouter un Achat</h1>

        <div className="flex flex-col  gap-6">
          <Tabs
            defaultValue="achat"
            className="w-full"
            onValueChange={(value) => setProductType(value as "achat" | "all")}
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-12">
              <TabsTrigger
                value="achat"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Produits Achat
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Tous les Produits
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par référence ou designation..."
              className="w-full md:w-80 px-5"
            />

            {loading ? (
              <LoadingButton
                textColor="text-white"
                bgColor="bg-primary"
                className="px-8 h-10"
              />
            ) : (
              <Button
                disabled={Object.values(productSelected).every(
                  (product) => !product.selected
                )}
                onClick={handleSubmit}
                className="h-10 px-6"
              >
                Créer Achat
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Products list */}
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center font-semibold text-lg text-gray-500 mb-4">
              Aucun produit disponible
            </div>
            <Link href="/dashboard/achat/produit/ajouter">
              <Button className="rounded-lg px-6 py-2">
                Ajouter un Produit
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product, idx) => (
              <div
                onClick={() => handleSelectedProduct(product.refProduct || "")}
                key={idx}
                className={`flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer  ${
                  productSelected[product?.refProduct || ""]
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-5 h-5 mt-1 rounded ${
                    productSelected[product?.refProduct || ""]
                      ? "bg-primary"
                      : "border-2 border-gray-400"
                  }`}
                >
                  {productSelected[product?.refProduct || ""] && (
                    <Check className="text-white" size={15} />
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {product.designationProduit}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Réf: {product.refProduct}
                      </p>
                    </div>
                    {product.isAchatProduct && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Produit Achat
                      </span>
                    )}
                  </div>

                  {productSelected[product?.refProduct || ""] && (
                    <div className="mt-3">
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">
                          Quantité:
                        </label>
                        <Input
                          placeholder="Quantité"
                          className="w-32 bg-white px-3"
                          type="number"
                          min={0}
                          value={
                            productSelected[product.refProduct ?? ""]
                              ?.quantity || ""
                          }
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) =>
                            handleInputChange(
                              product.refProduct,
                              "quantity",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAchat;
