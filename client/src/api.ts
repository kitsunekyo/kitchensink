export class FetchError extends Error {
  code: number;
  constructor(res: Response) {
    super(`Failed to fetch ${res.url}: ${res.statusText}`);
    this.code = res.status;
  }
}

export async function api(url: string, options: any = { method: "GET" }) {
  const baseURL = "http://localhost:8080/api/v1";
  const res = await fetch(`${baseURL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    ...options,
  });

  if (res.status >= 401) {
    throw new FetchError(res);
  }

  if (res.status > 204) {
    throw new FetchError(res);
  }

  return await res.json();
}
