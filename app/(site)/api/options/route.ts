import { NextRequest, NextResponse } from "next/server";
import getAllOptions from "../../sql/options/getAllOptions";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getAllOptions":
      return NextResponse.json(await getAllOptions());
  }
}
