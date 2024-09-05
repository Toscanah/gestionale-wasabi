import createTableOrder from "@/app/(site)/sql/orders/createTableOrder";
import { NextRequest, NextResponse } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import { OrderType } from "../../types/OrderType";
import createPickupOrder from "../../sql/orders/createPickupOrder";
import createHomeOrder from "../../sql/orders/createHomeOrder";
import getRequestBody from "../../util/functions/getRequestBody";
import copyFromOrder from "../../sql/orders/copyFromOrder";

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "createTableOrder":
      return NextResponse.json(await createTableOrder(content as any));
    case "createPickupOrder":
      return NextResponse.json(await createPickupOrder(content as any));
    case "createHomeOrder":
      return NextResponse.json(await createHomeOrder(content as any));
    case "copyFromOrder":
      return NextResponse.json(await copyFromOrder(content?.sourceOrder, content?.order));
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getOrdersByType":
      return NextResponse.json(await getOrdersByType(params.get("type") as OrderType));
  }
}
