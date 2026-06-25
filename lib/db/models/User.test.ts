import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "./User";

const URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/kboards-test";

beforeAll(async () => {
  await mongoose.connect(URI);
  // Wait for the unique email index to build before testing uniqueness.
  await User.init();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User model", () => {
  it("hashes the password on save and never stores plaintext", async () => {
    const user = await User.create({ email: "a@b.com", password: "supersecret" });
    expect(user.password).not.toBe("supersecret");
    expect(user.password).toMatch(/^\$2[aby]\$/);
  });

  it("verifies the original password and rejects a wrong one", async () => {
    await User.create({ email: "c@d.com", password: "supersecret" });
    const user = await User.findOne({ email: "c@d.com" }).select("+password");
    expect(user).not.toBeNull();
    expect(await bcrypt.compare("supersecret", user!.password)).toBe(true);
    expect(await bcrypt.compare("wrong-password", user!.password)).toBe(false);
  });

  it("excludes the password from default queries", async () => {
    await User.create({ email: "e@f.com", password: "supersecret" });
    const user = await User.findOne({ email: "e@f.com" });
    expect(user!.password).toBeUndefined();
  });

  it("lowercases and trims the email and enforces uniqueness", async () => {
    await User.create({ email: " A@B.com ", password: "supersecret" });
    const found = await User.findOne({ email: "a@b.com" });
    expect(found).not.toBeNull();
    await expect(
      User.create({ email: "a@b.com", password: "anotherpass" }),
    ).rejects.toThrow();
  });
});
