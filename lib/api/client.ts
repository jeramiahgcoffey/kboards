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

// A hung request would otherwise leave a submit button stuck pending forever,
// so every call aborts after this deadline unless it resolves first.
const DEFAULT_TIMEOUT_MS = 15_000;

export async function apiFetch<T = unknown>(
  url: string,
  init: ApiFetchInit = {},
): Promise<T> {
  // Combine a default timeout with any caller-supplied signal. AbortSignal.any
  // aborts immediately if the caller's signal is already aborted, and self-
  // cleans once settled, so there is no lingering listener to leak.
  const timeoutSignal = AbortSignal.timeout(DEFAULT_TIMEOUT_MS);
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;

  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: init.body !== undefined ? { "content-type": "application/json" } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    signal,
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
  return (await response.json()) as T;
}

// Shared message extractor so call sites surface the API's message and fall
// back to a caller-supplied line for non-API failures (network, timeout).
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}
