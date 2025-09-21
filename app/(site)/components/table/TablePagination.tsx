import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
  selectSizeClassName?: string;
  selectPageClassName?: string;
}

export default function TablePagination<TData>({
  table,
  totalCount,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  disabled,
  selectSizeClassName,
  selectPageClassName,
}: TablePaginationProps<TData>) {
  const currentPage = page ?? table.getState().pagination.pageIndex;
  const currentPageSize = pageSize ?? table.getState().pagination.pageSize;
  const totalPages =
    currentPageSize === -1
      ? 1 // only one "page" when showing all
      : (pageCount ?? table.getPageCount());

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
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium">Elementi per pagina</p>
        <Select
          value={`${currentPageSize}`}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className={cn("h-8 w-24", selectSizeClassName)} disabled={disabled}>
            <SelectValue placeholder={`${currentPageSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
            <SelectItem key={-1} value={"-1"}>
              Tutti <span className="text-muted-foreground">(sconsigliato, pesante)</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <span className="text-muted-foreground text-sm">
        {(() => {
          const total = totalCount ?? 0;
          if (currentPageSize === -1) {
            // Show all records
            if (total === 0) return `0 di 0`;
            return `${total} di ${total}`;
          }
          const start = total === 0 ? 0 : currentPage * currentPageSize + 1;
          const end = Math.min((currentPage + 1) * currentPageSize, total);
          if (start === end) {
            return `${end} di ${total}`;
          }
          if (end === total && start === 1) {
            return `${total} di ${total}`;
          }
          return `${start}-${end} di ${total}`;
        })()}
      </span>

      <div className="flex items-center ml-auto">
        <Button
          variant="outline"
          className={cn("h-8 px-2 border-r-0 rounded-r-none", selectPageClassName)}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || disabled}
        >
          <ChevronLeft className="mr-2" />
          Precedente
        </Button>

        <span
          className={cn(
            "flex items-center justify-center text-sm border h-8 p-2",
            selectPageClassName
          )}
        >
          Pagina {currentPage + 1} di {totalPages}
        </span>

        <Button
          variant="outline"
          className={cn("h-8 px-2 border-l-0 rounded-l-none", selectPageClassName)}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages || disabled}
        >
          Successiva
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
