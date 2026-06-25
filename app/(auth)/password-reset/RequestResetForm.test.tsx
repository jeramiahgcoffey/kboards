// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequestResetForm } from "./RequestResetForm";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
});

describe("RequestResetForm", () => {
  it("shows a generic confirmation when the request succeeds", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({}) });
    render(<RequestResetForm />);

    await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      /reset link is on its way/i,
    );
  });

  it("surfaces an error and stays on the form for a rejected email", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 400, json: async () => ({}) });
    render(<RequestResetForm />);

    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/valid email/i);
    expect(screen.queryByRole("status")).toBeNull();
  });
});
