import { useState } from "react";

interface UsePaginationParams {
  initialPage?: number;
  initialPageSize?: number;
}

export default function useTablePagination({
  initialPage = 0,
  initialPageSize = 10,
}: UsePaginationParams = {}) {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const resetPagination = () => {
    setPage(initialPage);
    setPageSize(initialPageSize);
  };

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPagination,
  };
}
