"use client";

import { useEffect, useState } from "react";
import fetchRequest from "../../functions/api/fetchRequest";
import FormFields from "../FormFields";
import { formSchema, getCustomerFields } from "./form";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import Manager from "../Manager";
import columns from "./columns";
import GoBack from "../../components/ui/GoBack";
import { CustomerWithDetails } from "@/app/(site)/models";
import { Input } from "@/components/ui/input";

type FormValues = Partial<CustomerWithDetails>;

export default function CustomersDashboard() {
  const [customers, setCustomers] = useState<CustomerWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchRequest<CustomerWithDetails[]>("GET", "/api/customers/", "getCustomersWithDetails").then(
      (customers) => {
        setCustomers(customers);
        setLoading(false);
      }
    );
  }, []);

  const Fields = ({
    handleSubmit,
    object,
    footerName,
  }: {
    handleSubmit: (values: FormValues) => void;
    object?: CustomerWithDetails;
    footerName: string;
  }) => (
    <FormFields
      handleSubmit={handleSubmit}
      footerName={footerName}
      defaultValues={{
        ...object,
        phone: (object?.phone?.phone ?? "") as any,
        email: object?.email ?? "",
        preferences: object?.preferences ?? "",
      }}
      layout={[{ fieldsPerRow: 1 }, { fieldsPerRow: 2 }, { fieldsPerRow: 1 }, { fieldsPerRow: 1 }]}
      formFields={getCustomerFields()}
      formSchema={formSchema}
    />
  );

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-[90%] h-[90%] flex max-h-[90%] gap-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center ">
            <Image src={logo} alt="logo" width={600} height={600} className="animate-spin" />
          </div>
        ) : (
          <Manager<CustomerWithDetails>
            type="customer"
            receivedData={customers}
            columns={columns(customers, setCustomers)}
            FormFields={Fields}
            path="/api/customers/"
            pagination
            deleteAction
            fetchActions={{
              add: "createCustomer",
              toggle: "toggleCustomer",
              update: "updateCustomerFromAdmin",
              delete: "deleteCustomerById"
            }}
          />
        )}
      </div>

      <GoBack path="../../home" />
    </div>
  );
}
