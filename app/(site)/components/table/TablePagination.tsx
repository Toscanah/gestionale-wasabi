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
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import capitalizeFirstLetter from "../../lib/utils/global/string/capitalizeFirstLetter";
import { useEffect } from "react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
  label?: string;
  children?: React.ReactNode;
}

const BASE_SIZES = [10, 20, 30, 40, 50, 100, 500];

export default function TablePagination<TData>({
  table,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  disabled,
  label = "Elementi",
  children: MiddleComponent,
}: TablePaginationProps<TData>) {
  const currentPage = page ?? table.getState().pagination.pageIndex;
  const currentPageSize = pageSize ?? table.getState().pagination.pageSize;

  const effectiveTotal =
    totalCount !== undefined
      ? totalCount
      : !table.getRowModel().rows?.length || table.options.meta?.isLoading
        ? 0
        : table.getFilteredRowModel().rows.length;

  const normalizedPageSize = currentPageSize === -1 ? effectiveTotal || 1 : currentPageSize;
  const totalPages =
    normalizedPageSize === -1 ? 1 : Math.max(1, Math.ceil(effectiveTotal / normalizedPageSize));

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else table.setPageIndex(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    const effectiveSize = newSize === -1 ? effectiveTotal || 1 : newSize;
    if (onPageSizeChange) onPageSizeChange(effectiveSize);
    else table.setPageSize(effectiveSize);
  };

  useEffect(() => {
    if (effectiveTotal > 0) {
      const totalPages =
        normalizedPageSize === -1 ? 1 : Math.max(1, Math.ceil(effectiveTotal / normalizedPageSize));
      if (currentPage + 1 > totalPages) {
        handlePageChange(totalPages - 1);
      }
    } else if (effectiveTotal === 0 && currentPage !== 0) {
      handlePageChange(0);
    }
  }, [effectiveTotal, normalizedPageSize]);

  return (
    <div className="flex w-full items-center ">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">{capitalizeFirstLetter(label)} per pagina</p>

          <Select
            value={`${currentPageSize}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className={cn("w-24")} disabled={disabled}>
              <SelectValue>
                {effectiveTotal === 0
                  ? 0
                  : currentPageSize === -1
                    ? effectiveTotal
                    : currentPageSize}
              </SelectValue>
            </SelectTrigger>

            {effectiveTotal > 0 && (
              <SelectContent side="top">
                {(() => {
                  let visibleSizes = BASE_SIZES.filter((s) => s < effectiveTotal);
                  const minSize = Math.min(...BASE_SIZES);

                  if (effectiveTotal > 0 && effectiveTotal < minSize) {
                    visibleSizes = [minSize];
                  }

                  if (visibleSizes.length === 0 && effectiveTotal > 0) {
                    visibleSizes = [effectiveTotal];
                  }

                  return (
                    <>
                      {visibleSizes.map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}{" "}
                          {size >= 100 ? (
                            <span className="text-muted-foreground">(lento)</span>
                          ) : null}
                        </SelectItem>
                      ))}
                      {effectiveTotal > Math.min(...BASE_SIZES) && (
                        <SelectItem key={-1} value="-1">
                          {effectiveTotal} <span className="text-muted-foreground">(tutti)</span>
                        </SelectItem>
                      )}
                    </>
                  );
                })()}
              </SelectContent>
            )}
          </Select>
        </div>

        <span className="text-muted-foreground text-sm">
          {(() => {
            const parsedLabel = label.toLowerCase();
            const total = effectiveTotal;

            if (total === 0) return `0 di 0 ${parsedLabel}`;
            if (currentPageSize === -1) return `${total} di ${total} ${parsedLabel}`;

            const start = currentPage * currentPageSize + 1;
            const end = Math.min((currentPage + 1) * currentPageSize, total);

            if (start === end) return `${end} di ${total} ${parsedLabel}`;
            if (end === total && start === 1) return `${total} di ${total} ${parsedLabel}`;
            return `${start}-${end} di ${total} ${parsedLabel}`;
          })()}
        </span>
      </div>

      <div className="flex-1 flex justify-center">{MiddleComponent}</div>

      <div className="flex-1 flex justify-end">
        <ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(0)}
            disabled={currentPage === 0 || disabled || totalPages <= 1}
            aria-label="Prima pagina"
          >
            <CaretDoubleLeftIcon size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0 || disabled || totalPages <= 1}
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
            disabled={currentPage + 1 >= totalPages || disabled || totalPages <= 1}
            aria-label="Pagina successiva"
          >
            <CaretRightIcon size={18} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={currentPage + 1 >= totalPages || disabled || totalPages <= 1}
            aria-label="Ultima pagina"
          >
            <CaretDoubleRightIcon size={18} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
