"use client";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react"; // Correct import for Swiper
import { ProductData } from "@/components/backend/table/TableActions";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { BiCartAdd } from "react-icons/bi";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/context/store";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import BookmarkButton from "./BookmarkButton";

export interface ProductsProps {
  productsData: ProductData[];
  categoryTitle?: string;
}

const ProductCard = ({ productsData, categoryTitle }: ProductsProps) => {
  // Use 'typeof Swiper' to get the type of the Swiper instance
  const swiperRef = useRef<SwiperClass | null>(null);
  const { addItem } = useCartStore();
  const { data: session } = useSession();
  const { toast } = useToast();

  // Filtering the products with the ones that are not for achat
  const notAchatProducts = productsData.filter(
    (prod) => prod.isAchatProduct === false
  );

  return (
    <div className="mt-4">
      <div className="m-4 xl:m-0">
        <div className="flex justify-between md:items-end md:justify-end gap-4 mb-4">
          <button
            onClick={() => swiperRef.current?.slidePrev()} // Optional chaining for safety
            className="bg-slate-900 text-white hover:bg-slate-700 duration-300"
          >
            <ChevronLeft />
          </button>

          <p className="capitalize font-semibold text-md md:hidden">
            {categoryTitle}
          </p>

          <button
            onClick={() => swiperRef.current?.slideNext()} // Optional chaining for safety
            className="bg-slate-900 text-white hover:bg-slate-700 duration-300"
          >
            <ChevronRight />
          </button>
        </div>
        <Swiper
          slidesPerView={1}
          observeParents={true}
          watchSlidesProgress={true}
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
            swiperRef.current = swiper; // Assigning swiper to the ref
          }}
        >
          {notAchatProducts.slice(0, 5).map((product, idx) => (
            <SwiperSlide
              key={idx}
              className="shadow p-6 bg-white mb-8 group min-h-[400px]"
            >
              <Link href={`/produit/${product.slug}`}>
                <div className="relative w-full h-0 pb-[100%] min-h-[300px]">
                  <Image
                    src={product.imageUrl || ""}
                    alt="image du produit"
                    width={700}
                    height={700}
                    className="flex items-center justify-center group-hover:scale-105 duration-300 object-contain mb-12 h-52 w-full"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                    blurDataURL="data:image/svg+xml;base64,..."
                    placeholder="blur"
                  />
                </div>

                <h1 className="line-clamp-2 max-w-56 font-semibold uppercase">
                  {product.title}
                </h1>
              </Link>
              <p className="font-semibold text-green-500 mt-8">
                {product.price}dhs
              </p>
              <div className="flex items-center justify-between mt-4">
                <BookmarkButton product={product} userId={session?.user.id} />
                {product.stock && product.stock >= 1 ? (
                  <button
                    onClick={() => {
                      toast({
                        title: "Produit ajouter au panier",
                        variant: "success",
                      });
                      addItem({
                        id: product.id,
                        title: product.title,
                        imageUrl: product.imageUrl || "",
                        price: product.price,
                        quantity: 1,
                        userId: session?.user.id || "",
                        stock: product.stock || 0,
                      });
                    }}
                    className="flex items-center justify-center rounded-full h-10 w-10 hover:!bg-blue-600 group-hover:bg-gray-800 group-hover:text-white duration-300"
                  >
                    <BiCartAdd className="text-2xl" />
                  </button>
                ) : (
                  <p className="text-red-500 text-xs">Rupture de stock</p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductCard;
