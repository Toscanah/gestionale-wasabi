import { NextRequest, NextResponse } from "next/server";
import getCustomerByPhone from "../../sql/customers/getCustomerByPhone";
import getRequestBody from "../../util/functions/getRequestBody";
import updateCustomer from "../../sql/customers/updateCustomer";
import { Customer } from "@prisma/client";
import createCustomer from "../../sql/customers/createCustomer";
import getCustomersWithDetails from "../../sql/customers/getCustomersWithDetails";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getSingle":
      return NextResponse.json(await getCustomerByPhone(params.get("phone") ?? ""));
    case "getCustomersWithDetails":
      return NextResponse.json(await getCustomersWithDetails())
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "updateCustomer": {
      return NextResponse.json(await updateCustomer(content as any));
    }
    case "createCustomer": {
      return NextResponse.json(
        await createCustomer(content as { customer: Customer; phone: string })
      );
    }
  }
}
