"use client";

import Image from "next/image";
import Link from "next/link";

import { ProductData } from "@/components/backend/table/TableActions";
import SectionHeader from "./SectionHeader";

interface BestDemandProductCardProps {
  product: [ProductData];
}

const SpecialAndDemandingProducts = ({
  product,
}: BestDemandProductCardProps) => {
  const specialOfferProducts = product.filter(
    (product) => product.price <= 1500
  );
  const bestDemandProducts = product.filter((product) => product.vente >= 5);
  return (
    <div className="flex flex-col lg:flex-row  gap-12">
      {/* special offre */}
      <div className="flex-1">
        <SectionHeader header={"Offres Spéciales "} />
        {specialOfferProducts.slice(0, 3).map((product, idx) => (
          <div
            key={idx}
            className="flex flex-col p-10 text-center md:text-start md:p-2 md:flex-row items-center bg-white m-4 gap-12"
          >
            {/* image */}
            <Link href={`/produit/${product.slug}`}>
              <div className="p-2">
                <Image
                  src={product.imageUrl || ""}
                  alt="Image produit"
                  width={500}
                  height={500}
                  className="w-52 h-32 object-cover"
                />
              </div>
            </Link>

            <div className="space-y-4 mr-8">
              <Link href={`/produit/${product.slug}`}>
                <h1 className="font-semibold text-md line-clamp-2">
                  {product.title}
                </h1>
              </Link>
              <p className="text-green-500 font-semibold text-xl">
                {product.price}dhs
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* plus demmande */}
      <div className="flex-1">
        <SectionHeader header={"Les Plus demandées"} />
        {bestDemandProducts.slice(0, 3).map((product, idx) => (
          <div
            key={idx}
            className="flex flex-col p-10  text-center md:text-start md:p-2 md:flex-row items-center bg-white m-4 gap-12"
          >
            {/* image */}
            <Link href={`/produit/${product.slug}`}>
              <div className="p-2">
                <Image
                  src={product.imageUrl || ""}
                  alt="Image produit"
                  width={500}
                  height={500}
                  className="w-52 h-32 object-cover"
                />
              </div>
            </Link>

            <div className="space-y-4 mr-8">
              <Link href={`/produit/${product.slug}`}>
                <h1 className="font-semibold text-md line-clamp-2">
                  {product.title}
                </h1>
              </Link>
              <p className="text-green-500 font-semibold text-xl">
                {product.price}dhs
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialAndDemandingProducts;
