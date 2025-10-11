"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CaretDoubleLeft,
  CaretDoubleLeftIcon,
  CaretDoubleRight,
  CaretDoubleRightIcon,
  CaretLeft,
  CaretLeftIcon,
  CaretRight,
  CaretRightIcon,
} from "@phosphor-icons/react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
}

export default function TablePagination<TData>({
  table,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  disabled,
}: TablePaginationProps<TData>) {
  const currentPage = page ?? table.getState().pagination.pageIndex;
  const currentPageSize = pageSize ?? table.getState().pagination.pageSize;
  const pageCount = Math.ceil((totalCount ?? 0) / (pageSize ?? totalCount ?? 1));
  const totalPages = currentPageSize === -1 ? 1 : Math.max(1, pageCount ?? table.getPageCount());

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else table.setPageIndex(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    if (onPageSizeChange) onPageSizeChange(newSize);
    else table.setPageSize(newSize);
  };

  return (
    <div className="flex w-full items-center gap-4">
      {/* Per-page selector */}
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">Elementi per pagina</p>
        <Select
          value={`${currentPageSize}`}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className={cn("w-24")} disabled={disabled}>
            <SelectValue placeholder={`${currentPageSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
            <SelectItem key={-1} value="-1">
              Tutti <span className="text-muted-foreground">(sconsigliato)</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Range summary */}
      <span className="text-muted-foreground text-sm">
        {(() => {
          const total = totalCount ?? 0;
          if (currentPageSize === -1) {
            if (total === 0) return `0 di 0`;
            return `${total} di ${total}`;
          }
          const start = total === 0 ? 0 : currentPage * currentPageSize + 1;
          const end = Math.min((currentPage + 1) * currentPageSize, total);
          if (start === end) return `${end} di ${total}`;
          if (end === total && start === 1) return `${total} di ${total}`;
          return `${start}-${end} di ${total}`;
        })()}
      </span>

      {/* Pagination controls */}
      <div className="ml-auto">
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0 || disabled}
            aria-label="Prima pagina"
          >
            <CaretDoubleLeftIcon size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || disabled}
            aria-label="Pagina precedente"
          >
            <CaretLeftIcon size={18} />
          </Button>

          <Button variant="outline" size="sm" className="pointer-events-none">
            Pagina {currentPage + 1} di {totalPages}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= totalPages || disabled}
            aria-label="Pagina successiva"
          >
            <CaretRightIcon size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage + 1 >= totalPages || disabled}
            aria-label="Ultima pagina"
          >
            <CaretDoubleRightIcon size={18} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
