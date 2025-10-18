"use client";

import { CustomerFormData, customerFormSchema, getCustomerFields } from "./form";
import Manager, { FormFieldsProps } from "../manager/Manager";
import columns from "./columns";
import GoBack from "../../../components/ui/misc/GoBack";
import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import { trpc } from "@/lib/server/client";
import Loader from "@/app/(site)/components/ui/misc/loader/Loader";
import useCustomersManager from "@/app/(site)/hooks/backend/base/useCustomersManager";
import useTablePagination from "@/app/(site)/hooks/table/useTablePagination";
import { FormFields } from "../manager/FormFields";
import { useState } from "react";
import { SortField } from "@/app/(site)/components/ui/sorting/SortingMenu";
import { Path } from "react-hook-form";

export default function CustomersDashboard() {
  const [activeSorts, setActiveSorts] = useState<SortField[]>([]);
  const { page, pageSize, setPage, setPageSize } = useTablePagination();

  const { data: customers = [], isFetching } = trpc.customers.getAllComprehensive.useQuery();

  const layout: { fields: Path<CustomerFormData>[] }[] = [{ fields: ["name", "phone"] }];

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<CustomerFormData>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={customerFormSchema.parse(object ?? {})}
      layout={layout}
      formFields={getCustomerFields()}
      formSchema={customerFormSchema}
    />
  );

  return (
    <Manager<ComprehensiveCustomer, CustomerFormData>
      useDomainManager={() =>
        useCustomersManager({
          pagination: { page, pageSize },
        })
      }
      labels={{
        singular: "Cliente",
        plural: "Clienti",
      }}
      columns={columns}
      FormFields={Fields}
      pagination={{ page, pageSize, setPage, setPageSize, mode: "server" }}
    />
  );
}
