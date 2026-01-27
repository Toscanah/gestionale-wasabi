import ResetTableControlsBtn from "@/components/shared/filters/common/ResetTableControlsBtn";
import capitalizeFirstLetter from "@/lib/shared/utils/global/string/capitalizeFirstLetter";
import React, { Fragment } from "react";
import { AdditionalFilters } from "./Manager";
import { Table } from "@tanstack/react-table";
import TableColumnsVisibility from "@/components/table/TableColumnsVisibility";
import SearchBar from "@/components/shared/filters/common/SearchBar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToolbarProps {
  title: string;
  AddComponent: React.ReactNode;
  onQueryChange: (value: string) => void;
  query: string;
  debouncedQuery?: string;
  filters?: AdditionalFilters;
  showOnlyActive: boolean;
  onOnlyActiveChange: (value: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  table: Table<any>;
  hasServerSorting?: boolean;
  onReset: () => void;
}

export default function Toolbar({
  title,
  AddComponent,
  onQueryChange,
  query,
  debouncedQuery,
  filters,
  showOnlyActive,
  onOnlyActiveChange,
  disabled,
  children,
  hasServerSorting,
  onReset,
  table,
}: ToolbarProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">{capitalizeFirstLetter(title)}</span>

        <SearchBar disabled={disabled} onChange={onQueryChange} query={query} />

        {filters?.components.map((f, i) => (
          <Fragment key={i}>{React.cloneElement(f, { disabled })}</Fragment>
        ))}

        <div className="space-x-4 flex items-center">
          <Switch
            disabled={disabled}
            id="active-checkbox"
            checked={showOnlyActive}
            onCheckedChange={() => onOnlyActiveChange(!showOnlyActive)}
          />
          <Label htmlFor="active-checkbox" className="text-xl flex items-center h-10">
            Solo attivi
          </Label>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <ResetTableControlsBtn
          onReset={onReset}
          disabled={disabled}
          table={table}
          customShow={filters?.showReset}
          hasFilters={showOnlyActive === false || debouncedQuery?.length! > 0}
          hasServerSorting={hasServerSorting}
        />

        <TableColumnsVisibility table={table} disabled={disabled} />

        {children}

        {AddComponent}
      </div>
    </div>
  );
}
