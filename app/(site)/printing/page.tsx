"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Br, Cut, Line, Printer, Text, Row, render } from "react-thermal-printer";

import { HomeOrder } from "../types/PrismaOrders";
import Takeaway from "./receipts/Takeaway";

export default function Dio() {
  async function foo() {
    /**
     * step 1: installare il driver sia del cavo serial
     * e poi della stampante in se
     *
     * step 2: e poi andare nel device manager e mettere 19200 come rate
     */

    //width={42} characterSet="wpc1252"
    const receipt = (
      <Printer type="epson">
        <Takeaway />
      </Printer>
    );

    const data: Uint8Array = await render(receipt);
    const port = await (window as any).navigator.serial.requestPort();
    await port.open({ baudRate: 19200 });

    console.log(data);

    const writer = port.writable?.getWriter();

    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }
  }

  return (
    <div className="flex gap-4">
      <Button onClick={foo}>test </Button>
    </div>
  );
}
