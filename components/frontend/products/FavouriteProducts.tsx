"use client";
import { ProductData } from "@/components/backend/table/TableActions";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import BookmarkButton from "./BookmarkButton";
import { useSession } from "next-auth/react";

interface FavouriteProducts {
  product: ProductData;
}
const FavouriteProducts = ({ product }: FavouriteProducts) => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col justify-center md:flex-row    border-2 p-8 md:justify-between ">
      <div className="flex flex-col md:flex-row gap-12">
        {/* image */}
        <div>
          <Image
            src={product.imageUrl || ""}
            alt={product.title}
            width={500}
            height={500}
            className="w-32 rounded"
          />
        </div>
        {/* informations */}
        <div>
          <h1 className="text-2xl font-semibold">{product.title}</h1>
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
