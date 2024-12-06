import { ReactNode } from "react";
import { Printer, render } from "react-thermal-printer";

interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  writable: WritableStream | null;
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

export default async function print(...contents: (() => ReactNode)[]) {
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

  const receipt = (
    <Printer characterSet="wpc1256_arabic" type="epson">
      {contents.map((content) => content())}
    </Printer>
  );

  const data: Uint8Array = await render(receipt);
  const ports: SerialPort[] = await window.navigator.serial.getPorts();

  if (ports.length == 0) return false;

  const port = ports[0];

  if (port) {
    await port.open({ baudRate: 19200 });
    const writer = port.writable?.getWriter();

    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }

    await port.close();
    return true;
  }

  return false;
}
