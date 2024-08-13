import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { SetStateAction, Dispatch, ReactNode } from "react";

export default function TableControls({
  table,
  globalFilter,
  setGlobalFilter,
  AddComponent,
}: {
  table: Table<any>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  AddComponent: ReactNode;
}) {
  return (
    <div className="flex gap-4 items-center">
      {AddComponent}

      <Input
        placeholder="Cerca"
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(String(event.target.value))}
        className="max-w-sm"
      />
      <Button
        className="px-0"
        variant={"link"}
        onClick={() => {
          table.resetSorting();
          setGlobalFilter("");
        }}
      >
        Reimposta
      </Button>
    </div>
  );
}
