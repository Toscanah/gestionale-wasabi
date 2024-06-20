import createOrder from "@/app/(site)/sql/orders/createOrder";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  return NextResponse.json(await createOrder());
}
