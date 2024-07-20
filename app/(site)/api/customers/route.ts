import { NextRequest, NextResponse } from "next/server";
import getCustomerByPhone from "../../sql/customers/getCustomerByPhone";
import getPostBody from "../../util/getPostBody";
import updateCustomer from "../../sql/customers/updateCustomer";
import { Customer } from "@prisma/client";
import createCustomer from "../../sql/customers/createCustomer";

export async function GET(request: NextRequest) {
  switch (request.nextUrl.searchParams.get("requestType")) {
    case "getSingle":
      const phone = request.nextUrl.searchParams.get("phone");
      return NextResponse.json(await getCustomerByPhone(phone ?? ""));
  }
}

export async function POST(request: NextRequest) {
  const body = await getPostBody(request);

  switch (body.requestType) {
    case "updateCustomer": {
      return NextResponse.json(await updateCustomer(body.content as any));
    }
    case "createCustomer": {
      return NextResponse.json(
        await createCustomer(
          body.content as { customer: Customer; phone: string }
        )
      );
    }
  }
}
