import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { verifyCredentials } from "./credentials";

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

describe("verifyCredentials", () => {
  it("returns the safe user for a correct email and password", async () => {
    await User.create({
      email: "user@example.com",
      password: "supersecret",
      name: "Ada",
    });

    const result = await verifyCredentials("user@example.com", "supersecret");

    expect(result).toEqual({
      id: expect.any(String),
      email: "user@example.com",
      name: "Ada",
    });
  });

  it("matches regardless of the email's case or surrounding space", async () => {
    await User.create({ email: "user@example.com", password: "supersecret" });

    const result = await verifyCredentials("  USER@Example.com ", "supersecret");

    expect(result).not.toBeNull();
    expect(result?.email).toBe("user@example.com");
  });

  it("returns null for a wrong password", async () => {
    await User.create({ email: "user@example.com", password: "supersecret" });

    expect(
      await verifyCredentials("user@example.com", "wrong-password"),
    ).toBeNull();
  });

  it("returns null for an unknown email", async () => {
    expect(
      await verifyCredentials("nobody@example.com", "whatever123"),
    ).toBeNull();
  });
});
