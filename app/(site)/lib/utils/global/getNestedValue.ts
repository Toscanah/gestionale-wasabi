/**
 * Retrieves the value at a given nested path within an object.
 *
 * @template T - The type of the input object.
 * @param obj - The object from which to retrieve the nested value.
 * @param path - The dot-separated string representing the path to the desired value (e.g., "a.b.c").
 * @returns The value at the specified path, or an empty string if the path does not exist.
 */
export default function getNestedValue<T>(obj: T, path: string): any {
  return (
    path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj as any) ??
    ""
  );
}
