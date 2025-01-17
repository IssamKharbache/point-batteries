"use client";
import { Headset, Minus, Plus, ShieldCheck, Truck, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ShareProduct from "@/components/frontend/products/ShareProduct";
import { ProductData } from "@/components/backend/table/TableActions";
import ProductSpecification from "./ProductSpecification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/context/store";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  product: ProductData;
}
const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { cartItems, setCartItems } = useCartStore();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState<number>(1);
  console.log(cartItems);

  const { toast } = useToast();

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* left part */}
      <div className="flex flex-col gap-8 col-span-12 md:col-span-8  min-h-[430px]">
        <div className="flex gap-12 bg-white p-4 ">
          <Image
            src={product.imageUrl || ""}
            alt={product.title}
            width={700}
            height={700}
            className="w-72 object-contain"
          />

          <div className="flex flex-col gap-8">
            <div>
              <h1 className="uppercase font-semibold text-2xl">
                {product.title}
              </h1>
            </div>

            <div className="">
              <p className="text-xl font-semibold text-green-500 mt-4">
                {product.price}dhs
              </p>

              <div className="flex items-center justify-between gap-4 bg-gray-200 p-3 mt-4 w-[120px]">
                <Minus
                  onClick={() => {
                    if (quantity <= 1) {
                      return;
                    }
                    setQuantity((prev) => prev - 1);
                  }}
                  size={12}
                  className="hover:bg-slate-100 w-5 h-5 rounded-full duration-300 p-[2px] cursor-pointer "
                />
                {quantity}

                <Plus
                  onClick={() => {
                    if (product.stock && product.stock <= quantity) {
                      return;
                    }
                    setQuantity((prev) => prev + 1);
                  }}
                  size={12}
                  className="hover:bg-slate-100 w-5 h-5 rounded-full duration-300 p-[2px] cursor-pointer"
                />
              </div>
              <button
                onClick={() => {
                  toast({
                    title: "Produit ajouter au panier",
                    variant: "success",
                    className: "custom-toast-container",
                    position: "top-left",
                  });
                  setCartItems({
                    id: product.slug,
                    title: product.title,
                    imageUrl: product.imageUrl || "",
                    price: product.price,
                    quantity,
                    userId: session?.user.id || "",
                  });
                }}
                className="bg-slate-800 w-full py-3 mt-4 text-white font-semibold hover:bg-slate-900  px-5  duration-500"
              >
                Ajouter au panier
              </button>
              <div className="mt-4">
                {product.stock && product.stock == 0 && (
                  <p className="flex items-center  gap-2 bg-red-600 rounded text-center text-white px-5 py-2 w-fit">
                    <span className="text-sm font-semibold">
                      Rupture du stock
                    </span>
                    <X size={20} />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col bg-white mb-5  ">
          <Tabs
            defaultValue="specs"
            className="flex flex-col  justify-center py-4"
          >
            <TabsList className="border-none">
              <TabsTrigger
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-black"
                value="specs"
              >
                Spécification
              </TabsTrigger>
              <TabsTrigger
                className=" data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-black "
                value="description"
              >
                Description
              </TabsTrigger>
            </TabsList>
            <hr />
            <div className="mt-4 p-10">
              <TabsContent value="specs">
                <ProductSpecification product={product} />
              </TabsContent>
              <TabsContent value="description">
                <div className="p-4">
                  <h1 className="mt-8 font-semibold ">Description</h1>
                  <p className="text-sm font-medium mt-4">
                    {product.description}
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* right part */}
      <div className="flex flex-col  gap-8 col-span-4">
        {/* first */}
        <div className="bg-white ">
          {product.garantie !== "NOGARANTIE" &&
          product.garantie === "ONEYEAR" ? (
            <div className="flex items-center  gap-4 mt-4 p-5">
              <Image
                src="/1yearwarranty.png"
                alt="warranty logo"
                width={500}
                height={500}
                className="w-14"
              />
              <p className="font-semibold text-lg">Garantie 12 mois</p>
            </div>
          ) : (
            <div className="flex items-center gap-4 mt-4 p-5">
              <Image
                src="/2yearwarranty.png"
                alt="warranty logo"
                width={500}
                height={500}
                className="w-11"
              />
              <p className="font-semibold text-lg">Garantie 24 mois</p>
            </div>
          )}
          <hr />
          <div className="p-5">
            {/* Share product */}
            <ShareProduct />
          </div>
        </div>
        {/* second */}
        <div className="flex flex-col gap-6 bg-white p-10">
          {/* first info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-slate-100 h-12 w-12 rounded-full">
              <Truck />
            </div>
            <div>
              <p className="font-semibold text-sm">Livraison Expresse</p>
              <p className="text-gray-500 font-semibold text-xs">En 1 Heure</p>
            </div>
          </div>
          {/* second info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-slate-100 h-12 w-12 rounded-full">
              <Headset />
            </div>
            <div>
              <p className="font-semibold text-sm">Support 24/7 </p>
              <p className="text-gray-500 font-semibold text-xs">
                Appelez nous
              </p>
            </div>
          </div>
          {/* third info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center bg-slate-100 h-12 w-12 rounded-full">
              <ShieldCheck />
            </div>
            <div>
              <p className="font-semibold text-sm">Garantie</p>
              <p className="text-gray-500 font-semibold text-xs">
                12 ou 24 mois
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
