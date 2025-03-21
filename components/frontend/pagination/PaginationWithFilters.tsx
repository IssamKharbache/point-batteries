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
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const q = searchParams.get("q") || "";

  // Calculate the actual number of pages based on the filtered count
  const actualPages = Math.ceil(count / pageSize);

  // Calculate the first and last index on the current page
  const firstIndex = (currentPage - 1) * pageSize + 1;
  const lastIndex = Math.min(currentPage * pageSize, count || 0);

  // Function to generate pagination items
  const renderPaginationItems = () => {
    const paginationItems = [];

    // Always show the first page
    paginationItems.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={1 === currentPage}
          href={`?${new URLSearchParams({
            q: q ? q : "",
            page: "1",
          })}`}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show dots if current page is greater than 3
    if (currentPage > 3) {
      paginationItems.push(
        <PaginationItem key="dots-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around the current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(actualPages - 1, currentPage + 1);
      i++
    ) {
      paginationItems.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            href={`?${new URLSearchParams({
              q: q ? q : "",
              page: i.toString(),
            })}`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show dots if current page is less than totalPages - 2
    if (currentPage < actualPages - 2) {
      paginationItems.push(
        <PaginationItem key="dots-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show the last page
    if (actualPages > 1) {
      paginationItems.push(
        <PaginationItem key={actualPages}>
          <PaginationLink
            isActive={actualPages === currentPage}
            href={`?${new URLSearchParams({
              q: q ? q : "",
              page: actualPages.toString(),
            })}`}
          >
            {actualPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationItems;
  };

  return (
    <Pagination className="flex flex-col md:flex-row gap-8 items-center justify-between p-4 bg-white rounded">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1
                ? "cursor-not-allowed opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
            href={
              currentPage === 1
                ? `?${new URLSearchParams({
                    q: q ? q : "",
                    page: "1",
                  })}`
                : `?${new URLSearchParams({
                    q: q ? q : "",
                    page: (currentPage - 1).toString(),
                  })}`
            }
          />
        </PaginationItem>

        {renderPaginationItems()}

        <PaginationItem>
          <PaginationNext
            className={
              currentPage === actualPages
                ? "cursor-not-allowed opacity-50 pointer-events-none"
                : "cursor-pointer"
            }
            href={
              currentPage === actualPages
                ? `?${new URLSearchParams({
                    q: q ? q : "",
                    page: actualPages.toString(),
                  })}`
                : `?${new URLSearchParams({
                    q: q ? q : "",
                    page: (currentPage + 1).toString(),
                  })}`
            }
          />
        </PaginationItem>
      </PaginationContent>

      <div className="text-sm">
        <p>
          Affichage de <span className="font-semibold">{firstIndex}</span>-
          <span className="font-semibold">{lastIndex}</span> sur{" "}
          <span className="font-semibold">{count}</span> résultats
        </p>
      </div>
    </Pagination>
  );
};

export default PaginationWithFilters;
