type HttpMethod = "POST" | "GET" | "DELETE";

export default async function fetchRequest<T>(
  method: HttpMethod,
  path: string,
  action?: string,
  content?: object | undefined
): Promise<T> {
  // quando ho una richiesta GET non si dovrebbe avere la proprietà body anche se è undefined
  // ma alla fine che cazzo me ne frega, tanto l'API la faccio io

  return await (
    await fetch(path, {
      method: method,
      body: content && action ? JSON.stringify({ action, content }) : undefined,
    })
  ).json();
}
