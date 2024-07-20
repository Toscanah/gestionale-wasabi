import { NextRequest, NextResponse } from "next/server";
import createAddress from "../../sql/addresses/createAddress";
import updateAddress from "../../sql/addresses/updateAddress";
import getAddressesByCustomer from "../../sql/addresses/getAddressesByCustomer";
import { Address, Customer } from "@prisma/client";

export async function POST(request: NextRequest) {
  const body: {
    requestType: string;
    content: object;
  } = await request.json();

  switch (body.requestType) {
    case "createAddress":
      return NextResponse.json(await createAddress(body.content as Address));
    case "updateAddress":
      return NextResponse.json(await updateAddress(body.content as Address));
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const requestType = url.searchParams.get("requestType");

  switch (requestType) {
    case "getAddressesByCustomer": {
      return NextResponse.json(
        await getAddressesByCustomer(Number(url.searchParams.get("customerId")))
      );
    }
  }
}
