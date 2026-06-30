// Client-side fetch helper for the JSON API. Centralizes the JSON headers and
// the error-message extraction that every mutation in the UI would otherwise
// repeat, and surfaces a typed ApiError so callers can branch on status.

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchInit {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  // A JSON-serializable body; serialized and sent with a JSON content type.
  body?: unknown;
  signal?: AbortSignal;
}

export async function apiFetch<T = unknown>(
  url: string,
  init: ApiFetchInit = {},
): Promise<T> {
  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: init.body !== undefined ? { "content-type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    signal: init.signal,
  });

  if (!response.ok) {
    // The API answers errors as { error: string }; fall back to a generic
    // message when the body is missing or not JSON.
    const data = await response.json().catch(() => null);
    const message =
      (data && typeof data.error === "string" && data.error) ||
      "Something went wrong. Please try again.";
    throw new ApiError(response.status, message);
  }

  // 204 No Content (e.g. board delete) carries no body to parse.
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
