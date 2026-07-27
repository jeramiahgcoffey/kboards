import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendResetEmail } from "./email";

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  resend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mocks.send };

    constructor(apiKey: string) {
      mocks.resend(apiKey);
    }
  },
}));

beforeEach(() => {
  vi.stubEnv("EMAIL_FROM", "kboards <hello@example.com>");
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("SMTP_HOST", "");
  vi.stubEnv("SMTP_PASS", "");
  mocks.send.mockReset();
  mocks.resend.mockReset();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("sendResetEmail", () => {
  it("logs the reset link in local development without a provider", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});

    await sendResetEmail("user@example.com", "https://example.com/reset");

    expect(info).toHaveBeenCalledWith(
      "[email] password reset for user@example.com: https://example.com/reset",
    );
    expect(mocks.resend).not.toHaveBeenCalled();
  });

  it("sends through the Resend API", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    mocks.send.mockResolvedValue({ data: { id: "email-id" }, error: null });

    await sendResetEmail("user@example.com", "https://example.com/reset");

    expect(mocks.resend).toHaveBeenCalledWith("re_test");
    expect(mocks.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "user@example.com",
        subject: "Reset your kboards password",
      }),
    );
  });

  it("keeps the existing Resend SMTP key working during migration", async () => {
    vi.stubEnv("SMTP_HOST", "smtp.resend.com");
    vi.stubEnv("SMTP_PASS", "re_legacy");
    mocks.send.mockResolvedValue({ data: { id: "email-id" }, error: null });

    await sendResetEmail("user@example.com", "https://example.com/reset");

    expect(mocks.resend).toHaveBeenCalledWith("re_legacy");
  });

  it("surfaces provider errors", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    mocks.send.mockResolvedValue({
      data: null,
      error: { message: "Domain is not verified" },
    });

    await expect(
      sendResetEmail("user@example.com", "https://example.com/reset"),
    ).rejects.toThrow("Domain is not verified");
  });
});
