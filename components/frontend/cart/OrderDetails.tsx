"use client";

import { useCartStore } from "@/context/store";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaHandshake } from "react-icons/fa";
import LoadingButton from "../buttons/LoadingButton";

const OrderDetails = () => {
  const { cartItems, livraison, setSubmitForm, loadingOrder } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const sousTotal =
    isHydrated && Array.isArray(cartItems)
      ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
      : 0;
  if (!isHydrated) {
    return (
      <div className="space-y-12 bg-white p-10 ">
        <div className="flex items-center justify-center h-80">
          <Loader2 className="animate-spin" size={45} />
        </div>
      </div>
    );
  }

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div className="space-y-5 bg-white p-10 mb-10">
      <h1 className="text-2xl font-medium p-4">Votre commande</h1>
      <hr />
      <div className="flex items-center justify-between p-2 font-medium mt-4">
        <p>Produit</p>
        <p>Sous-total</p>
      </div>
      <hr />

      {cartItems?.map((item, idx) => (
        <div
          key={idx}
          className="mt-8  p-2 flex justify-between items-center font-medium text-gray-800 flex-wrap w-full gap-4"
        >
          <div className="">
            <p className="line-clamp-1 w-32">{item.title}</p>
            <p>x{item.quantity}</p>
          </div>
          <p>{item.price * item.quantity}dhs</p>
        </div>
      ))}
      <hr />
      <div className="flex justify-between items-center font-medium flex-wrap">
        <p>Frais de Livraison</p>
        <p>{livraison}dhs</p>
      </div>
      <div className="flex justify-between items-center pt-6 flex-wrap">
        <p className="text-2xl font-medium">Total</p>
        <p className="font-medium text-2xl">{sousTotal + livraison}dhs</p>
      </div>
      <div className="flex  flex-col md:flex-row items-center gap-4 space-y-2 bg-gray-100/70 py-4 px-7 border mt-4 ">
        <FaHandshake size={25} />
        <div>
          <p className="text-sm font-medium">Paiement cash à la livraison </p>
          <p className="text-sm  text-gray-500">
            Payer en cash à la livraison.
          </p>
        </div>
      </div>
      <p className="text-xs">
        Vos données personnelles seront utilisées pour traiter votre commande,
        soutenir votre expérience sur ce site Web et à d&apos;autres fins
        décrites dans notre{" "}
        <Link
          className="text-blue-700 hover:underline font-medium"
          href="/politique"
        >
          politique de confidentialité.
        </Link>
      </p>
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
          className="rounded-none"
          id="terms"
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          J&apos;ai lu et j&apos;accepte conditions générales{" "}
          <span className="text-red-500">*</span>
        </label>
      </div>
      {loadingOrder ? (
        <LoadingButton textColor="text-white" bgColor="bg-black" />
      ) : (
        <Button
          disabled={!isChecked}
          onClick={() => setSubmitForm(true)}
          type="submit"
          className={`mt-4 px-4 py-6  bg-black text-white w-full text-md`}
        >
          Commander
        </Button>
      )}
    </div>
  );
};

export default OrderDetails;
