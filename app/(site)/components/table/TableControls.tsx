import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
}

export default function TableControls({
  table,
  globalFilter,
  setGlobalFilter,
  AddComponent,
  children,
  title,
  onReset,
}: TableControlsProps) {
  return (
    <div className="flex gap-4 items-center">
      {title}
      {AddComponent}

      <Input
        placeholder="Cerca"
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(String(e.target.value))}
        className="max-w-sm"
      />
      {children}
      <Button
        variant={"outline"}
        onClick={() => {
          onReset?.();
          table.resetSorting();
          setGlobalFilter("");
        }}
      >
        Reimposta filtri
      </Button>
    </div>
  );
}
