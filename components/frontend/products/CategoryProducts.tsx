"use client";
import { ProductData } from "@/components/backend/table/TableActions";
import BookmarkButton from "@/components/frontend/products/BookmarkButton";
import { useCartStore, useCategoryProductPageStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BiCartAdd } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import PaginationWithFilters from "../pagination/PaginationWithFilters";

interface CategoryProductsProps {
  products: ProductData[];
  catId: string;
  pageSize: number;
}

const CategoryProducts = ({
  products,
  catId,
  pageSize,
}: CategoryProductsProps) => {
  // Pagination State
  const [productsState, setProductsState] = useState<ProductData[]>(products);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  //store
  const { loading: loadingStore, setLoading: setLoadingStore } =
    useCategoryProductPageStore();

  const [resultLength, setResultLength] = useState<number>(0);
  const totalPages = Math.ceil(resultLength / pageSize);
  const min = searchParams.get("min") || "0"; // Make sure min is a string
  const max = searchParams.get("max") || ""; // Make sure max is a string
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const useParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await axios.get(
        `/api/product?catId=${catId}&pageNum=${currentPage}&min=${min}&max=${max}&pageSize=${pageSize}`
      );
      if (res.status === 201) {
        setProductsState(res.data.data);
        setResultLength(res.data.totalCount);
        setLoading(false);
      } else {
        setLoading(false);
        toast({
          title: "ERREUR",
          variant: "error",
          description: "Une Erreur s'est produite",
        });
      }
    };

    fetchProducts();
  }, [min, max, currentPage, catId, pageSize]);

  useEffect(() => {
    if (productsState.length > 0) {
      setLoadingStore(false);
    }
  }, [useParams]);

  return (
    <div>
      {loadingStore && (
        <div className="flex items-center justify-center h-[500px] w-[500px]">
          <Loader2 className="animate-spin" size={45} />
        </div>
      )}
      {loading && (
        <div className="flex items-center justify-center h-[500px] w-[500px]">
          <Loader2 className="animate-spin" size={45} />
        </div>
      )}
      {!loading && productsState.length === 0 && (
        <div className="flex flex-col gap-8  items-center">
          <Image
            src="/noproduct.png"
            alt="Icon"
            width={500}
            height={500}
            className="w-40 self-center"
          />
          <p className="text-center font-semibold text-xl mt-6 text-gray-500">
            Il n&apos;y a aucun produit
          </p>
          <Link href="/">
            <Button>Poursuivez vos achats</Button>
          </Link>
        </div>
      )}
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && (
          <div className="flex items-center justify-center h-[500px] w-[500px]">
            <Loader2 className="animate-spin" size={45} />
          </div>
        )}
        {!loading &&
          !loadingStore &&
          productsState.map((product) => (
            <div key={product.id} className="group bg-white p-5">
              <Link href={`/produit/${product.slug}`}>
                <Image
                  src={product.imageUrl || ""}
                  alt="image du produit"
                  width={500}
                  height={500}
                  className="flex items-center justify-center group-hover:scale-105 duration-300 object-contain mb-12"
                />
                <h1 className="line-clamp-1 w-48 font-semibold">
                  {product.title}
                </h1>
              </Link>
              <p className="font-semibold text-green-500">{product.price}dhs</p>
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

      {productsState.length !== 0 && (
        <div className="mt-8">
          <PaginationWithFilters
            count={resultLength}
            totalPages={totalPages}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
