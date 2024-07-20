export default async function fetchRequest(
  method: "POST" | "GET" | "DELETE",
  path: string,
  body?: { requestType: string; content?: {} } | undefined
): Promise<any> {
  return await (
    await fetch(path, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
    })
  ).json();
}
