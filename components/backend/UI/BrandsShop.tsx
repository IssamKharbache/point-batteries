"use client";

import { useRef } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import SectionHeader from "@/components/frontend/products/SectionHeader";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  {
    name: "Bosch",
    src: "/brands/bosch.png",
    link: "/produits/marque/bosch",
    color: "bg-yellow-300",
  },
  {
    name: "Exide",
    src: "/brands/exide.png",
    link: "/produits/marque/exide",
    color: "bg-purple-300",
  },
  {
    name: "Leoch",
    src: "/brands/leoch.png",
    link: "/produits/marque/leoch",
    color: "bg-blue-300",
  },
  {
    name: "Varta",
    src: "/brands/varta.png",
    link: "/produits/marque/varta",
    color: "bg-purple-200",
  },
  {
    name: "Electra",
    src: "/brands/electra.png",
    link: "/produits/marque/electra",
    color: "bg-purple-500",
  },
  {
    name: "Amaron",
    src: "/brands/amaron.jpg",
    link: "/produits/marque/amaron",
    color: "bg-white",
  },
  {
    name: "Fiamm",
    src: "/brands/fiamm.png",
    link: "/produits/marque/fiamm",
    color: "bg-black",
  },
  {
    name: "Banner",
    src: "/brands/banner.jpg",
    link: "/produits/marque/banner",
    color: "bg-white",
  },
  {
    name: "AD",
    src: "/brands/ad.png",
    link: "/produits/marque/ad",
    color: "bg-[#131343]",
  },
  {
    name: "Almabat",
    src: "/brands/almabat.png",
    link: "/produits/marque/almabat",
    color: "bg-red-400",
  },
];

const BrandsShop = () => {
  const swiperRef = useRef<SwiperClass | null>(null);

  const handleMouseEnter = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop(); // Stop autoplay on hover
    }
  };

  const handleMouseLeave = () => {
    if (swiperRef.current) {
      swiperRef.current.autoplay.start(); // Resume autoplay when mouse leaves
    }
  };

  return (
    <div className="mb-8">
      <SectionHeader header="Nos Marques" />
      <div
        className="relative mt-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-3 items-center mb-4">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="bg-slate-900 text-white hover:bg-slate-700 p-2 rounded-full"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="bg-slate-900 text-white hover:bg-slate-700 p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Swiper */}
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
          }}
          modules={[Navigation, Autoplay]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
        >
          {brands.map((brand, index) => (
            <SwiperSlide
              key={index}
              className={`flex items-center justify-center p-10 opacity-90 hover:opacity-100 duration-300 mt-4 ${brand.color}`}
            >
              <Link
                href={brand.link}
                className="flex items-center justify-center w-full h-full"
              >
                <Image
                  src={brand.src}
                  alt={brand.name}
                  width={400}
                  height={400}
                  className="object-contain h-44 mx-auto"
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <p className="mt-4 text-center text-gray-700 text-md">
        Glissez pour voir plus →
      </p>
    </div>
  );
};

export default BrandsShop;
