// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { push, refresh, signInMock } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  signInMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));
vi.mock("next-auth/react", () => ({ signIn: signInMock }));

import { RegisterForm } from "./RegisterForm";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
});

async function fillAndSubmit(email: string, password: string) {
  await userEvent.type(screen.getByLabelText("Email"), email);
  await userEvent.type(screen.getByLabelText("Password"), password);
  await userEvent.click(
    screen.getByRole("button", { name: /create account & board/i }),
  );
}

describe("RegisterForm", () => {
  it("registers, signs in, and opens a personal starter board", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ user: {} }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ board: { id: "board-1" } }),
    });
    signInMock.mockResolvedValue({ ok: true, error: undefined });
    render(<RegisterForm />);

    await fillAndSubmit("new@example.com", "supersecret");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" }),
    );
    expect(signInMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/boards",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "My week", template: "personal" }),
      }),
    );
    expect(push).toHaveBeenCalledWith("/boards/board-1");
  });

  it("falls back to the empty state if starter-board creation fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ user: {} }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: "unavailable" }),
    });
    signInMock.mockResolvedValue({ ok: true, error: undefined });
    render(<RegisterForm />);

    await fillAndSubmit("new@example.com", "supersecret");

    expect(push).toHaveBeenCalledWith("/boards");
  });

  it("surfaces a duplicate-email conflict and does not sign in", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: "exists" }),
    });
    render(<RegisterForm />);

    await fillAndSubmit("dupe@example.com", "supersecret");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /already exists/i,
    );
    expect(signInMock).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });

  it("sends a new account to sign in if automatic sign-in fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ user: {} }),
    });
    signInMock.mockResolvedValue({ ok: false, error: "CredentialsSignin" });
    render(<RegisterForm />);

    await fillAndSubmit("new@example.com", "supersecret");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/login");
  });

  it("validates password length before calling the API", async () => {
    render(<RegisterForm />);

    await fillAndSubmit("new@example.com", "short");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /at least 8 characters/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
