import { NextResponse } from "next/server";
import addProductToOrder from "../../sql/products/addProductToOrder";
import updateFieldProduct from "../../sql/products/updateFieldProduct";
import deleteProduct from "../../sql/products/deleteProduct";
import getProducts from "../../sql/products/getProducts";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestType = url.searchParams.get("requestType");

  switch (requestType) {
    case "get":
      return NextResponse.json(await getProducts());
  }
}

export async function POST(request: Request) {
  const body: {
    requestType: string;
    content?: any;
  } = await request.json();

  switch (body.requestType) {
    case "add":
      return NextResponse.json(
        await addProductToOrder(
          body.content?.orderId,
          body.content?.productCode,
          body.content?.quantity
        )
      );

    case "update":
      return NextResponse.json(
        await updateFieldProduct(
          body.content?.orderId,
          body.content?.key,
          body.content?.value,
          body.content?.product
        )
      );
  }
}

export async function DELETE(request: Request) {
  const body: {
    requestType: string;
    content?: any;
  } = await request.json();

  switch (body.requestType) {
    case "delete":
      return NextResponse.json(
        await deleteProduct(body.content?.productIds, body.content?.orderId)
      );
  }
}
