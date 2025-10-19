"use client";

import React from "react";
import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import WasabiPopover from "../ui/wasabi/WasabiPopover";
import { CheckIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import { ArrowsDownUpIcon } from "@phosphor-icons/react/dist/ssr";

interface TableVisibilityProps<TData> {
  table: Table<TData>;
}

export default function TableVisibility<TData>({ table }: TableVisibilityProps<TData>) {
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()),
    [table]
  );

  return (
    <WasabiPopover
      contentClassName="w-44 p-0"
      trigger={
        <Button
          aria-label="Toggle columns"
          role="combobox"
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
          Colonne
          {/* <ArrowsDownUpIcon className="ml-auto h-4 w-4 opacity-50" /> */}
        </Button>
      }
    >
      <Command>
        <CommandInput placeholder="Search columns..." />
        <CommandList>
          <CommandEmpty>No columns found.</CommandEmpty>
          <CommandGroup>
            {columns.map((column) => (
              <CommandItem
                key={column.id}
                onSelect={() => column.toggleVisibility(!column.getIsVisible())}
              >
                <span className="truncate">{column.columnDef.meta?.label ?? column.id}</span>
                <CheckIcon
                  className={cn(
                    "ml-auto size-4 shrink-0 transition-opacity",
                    column.getIsVisible() ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </WasabiPopover>
  );
}
