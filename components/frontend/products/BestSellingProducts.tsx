"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionHeader from "./SectionHeader";
import { ProductData } from "@/components/backend/table/TableActions";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BiCartAdd } from "react-icons/bi";

interface BestSellingProductsProps {
  productsData: [ProductData];
}
const BestSellingProducts = ({ productsData }: BestSellingProductsProps) => {
  return (
    <div className="mt-20">
      <SectionHeader header="Meilleures Ventes" />
      <div className="p-8 ">
        <Swiper
          modules={[Navigation]}
          draggable={true}
          spaceBetween={40}
          slidesPerView={4}
        >
          {productsData.map((product, idx) => (
            <SwiperSlide
              key={idx}
              className="shadow p-6 bg-white  mb-8 group relative"
            >
              <Image
                src={product.imageUrl || ""}
                alt="image du produit"
                width={500}
                height={500}
                className="group-hover:scale-105 duration-300  object-contain mb-12 h-72 w-72 "
              />

              <h1 className="line-clamp-1 w-60 font-semibold">
                {product.title}
              </h1>
              <div className="flex items-center justify-between mt-4">
                <p className="font-semibold text-green-500 ">
                  {product.price}dhs
                </p>

                <button
                  className="flex items-center justify-center  rounded-full h-10 w-10 hover:!bg-blue-600  group-hover:bg-gray-800 group-hover:text-white duration-300
                "
                >
                  <BiCartAdd className="text-2xl" />
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BestSellingProducts;
