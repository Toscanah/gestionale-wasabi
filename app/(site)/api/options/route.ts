import { NextRequest, NextResponse } from "next/server";
import getAllOptions from "../../sql/options/getAllOptions";
import getPostBody from "../../util/functions/getPostBody";
import editOptionsOfCategory from "../../sql/options/editOptionsOfCategory";
import getAllOptionsWithCategories from "../../sql/options/getAllOptionsWithCategories";
import updateOption from "../../sql/options/updateOption";
import { Option } from "@prisma/client";
import createNewOption from "../../sql/options/createNewOption";
import deleteOption from "../../sql/options/deleteOption";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getAllOptions":
      return NextResponse.json(await getAllOptions());

    case "getAllOptionsWithCategories":
      return NextResponse.json(await getAllOptionsWithCategories());
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "editOptionsOfCategory":
      return NextResponse.json(await editOptionsOfCategory(content?.category, content?.options));
    case "updateOption":
      return NextResponse.json(await updateOption(content as Option));
    case "createNewOption":
      return NextResponse.json(await createNewOption(content as Option));
  }
}

export async function DELETE(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "deleteOption":
      return NextResponse.json(await deleteOption(content?.id as number));
  }
}
