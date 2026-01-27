"use client";

import { ComponentType, useMemo, ReactElement } from "react";
import Table from "../../../../../components/table/Table";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import useTable from "../../../../../hooks/table/useTable";
import TablePagination from "../../../../../components/table/TablePagination";
import { BaseEntity, useManager } from "../../../../../hooks/backend/useManager";
import useSkeletonTable from "../../../../../hooks/table/useSkeletonTable";
import useTablePagination from "../../../../../hooks/table/useTablePagination";
import { FieldValues } from "react-hook-form";
import GoBack from "@/components/shared/misc/GoBack";
import EditAction from "./actions/EditAction";
import ToggleAction from "./actions/ToggleAction";
import DeleteAction from "./actions/DeleteAction";
import AddAction from "./actions/AddAction";
import Toolbar from "./Toolbar";
import managerColumns from "./managerColumns";
import SortingMenu from "@/components/shared/sorting/SortingMenu";

export interface FormFieldsProps<T> {
  handleSubmit: (values: T) => void;
  submitLabel: string;
  object?: T;
}

export interface AdditionalFilters {
  components: ReactElement<{ disabled?: boolean }>[];
  onReset: () => void;
  showReset: boolean;
}

type ClientPagination = {
  mode: "client";
};

type ServerPagination = Omit<ReturnType<typeof useTablePagination>, "resetPagination"> & {
  mode: "server";
};

interface ManagerProps<TDomain extends BaseEntity, TForm extends FieldValues = TDomain> {
  useDomainManager: () => ReturnType<typeof useManager<TDomain, any, any>>;
  FormFields: ComponentType<FormFieldsProps<TForm>>;
  columns: ColumnDef<TDomain>[];
  mapToForm?: (entity: TDomain) => TForm;
  mapFromForm?: (form: TForm) => Partial<TDomain>;
  filters?: AdditionalFilters;
  pagination?: ClientPagination | ServerPagination | undefined;
  deleteAction?: boolean;
  serverSorting?: Pick<
    React.ComponentProps<typeof SortingMenu>,
    "availableFields" | "activeSorts" | "onChange"
  >;
  labels: {
    singular: string;
    plural: string;
  };
}

export type ActionProps<T> = { object: T };

export type ManagerTableMeta<T> = TableMeta<T> & {
  EditComponent: ComponentType<ActionProps<T>>;
  ToggleComponent: ComponentType<ActionProps<T>>;
  DeleteComponent?: ComponentType<ActionProps<T>>;
};

export default function Manager<TDomain extends BaseEntity, TForm extends FieldValues = TDomain>({
  useDomainManager,
  columns,
  FormFields,
  filters,
  pagination,
  deleteAction = false,
  mapToForm,
  mapFromForm,
  labels,
  serverSorting,
}: ManagerProps<TDomain, TForm>) {
  const parsedLabels = {
    singular: labels.singular.toLocaleLowerCase(),
    plural: labels.plural.toLocaleLowerCase(),
  };

  const {
    totalCount,
    data,
    isLoading,
    actions,
    showOnlyActive,
    setShowOnlyActive,
    inputQuery,
    debouncedQuery,
    setInputQuery,
    resetQuery,
  } = useDomainManager();

  const AdaptedFormFields: ComponentType<FormFieldsProps<TDomain>> = ({
    handleSubmit,
    object,
    submitLabel,
  }) => (
    <FormFields
      object={object && mapToForm ? mapToForm(object as TDomain) : (object as any)}
      handleSubmit={(values) =>
        handleSubmit(mapFromForm ? mapFromForm(values as any) : (values as any))
      }
      submitLabel={submitLabel}
    />
  );

  const EditComponent = EditAction({
    handleUpdate: actions.handleUpdate,
    FormFields: AdaptedFormFields,
    title: parsedLabels.singular,
  });

  const AddComponent = AddAction({
    handleAdd: actions.handleAdd,
    FormFields: AdaptedFormFields,
    title: parsedLabels.singular,
    disabled: isLoading,
  });

  const ToggleComponent = ToggleAction({
    handleToggle: actions.handleToggle,
    title: parsedLabels.singular,
  });

  const DeleteComponent = deleteAction
    ? DeleteAction({
        handleDelete: actions.handleDelete,
      })
    : undefined;

  const tableColumns = useMemo(() => {
    return [...managerColumns.prefix, ...columns, ...managerColumns.subfix] as ColumnDef<TDomain>[];
  }, [columns]);

  const { tableColumns: skeletonColumns, tableData } = useSkeletonTable({
    isLoading,
    columns: tableColumns,
    data,
    pageSize: pagination && pagination.mode === "server" ? pagination.pageSize : undefined,
  });

  const table = useTable<TDomain, ManagerTableMeta<TDomain>>({
    data: tableData,
    columns: skeletonColumns,
    query: debouncedQuery,
    setQuery: setInputQuery,
    pagination: pagination
      ? pagination.mode === "server"
        ? {
            mode: "server",
            page: pagination.page,
            pageSize: pagination.pageSize,
            setPage: pagination.setPage,
            setPageSize: pagination.setPageSize,
            totalCount,
          }
        : {
            mode: "client",
          }
      : undefined,
    meta: {
      EditComponent,
      ToggleComponent,
      DeleteComponent,
      isLoading,
      paginationMode: pagination?.mode ?? "client",
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        <div className="w-full flex justify-center flex-col gap-4">
          <Toolbar
            table={table}
            disabled={isLoading}
            title={parsedLabels.plural}
            AddComponent={AddComponent}
            onQueryChange={setInputQuery}
            query={inputQuery}
            filters={filters}
            debouncedQuery={debouncedQuery}
            showOnlyActive={showOnlyActive}
            onOnlyActiveChange={setShowOnlyActive}
            hasServerSorting={serverSorting?.activeSorts.length! > 0}
            onReset={() => {
              filters?.onReset?.();
              setShowOnlyActive(true);
              table.resetSorting();
              serverSorting?.onChange([]);
              resetQuery();
              if (pagination?.mode === "server") {
                pagination.setPage(0);
                pagination.setPageSize(pagination.pageSize);
              } else {
                table.resetPagination();
              }
            }}
          >
            
            {serverSorting && (
              <SortingMenu
                disabled={isLoading}
                activeSorts={serverSorting.activeSorts}
                availableFields={serverSorting.availableFields}
                onChange={serverSorting.onChange}
              />
            )}
          </Toolbar>

          <Table<TDomain> table={table} maxRows={10} scrollAdjustment={1} />

          {pagination ? (
            <TablePagination
              label={parsedLabels.plural}
              table={table}
              totalCount={pagination?.mode === "server" ? totalCount : undefined}
              disabled={isLoading}
              onPageChange={pagination.mode == "server" ? pagination.setPage : undefined}
              onPageSizeChange={pagination.mode == "server" ? pagination.setPageSize : undefined}
              page={pagination.mode == "server" ? pagination.page : undefined}
              pageSize={pagination.mode == "server" ? pagination.pageSize : undefined}
            />
          ) : (
            !isLoading && (
              <span>
                {table.getRowCount()} {labels.plural}
              </span>
            )
          )}
        </div>
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
