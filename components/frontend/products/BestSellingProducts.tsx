"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionHeader from "./SectionHeader";
import { ProductData } from "@/components/backend/table/TableActions";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { BiCartAdd } from "react-icons/bi";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/context/store";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface ProductsProps {
  productsData: [ProductData];
  categoryTitle?: string;
}
const ProductCard = ({ productsData, categoryTitle }: ProductsProps) => {
  const swiperRef = useRef<any>(null);
  const { setCartItems } = useCartStore();
  const { data: session } = useSession();
  const { toast } = useToast();
  return (
    <div className="mt-4">
      <div className="m-8 2xl:m-0">
        <div className="flex justify-between md:items-end md:justify-end gap-4 mb-4">
          <button
            onClick={() => swiperRef.current.slidePrev()}
            className="bg-slate-900  text-white hover:bg-slate-700 duration-300"
          >
            <ChevronLeft />
          </button>

          <p className="capitalize font-semibold text-xl md:hidden ">
            {categoryTitle}
          </p>
          <button
            onClick={() => swiperRef.current.slideNext()}
            className="bg-slate-900  text-white hover:bg-slate-700 duration-300"
          >
            <ChevronRight />
          </button>
        </div>
        <Swiper
          breakpoints={{
            480: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            550: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            970: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          }}
          modules={[Navigation]}
          draggable={true}
          spaceBetween={40}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {productsData.map((product, idx) => (
            <SwiperSlide key={idx} className="shadow p-6 bg-white  mb-8 group ">
              <Link href={`/produit/${product.slug}`}>
                <Image
                  src={product.imageUrl || ""}
                  alt="image du produit"
                  width={500}
                  height={500}
                  className="flex items-center justify-center group-hover:scale-105 duration-300  object-contain mb-12  "
                />

                <h1 className="line-clamp-1 w-60 font-semibold">
                  {product.title}
                </h1>
              </Link>
              <p className="font-semibold text-green-500 ">
                {product.price}dhs
              </p>
              <div className="flex items-center justify-between mt-4">
                <button className="hover:bg-slate-100 p-2  border rounded group/heart duration-300">
                  <Heart className="group-hover/heart:fill-red-500 group-hover/heart:text-red-500" />
                </button>
                <button
                  onClick={() => {
                    toast({
                      title: "Produit ajouter au panier",
                      variant: "success",
                    });
                    setCartItems({
                      id: product.slug,
                      title: product.title,
                      imageUrl: product.imageUrl || "",
                      price: product.price,
                      qty: 1,
                      userId: session?.user.id || "",
                    });
                  }}
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

export default ProductCard;
