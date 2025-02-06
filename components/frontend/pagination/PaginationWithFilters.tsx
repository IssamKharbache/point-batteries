import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";
import React from "react";

interface PaginationTestProps {
  totalPages: number | undefined;
  count: number;
  pageSize: number;
}

const PaginationWithFilters = ({
  totalPages,
  count,
  pageSize,
}: PaginationTestProps) => {
  const searchParams = useSearchParams();

  const min = searchParams.get("min") || "0"; // Make sure min is a string
  const max = searchParams.get("max") || ""; // Make sure max is a string
  const sort = searchParams.get("sort") || "asc";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // Calculate the actual number of pages based on the filtered count
  const actualPages = Math.ceil(count / pageSize);

  // Calculate the first and last index on the current page
  const firstIndex = (currentPage - 1) * pageSize + 1;
  const lastIndex = Math.min(currentPage * pageSize, count || 0);

  return (
    <Pagination className="flex flex-col md:flex-row gap-8 items-center justify-between p-4 bg-white rounded">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1
                ? "cursor-not-allowed opacity-50  pointer-events-none"
                : "cursor-pointer"
            }
            href={
              currentPage === 1
                ? `?${new URLSearchParams({
                    page: "1", // Convert page to string
                    sort,
                    min,
                    max,
                  })}`
                : `?${new URLSearchParams({
                    page: (currentPage - 1).toString(), // Convert page to string
                    sort,
                    min,
                    max,
                  })}`
            }
          />
        </PaginationItem>
        {totalPages && totalPages <= actualPages ? (
          Array.from({ length: actualPages }, (_, index) => {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index + 1 === currentPage}
                  href={`?${new URLSearchParams({
                    page: (index + 1).toString(),
                  })}`}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })
        ) : (
          <>
            {Array.from({ length: 2 }, (_, index) => {
              return (
                <PaginationItem key={index}>
                  <PaginationLink href="#">{index + 1}</PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
            href={
              currentPage === totalPages
                ? `?${new URLSearchParams({
                    page: totalPages.toString(), // Convert page to string
                    sort,
                    min,
                    max,
                  })}`
                : `?${new URLSearchParams({
                    page: (currentPage + 1).toString(), // Convert page to string
                    sort,
                    min,
                    max,
                  })}`
            }
          />
        </PaginationItem>
      </PaginationContent>

      <div className="text-sm">
        {" "}
        <p>
          Affichage de <span className="font-semibold">{firstIndex}</span>-
          <span className="font-semibold">{lastIndex}</span> sur{" "}
          <span className="font-semibold">{count}</span> résultats{" "}
        </p>{" "}
      </div>
    </Pagination>
  );
};

export default PaginationWithFilters;
