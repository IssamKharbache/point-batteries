"use client";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { ProductData } from "../table/TableActions";
import { Button } from "@/components/ui/button";
import { omit } from "lodash";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface addAchatProps {
  productsAchat: ProductData[];
}

interface ProductSelection {
  quantity: string;
  selected: boolean;
}

const AddAchat = ({ productsAchat }: addAchatProps) => {
  //states
  const [search, setSearch] = React.useState("");
  const [productSelected, setProductsSelected] = React.useState<{
    [refProduct: string]: ProductSelection;
  }>({});
  const [filteredProducts, setFilteredProducts] =
    React.useState<ProductData[]>(productsAchat);
  const [loading, setLoading] = useState<boolean>(false);

  //use Effect to make search functionality
  React.useEffect(() => {
    setFilteredProducts(
      productsAchat.filter(
        (product) =>
          product.refProduct &&
          product.refProduct.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, productsAchat]);
  //router
  const router = useRouter();
  //
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;

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
    // Validate if all selected products have both price and quantity filled
    const incompleteProducts = Object.entries(productSelected).filter(
      ([_, { quantity }]) => !quantity
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
      if (res.statusText === "created") {
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
      <div className="flex gap-8 container mx-auto py-5 items-end justify-end ">
        {loading ? (
          <LoadingButton
            textColor="text-white"
            bgColor="bg-primary"
            className="px-8"
          />
        ) : (
          <Button
            disabled={Object.values(productSelected).every(
              (product) => !product.selected
            )}
            onClick={handleSubmit}
            className="py-6 rounded"
          >
            Créer
          </Button>
        )}
        <Input
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Chercher par reference..."
          className="max-w-md px-4 "
        />
      </div>
      <div className="space-y-2 bg-white p-10 rounded-md border-2 md:w-[750px] mt-8 container mx-auto py-5 ">
        <h1 className="text-xl text-start text-gray-600 ">Ajouter Achat</h1>
        <hr className="text-gray-400 " />
        <div className="container mx-auto py-10 ">
          {filteredProducts.length === 0 && (
            <div className="text-center font-semibold text-2xl">
              Aucun resultat
            </div>
          )}
          {filteredProducts.map((product, idx) => (
            <div
              key={idx}
              className={`flex gap-4  bg-slate-100 m-4 rounded p-5 cursor-pointer `}
            >
              {productSelected[product?.refProduct || ""] ? (
                <div
                  onClick={() => {
                    handleSelectedProduct(product.refProduct || "");
                  }}
                  className="flex items-center justify-center w-5 h-5 fill-black bg-black rounded"
                >
                  <Check className="text-white" size={15} />
                </div>
              ) : (
                <div
                  onClick={() => {
                    handleSelectedProduct(product.refProduct || "");
                  }}
                  className="p-2 border-2 border-black/60 rounded h-5"
                ></div>
              )}

              <div className="space-y-4">
                <h1 className="font-semibold">{product.designationProduit}</h1>
                <div className="flex items-center gap-4">
                  <p>Ref : </p>
                  <p className="font-semibold">{product.refProduct}</p>
                </div>
                {productSelected[product?.refProduct || ""] && (
                  <div className="flex items-center gap-8">
                    <Input
                      placeholder="Quantite"
                      className="px-4 bg-white max-w-sm"
                      type="number"
                      min={0}
                      value={
                        productSelected[product.refProduct ?? ""]?.quantity ||
                        ""
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
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddAchat;
