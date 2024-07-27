import createTableOrder from "@/app/(site)/sql/orders/createTableOrder";
import { NextRequest, NextResponse } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import createPickupOrder from "../../sql/orders/createPickupOrder";
import createHomeOrder from "../../sql/orders/createHomeOrder";
import getPostBody from "../../util/getPostBody";

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);
  
  switch (action) {
    case "createTableOrder":
      return NextResponse.json(await createTableOrder(content as any));
    case "createPickupOrder":
      return NextResponse.json(await createPickupOrder(content as any));
    case "createHomeOrder":
      return NextResponse.json(await createHomeOrder(content as any));
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getOrdersByType":
      return NextResponse.json(
        await getOrdersByType(params.get("type") as TypesOfOrder)
      );
  }
}
