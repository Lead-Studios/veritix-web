"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("…");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 transition"
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((page, i) =>
        page === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page as number)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${
              currentPage === page
                ? "bg-gradient-to-r from-[#4D21FF] to-[#21D4FF] text-white"
                : "border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 transition"
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
