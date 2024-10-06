"use client";

import { useEffect, useState } from "react";
import address from "./receipts/address"; // Assuming it returns encoded data
import commands from "./commands"; // Assuming it contains ESC/POS commands
import { Button } from "@/components/ui/button";

export default function Dio() {
  const [device, setDevice] = useState<USBDevice | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const setupDevice = (selectedDevice: USBDevice) => {
    return selectedDevice
      .open()
      .then(() => selectedDevice.selectConfiguration(1))
      .then(() => selectedDevice.claimInterface(0))
      .then(() => {
        setDevice(selectedDevice);
        setIsConnected(true);
      })
      .catch((error) => {
        console.error("Error setting up the device:", error);
      });
  };

  const connectToDevice = () => {
    if (!device) {
      navigator.usb
        .requestDevice({ filters: [] })
        .then((selectedDevice) => setupDevice(selectedDevice))
        .catch((error) => {
          console.error("Failed to connect to USB device:", error);
        });
    }
  };

  const print =  () => {
    if (device && isConnected) {
      const data = address();
      const commandBuffer = new Uint8Array([
        // ...commands.TEXT_BOLD,
        ...new TextEncoder().encode("AAAB "),
        // ...commands.FULL_CUT,
      ]);

      device
        .transferOut(1, data)

    } else {
      console.warn("Device is not connected or not ready");
    }
  };

  return (
    <div className="flex gap-4">
      {/* Button to trigger device connection and printing */}
      <Button onClick={connectToDevice}>Connect to Printer</Button>
      <Button onClick={print} disabled={!isConnected}>
        Print
      </Button>
    </div>
  );
}
