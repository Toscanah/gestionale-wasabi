import createOrder from "@/app/(site)/sql/orders/createOrder";
import { NextResponse } from "next/server";
import getOrdersByType from "../../sql/orders/getOrdersByType";
import { TypesOfOrder } from "../../types/TypesOfOrder";

export async function POST(request: Request) {
  const body: {
    requestType: string;
    content?: {
      // TODO:
    };
  } = await request.json();

  switch (body.requestType) {
    case "create":
      return NextResponse.json(await createOrder(body.content as any));
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
