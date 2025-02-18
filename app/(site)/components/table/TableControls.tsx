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
  searchBar?: boolean;
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
  searchBar = true,
}: TableControlsProps) {
  const handleReset = () => {
    onReset?.();
    table.resetSorting();
    setGlobalFilter("");
  };

  return (
    <div className={cn("flex gap-4 items-center")}>
      {title}
      {AddComponent}

      {searchBar && (
        <Input
          placeholder="Cerca"
          value={globalFilter ?? ""}
          onChange={(e) => {
            
            setGlobalFilter(e.target.value);
          }}
          className="max-w-sm"
        />
      )}

      {children}

      <Button variant={"outline"} onClick={handleReset} className={resetClassName}>
        Reimposta filtri
      </Button>
    </div>
  );
}
