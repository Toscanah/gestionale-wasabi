import { ReactNode } from "react";
import { Printer, render } from "react-thermal-printer";

export default async function print(...contents: (() => ReactNode)[]) {
  /**
   * step 1: installare il driver sia del cavo serial (https://www.think-benfei.com/driver/FL2000-2.1.34054.0.exe)
   * e poi della stampante in se
   *
   * step 2: e poi andare nel device manager e mettere 19200 come rate
   */

  const receipt = (
    <Printer characterSet="wpc1256_arabic" type="epson">
      {contents.map((content) => content())}
    </Printer>
  );
  
  const data: Uint8Array = await render(receipt);
  const ports = await window.navigator.serial.getPorts();
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
