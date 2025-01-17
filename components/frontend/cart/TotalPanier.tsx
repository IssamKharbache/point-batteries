"use client";

import { useCartStore } from "@/context/store";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TotalPanier = () => {
  const {
    cartItems,
    setLivraison: setLivraisonStore,
    livraison: livraisonStore,
  } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [livraison, setLivraison] = useState<string>(
    livraisonStore === 0 ? "gratuite" : "autreville"
  );

  const router = useRouter();
  // Check if the component has mounted (to prevent hydration mismatch)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const sousTotal =
    isHydrated && Array.isArray(cartItems)
      ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      : 0;

  // Function to handle change
  const handleChange = (value: string) => {
    setLivraison(value);
  };

  const commander = () => {
    if (livraison === "gratuite") {
      setLivraisonStore(0);
    } else {
      setLivraisonStore(50);
    }
    router.push("/commander");
  };
  if (cartItems.length === 0) {
    return null;
  }
  return (
    <div className="bg-white col-span-12 xl:col-span-4 p-12 m-8">
      <h1 className="text-xl font-semibold border-b p-2">Total panier</h1>
      <div className="flex flex-col gap-4 mt-8 p-4 ">
        <div className="flex justify-between items-center font-medium">
          <p>Sous-total</p>
          <p>{sousTotal}dhs</p>
        </div>
        <div>
          <p className="font-medium">Livraison</p>
          <RadioGroup
            defaultValue={livraisonStore === 0 ? "gratuite" : "autreville"}
            value={livraison}
            onValueChange={handleChange}
            className="flex flex-col gap-4 mt-4"
          >
            <div className="flex items-center space-x-2 ">
              <RadioGroupItem value="gratuite" id="gratuite" />
              <Label htmlFor="gratuite">
                Livraison Express à Tanger (Gratuite)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="autreville" id="autreville" />
              <Label htmlFor="autreville">Autre ville: 50dhs</Label>
            </div>
          </RadioGroup>
        </div>
        <hr className="mt-8" />
        <div className="flex justify-between items-center font-medium">
          <p className="text-2xl">Total</p>
          <p>
            {livraison === "gratuite"
              ? `${sousTotal}dhs`
              : `${sousTotal + 50}dhs`}
          </p>
        </div>
        <div className="mt-4 w-full">
          <Button onClick={commander} className="rounded-none py-4 w-full">
            Valider la commande
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TotalPanier;
