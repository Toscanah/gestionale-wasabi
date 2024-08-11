import { NextRequest, NextResponse } from "next/server";
import getAllOptions from "../../sql/options/getAllOptions";
import getPostBody from "../../util/functions/getPostBody";
import editOptionsOfCategory from "../../sql/options/editOptionsOfCategory";
import getOptionsByCategory from "../../sql/options/getOptionsByCategory";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getAllOptions":
      return NextResponse.json(await getAllOptions());
    case "getOptionsByCategory":
      return NextResponse.json(await getOptionsByCategory(Number(params.get("categoryId"))));
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "editOptionsOfCategory":
      return NextResponse.json(await editOptionsOfCategory(content?.category, content?.options));
  }
}
