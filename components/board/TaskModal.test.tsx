// @vitest-environment jsdom
import type { ComponentProps } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskModal } from "./TaskModal";
import type { TaskDTO } from "@/lib/dto";

const columns = [
  { id: "c1", name: "todo" },
  { id: "c2", name: "doing" },
  { id: "c3", name: "done" },
];

const task: TaskDTO = {
  id: "t1",
  title: "Ship the modal",
  description: "Interactive task details with subtask progress.",
  status: { name: "doing", color: "" },
  subtasks: [
    { id: "s1", title: "Markup", completed: true },
    { id: "s2", title: "Styles", completed: false },
  ],
};

function setup(overrides: Partial<ComponentProps<typeof TaskModal>> = {}) {
  const props = {
    task,
    columns,
    onClose: vi.fn(),
    onToggleSubtask: vi.fn(),
    onChangeStatus: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    ...overrides,
  };
  render(<TaskModal {...props} />);
  return props;
}

beforeEach(() => vi.clearAllMocks());

describe("TaskModal", () => {
  it("renders nothing when no task is selected", () => {
    setup({ task: null });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the task details, subtask progress, and current status", () => {
    setup();

    const dialog = screen.getByRole("dialog", { name: /ship the modal/i });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(
      screen.getByText(/interactive task details with subtask progress/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtasks (1 of 2)")).toBeInTheDocument();

    const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(boxes[0]).toBeChecked();
    expect(boxes[1]).not.toBeChecked();
    expect(boxes[0]).not.toBeDisabled();

    expect(screen.getByLabelText(/current status/i)).toHaveValue("doing");
  });

  it("toggles a subtask via its checkbox", async () => {
    const { onToggleSubtask } = setup();

    await userEvent.click(screen.getByRole("checkbox", { name: /styles/i }));
    expect(onToggleSubtask).toHaveBeenCalledWith("s2");
  });

  it("changes status via the select", async () => {
    const { onChangeStatus } = setup();

    await userEvent.selectOptions(
      screen.getByLabelText(/current status/i),
      "done",
    );
    expect(onChangeStatus).toHaveBeenCalledWith("done");
  });

  it("exposes edit and delete actions through the menu", async () => {
    const { onEdit, onDelete } = setup();

    await userEvent.click(screen.getByRole("button", { name: /task actions/i }));
    await userEvent.click(screen.getByRole("menuitem", { name: /edit task/i }));
    expect(onEdit).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: /task actions/i }));
    await userEvent.click(
      screen.getByRole("menuitem", { name: /delete task/i }),
    );
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("closes via the close button and the Escape key", async () => {
    const { onClose } = setup();

    await userEvent.click(screen.getByRole("button", { name: /close task/i }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
