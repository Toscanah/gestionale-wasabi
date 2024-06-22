import createOrder from "@/app/(site)/sql/orders/createOrder";
import { NextResponse } from "next/server";

export async function handler(request: Request) {
  const body: {
    requestType: string;
    content?: {
      
    };
  } = await request.json();

  switch (body.requestType) {
    case "create":
      return NextResponse.json(await createOrder(body.content as any));
  }
}
