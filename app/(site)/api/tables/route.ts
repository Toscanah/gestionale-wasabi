import { NextRequest, NextResponse } from "next/server";
import getTables from "../../sql/tables/getTables";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getTables": {
      return NextResponse.json(await getTables());
    }
  }
}
