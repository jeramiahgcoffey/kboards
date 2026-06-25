import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
} from "vitest";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/User";
import { Token } from "@/lib/db/models/Token";
import {
  requestPasswordReset,
  confirmPasswordReset,
} from "./passwordReset";

// Capture the reset link instead of sending an email.
vi.mock("@/lib/email", () => ({ sendResetEmail: vi.fn() }));
import { sendResetEmail } from "@/lib/email";
const sendResetEmailMock = vi.mocked(sendResetEmail);

// The raw token is the last path segment of the link handed to sendResetEmail.
function lastEmailedToken(): string {
  const call = sendResetEmailMock.mock.calls.at(-1);
  if (!call) throw new Error("sendResetEmail was not called");
  return call[1].split("/").pop()!;
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
  await Token.deleteMany({});
  vi.clearAllMocks();
});

describe("requestPasswordReset", () => {
  it("stores only a hash of the token and emails the raw link", async () => {
    await User.create({ email: "user@example.com", password: "supersecret" });

    await requestPasswordReset("user@example.com");

    const tokens = await Token.find({});
    expect(tokens).toHaveLength(1);
    expect(tokens[0].tokenHash).toMatch(/^[a-f0-9]{64}$/);

    const rawToken = lastEmailedToken();
    const expectedHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");
    expect(expectedHash).toBe(tokens[0].tokenHash);
  });

  it("does nothing and reveals nothing for an unknown email", async () => {
    await requestPasswordReset("nobody@example.com");

    expect(await Token.countDocuments()).toBe(0);
    expect(sendResetEmailMock).not.toHaveBeenCalled();
  });

  it("keeps a single active token per user across requests", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "supersecret",
    });

    await requestPasswordReset("user@example.com");
    await requestPasswordReset("user@example.com");

    expect(await Token.countDocuments({ userId: user._id })).toBe(1);
  });
});

describe("confirmPasswordReset", () => {
  it("updates the password with a valid token and burns it", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "supersecret",
    });
    await requestPasswordReset("user@example.com");
    const rawToken = lastEmailedToken();

    const result = await confirmPasswordReset(
      String(user._id),
      rawToken,
      "newpassword1",
    );

    expect(result.ok).toBe(true);
    expect(await Token.countDocuments()).toBe(0);

    const updated = await User.findById(user._id).select("+password");
    expect(await bcrypt.compare("newpassword1", updated!.password)).toBe(true);
  });

  it("cannot be replayed once used", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "supersecret",
    });
    await requestPasswordReset("user@example.com");
    const rawToken = lastEmailedToken();

    await confirmPasswordReset(String(user._id), rawToken, "newpassword1");
    const replay = await confirmPasswordReset(
      String(user._id),
      rawToken,
      "anotherpass2",
    );

    expect(replay.ok).toBe(false);
  });

  it("rejects an invalid token", async () => {
    const user = await User.create({
      email: "user@example.com",
      password: "supersecret",
    });
    await requestPasswordReset("user@example.com");

    const result = await confirmPasswordReset(
      String(user._id),
      "deadbeef",
      "newpassword1",
    );

    expect(result.ok).toBe(false);
  });

  it("rejects a malformed user id without throwing", async () => {
    const result = await confirmPasswordReset(
      "not-an-objectid",
      "deadbeef",
      "newpassword1",
    );

    expect(result.ok).toBe(false);
  });
});
