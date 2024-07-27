import { NextRequest, NextResponse } from "next/server";
import createAddress from "../../sql/addresses/createAddress";
import updateAddress from "../../sql/addresses/updateAddress";
import getAddressesByCustomer from "../../sql/addresses/getAddressesByCustomer";
import { Address } from "@prisma/client";
import getPostBody from "../../util/getPostBody";

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "createAddress":
      return NextResponse.json(await createAddress(content as Address));
    case "updateAddress":
      return NextResponse.json(await updateAddress(content as Address));
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getAddressesByCustomer": {
      return NextResponse.json(
        await getAddressesByCustomer(Number(params.get("customerId")))
      );
    }
  }
}
