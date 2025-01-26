import { ReactNode } from "react";
import { CharacterSet, Printer, render } from "react-thermal-printer";

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  writable: WritableStream | null;
  getInfo(): {
    usbVendorId?: number;
    usbProductId?: number;
  };
}

interface Serial {
  getPorts(): Promise<SerialPort[]>;
  requestPort(): Promise<SerialPort>;
}

declare global {
  interface Navigator {
    serial: Serial;
  }
}

/**
 * Passaggi per configurare la stampante termica:
 *
 * 1. **Installare i driver necessari**:
 *    - **Driver per il cavo seriale**: Installare il driver per il cavo seriale.
 *      - [Driver per il cavo seriale](https://www.think-benfei.com/driver/FL2000-2.1.34054.0.exe)
 *    - **Driver per la stampante termica**: Installare il driver per la stampante termica fornito dal produttore della stampante.
 *
 * 2. **Configurare le impostazioni della porta seriale**:
 *    - Vai su **Gestione dispositivi** e trova il dispositivo seriale per la stampante termica.
 *    - Imposta il **tasso di trasmissione (baud rate)** a **19200**.
 *
 * ### Dettagli del processo di stampa:
 *
 * - Il contenuto della ricevuta verrà generato come un componente React utilizzando il tipo di stampante **Epson**.
 * - Il contenuto di ciascun elemento viene renderizzato e passato al metodo `render` della libreria `react-thermal-printer`.
 * - Una volta ottenuto il flusso di byte dalla funzione `render`, la connessione alla porta seriale viene stabilita.
 * - I dati vengono quindi inviati alla stampante tramite la porta seriale utilizzando il tasso di trasmissione configurato.
 * - Alla fine, la connessione alla porta viene chiusa.
 */
export default async function print(...contents: (() => ReactNode)[]) {
  const EURO_USB_PRODUCT_ID = 9123;
  const EURO_USB_VENDOR_ID = 1659;

  const ports: SerialPort[] = await window.navigator.serial.getPorts();

  let selectedPort: SerialPort | null = null;
  let characterSetToUse: CharacterSet = "wpc1256_arabic";

  for (const port of ports) {
    const info = port.getInfo();

    if (info.usbProductId === EURO_USB_PRODUCT_ID && info.usbVendorId === EURO_USB_VENDOR_ID) {
      selectedPort = port;
      characterSetToUse = "wpc1256_arabic"; // pc858_euro
      break;
    }
  }

  if (!selectedPort) {
    selectedPort = ports[0];
  }

  const receipt = (
    <Printer characterSet={characterSetToUse} type="epson">
      {contents.map((content) => content())}
    </Printer>
  );

  const data: Uint8Array = await render(receipt);
  console.log(new TextDecoder().decode(data));

  if (ports.length === 0) {
    return false;
  }

  try {
    await selectedPort.open({ baudRate: 19200 });
    const writer = selectedPort.writable?.getWriter();

    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }

    await selectedPort.close();
    return true;
  } catch (error) {
    console.error("Error interacting with the serial port:", error);
    return false;
  }
}
