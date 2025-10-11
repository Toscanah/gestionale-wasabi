"use client";

import { ComponentType, useMemo, ReactElement } from "react";
import Table from "../../../components/table/Table";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import useTable from "../../../hooks/table/useTable";
import TablePagination from "../../../components/table/TablePagination";
import { BaseEntity, useManager } from "../../../hooks/backend/useManager";
import useSkeletonTable from "../../../hooks/table/useSkeletonTable";
import useTablePagination from "../../../hooks/table/useTablePagination";
import { FieldValues } from "react-hook-form";
import GoBack from "../../../components/ui/misc/GoBack";
import EditAction from "./actions/EditAction";
import ToggleAction from "./actions/ToggleAction";
import DeleteAction from "./actions/DeleteAction";
import AddAction from "./actions/AddAction";
import Toolbar from "./Toolbar";
import managerColumns from "./managerColumns";
import SortingMenu from "@/app/(site)/components/ui/sorting/SortingMenu";

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

interface ManagerProps<TDomain extends BaseEntity, TForm extends FieldValues = TDomain> {
  useDomainManager: () => ReturnType<typeof useManager<TDomain, any, any>>;
  FormFields: ComponentType<FormFieldsProps<TForm>>;
  columns: ColumnDef<TDomain>[];
  mapToForm?: (entity: TDomain) => TForm;
  mapFromForm?: (form: TForm) => Partial<TDomain>;
  filters?: AdditionalFilters;
  pagination?: Omit<ReturnType<typeof useTablePagination>, "resetPagination">;
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
    pageSize: pagination?.pageSize,
  });

  const table = useTable<TDomain, ManagerTableMeta<TDomain>>({
    data: tableData,
    columns: skeletonColumns,
    query: debouncedQuery,
    setQuery: setInputQuery,
    pagination: pagination
      ? {
          mode: "server",
          page: pagination.page,
          pageSize: pagination.pageSize,
          setPage: pagination.setPage,
          setPageSize: pagination.setPageSize,
          totalCount,
        }
      : undefined,
    meta: {
      EditComponent,
      ToggleComponent,
      DeleteComponent,
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        <div className="w-full flex flex-col gap-4">
          <Toolbar
            table={table}
            disabled={isLoading}
            title={parsedLabels.plural}
            AddComponent={AddComponent}
            onQueryChange={setInputQuery}
            query={inputQuery}
            filters={filters}
            showOnlyActive={showOnlyActive}
            onOnlyActiveChange={setShowOnlyActive}
            hasServerSorting={serverSorting?.activeSorts.length! > 0}
            onReset={() => {
              filters?.onReset?.();
              setShowOnlyActive(true);
              table.resetSorting();
              serverSorting?.onChange([]);
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

          <Table<TDomain> table={table} />

          {pagination ? (
            <TablePagination
              table={table}
              totalCount={totalCount}
              disabled={isLoading}
              onPageChange={pagination.setPage}
              onPageSizeChange={pagination.setPageSize}
              page={pagination.page}
              pageSize={pagination.pageSize}
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
