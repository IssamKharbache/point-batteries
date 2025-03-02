"use client";
import SectionHeader from "@/components/frontend/products/SectionHeader";
import Image from "next/image";
import Link from "next/link";

const BrandsShop = () => {
  return (
    <div>
      <SectionHeader header="Nos Marque" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mt-8">
        {/* Bosch */}
        <div className="bg-yellow-300 p-4 flex justify-center">
          <Link href="/produits/marque/bosch">
            <Image
              width={500}
              height={500}
              src="/brands/bosch.png"
              alt="Bosch"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Exide */}
        <div className="bg-purple-300 p-4 flex justify-center">
          <Link href="/produits/marque/exide">
            <Image
              width={500}
              height={500}
              src="/brands/exide.png"
              alt="Exide"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Leoch */}
        <div className="bg-blue-300 p-4 flex justify-center">
          <Link href="/produits/marque/leoch">
            <Image
              width={500}
              height={500}
              src="/brands/leoch.png"
              alt="Leoch"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Varta */}
        <div className="bg-purple-200 p-4 flex justify-center">
          <Link href="/produits/marque/varta">
            <Image
              width={500}
              height={500}
              src="/brands/varta.png"
              alt="Varta"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Amaron */}
        <div className="bg-white p-4 flex justify-center">
          <Link href="/produits/marque/amaron">
            <Image
              width={500}
              height={500}
              src="/brands/amaron.jpg"
              alt="Amaron"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Fiamm */}
        <div className="bg-black p-4 flex justify-center">
          <Link href="/produits/marque/fiamm">
            <Image
              width={500}
              height={500}
              src="/brands/fiamm.png"
              alt="Fiamm"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Banner */}
        <div className="bg-white p-4 flex justify-center">
          <Link href="/produits/marque/banner">
            <Image
              width={500}
              height={500}
              src="/brands/banner.jpg"
              alt="Banner"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* AD */}
        <div className="bg-[#131343] p-4 flex justify-center">
          <Link href="/produits/marque/ad">
            <Image
              width={500}
              height={500}
              src="/brands/ad.png"
              alt="AD"
              className="object-contain h-52"
            />
          </Link>
        </div>

        {/* Almabat */}
        <div className="bg-red-400 p-4 flex justify-center">
          <Link href="/produits/marque/almabat">
            <Image
              width={500}
              height={500}
              src="/brands/almabat.png"
              alt="Almabat"
              className="object-contain h-52"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandsShop;
