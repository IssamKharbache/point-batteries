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
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Calculate the first and last index on the current page
  const firstIndex = (currentPage - 1) * pageSize + 1;
  const lastIndex = Math.min(currentPage * pageSize, resultLength || 0);

  return (
    <Pagination className="flex items-center justify-between p-4 bg-white rounded">
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
        {totalPages > 5 && (
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
          Affichage de {firstIndex}–{lastIndex} sur {resultLength} résultats
        </p>
      </div>
    </Pagination>
  );
};

export default PaginationComponent;
