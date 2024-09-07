import { NextRequest, NextResponse } from "next/server";
import getRemainingRice from "../../sql/rice/getRemainingRice";
import updateRice from "../../sql/rice/updateRice";
import getRequestBody from "../../util/functions/getRequestBody";
import getTotalRice from "../../sql/rice/getTotalRice";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getRemainingRice": {
      return NextResponse.json(await getRemainingRice());
    }

    case "getTotalRice":
      return NextResponse.json(await getTotalRice());
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "updateRice":
      return NextResponse.json(await updateRice(content));
  }
}
