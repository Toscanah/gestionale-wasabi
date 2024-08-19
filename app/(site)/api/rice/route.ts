import { NextRequest, NextResponse } from "next/server";
import getRice from "../../sql/rice/getRice";
import updateRice from "../../sql/rice/updateRice";
import getRequestBody from "../../util/functions/getRequestBody";
import { Rice } from "@prisma/client";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getRice": {
      return NextResponse.json(await getRice());
    }
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "updateRice": {
      const { rice } = content;
      return NextResponse.json(await updateRice(rice as Rice));
    }
  }
}
