"use client";

import { useCartStore } from "@/context/store";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const TotalPanier = () => {
  const { cartItems, setCartItems, setTotal, total } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [livraison, setLivraison] = useState<string>("gratuite");
  const router = useRouter();

  const commander = () => {
    setTotal(livraison === "gratuite" ? sousTotal : sousTotal + 50);
    router.push("/commander");
  };
  console.log(total);

  // Check if the component has mounted (to prevent hydration mismatch)
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const sousTotal =
    isHydrated && Array.isArray(cartItems)
      ? cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      : 0;

  // Function to handle change
  const handleChange = (value: string) => {
    setLivraison(value);
  };

  return (
    <div className="flex flex-col gap-4 mt-8 p-4 ">
      <div className="flex justify-between items-center font-medium">
        <p>Sous-total</p>
        <p>{sousTotal}dhs</p>
      </div>
      <div>
        <p className="font-medium">Livraison</p>
        <RadioGroup
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
  );
};

export default TotalPanier;
