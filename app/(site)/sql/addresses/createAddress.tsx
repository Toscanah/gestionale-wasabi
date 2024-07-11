import { Address, Customer } from "@prisma/client";
import prisma from "../db";

export default async function createAddress(data: {
  address: Address;
  phone: string;
  name: string;
  surname: string;
  customer?: Customer;
}) {
  const { address, phone, customer, name, surname } = data;

  if (customer) {
    // nel dubbio cambio sempre il nome e cognome
    await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        name: name,
        surname: surname,
      },
    });

    // creo il nuovo domicilio
    const newAddress = await prisma.address.create({
      data: {
        ...address,
        cap: Number(address.cap),
      },
    });

    // ritorno il cliente con tutti i domicili cosi lo state<CustomerWithAddresses> è contento
    // + il nuovo domicilio
    return {
      address: newAddress,
      customer: await prisma.customer.findUnique({
        where: { id: customer.id },
        include: {
          addresses: true,
        },
      }),
    };
  } else {
    const newCustomer = await prisma.customer.create({
      data: {
        phone: {
          create: {
            phone: phone,
          },
        },
        name: name,
        surname: surname,
        addresses: {
          create: {
            ...address,
            cap: Number(address.cap),
          },
        },
      },
      include: {
        addresses: true,
      },
    });

    const newAddress = prisma.address.findFirst({
      where: {
        ...address,
        cap: Number(address.cap),
      },
    });

    return { customer: newCustomer, address: newAddress };
  }
}
