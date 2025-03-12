export const dynamic = "force-dynamic";

import { ProductData } from "@/components/backend/table/TableActions";
import FavouriteProductsList from "@/components/frontend/products/FavouriteProductsList";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/authOptions";
import { getData } from "@/lib/getData";
import FetchBookmarks from "@/lib/utils/FetchBookmarks";
import { Heart } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";
import BreadcrumbComponent from "@/components/frontend/breadcrump/BreadCrumpComponent";

export const metadata: Metadata = {
  title: "Votre liste d envies",
};
export type bookmarkedData = [
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

  const products = bookmarked?.map((bookmark) => bookmark.product);
  if (products.length === 0) {
    return (
      <div className="flex flex-col gap-12 items-center justify-center max-w-[1100px] mx-auto">
        <div className=" flex items-center justify-center bg-gray-200 w-fit rounded-full p-5">
          <Heart size={65} className="fill-yellow-400 text-yellow-400" />
        </div>
        <h1 className="text-xl md:text-2xl">
          Votre liste d&apos;envies est vide !
        </h1>
        <p className="text-center  max-w-xl text-sm m-4 md:m-0 md:text-md text-gray-500">
          Vous avez trouvé quelque chose que vous aimez ? Tapez sur l&apos;icône
          en forme de cœur à côté de l&apos;article pour l&apos;ajouter à votre
          liste d&apos;envies! Tous vos articles sauvegardés apparaîtront ici.
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
      <BreadcrumbComponent links={[{ name: "Ma liste d'envies" }]} />
      <FavouriteProductsList
        products={bookmarked}
        userId={userId || ""}
        pageSize={4}
      />
    </section>
  );
};

export default page;
