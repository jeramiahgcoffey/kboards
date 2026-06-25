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
vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a {...props}>{children}</a>,
}));

import { LoginForm } from "./LoginForm";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginForm", () => {
  it("signs in with credentials and redirects to the boards", async () => {
    signInMock.mockResolvedValue({ ok: true, error: undefined });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "supersecret");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(signInMock).toHaveBeenCalledWith("credentials", {
      email: "user@example.com",
      password: "supersecret",
      redirect: false,
    });
    expect(push).toHaveBeenCalledWith("/boards");
  });

  it("shows a generic error and does not redirect on failure", async () => {
    signInMock.mockResolvedValue({ ok: false, error: "CredentialsSignin" });
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
    await userEvent.type(screen.getByLabelText("Password"), "wrong-password");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid email or password/i,
    );
    expect(push).not.toHaveBeenCalled();
  });
});
