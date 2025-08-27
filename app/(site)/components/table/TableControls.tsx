import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { setGlobal } from "next/dist/trace";
import { SetStateAction, Dispatch, ReactNode } from "react";

interface TableControlsProps {
  table: Table<any>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  AddComponent?: ReactNode;
  children?: ReactNode;
  title?: ReactNode;
  onReset?: () => void;
  resetClassName?: string;
  resetDisabled?: boolean;
  searchBar?: boolean;
  searchBarDisabled?: boolean;
}

export default function TableControls({
  table,
  globalFilter,
  setGlobalFilter,
  AddComponent,
  children,
  title,
  onReset,
  resetClassName,
  resetDisabled = false,
  searchBar = true,
  searchBarDisabled = false,
}: TableControlsProps) {
  const handleReset = () => {
    onReset?.();
    table.resetSorting();
    setGlobalFilter("");
  };

  return (
    <div className={cn("w-full flex gap-4 items-center justify-between")}>
      <div className="w-full flex gap-4 items-center">
        {title}
        {AddComponent}
  
        {searchBar && (
          <Input
            placeholder="Cerca..."
            disabled={searchBarDisabled}
            value={globalFilter ?? ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
            className="w-60 h-8"
          />
        )}
  
        {children}
      </div>

      <Button
        variant="outline"
        onClick={handleReset}
        className={resetClassName ?? "h-8"}
        disabled={resetDisabled}
      >
        Reset filtri
      </Button>
    </div>
  );
}
