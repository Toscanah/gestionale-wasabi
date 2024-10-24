"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Br, Cut, Line, Printer, Text, Row, render, Raw } from "react-thermal-printer";

import { HomeOrder } from "../types/PrismaOrders";
import Takeaway from "./receipts/order";
import takeway from "./receipts/order";
import productsTable from "./common/products";
import getOrdersByType from "../sql/orders/getOrdersByType";
import { OrderType } from "../types/OrderType";
import { ProductInOrderType } from "../types/ProductInOrderType";
import fetchRequest from "../util/functions/fetchRequest";

export default async function print(content: () => ReactNode) {
  /**
   * step 1: installare il driver sia del cavo serial
   * e poi della stampante in se
   *
   * step 2: e poi andare nel device manager e mettere 19200 come rate
   */

  const receipt = (
    <Printer characterSet="wpc1256_arabic" type="epson">
      {content()}
    </Printer>
  );

  const data: Uint8Array = await render(receipt);
  const ports = await (window as any).navigator.serial.getPorts();
  const port = ports[0];

  if (port) {
    await port.open({ baudRate: 19200 });

    const writer = port.writable?.getWriter();

    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }

    await port.close();
  }
}
