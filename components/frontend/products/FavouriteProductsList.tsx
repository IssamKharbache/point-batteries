"use client";
import { bookmarkedData } from "@/app/(frontend)/liste-denvies/page";
import React, { useEffect, useState } from "react";
import FavouriteProducts from "./FavouriteProducts";
import { useFavouritePaginationStore } from "@/context/store";
import axios from "axios";
import PaginationComponent from "../pagination/Pagination";
import { Loader2 } from "lucide-react";

interface FavouriteProductsListProps {
  products: bookmarkedData;
  userId: string;
  pageSize: number;
}
const FavouriteProductsList = ({
  products,
  userId,
  pageSize,
}: FavouriteProductsListProps) => {
  const { page, setPage } = useFavouritePaginationStore();
  const [favouriteData, setFavouriteData] = useState<FavouriteProducts[]>(
    products || []
  );

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil((products.length || 0) / pageSize)
  );
  const [resultLength, setResultLength] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaginationData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/bookmark/${userId}?pageNum=${page}&pageSize=${pageSize}`
        );
        const data = res.data.data;
        setFavouriteData(data);
        const totalCount = res.data.totalCount;
        setResultLength(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize));
      } catch (error) {
        console.error("Failed to fetch paginated favourite products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaginationData();
  }, [page, userId, pageSize]);
  return (
    <div className="p-10">
      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-[450px]">
          <Loader2 className="animate-spin" size={45} />
        </div>
      ) : (
        <>
          {favouriteData?.map((product, idx) => {
            return <FavouriteProducts key={idx} product={product.product} />;
          })}
          <PaginationComponent
            currentPage={page}
            onPageChange={setPage}
            pageSize={pageSize}
            resultLength={resultLength}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
};

export default FavouriteProductsList;
