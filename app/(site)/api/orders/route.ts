import createTableOrder from "@/app/(site)/sql/orders/createTableOrder";
import { NextRequest, NextResponse } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import { OrderType } from "../../types/OrderType";
import createPickupOrder from "../../sql/orders/createPickupOrder";
import createHomeOrder from "../../sql/orders/createHomeOrder";
import getRequestBody from "../../util/functions/getRequestBody";
import updateOrderTime from "../../sql/orders/updateOrderTime";
import cancelOrder from "../../sql/orders/cancelOrder";
import updateOrderNotes from "../../sql/orders/updateOrderNotes";
import updateDiscount from "../../sql/orders/updateDiscount";

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "updateDiscount":
      return NextResponse.json(await updateDiscount(content?.orderId, content?.discount));
    case "updateOrderNotes":
      return NextResponse.json(await updateOrderNotes(content?.orderId, content?.notes));
    case "createTableOrder":
      return NextResponse.json(await createTableOrder(content as any));
    case "createPickupOrder":
      return NextResponse.json(await createPickupOrder(content as any));
    case "createHomeOrder":
      return NextResponse.json(await createHomeOrder(content as any));
    case "updateOrderTime":
      return NextResponse.json(await updateOrderTime(content?.time, content?.orderId));
    case "cancelOrder":
      return NextResponse.json(await cancelOrder(content?.orderId));
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getOrdersByType":
      return NextResponse.json(await getOrdersByType(params.get("type") as OrderType));
  }
}
