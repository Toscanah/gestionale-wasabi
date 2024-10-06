import { Address } from "@prisma/client";
import commands from "../commands";

export default function address(address?: Address, contactPhone?: string): Uint8Array {
  const encoder = new TextEncoder();

  // Prepare address string
  let addressString = "Address Details:\n";
  // addressString += `Street: ${address.street}\n`;
  // addressString += `Civic: ${address.civic}\n`;
  // addressString += `Street Info: ${address.street_info}\n`;
  // addressString += `Contact Phone: ${contactPhone}\n`;

  // Combine commands and the encoded address
  return new Uint8Array([
    ...commands.ALIGN_RIGHT,
    ...encoder.encode("AAAAAAAAAAAAAA"),
    ...encoder.encode(addressString),
    ...commands.FULL_CUT,

  ]);
}
