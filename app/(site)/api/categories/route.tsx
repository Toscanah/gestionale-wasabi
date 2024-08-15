import { NextRequest, NextResponse } from "next/server";
import getCategories from "../../sql/categories/getCategories";
import getPostBody from "../../util/functions/getPostBody";
import { CategoryWithOptions } from "../../types/CategoryWithOptions";
import createNewCategory from "../../sql/categories/createNewCategory";
import updateCategory from "../../sql/categories/updateCategory";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getCategories":
      return NextResponse.json(await getCategories());
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "updateCategory":
      return NextResponse.json(await updateCategory(content as CategoryWithOptions));
    case "createNewCategory":
      return NextResponse.json(await createNewCategory(content as CategoryWithOptions));
  }
}
