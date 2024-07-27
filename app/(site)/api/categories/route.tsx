import { NextRequest, NextResponse } from "next/server";
import getCategories from "../../sql/categories/getCategories";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getCategories":
      return NextResponse.json(await getCategories());
  }
}
