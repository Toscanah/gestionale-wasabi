"use client";

import FormFields from "../manager/FormFields";
import { formSchema, getCustomerFields } from "./form";
import Manager, { FormFieldsProps } from "../manager/Manager";
import columns from "./columns";
import GoBack from "../../../components/ui/misc/GoBack";
import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import { trpc } from "@/lib/server/client";
import Loader from "@/app/(site)/components/ui/misc/loader/Loader";
import useCustomersManager from "@/app/(site)/hooks/backend/base/useCustomersManager";
import useTablePagination from "@/app/(site)/hooks/table/useTablePagination";

export default function CustomersDashboard() {
  const { data: customers = [], isFetching } = trpc.customers.getAllComprehensive.useQuery();
  const { page, pageSize, setPage, setPageSize } = useTablePagination();

  const Fields = ({
    handleSubmit,
    object,
    submitLabel,
  }: FormFieldsProps<ComprehensiveCustomer>) => (
    <FormFields
      handleSubmit={handleSubmit}
      submitLabel={submitLabel}
      defaultValues={{
        ...object,
        phone: (object?.phone?.phone ?? "") as any,
        email: object?.email ?? "",
        preferences: object?.preferences ?? "",
      }}
      layout={[
        { fieldsPerRow: 1 },
        { fieldsPerRow: 2 },
        { fieldsPerRow: 1 },
        { fieldsPerRow: 2 },
        { fieldsPerRow: 1 },
      ]}
      formFields={getCustomerFields()}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        <Loader isLoading={isFetching}>
          <Manager<ComprehensiveCustomer>
            useDomainManager={() => useCustomersManager()}
            columns={columns(customers)}
            FormFields={Fields}
            pagination
            deleteAction
          />
        </Loader>
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
