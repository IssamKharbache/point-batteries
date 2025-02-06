"use client";
import { images } from "@/lib/brandsImage";
import Image from "next/image";
import { CSSProperties } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CustomCSSProperties extends CSSProperties {
  "--swiper-pagination-bottom"?: string;
  "--swiper-pagination-color"?: string;
  "--swiper-pagination-bullet-size"?: string;
}

const Brands = () => {
  const swiperStyles: CustomCSSProperties = {
    "--swiper-pagination-bottom": "2px",
    "--swiper-pagination-color": "black",
  };
  return (
    <div className="p-12">
      <Swiper
        slidesPerView={2}
        modules={[Pagination]}
        draggable={true}
        scrollbar={{ draggable: true }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="flex justify-center items-center  w-full  p-12 pb-8"
        style={swiperStyles}
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <Image
              src={image.href}
              alt="brand image"
              width={700}
              height={700}
              className="w-20 md:w-40 object-contain h-52"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Brands;
