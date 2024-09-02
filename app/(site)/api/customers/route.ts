import { NextRequest, NextResponse } from "next/server";
import getCustomerByPhone from "../../sql/customers/getCustomerByPhone";
import getRequestBody from "../../util/functions/getRequestBody";
import updateCustomer from "../../sql/customers/updateCustomer";
import { Address, Customer } from "@prisma/client";
import createCustomer from "../../sql/customers/createCustomer";
import getCustomersWithDetails from "../../sql/customers/getCustomersWithDetails";
import updateAddressesOfCustomer from "../../sql/customers/updateAddressesOfCustomer";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getSingle":
      return NextResponse.json(await getCustomerByPhone(params.get("phone") ?? ""));
    case "getCustomersWithDetails":
      return NextResponse.json(await getCustomersWithDetails());
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "updateCustomer":
      return NextResponse.json(await updateCustomer(content as any));

    case "createCustomer":
      return NextResponse.json(
        await createCustomer(content as { customer: Customer; phone: string })
      );

      case "toggleCustomer":
        

    case "updateAddressesOfCustomer":
      return NextResponse.json(
        await updateAddressesOfCustomer(content?.addresses, content?.customerId)
      );
  }
}
