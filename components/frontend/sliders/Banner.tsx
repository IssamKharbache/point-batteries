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
  bannerData: [
    {
      title: string;
      imageUrl: string;
      link: string;
    }
  ];
}

const Banner = ({ bannerData }: BannerProps) => {
  const swiperStyles: CustomCSSProperties = {
    "--swiper-pagination-bottom": "2px",
  };
  return (
    <Swiper
      modules={[Pagination]}
      className="h-full"
      draggable={true}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{
        clickable: true,
      }}
      scrollbar={{ draggable: true }}
      autoplay={{
        delay: 2000,
      }}
      loop={true}
      style={swiperStyles}
    >
      {bannerData.map((banner, idx) => (
        <SwiperSlide key={idx}>
          <Link href={banner.link}>
            <Image
              priority
              src={banner.imageUrl}
              alt="banner"
              width={4000}
              height={4000}
              className="w-full object-cover h-[300px] md:h-full rounded"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Banner;
