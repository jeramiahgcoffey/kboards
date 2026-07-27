// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { InteractiveBoardPreview } from "./InteractiveBoardPreview";

describe("InteractiveBoardPreview", () => {
  it("lets a visitor move the highlighted task through the workflow", async () => {
    render(<InteractiveBoardPreview />);

    const task = screen.getByRole("button", {
      name: /move ship the first version to done/i,
    });
    await userEvent.click(task);

    expect(
      screen.getByRole("button", {
        name: /move ship the first version to later/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/ship the first version is now in done/i),
    ).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<InteractiveBoardPreview />);
    const { violations } = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });

    expect(violations).toEqual([]);
  });
});
