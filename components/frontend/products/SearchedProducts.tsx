"use client";
import React, { useEffect, useState } from "react";
import { ProductData } from "@/components/backend/table/TableActions";
import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "./BookmarkButton";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useCartStore, useCategoryProductPageStore } from "@/context/store";
import { BiCartAdd } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import PaginationWithFilters from "../pagination/PaginationWithFilters";

interface SearchedProductsProps {
  products: ProductData[];
  pageSize: number;
}

const SearchedProducts = ({ products, pageSize }: SearchedProductsProps) => {
  const [productsState, setProductsState] = useState<ProductData[]>(products);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  //store
  const { loading: loadingStore, setLoading: setLoadingStore } =
    useCategoryProductPageStore();

  const [resultLength, setResultLength] = useState<number>(0);
  const totalPages = Math.ceil(resultLength / pageSize);

  const marque = searchParams.get("marque") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQ = searchParams.get("q") || "";

  const { addItem } = useCartStore();
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setLoadingStore(true);
    const fetchProducts = async () => {
      const res = await axios.get(
        `/api/product?search=${searchQ}&pageNum=${currentPage}&marque=${marque}&pageSize=${pageSize}`
      );

      if (res.status === 201) {
        setProductsState(res.data.data);
        setResultLength(res.data.totalCount);
        setLoading(false);
        setLoadingStore(false);
      } else {
        setLoadingStore(false);
        setLoading(false);
        toast({
          title: "ERREUR",
          variant: "error",
          description: "Une Erreur s'est produite",
        });
      }
    };

    fetchProducts();
  }, [marque, currentPage, pageSize, searchQ]);

  return (
    <>
      {!loading && !loadingStore && products.length === 0 && (
        <div className="flex flex-col md:flex-row  gap-8  items-center justify-center">
          <Image
            src="/noproduct.png"
            alt="Icon"
            width={500}
            height={500}
            className="w-40 self-center"
          />
          <div className="flex flex-col items-center gap-8">
            <p className="text-center font-semibold text-md mt-6 w-80 text-gray-500">
              Nous n&apos;avons trouvé aucun produit correspondant à cette
              recherche, essayez avec d&apos;autres mots-clés.
            </p>
            <Link href="/">
              <Button>Poursuivez vos achats</Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="flex items-center justify-center w-full h-full md:h-[500px] md:w-[500px]">
            <Loader2 className="animate-spin" size={45} />
          </div>
        )}
        {!loading &&
          !loadingStore &&
          products.map((product) => (
            <div key={product.id} className="group bg-white p-5">
              <Link href={`/produit/${product.slug}`}>
                <Image
                  src={product.imageUrl || ""}
                  alt="image du produit"
                  width={500}
                  height={500}
                  className="flex items-center justify-center group-hover:scale-105 duration-300 object-contain mb-12 h-52 w-full"
                />
                <h1 className="line-clamp-2 w-48 font-semibold">
                  {product.title}
                </h1>
              </Link>
              <p className="font-semibold text-green-500 mt-4">
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
                  <p className="text-red-500">Rupture de stock</p>
                )}
              </div>
            </div>
          ))}
      </div>
      {!loading && !loadingStore && productsState.length !== 0 && (
        <div className="mt-8">
          <PaginationWithFilters
            count={resultLength}
            totalPages={totalPages}
            pageSize={pageSize}
          />
        </div>
      )}
    </>
  );
};

export default SearchedProducts;
