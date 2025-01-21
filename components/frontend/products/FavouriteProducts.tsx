"use client";
import { ProductData } from "@/components/backend/table/TableActions";

import Image from "next/image";
import React from "react";
import BookmarkButton from "./BookmarkButton";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface FavouriteProducts {
  product: ProductData;
}
const FavouriteProducts = ({ product }: FavouriteProducts) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col  justify-center md:flex-row border-2 p-8 mb-6 md:justify-between bg-gray-200/20 rounded-xl ">
      <div className="flex flex-col md:flex-row gap-12 ">
        <Link href={`/produit/${product.slug}`}>
          {/* image */}
          <div className="flex justify-center items-center">
            <Image
              src={product.imageUrl || ""}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-72 rounded object-cover md:w-32 md:h-full"
            />
          </div>
        </Link>
        {/* informations */}
        <div>
          <Link href={`/produit/${product.slug}`}>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
          </Link>
          <p className="text-xl mt-4">{Number(product.price).toFixed(2)}dhs</p>
        </div>
      </div>
      <div className="mt-4">
        <BookmarkButton product={product} userId={session?.user.id} />
      </div>
    </div>
  );
};

export default FavouriteProducts;
