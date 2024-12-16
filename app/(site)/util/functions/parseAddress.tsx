export default function parseAddress(street: string) {
  const civicMatch = street.match(/(?:\D*\d+|\s*\d+)(?=\s|$)/);

  if (civicMatch) {
    const index = street.indexOf(civicMatch[0]);
    const streetName = street.slice(0, index).trim();
    const civic = civicMatch[0].trim();

    return { street: streetName, civic };
  }

  return { street: street.trim(), civic: "" };
}
