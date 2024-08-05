export default function getNestedValue<T>(obj: T, path: string): any {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj as any
    );
}
