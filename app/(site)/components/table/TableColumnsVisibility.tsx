"use client";

import React from "react";
import type { Table } from "@tanstack/react-table";
import { EyeIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import WasabiSelect, { CommandGroupType } from "../ui/wasabi/WasabiSelect";

interface TableVisibilityProps<TData> {
  table: Table<TData>;
  blacklist?: string[];
  disabled?: boolean;
}

export default function TableColumnsVisibility<TData>({
  table,
  blacklist = [],
  disabled = false,
}: TableVisibilityProps<TData>) {
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (c) => typeof c.accessorFn !== "undefined" && c.getCanHide() && !blacklist.includes(c.id)
        ),
    [table, blacklist]
  );

  const groups: CommandGroupType[] = [
    {
      icon: SlidersHorizontalIcon,
      options: columns.map((col) => ({
        label: col.columnDef.meta?.label ?? col.id,
        value: col.id,
        disabled: false,
      })),
    },
  ];

  const selected = columns.filter((c) => c.getIsVisible()).map((c) => c.id);

  return (
    <WasabiSelect
    shouldSort={false}
      disabled={disabled}
      appearance="filter"
      title="Colonne"
      mode="multi"
      shouldClear={columns.length !== selected.length}
      triggerIcon={EyeIcon}
      selectedValues={selected}
      triggerClassName="border-solid"
      onChange={(updated) => {
        // if the selection was cleared (empty array),
        // reset all columns to visible instead of hiding everything
        const shouldShowAll = updated.length === 0;

        for (const col of columns) {
          col.toggleVisibility(shouldShowAll || updated.includes(col.id));
        }
      }}
      groups={groups}
      searchPlaceholder="Cerca colonne..."
      allLabel="Tutte"
    />
  );
}
