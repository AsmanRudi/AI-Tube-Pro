"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const items: (number | "...")[] = [];
  let prev = 0;
  for (const p of pages) {
    if (p - prev > 1) items.push("...");
    items.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-md border p-2 disabled:opacity-40"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((item, i) =>
        item === "..." ? (
          <span key={`e-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm",
              item === page
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-md border p-2 disabled:opacity-40"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

