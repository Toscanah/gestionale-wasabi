import { NextRequest, NextResponse } from "next/server";
import addProductToOrder from "../../sql/products/addProductToOrder";
import updateFieldProduct from "../../sql/products/updateFieldProduct";
import deleteProduct from "../../sql/products/deleteProduct";
import getProducts from "../../sql/products/getProducts";
import getPostBody from "../../util/functions/getPostBody";
import createProduct from "../../sql/products/createProduct";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import editProduct from "../../sql/products/editProduct";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getProducts":
      return NextResponse.json(await getProducts());
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "createProduct":
      return NextResponse.json(await createProduct(content as ProductWithInfo));
    case "editProduct":
      return NextResponse.json(await editProduct(content as any));
    case "addProductToOrder":
      return NextResponse.json(
        await addProductToOrder(content?.order, content?.productCode, content?.quantity)
      );
    case "updateProduct":
      return NextResponse.json(
        await updateFieldProduct(content?.orderId, content?.key, content?.value, content?.product)
      );
  }
}

export async function DELETE(request: NextRequest) {
  const { action, content } = await getPostBody(request);

  switch (action) {
    case "deleteProduct":
      return NextResponse.json(await deleteProduct(content?.productIds, content?.orderId));
  }
}
