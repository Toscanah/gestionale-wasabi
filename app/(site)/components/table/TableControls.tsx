import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
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

      <Input
        placeholder="Cerca"
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(String(e.target.value))}
        className="max-w-sm"
      />

      {children}

      <Button variant={"outline"} onClick={handleReset} className={resetClassName}>
        Reimposta filtri
      </Button>
    </div>
  );
}
