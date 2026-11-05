export const DUMMYJSON_BASE_URL = "https://dummyjson.com";

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${DUMMYJSON_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;
    throw new Error(body?.message ?? `DummyJSON request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function encodeQuery(value: string): string {
  return encodeURIComponent(value.trim());
}
