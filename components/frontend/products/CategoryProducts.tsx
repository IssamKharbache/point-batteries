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
import { useSearchParams } from "next/navigation";
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
  // Initialize with filtered products (stock > 0)
  const [productsState, setProductsState] = useState<ProductData[]>(
    products.filter((product) => (product.stock || 0) > 0)
  );
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  //store
  const { loading: loadingStore, setLoading: setLoadingStore } =
    useCategoryProductPageStore();

  const [resultLength, setResultLength] = useState<number>(0);
  const totalPages = Math.ceil(resultLength / pageSize);
  const marque = searchParams.get("marque") || "";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { data: session } = useSession();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const useParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    setLoadingStore(true);
    const fetchProducts = async () => {
      const res = await axios.get(
        `/api/product?catId=${catId}&pageNum=${currentPage}&marque=${marque}&pageSize=${pageSize}`
      );
      if (res.status === 201) {
        // Filter products with stock > 0
        const filteredProducts = res.data.data.filter(
          (product: ProductData) => {
            const hasStock = (product.stock || 0) > 0;
            return hasStock;
          }
        );
        setProductsState(filteredProducts);
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
  }, [marque, currentPage, catId, pageSize]);

  useEffect(() => {
    if (productsState.length > 0) {
      setTimeout(() => {
        setLoadingStore(false);
      }, 700);
    }
  }, [useParams]);

  return (
    <div>
      {!loading && !loadingStore && productsState.length === 0 && (
        <div className="flex flex-col gap-8 items-center">
          <Image
            src="/noproduct.png"
            alt="Icon"
            width={500}
            height={500}
            className="w-40 self-center"
            loading="eager"
          />
          <p className="text-center font-semibold text-sm mt-6 text-gray-500">
            Aucun produit disponible sous cette marque, essayez une autre
          </p>
          <Link href="/">
            <Button>Poursuivez vos achats</Button>
          </Link>
        </div>
      )}
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading || loadingStore ? (
          <div className="flex items-center justify-center w-full h-full md:h-[500px] md:w-[500px]">
            <Loader2 className="animate-spin" size={45} />
          </div>
        ) : (
          productsState.map((product) => (
            <div key={product.id} className="group bg-white p-5">
              <Link href={`/produit/${product.slug}`}>
                <Image
                  src={product.imageUrl || ""}
                  alt="image du produit"
                  width={500}
                  height={500}
                  className="flex items-center justify-center group-hover:scale-105 duration-300 object-contain mb-12 h-52 w-full"
                />
                <h1 className="line-clamp-2 font-semibold uppercase text-center md:text-start text-sm min-h-20">
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
                  <p className="text-red-500 text-xs">Rupture de stock</p>
                )}
              </div>
            </div>
          ))
        )}
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
    </div>
  );
};

export default CategoryProducts;
