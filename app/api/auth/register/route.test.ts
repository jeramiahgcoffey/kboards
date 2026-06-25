import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { POST } from "./route";

function postJson(body: unknown): Request {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeAll(async () => {
  await dbConnect();
  await User.init();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("POST /api/auth/register", () => {
  it("creates a user and returns 201 without the password", async () => {
    const res = await POST(
      postJson({
        email: "new@example.com",
        password: "supersecret",
        name: "Ada",
      }),
    );

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.user).toMatchObject({ email: "new@example.com", name: "Ada" });
    expect(json.user.password).toBeUndefined();
    expect(await User.countDocuments()).toBe(1);
  });

  it("rejects a duplicate email with 409", async () => {
    await User.create({ email: "dupe@example.com", password: "supersecret" });

    const res = await POST(
      postJson({ email: "dupe@example.com", password: "supersecret" }),
    );

    expect(res.status).toBe(409);
    expect(await User.countDocuments()).toBe(1);
  });

  it("treats email as case-insensitive when detecting duplicates", async () => {
    await User.create({ email: "dupe@example.com", password: "supersecret" });

    const res = await POST(
      postJson({ email: "DUPE@Example.com", password: "supersecret" }),
    );

    expect(res.status).toBe(409);
    expect(await User.countDocuments()).toBe(1);
  });

  it("rejects invalid input with 400", async () => {
    const res = await POST(
      postJson({ email: "not-an-email", password: "short" }),
    );

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Validation failed");
  });

  it("rejects a non-JSON body with 400", async () => {
    const res = await POST(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        body: "not json",
      }),
    );

    expect(res.status).toBe(400);
  });
});
