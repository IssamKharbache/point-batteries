"use client";
import {
  CheckCheck,
  Copy,
  Headset,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ShareProduct from "@/components/frontend/products/ShareProduct";
import { ProductData } from "@/components/backend/table/TableActions";
import ProductSpecification from "./ProductSpecification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/context/store";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { FaCartPlus } from "react-icons/fa6";

interface ProductDetailsProps {
  product: ProductData;
}
const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const { addItem } = useCartStore();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState<number>(1);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard
        .writeText(product.refProduct || "")
        .then(() => {
          toast({
            title: "Copié",
            description: "La référence du produit a été copiée",
            variant: "success",
            duration: 4000,
          });
          setCopied(true);
          setTimeout(() => setCopied(false), 4000);
        })
        .catch((error) => {
          console.error("Failed to copy: ", error);
        });
    }
  };

  return (
    <section className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-12 gap-4">
        {/* left part */}
        <div className="flex flex-col gap-8 col-span-12 lg:col-span-8  min-h-[430px] m-8  2xl:m-0 ">
          <div className="flex flex-col md:flex-row gap-12 bg-white p-4 ">
            <Image
              src={product.imageUrl || ""}
              alt={product.title}
              width={700}
              height={700}
              className="w-72 object-contain self-center md:self-start"
              blurDataURL="data:image/svg+xml;base64,..."
              placeholder="blur"
            />

            <div className="flex flex-col gap-8 p-2">
              <div>
                <h1 className="uppercase font-semibold text-2xl text-center md:text-start">
                  {product.title}
                </h1>
              </div>

              <div className="">
                <p className="text-center md:text-start text-2xl md:text-3xl font-semibold text-green-500 mt-4">
                  {product.price}dhs
                </p>
                {product.stock === 0 ? (
                  <div className="mt-4">
                    <p className="flex items-center  gap-2 bg-red-600 rounded text-center text-white px-5 py-2 w-fit">
                      <span className="text-sm font-semibold">
                        Rupture du stock
                      </span>
                      <X size={20} />
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-4 bg-gray-200 p-3 mt-4 w-full md:w-[120px] ">
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
                        addItem({
                          id: product.id,
                          title: product.title,
                          imageUrl: product.imageUrl || "",
                          price: product.price,
                          quantity,
                          userId: session?.user.id || "",
                          stock: product.stock || 0,
                        });
                      }}
                      className="flex gap-6 items-center justify-center bg-slate-800 w-full py-3 mt-4 text-white font-semibold hover:bg-slate-900  px-5  duration-500"
                    >
                      <span>Ajouter au panier</span>
                      <FaCartPlus />
                    </button>
                  </>
                )}

                {session?.user.role !== "USER" ? (
                  <div>
                    {!copied ? (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-4 bg-slate-200 mt-4 rounded px-4 py-2 hover:text-blue-500 cursor-pointer text-sm"
                      >
                        <Copy size={20} />
                        Ref du produit
                      </button>
                    ) : (
                      <div className="flex items-center gap-4 bg-slate-200 mt-4 rounded px-4 py-2 hover:text-blue-500 cursor-pointer text-sm w-fit">
                        <CheckCheck size={20} />
                        <span>Copié</span>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white mb-5 ">
            <Tabs
              defaultValue="specs"
              className="flex flex-col  justify-center py-4"
            >
              <TabsList className="border-none">
                <TabsTrigger
                  className="data-[state=active]:bg-white data-[state=active]:border-b-4 data-[state=active]:border-blue-500 data-[state=active]:text-black"
                  value="specs"
                >
                  Spécification
                </TabsTrigger>
                <TabsTrigger
                  className=" data-[state=active]:bg-white data-[state=active]:border-b-4 data-[state=active]:border-blue-500 data-[state=active]:text-black"
                  value="description"
                >
                  Description
                </TabsTrigger>
              </TabsList>
              <hr className="mt-[1px]" />
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
        <div className="flex flex-col col-span-12  gap-8 lg:col-span-4 m-8 2xl:m-0">
          {/* first */}
          <div className="bg-white ">
            {product.garantie === "NOGARANTIE" && (
              <div className="flex items-center gap-4 mt-4 p-5 text-red-500">
                <X />
                <span className="text-xl font-semibold">Sans Garantie</span>
              </div>
            )}
            {product.garantie === "ONEYEAR" && (
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
            )}

            {product.garantie === "TWOYEARS" && (
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
                <p className="text-gray-500 font-semibold text-xs">
                  En 1 Heure
                </p>
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
    </section>
  );
};

export default ProductDetails;
