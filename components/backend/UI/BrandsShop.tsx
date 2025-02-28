"use client";
import SectionHeader from "@/components/frontend/products/SectionHeader";
import { images } from "@/lib/brandsImage";
import Image from "next/image";
import Link from "next/link";

const BrandsShop = () => {
  return (
    <div>
      <SectionHeader header="Nos Marque" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {images.map((image, index) => (
          <Link href={`/`} key={index}>
            <Image
              width={500}
              height={500}
              src={image.href}
              alt="brand image"
              className={`object-contain h-52 p-4  ${image.bgColor}`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrandsShop;
