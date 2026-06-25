import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";
import { z } from "zod";

// Mock the data-access helper so the wrapper never touches Auth.js or the db.
vi.mock("@/lib/auth/dal", () => ({ getCurrentUserId: vi.fn() }));
import { getCurrentUserId } from "@/lib/auth/dal";
import { authed, readJson } from "./route";
import { notFound } from "@/lib/services/errors";

const mockUser = vi.mocked(getCurrentUserId);

function context<P>(params: P) {
  return { params: Promise.resolve(params) };
}
function postRequest(body?: string) {
  return new Request("http://localhost/api/x", { method: "POST", body });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authed", () => {
  it("returns 401 when there is no signed-in user", async () => {
    mockUser.mockResolvedValue(null);
    const handler = authed(async () => NextResponse.json({ ok: true }));

    const res = await handler(postRequest(), context({}));

    expect(res.status).toBe(401);
  });

  it("passes the user id and resolved params to the handler", async () => {
    mockUser.mockResolvedValue("user-1");
    const handler = authed<{ boardId: string }>(async ({ userId, params }) =>
      NextResponse.json({ userId, boardId: params.boardId }),
    );

    const res = await handler(postRequest(), context({ boardId: "b1" }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ userId: "user-1", boardId: "b1" });
  });

  it("maps a ServiceError to its status and message", async () => {
    mockUser.mockResolvedValue("user-1");
    const handler = authed(async () => {
      throw notFound("Board not found");
    });

    const res = await handler(postRequest(), context({}));

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Board not found" });
  });

  it("maps a ZodError to 400", async () => {
    mockUser.mockResolvedValue("user-1");
    const schema = z.object({ name: z.string() });
    const handler = authed(async () => {
      schema.parse({});
      return NextResponse.json({ ok: true });
    });

    const res = await handler(postRequest(), context({}));

    expect(res.status).toBe(400);
  });

  it("treats a malformed JSON body as 400 via readJson", async () => {
    mockUser.mockResolvedValue("user-1");
    const handler = authed(async ({ request }) => {
      await readJson(request);
      return NextResponse.json({ ok: true });
    });

    const res = await handler(postRequest("not json"), context({}));

    expect(res.status).toBe(400);
  });
});
