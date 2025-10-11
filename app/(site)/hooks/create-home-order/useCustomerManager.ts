import parseAddress from "../../lib/utils/domains/address/parseAddress";
import { AddressFormValues } from "../../(domains)/orders/create-order/home/address/form";
import { ExtraInfo } from "../../context/CreateHomeOrderContext";
import { toastSuccess } from "../../lib/utils/global/toast";
import { Dispatch, SetStateAction } from "react";
import { AddressContracts, CustomerContracts } from "../../lib/shared";
import { trpc } from "@/lib/server/client";
import { AddressType, CustomerType } from "@/prisma/generated/schemas";

function getActionType(object: object | undefined): string {
  return object === undefined ? "create" : "update";
}

interface UseCustomerManageParams {
  phone: string;
  customer: CustomerType | undefined;
  selectedAddress: AddressType | undefined;
  setExtraInfo: Dispatch<SetStateAction<ExtraInfo>>;
  selectedOption: string;
  setSelectedAddress: Dispatch<SetStateAction<AddressType | undefined>>;
}

type CreateCustomerInput = CustomerContracts.Create.Input["customer"];
type CreateAddressInput = AddressContracts.Create.Input["address"];

export default function useCustomerManager({
  phone,
  customer,
  selectedAddress,
  setExtraInfo,
  selectedOption,
  setSelectedAddress,
}: UseCustomerManageParams) {
  const createCustomerMutation = trpc.customers.create.useMutation();
  const updateCustomerMutation = trpc.customers.updateFromOrder.useMutation();
  const createAddressMutation = trpc.addresses.create.useMutation();
  const updateAddressMutation = trpc.addresses.update.useMutation();

  const utils = trpc.useUtils();

  async function onSubmit(values: AddressFormValues) {
    const { street, civic } = parseAddress(values.street);

    const actionCustomer = getActionType(customer);
    const actionAddress = getActionType(selectedAddress);

    const customerContent: CreateCustomerInput = {
      order_notes: values.order_notes,
      origin: values.origin,
      name: values.name,
      surname: values.surname,
      preferences: values.preferences,
      email: values.email,
      phone,
    };

    const addressContent: Omit<CreateAddressInput, "customer_id"> = {
      street,
      civic,
      doorbell: values.doorbell,
      floor: values.floor,
      stair: values.stair,
      street_info: values.street_info,
      temporary: selectedOption === "temp",
    };

    setExtraInfo({ contactPhone: values.contact_phone ?? undefined });

    let updatedCustomer: CustomerType;
    if (actionCustomer === "create") {
      updatedCustomer = await createCustomerMutation.mutateAsync({ customer: customerContent });
    } else {
      if (!customer) return;
      updatedCustomer = await updateCustomerMutation.mutateAsync({
        customer: { ...customer, ...customerContent },
      });
    }

    utils.customers.getByPhone.setData({ phone }, updatedCustomer);

    let updatedAddress: AddressType;
    if (actionAddress === "create") {
      updatedAddress = await createAddressMutation.mutateAsync({
        address: { ...addressContent, customer_id: updatedCustomer.id },
      });
    } else {
      if (!selectedAddress) return;
      updatedAddress = await updateAddressMutation.mutateAsync({
        address: { ...addressContent, customer_id: updatedCustomer.id, id: selectedAddress.id },
      });
    }

    utils.addresses.getByCustomer.setData({ customerId: updatedCustomer.id }, (prev) => {
      if (!prev) return [updatedAddress];
      const exists = prev.some((addr) => addr.id === updatedAddress.id);
      return exists
        ? prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
        : [...prev, updatedAddress];
    });

    setSelectedAddress(updatedAddress);

    toastSuccess("Il cliente e i suoi indirizzi sono stato correttamente aggiornati");
  }

  return {
    onSubmit,
  };
}
