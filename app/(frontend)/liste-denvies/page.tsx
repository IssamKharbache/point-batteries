import { ProductData } from "@/components/backend/table/TableActions";
import FavouriteProducts from "@/components/frontend/products/FavouriteProducts";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import FetchBookmarks from "@/lib/utils/FetchBookmarks";
import { Heart } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
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

  const bookmarked: bookmarkedData = await getData(`bookmark/${userId}`);

  const products = bookmarked?.map((bookmark) => bookmark.product);
  if (products.length === 0) {
    return (
      <div className="flex flex-col gap-12 items-center justify-center max-w-[1100px] mx-auto">
        <div className=" flex items-center justify-center bg-gray-200 w-fit rounded-full p-5">
          <Heart size={65} className="fill-yellow-400 text-yellow-400" />
        </div>
        <h1 className="text-2xl">Votre liste d'envies est vide !</h1>
        <p className="text-center  max-w-xl text-md text-gray-500">
          Vous avez trouvé quelque chose que vous aimez ? Tapez sur l'icône en
          forme de cœur à côté de l'article pour l'ajouter à votre liste
          d'envies! Tous vos articles sauvegardés apparaîtront ici.
        </p>
        <Link href="/">
          <Button>Continue vos achats</Button>
        </Link>
      </div>
    );
  }
  return (
    <section className="max-w-[1100px] mx-auto  rounded">
      {userId && <FetchBookmarks userId={userId} />}
      <h1 className="text-2xl mb-8 border-b p-4">Votre liste d'envies</h1>

      {products?.map((product, idx) => (
        <FavouriteProducts key={idx} product={product} />
      ))}
    </section>
  );
};

export default page;
