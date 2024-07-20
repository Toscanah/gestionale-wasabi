import { NextResponse } from "next/server";
import getRice from "../../sql/rice/getRice";
import updateRice from "../../sql/rice/updateRice";

export async function GET(request: Request) {
  const requestType = new URL(request.url).searchParams.get("requestType");

  switch (requestType) {
    case "get": {
      return NextResponse.json(await getRice());
    }
  }
}

export async function POST(request: Request) {
  const {
    requestType,
    content,
  }: { requestType: string; content: { rice: number } } = await request.json();

  switch (requestType) {
    case "update": {
      return NextResponse.json(await updateRice(content.rice));
    }
  }
}


