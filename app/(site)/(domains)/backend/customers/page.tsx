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
import { useSearchParams } from "next/navigation";

const toFormData = (c: ComprehensiveCustomer): CustomerFormData => {
  return {
    ...c,
    name: c.name || "",
    surname: c.surname || "",
    email: c.email || "",
    preferences: c.preferences || "",
    order_notes: c.order_notes || "",
    phone: c.phone?.phone || "",
  };
};

const fromFormData = (c: CustomerFormData): Partial<ComprehensiveCustomer> => ({
  ...c,
  phone: {
    phone: c.phone || "",
    id: -1,
  },
});

export default function CustomersDashboard() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("initialQuery") || "";
  const { page, pageSize, setPage, setPageSize } = useTablePagination();

  const layout: { fields: Path<CustomerFormData>[] }[] = [
    { fields: ["name", "phone"] },
    { fields: ["surname", "email"] },
    { fields: ["preferences", "order_notes"] },
    { fields: ["origin"] },
    { fields: ["addresses"] },
  ];

  const Fields = ({ handleSubmit, object, submitLabel }: FormFieldsProps<CustomerFormData>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={customerFormSchema.parse(object || {})}
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
          initialQuery,
        })
      }
      labels={{
        singular: "Cliente",
        plural: "Clienti",
      }}
      mapFromForm={fromFormData}
      mapToForm={toFormData}
      columns={columns}
      FormFields={Fields}
      pagination={{ page, pageSize, setPage, setPageSize, mode: "server" }}
    />
  );
}
