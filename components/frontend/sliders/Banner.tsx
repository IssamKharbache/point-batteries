"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination } from "swiper/modules";
import { CSSProperties } from "react";
import Link from "next/link";

interface CustomCSSProperties extends CSSProperties {
  "--swiper-pagination-bottom"?: string;
  "--swiper-pagination-color"?: string;
  "--swiper-pagination-bullet-size"?: string;
}

interface BannerProps {
  bannerData: {
    title: string;
    imageUrl: string;
    link: string;
  }[];
}

const Banner = ({ bannerData }: BannerProps) => {
  const swiperStyles: CustomCSSProperties = {
    "--swiper-pagination-bottom": "2px",
  };

  return (
    <div className="relative w-full h-[400px]">
      {" "}
      {/* Fixed container height */}
      <Swiper
        modules={[Pagination]}
        draggable={true}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        scrollbar={{ draggable: true }}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        style={swiperStyles}
        className="h-full"
      >
        {bannerData.map((banner, idx) => (
          <SwiperSlide key={idx} className="h-full">
            <Link href={banner.link} className="block h-full">
              <div className="relative w-full h-full">
                <Image
                  priority
                  src={banner.imageUrl}
                  alt={banner.title || "banner"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
