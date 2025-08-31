import { Address, Customer } from "@prisma/client";
import fetchRequest from "../../lib/api/fetchRequest";
import parseAddress from "../../lib/utils/domains/address/parseAddress";
import { FormValues } from "../../(domains)/orders/create-order/home/address/form";
import { ExtraInfo } from "../../context/CreateHomeOrderContext";
import { toastSuccess } from "../../lib/utils/global/toast";
import { Dispatch, SetStateAction } from "react";
import { AddressContract, CustomerContract } from "../../lib/shared";

function getActionType(object: object | undefined): string {
  return object === undefined ? "create" : "update";
}

interface UseCustomerManageParams {
  phone: string;
  setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
  customer: Customer | undefined;
  selectedAddress: Address | undefined;
  setExtraInfo: Dispatch<SetStateAction<ExtraInfo>>;
  setAddresses: Dispatch<SetStateAction<Address[]>>;
  selectedOption: string;
  setSelectedAddress: Dispatch<SetStateAction<Address | undefined>>;
}

type CreateCustomerInput = CustomerContract["Requests"]["CreateCustomer"]["customer"];
type CreateAddressInput = AddressContract["Requests"]["CreateAddress"]["address"];
type UpdateAddressInput = AddressContract["Requests"]["UpdateAddress"]["address"];

export default function useCustomerManager({
  phone,
  setCustomer,
  customer,
  selectedAddress,
  setExtraInfo,
  setAddresses,
  selectedOption,
  setSelectedAddress,
}: UseCustomerManageParams) {
  const handleCreateCustomer = async (customer: CreateCustomerInput) => {
    const createdCustomer = await fetchRequest<Customer>(
      "POST",
      "/api/customers/",
      "createCustomer",
      {
        customer,
      }
    );

    setCustomer(createdCustomer);
    return createdCustomer;
  };

  const handleUpdateCustomer = async (customer: Customer) => {
    const updatedCustomer = await fetchRequest<Customer>(
      "PATCH",
      "/api/customers/",
      "updateCustomerFromOrder",
      { customer }
    );

    setCustomer(updatedCustomer);
    return updatedCustomer;
  };

  const handleCreateAddress = async (address: CreateAddressInput) =>
    await fetchRequest<Address>("POST", "/api/addresses/", "createAddress", {
      address: { ...address },
    });

  const handleUpdateAddress = async (address: UpdateAddressInput) =>
    await fetchRequest<Address>("PATCH", "/api/addresses/", "updateAddress", {
      address: { ...address },
    });

  async function onSubmit(values: FormValues) {
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

    setExtraInfo({ contactPhone: values.contact_phone });

    let updatedCustomer: Customer;
    if (actionCustomer === "create") {
      updatedCustomer = await handleCreateCustomer(customerContent);
    } else {
      if (!customer) return;
      updatedCustomer = await handleUpdateCustomer({ ...customer, ...customerContent });
    }

    let updatedAddress;
    if (actionAddress === "create") {
      updatedAddress = await handleCreateAddress({
        ...addressContent,
        customer_id: updatedCustomer.id,
      });
    } else {
      if (!selectedAddress) return;
      updatedAddress = await handleUpdateAddress({
        ...addressContent,
        customer_id: updatedCustomer.id,
        id: selectedAddress.id,
      });
    }

    setAddresses((prevAddresses) => {
      const addressExists = prevAddresses.some((address) => address.id === updatedAddress.id);
      return addressExists
        ? prevAddresses.map((address) =>
            address.id === updatedAddress.id ? updatedAddress : address
          )
        : [...prevAddresses, updatedAddress];
    });

    setSelectedAddress(updatedAddress);

    toastSuccess("Il cliente e i suoi indirizzi sono stato correttamente aggiornati");
  }

  return {
    onSubmit,
  };
}
