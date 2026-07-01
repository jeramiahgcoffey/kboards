// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardFormModal } from "./BoardFormModal";

beforeEach(() => vi.clearAllMocks());

describe("BoardFormModal", () => {
  it("validates that a name is provided before submitting", async () => {
    const onSubmit = vi.fn();
    render(
      <BoardFormModal mode="create" onSubmit={onSubmit} onClose={vi.fn()} />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /create board/i }),
    );

    expect(screen.getByText(/a board name is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits trimmed values and closes on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    render(
      <BoardFormModal mode="create" onSubmit={onSubmit} onClose={onClose} />,
    );

    await userEvent.type(
      screen.getByLabelText(/board name/i),
      "  Platform Launch  ",
    );
    await userEvent.click(
      screen.getByRole("button", { name: /create board/i }),
    );

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Platform Launch",
      description: undefined,
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("prefills fields when editing", () => {
    render(
      <BoardFormModal
        mode="edit"
        initial={{ name: "Roadmap", description: "Long term plan" }}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: /edit board/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/board name/i)).toHaveValue("Roadmap");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Long term plan");
  });
});
