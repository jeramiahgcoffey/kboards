// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppShell } from "./AppShell";

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a {...props}>{children}</a>,
}));
vi.mock("next-auth/react", () => ({ signOut: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const boards = [{ id: "b1", name: "Platform Launch" }];

describe("AppShell", () => {
  it("hides the mobile board-list trigger when there are no boards", () => {
    render(
      <AppShell boards={[]} userEmail="me@example.com" title="Your boards">
        <p>content</p>
      </AppShell>,
    );

    expect(
      screen.queryByRole("button", { name: /open board list/i }),
    ).toBeNull();
  });

  it("opens the board-list drawer from the trigger when boards exist", async () => {
    render(
      <AppShell
        boards={boards}
        activeBoardId="b1"
        userEmail="me@example.com"
        title="Platform Launch"
      >
        <p>content</p>
      </AppShell>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /open board list/i }),
    );

    expect(screen.getByRole("dialog", { name: "Boards" })).toBeInTheDocument();
  });
});
