"use client";
import React from "react";
import { ProductData } from "@/components/backend/table/TableActions";
import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "./BookmarkButton";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/context/store";
import { BiCartAdd } from "react-icons/bi";
import { Button } from "@/components/ui/button";

interface SearchedProductsProps {
  products: ProductData[];
}

const SearchedProducts = ({ products }: SearchedProductsProps) => {
  const { addItem } = useCartStore();
  const { data: session } = useSession();
  const { toast } = useToast();

  return (
    <div>
      {products.length === 0 && (
        <div className="flex flex-col gap-8  items-center">
          <Image
            src="/noproduct.png"
            alt="Icon"
            width={500}
            height={500}
            className="w-40 self-center"
          />
          <p className="text-center font-semibold text-md mt-6 w-80 text-gray-500">
            Nous n&apos;avons trouvé aucun produit correspondant à cette
            recherche, essayez avec d&apos;autres mots-clés.
          </p>
          <Link href="/">
            <Button>Poursuivez vos achats</Button>
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group bg-white p-5">
            <Link href={`/produit/${product.slug}`}>
              <Image
                src={product.imageUrl || ""}
                alt="image du produit"
                width={500}
                height={500}
                className="flex items-center justify-center group-hover:scale-105 duration-300 object-contain mb-12"
              />
              <h1 className="line-clamp-1 w-48 font-semibold">
                {product.title}
              </h1>
            </Link>
            <p className="font-semibold text-green-500">{product.price}dhs</p>
            <div className="flex items-center justify-between mt-4">
              <BookmarkButton product={product} userId={session?.user.id} />
              {product.stock && product.stock >= 1 ? (
                <button
                  onClick={() => {
                    toast({
                      title: "Produit ajouter au panier",
                      variant: "success",
                    });
                    addItem({
                      id: product.id,
                      title: product.title,
                      imageUrl: product.imageUrl || "",
                      price: product.price,
                      quantity: 1,
                      userId: session?.user.id || "",
                      stock: product.stock || 0,
                    });
                  }}
                  className="flex items-center justify-center rounded-full h-10 w-10 hover:!bg-blue-600 group-hover:bg-gray-800 group-hover:text-white duration-300"
                >
                  <BiCartAdd className="text-2xl" />
                </button>
              ) : (
                <p className="text-red-500">Rupture de stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchedProducts;
