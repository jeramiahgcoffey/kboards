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
  await userEvent.click(screen.getByRole("button", { name: /create account/i }));
}

describe("RegisterForm", () => {
  it("registers, signs in, and redirects on success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ user: {} }),
    });
    signInMock.mockResolvedValue({ ok: true, error: undefined });
    render(<RegisterForm />);

    await fillAndSubmit("new@example.com", "supersecret");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ method: "POST" }),
    );
    expect(signInMock).toHaveBeenCalled();
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

  it("validates password length before calling the API", async () => {
    render(<RegisterForm />);

    await fillAndSubmit("new@example.com", "short");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /at least 8 characters/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
