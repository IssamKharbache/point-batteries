"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSourceRetourStore } from "@/context/store";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { useState } from "react";

interface VenteProduct {
  productId: string;
  refProduct: string;
  designationProduit: string;
  marque: string;
  qty: number;
  price: number;
}

export interface VenteType {
  id: string;
  venteRef: string;
  clientNom: string;
  clientPrenom: string;
  products: VenteProduct[];
  createdAt: string;
}

interface ProductSelection {
  quantity: string;
  selected: boolean;
}

interface SelectFromVenteForReturnProps {
  ventes: VenteType[];
}

const SelectFromVenteForReturn = ({
  ventes,
}: SelectFromVenteForReturnProps) => {
  const [selectedVente, setSelectedVente] = useState<VenteType | null>(null);
  const [productSelected, setProductsSelected] = useState<{
    [refProduct: string]: ProductSelection;
  }>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { setStep } = useSourceRetourStore();
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const nomDuCaissier = session?.user.nom;
  const router = useRouter();

  // Filter ventes based on search
  const filteredVentes = ventes.filter(
    (vente) =>
      vente.venteRef.toLowerCase().includes(search.toLowerCase()) ||
      vente.clientNom.toLowerCase().includes(search.toLowerCase()) ||
      vente.clientPrenom.toLowerCase().includes(search.toLowerCase())
  );

  // Handle selecting a vente
  const handleSelectVente = (vente: VenteType) => {
    setSelectedVente(vente);
    // Initialize product selection
    const initialSelection = vente.products.reduce((acc, product) => {
      acc[product.refProduct] = {
        quantity: "1",
        selected: false,
      };
      return acc;
    }, {} as { [refProduct: string]: ProductSelection });
    setProductsSelected(initialSelection);
  };

  // Handle selecting/deselecting a product
  const handleSelectedProduct = (product: VenteProduct) => {
    setProductsSelected((prev) => {
      if (prev[product.refProduct]) {
        const newSelection = { ...prev };
        delete newSelection[product.refProduct];
        return newSelection;
      }

      return {
        ...prev,
        [product.refProduct]: {
          quantity: "1", // Default to 1 when selecting
          selected: true,
        },
      };
    });
  };

  // Handle quantity changes
  const handleQuantityChange = (refProduct: string, value: string) => {
    const product = selectedVente?.products.find(
      (p) => p.refProduct === refProduct
    );
    if (!product) return;

    // Allow empty value for better UX when deleting
    if (value === "") {
      setProductsSelected((prev) => ({
        ...prev,
        [refProduct]: {
          ...prev[refProduct],
          quantity: value,
        },
      }));
      return;
    }

    const quantity = parseInt(value);

    // Validate quantity
    if (isNaN(quantity)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une quantité valide",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0) {
      toast({
        title: "Erreur",
        description: "La quantité doit être supérieure à zéro",
        variant: "destructive",
      });
      return;
    }

    if (quantity > product.qty) {
      toast({
        title: "Erreur",
        description: `Quantité ne peut pas dépasser ${product.qty} (quantité vendue)`,
        variant: "destructive",
      });
      return;
    }

    setProductsSelected((prev) => ({
      ...prev,
      [refProduct]: {
        ...prev[refProduct],
        quantity: value,
      },
    }));
  };

  const handlePrevious = () => {
    if (selectedVente) {
      setSelectedVente(null);
    } else {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedVente) return;

    // Prepare products to return
    const productsToReturn = Object.entries(productSelected)
      .filter(([, { selected, quantity }]) => selected && quantity)
      .map(([refProduct, { quantity }]) => {
        const product = selectedVente.products.find(
          (p) => p.refProduct === refProduct
        );
        return {
          refProduct,
          quantity,
          marque: product?.marque || "",
          designationProduit: product?.designationProduit || "",
          productId: product?.productId || "",
        };
      });

    const allData = {
      products: productsToReturn,
      userId,
      returnFrom: "vente",
      nomDuCaissier,
      sourceId: selectedVente.id,
    };

    if (productsToReturn.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un produit",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/retour", allData);
      if (res.status === 201) {
        setLoading(false);
        setStep(1);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
        });
        router.push("/dashboard/retour");
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

  // Vente selection view
  if (!selectedVente) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Sélectionner une vente</h2>
        <Input
          placeholder="Rechercher une vente par ref..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-4 max-w-xl"
        />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {filteredVentes.map((vente) => (
            <div
              key={vente.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectVente(vente)}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{vente.venteRef}</p>
                  <p className="text-sm text-gray-600">
                    {vente.clientNom} {vente.clientPrenom}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    {new Date(vente.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {vente.products.length} produit(s)
                  </p>
                </div>
              </div>
            </div>
          ))}
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
        </div>
      </div>
    );
  }

  // Product selection view
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center m-10 gap-8">
        {/* Available Products */}
        <div className="bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setSelectedVente(null)}>
              <ChevronLeft size={16} className="mr-2" />
              Retour
            </Button>
            <h1 className="text-xl font-semibold">
              Vente: {selectedVente.venteRef}
            </h1>
          </div>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-80 overflow-scroll">
            {selectedVente.products.map((product) => (
              <div
                key={product.productId}
                className={`flex justify-between items-center gap-4 m-4 cursor-pointer border p-3 hover:bg-slate-100 duration-200 rounded ${
                  productSelected[product.refProduct]?.selected
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
                    Quantité vendue: {product.qty}
                  </p>
                </div>
                {productSelected[product.refProduct]?.selected && (
                  <span className="text-green-600">
                    <Check />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Products */}
        <div className="space-y-4 bg-white p-8 rounded-md border-2 w-full shadow-lg md:w-[50%]">
          <h1 className="text-xl font-semibold text-gray-600 mb-4">
            Produits à Retourner
          </h1>
          <hr className="text-gray-400 mb-4" />
          <div className="container mx-auto py-10 h-[345px] overflow-scroll">
            {Object.keys(productSelected).filter(
              (ref) => productSelected[ref].selected
            ).length === 0 ? (
              <div className="text-center font-semibold text-2xl text-gray-500">
                Aucun produit sélectionné
              </div>
            ) : (
              selectedVente.products
                .filter(
                  (product) => productSelected[product.refProduct]?.selected
                )
                .map((product) => (
                  <div
                    key={product.productId}
                    className="bg-slate-100 m-4 rounded-lg p-5 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="font-semibold text-gray-700 text-sm md:text-md uppercase">
                          {product.designationProduit}
                        </h1>
                        <p className="text-sm text-gray-500">
                          Quantité vendue: {product.qty}
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
                        min="1"
                        max={product.qty.toString()}
                        value={
                          productSelected[product.refProduct]?.quantity || ""
                        }
                        onChange={(e) =>
                          handleQuantityChange(
                            product.refProduct,
                            e.target.value
                          )
                        }
                        className="px-4 bg-white w-full md:w-52 border-2 border-gray-300 rounded-md h-8 md:h-12"
                      />
                    </div>
                  </div>
                ))
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
          <Button
            className="w-full md:w-32"
            onClick={handleSubmit}
            disabled={
              Object.values(productSelected).filter((p) => p.selected)
                .length === 0
            }
          >
            Valider
            <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectFromVenteForReturn;
