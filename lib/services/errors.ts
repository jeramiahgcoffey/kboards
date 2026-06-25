// Domain errors carry the HTTP status the route handler should return. The
// route wrapper (lib/api/route.ts) maps these to responses, keeping the
// services free of any HTTP concerns.
export class ServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export const badRequest = (message: string) => new ServiceError(400, message);
export const notFound = (message: string) => new ServiceError(404, message);
export const conflict = (message: string) => new ServiceError(409, message);
