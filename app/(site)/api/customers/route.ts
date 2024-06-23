import { NextRequest, NextResponse } from "next/server";
import getCustomerByPhone from "../../sql/customers/getCustomerByPhone";

export async function GET(request: NextRequest) {
  switch (request.nextUrl.searchParams.get("requestType")) {
    case "getSingle":
      const phone = request.nextUrl.searchParams.get("phone");
      return NextResponse.json(await getCustomerByPhone(phone ?? ""));
  }
}
