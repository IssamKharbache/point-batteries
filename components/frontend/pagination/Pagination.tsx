import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  resultLength: number | undefined;
  pageSize: number;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  resultLength,
  pageSize,
}) => {
  const handlePageChange = (page: number) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    onPageChange(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  // Calculate the first and last index on the current page
  const firstIndex = (currentPage - 1) * pageSize + 1;
  const lastIndex = Math.min(currentPage * pageSize, resultLength || 0);

  return (
    <Pagination className="flex flex-col md:flex-row gap-8 items-center justify-between p-4 bg-white rounded">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
            onClick={handlePreviousPage}
          />
        </PaginationItem>

        {/* Render page numbers dynamically */}
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className="cursor-pointer rounded"
              isActive={currentPage === index + 1}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Conditionally render ellipsis for larger total pages */}
        {totalPages > pageSize && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
            onClick={handleNextPage}
          />
        </PaginationItem>
      </PaginationContent>

      {/* Display the first and last index on the page */}
      <div className="text-sm">
        <p>
          Affichage de <span className="font-semibold">{firstIndex}</span>–
          <span className="font-semibold">{lastIndex}</span> sur{" "}
          <span className="font-semibold">{resultLength}</span> résultats
        </p>
      </div>
    </Pagination>
  );
};

export default PaginationComponent;
