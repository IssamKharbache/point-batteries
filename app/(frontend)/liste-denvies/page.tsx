import { ProductData } from "@/components/backend/table/TableActions";
import FavouriteProducts from "@/components/frontend/products/FavouriteProducts";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import React from "react";

export const metadata: Metadata = {
  title: "Votre liste d envies",
};
type bookmarkedData = [
  {
    id: string;
    product: ProductData;
    productId: string;
    userId: string;
  }
];
const page = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  const bookmarked: bookmarkedData = await getData(`/bookmark/${userId}`);
  const products = bookmarked.map((bookmark) => bookmark.product);

  return (
    <section className="max-w-[1100px] mx-auto">
      {products.map((product, idx) => (
        <FavouriteProducts key={idx} product={product} />
      ))}
    </section>
  );
};

export default page;
