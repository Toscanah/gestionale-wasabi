import { NextRequest, NextResponse } from "next/server";
import getCustomerByPhone from "../../sql/customers/getCustomerByPhone";
import getRequestBody from "../../util/functions/getRequestBody";
import { Address, Customer } from "@prisma/client";
import createCustomer from "../../sql/customers/createCustomer";
import toggleCustomer from "../../sql/customers/toggleCustomer";
import getCustomersWithDetails from "../../sql/customers/getCustomersWithDetails";
import updateAddressesOfCustomer from "../../sql/customers/updateAddressesOfCustomer";
import updateCustomerFromOrder from "../../sql/customers/updateCustomerFromOrder"
import { CustomerWithDetails } from "../../types/CustomerWithDetails";
import getCustomerWithDetails from "../../sql/customers/getCustomerWithDetails";
import updateCustomerFromAdmin from "../../sql/customers/updateCustomerFromAdmin";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getCustomerByPhone":
      return NextResponse.json(await getCustomerByPhone(params.get("phone") ?? ""));
    case "getCustomersWithDetails":
      return NextResponse.json(await getCustomersWithDetails());
    case "getCustomerWithDetails":
      return NextResponse.json(
        await getCustomerWithDetails(Number(params.get("customerId")) ?? -1)
      );
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "updateCustomerFromAdmin":
      return NextResponse.json(
        await updateCustomerFromAdmin({
          ...content,
          phone: { phone: content?.phone, id: content?.phone_id },
        } as CustomerWithDetails)
      );

    case "updateCustomerFromOrder":
      return NextResponse.json(await updateCustomerFromOrder(content as any));

    case "createCustomer":
      return NextResponse.json(
        await createCustomer(
          content?.customer
            ? content.customer
            : {
                name: content?.name,
                surname: content?.surname,
                email: content?.email,
                preferences: content?.preferences,
              },
          content?.phone
        )
      );

    case "toggleCustomer":
      return NextResponse.json(await toggleCustomer(content?.id));

    case "updateAddressesOfCustomer":
      return NextResponse.json(
        await updateAddressesOfCustomer(content?.addresses, content?.customerId)
      );
  }
}
