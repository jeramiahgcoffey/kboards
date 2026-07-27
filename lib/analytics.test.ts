import { describe, expect, it } from "vitest";
import { redactAnalyticsRoute } from "./analytics";

describe("redactAnalyticsRoute", () => {
  it("removes board ids and query parameters", () => {
    const event = redactAnalyticsRoute({
      type: "pageview",
      url: "https://kboards.example/boards/abc123?ref=private",
    });

    expect(event.url).toBe("https://kboards.example/boards/[board]");
  });

  it("removes password-reset credentials", () => {
    const event = redactAnalyticsRoute({
      type: "pageview",
      url: "https://kboards.example/password-reset/user-id/secret-token",
    });

    expect(event.url).toBe(
      "https://kboards.example/password-reset/[private-link]",
    );
  });
});
