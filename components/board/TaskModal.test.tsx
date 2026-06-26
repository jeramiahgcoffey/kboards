// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskModal } from "./TaskModal";
import type { TaskDTO } from "@/lib/dto";

const task: TaskDTO = {
  id: "t1",
  title: "Ship the modal",
  description: "Read-only task details with subtask progress.",
  status: { name: "doing", color: "" },
  subtasks: [
    { id: "s1", title: "Markup", completed: true },
    { id: "s2", title: "Styles", completed: false },
  ],
};

beforeEach(() => vi.clearAllMocks());

describe("TaskModal", () => {
  it("renders nothing when no task is selected", () => {
    render(<TaskModal task={null} onClose={vi.fn()} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the task details, subtask progress, and status", () => {
    render(<TaskModal task={task} onClose={vi.fn()} />);

    const dialog = screen.getByRole("dialog", { name: /ship the modal/i });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByText(/read-only task details with subtask progress/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtasks (1 of 2)")).toBeInTheDocument();
    expect(screen.getByText("doing")).toBeInTheDocument();

    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
    expect(boxes[0]).toBeDisabled();
  });

  it("closes via the close button and the Escape key", async () => {
    const onClose = vi.fn();
    render(<TaskModal task={task} onClose={onClose} />);

    await userEvent.click(screen.getByRole("button", { name: /close task/i }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
