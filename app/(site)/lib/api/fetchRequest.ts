// lib/api/fetchRequest.ts
export type PathType = string;
export type ValidActionKeys = string;

// temporary no-op fetch function
export default async function fetchRequest<T>(
  _method: string,
  _path: PathType,
  _action: ValidActionKeys,
  _body: any
): Promise<T | undefined> {
  throw new Error("fetchRequest is deprecated. Migrate to tRPC.");
}
