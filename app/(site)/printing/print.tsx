import { ReactNode } from "react";
import { CharacterSet, Printer, render } from "react-thermal-printer";
import { GlobalSettings } from "../types/GlobalSettings";
import { Printer as SelectedPrinter } from "../components/settings/PrinterChoice";
import { defaultSettings } from "../hooks/useSettings";

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

type PrinterContent = () => ReactNode;

export default async function print(...contents: PrinterContent[]) {
  const selectedPrinter: SelectedPrinter = (
    JSON.parse(
      localStorage.getItem("settings") || JSON.stringify(defaultSettings)
    ) as GlobalSettings
  ).selectedPrinter;

  const ports: SerialPort[] = await window.navigator.serial.getPorts();

  if (ports.length == 0) {
    return false;
  }

  let selectedPort: SerialPort = ports[0];
  let characterSetToUse: CharacterSet = selectedPrinter.charSet;

  const receipt = (
    <Printer characterSet={characterSetToUse} type="epson">
      {contents.map((content) => content())}
    </Printer>
  );

  const data: Uint8Array = await render(receipt);
  console.log(new TextDecoder().decode(data));

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
