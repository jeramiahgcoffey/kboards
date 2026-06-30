// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskFormModal } from "./TaskFormModal";

const columns = [
  { id: "c1", name: "todo" },
  { id: "c2", name: "doing" },
];

beforeEach(() => vi.clearAllMocks());

describe("TaskFormModal", () => {
  it("requires a title", async () => {
    const onSubmit = vi.fn();
    render(
      <TaskFormModal
        mode="create"
        columns={columns}
        onSubmit={onSubmit}
        onClose={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: /create task/i }));

    expect(screen.getByText(/a task title is required/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("defaults status to the first column and lists the rest", () => {
    render(
      <TaskFormModal
        mode="create"
        columns={columns}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/status/i)).toHaveValue("todo");
    expect(
      screen.getAllByRole("option").map((option) => option.textContent),
    ).toEqual(["todo", "doing"]);
  });

  it("collects non-empty subtasks and submits", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const onClose = vi.fn();
    render(
      <TaskFormModal
        mode="create"
        columns={columns}
        onSubmit={onSubmit}
        onClose={onClose}
      />,
    );

    await userEvent.type(screen.getByLabelText(/^title$/i), "Take a break");

    // Add two subtask rows; leave the second blank so it is dropped.
    await userEvent.click(screen.getByRole("button", { name: /add subtask/i }));
    await userEvent.click(screen.getByRole("button", { name: /add subtask/i }));
    const subtaskInputs = screen.getAllByLabelText(/subtask title/i);
    await userEvent.type(subtaskInputs[0], "Make coffee");

    await userEvent.selectOptions(screen.getByLabelText(/status/i), "doing");
    await userEvent.click(screen.getByRole("button", { name: /create task/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Take a break",
      description: undefined,
      statusName: "doing",
      subtasks: ["Make coffee"],
    });
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
