import { NextRequest, NextResponse } from "next/server";
import addProductToOrder from "../../sql/products/addProductToOrder";
import updateProductInOrder from "../../sql/products/updateProductInOrder";
import deleteProduct from "../../sql/products/deleteProduct";
import getProducts from "../../sql/products/getProducts";
import getPostBody from "../../util/functions/getPostBody";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import updateProduct from "../../sql/products/updateProduct";
import updateProductOptionsInOrder from "../../sql/products/updateProductOptionsInOrder";
import createNewProduct from "../../sql/products/createNewProduct";

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
    case "createNewProduct":
      return NextResponse.json(await createNewProduct(content as ProductWithInfo));
    case "updateProduct":
      return NextResponse.json(await updateProduct(content as ProductWithInfo));
    case "addProductToOrder":
      return NextResponse.json(
        await addProductToOrder(content?.order, content?.productCode, content?.quantity)
      );
    case "updateProductInOrder":
      return NextResponse.json(
        await updateProductInOrder(content?.orderId, content?.key, content?.value, content?.product)
      );
    case "updateProductOptionsInOrder":
      return NextResponse.json(
        await updateProductOptionsInOrder(content?.productInOrderId, content?.optionId)
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
