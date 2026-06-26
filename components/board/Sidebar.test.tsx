// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

vi.mock("next/link", () => ({
  default: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a {...props}>{children}</a>,
}));

const boards = [
  { id: "b1", name: "Platform Launch" },
  { id: "b2", name: "Roadmap" },
];

describe("Sidebar", () => {
  it("lists every board with a heading count", () => {
    render(<Sidebar boards={boards} />);

    expect(screen.getByText("All boards (2)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /platform launch/i })).toHaveAttribute(
      "href",
      "/boards/b1",
    );
    expect(screen.getByRole("link", { name: /roadmap/i })).toHaveAttribute(
      "href",
      "/boards/b2",
    );
  });

  it("marks the active board for assistive tech", () => {
    render(<Sidebar boards={boards} activeBoardId="b2" />);

    expect(screen.getByRole("link", { name: /roadmap/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: /platform launch/i }),
    ).not.toHaveAttribute("aria-current");
  });
});
