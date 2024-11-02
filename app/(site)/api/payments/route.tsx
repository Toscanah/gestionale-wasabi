import { NextRequest, NextResponse } from "next/server";
import getRequestBody from "../../util/functions/getRequestBody";
import { Payment } from "@prisma/client";
import payOrder from "../../sql/payments/payOrder";

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "payOrder":
      return NextResponse.json(
        await payOrder(content?.payments as Payment[], content?.productsToPay)
      );
  }
}
