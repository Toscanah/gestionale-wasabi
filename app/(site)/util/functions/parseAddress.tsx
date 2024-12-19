export default function parseAddress(street: string) {
  let index = 0;
  while (index < street.length && !/\d/.test(street[index])) {
    index++;
  }

  const streetName = street.slice(0, index).trim();
  const civic = street.slice(index).trim();

  return { street: streetName, civic };
}
