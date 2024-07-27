type HttpMethod = "POST" | "GET" | "DELETE";

export default async function fetchRequest<T>(
  method: HttpMethod,
  path: string,
  action?: string,
  content?: object | undefined
): Promise<T> {
  return await (
    await fetch(path, {
      method: method,
      body: content && action ? JSON.stringify({ action, content }) : undefined,
    })
  ).json();
}
