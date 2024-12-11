import { NextRequest, NextResponse } from "next/server";
import getRequestBody from "../../util/functions/getRequestBody";
import { Payment } from "@prisma/client";
import payOrder from "../../sql/payments/payOrder";
import getOrdersWithPayments from "../../sql/payments/getOrdersWithPayments";

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "payOrder":
      return NextResponse.json(
        await payOrder(content?.payments as Payment[], content?.productsToPay)
      );
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getOrdersWithPayments":
      return NextResponse.json(await getOrdersWithPayments());
  }
}
