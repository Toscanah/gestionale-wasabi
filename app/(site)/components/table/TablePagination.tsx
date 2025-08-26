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

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalCount?: ReactNode;
  page?: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function TablePagination<TData>({
  table,
  totalCount,
  page,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps<TData>) {
  const currentPage = page ?? table.getState().pagination.pageIndex;
  const currentPageSize = pageSize ?? table.getState().pagination.pageSize;
  const totalPages = pageCount ?? table.getPageCount();

  const handlePageChange = (newPage: number) => {
    if (onPageChange) onPageChange(newPage);
    else table.setPageIndex(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    if (onPageSizeChange) onPageSizeChange(newSize);
    else table.setPageSize(newSize);
  };

  return (
    <div className="flex w-full items-center gap-x-6 px-2">
      {/* Rows per page */}
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Righe per pagina</p>
        <Select
          value={`${currentPageSize}`}
          onValueChange={(value) => handlePageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={`${currentPageSize}`} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50, 100].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current page info */}
      <div className="flex w-[400px] items-center text-sm font-medium">
        Pagina {currentPage + 1} di {totalPages}
        {totalCount && (
          <>
            &nbsp;
            <span className="text-muted-foreground">
              {"("}
              {totalCount}
              {")"}
            </span>
          </>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center ml-auto space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage + 1 >= totalPages}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight />
        </Button>

        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage + 1 >= totalPages}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
