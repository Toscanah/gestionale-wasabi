import { NextRequest, NextResponse } from "next/server";
import addProductToOrder from "../../sql/products/addProductToOrder";
import addProductsToOrder from "../../sql/products/addProductsToOrder";
import updateProductInOrder from "../../sql/products/updateProductInOrder";
import deleteProductFromOrder from "../../sql/products/deleteProductFromOrder";
import getProducts from "../../sql/products/getProducts";
import getRequestBody from "../../util/functions/getRequestBody";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import updateProduct from "../../sql/products/updateProduct";
import updateProductOptionsInOrder from "../../sql/products/updateProductOptionsInOrder";
import createNewProduct from "../../sql/products/createNewProduct";
import toggleProduct from "../../sql/products/toggleProduct";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  switch (params.get("action")) {
    case "getProducts":
      return NextResponse.json(await getProducts());
  }
}

export async function POST(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

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
    case "addProductsToOrder":
      return NextResponse.json(await addProductsToOrder(content?.orderId, content?.products));;

    case "updateProductOptionsInOrder":
      return NextResponse.json(
        await updateProductOptionsInOrder(content?.productInOrderId, content?.optionId)
      );
    case "toggleProduct":
      return NextResponse.json(await toggleProduct(content?.id));
  }
}

export async function DELETE(request: NextRequest) {
  const { action, content } = await getRequestBody(request);

  switch (action) {
    case "deleteProductFromOrder":
      return NextResponse.json(await deleteProductFromOrder(content?.productIds, content?.orderId, content?.cooked));
  }
}
