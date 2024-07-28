import { NextRequest, NextResponse } from "next/server";
import getRice from "../../sql/rice/getRice";
import updateRice from "../../sql/rice/updateRice";
import getPostBody from "../../util/getPostBody";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getRice": {
      return NextResponse.json(await getRice());
    }
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "updateRice": {
      const { rice } = content;
      return NextResponse.json(await updateRice(rice as number));
    }
  }
}
