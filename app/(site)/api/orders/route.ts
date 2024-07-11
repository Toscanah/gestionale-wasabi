import createTableOrder from "@/app/(site)/sql/orders/createTableOrder";
import { NextResponse } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import { TypesOfOrder } from "../../types/TypesOfOrder";
import createPickupOrder from "../../sql/orders/createPickupOrder";

export async function POST(request: Request) {
  const body: {
    requestType: string;
    content: {};
  } = await request.json();

  switch (body.requestType) {
    case "createTableOrder":
      return NextResponse.json(await createTableOrder(body.content as any));
    case "createPickupOrder":
      return NextResponse.json(await createPickupOrder(body.content as any));
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestType = url.searchParams.get("requestType");

  switch (requestType) {
    case "getOrdersByType":
      return NextResponse.json(
        await getOrdersByType(url.searchParams.get("type") as TypesOfOrder)
      );
  }
}
