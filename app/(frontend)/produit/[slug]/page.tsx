import { ProductData } from "@/components/backend/table/TableActions";
import ProductSpecification from "@/components/frontend/products/ProductSpecification";
import { getData } from "@/lib/getData";
import { Headset, Minus, Plus, ShieldCheck, Truck, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import ShareProduct from "@/components/frontend/products/ShareProduct";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product: ProductData = await getData(`/product/${slug}`);

  return (
    <section className="flex flex-col gap-4 max-w-[85rem] mx-auto">
      <div className="grid grid-cols-12 gap-4">
        {/* left part */}
        <div className="flex flex-col gap-8 col-span-8   min-h-[430px]">
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
                    size={12}
                    className="hover:bg-slate-100 w-5 h-5 rounded-full duration-300 p-[2px] cursor-pointer "
                  />
                  1
                  <Plus
                    size={12}
                    className="hover:bg-slate-100 w-5 h-5 rounded-full duration-300 p-[2px] cursor-pointer"
                  />
                </div>
                <button className="bg-slate-800 w-full py-3 mt-4 text-white font-semibold hover:bg-slate-900 duration-300 px-5">
                  Commander Maintenant
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
          <div className="flex flex-col bg-white mb-5 p-10 ">
            <p className="text-center border-b border-gray-200 p-4 font-semibold">
              Spécification
            </p>
            <hr />
            <div className="mt-4">
              <ProductSpecification product={product} />
              <div className="p-4">
                <h1 className="mt-8 font-semibold ">Description</h1>
                <p className="text-sm font-medium mt-4">
                  {product.description}
                </p>
              </div>
            </div>
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

export default page;
