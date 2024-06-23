import { NextRequest, NextResponse } from "next/server";
import createAddress from "../../sql/addresses/createAddress";
import { Address } from "@prisma/client";

export async function POST(request: NextRequest) {
  const body: {
    requestType: string;
    content: {};
  } = await request.json();
  

  switch (body.requestType) {
    case "create":
      
      return NextResponse.json(await createAddress(body.content as Address));
  }
}
