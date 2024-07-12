import { NextRequest, NextResponse } from "next/server";
import createAddress from "../../sql/addresses/createAddress";
import updateAddress from "../../sql/addresses/updateAddress";
import getAddressesByCustomer from "../../sql/addresses/getAddressesByCustomer";

export async function POST(request: NextRequest) {
  const body: {
    requestType: string;
    content: {};
  } = await request.json();
  console.log(body.requestType);

  switch (body.requestType) {
    case "create":
      return NextResponse.json(await createAddress(body.content as any));
    case "update":
      return NextResponse.json(await updateAddress(body.content as any));
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
