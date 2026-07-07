// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "./TaskCard";
import type { ColumnDTO, TaskDTO } from "@/lib/dto";

const columns: ColumnDTO[] = [
  { id: "c1", name: "todo", color: "" },
  { id: "c2", name: "doing", color: "" },
  { id: "c3", name: "done", color: "" },
];

function makeTask(overrides: Partial<TaskDTO> = {}): TaskDTO {
  return {
    id: "t1",
    title: "Build the board view",
    status: { name: "todo", color: "" },
    order: 0,
    subtasks: [
      { id: "s1", title: "Columns", completed: true },
      { id: "s2", title: "Cards", completed: false },
      { id: "s3", title: "Modal", completed: false },
    ],
    ...overrides,
  };
}

beforeEach(() => vi.clearAllMocks());

describe("TaskCard", () => {
  it("shows the title and completed subtask count", () => {
    render(<TaskCard task={makeTask()} onOpen={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /build the board view/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 of 3 subtasks")).toBeInTheDocument();
  });

  it("omits the subtask count when there are none", () => {
    render(<TaskCard task={makeTask({ subtasks: [] })} onOpen={vi.fn()} />);

    expect(screen.queryByText(/subtasks/i)).toBeNull();
  });

  it("opens with the task when clicked", async () => {
    const onOpen = vi.fn();
    const task = makeTask();
    render(<TaskCard task={task} onOpen={onOpen} />);

    await userEvent.click(
      screen.getByRole("button", { name: /open task: build the board view/i }),
    );

    expect(onOpen).toHaveBeenCalledWith(task);
  });

  it("has no actions menu when no action handlers are provided", () => {
    render(<TaskCard task={makeTask()} onOpen={vi.fn()} />);

    expect(screen.queryByRole("button", { name: /actions for/i })).toBeNull();
  });

  it("moves, edits, and deletes through the actions menu", async () => {
    const onMove = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const task = makeTask();
    render(
      <TaskCard
        task={task}
        onOpen={vi.fn()}
        columns={columns}
        onMove={onMove}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const openMenu = () =>
      userEvent.click(
        screen.getByRole("button", { name: /actions for build the board view/i }),
      );

    await openMenu();
    // The current column ("todo") is not offered as a move target.
    expect(
      screen.queryByRole("menuitem", { name: /move to todo/i }),
    ).toBeNull();
    await userEvent.click(
      screen.getByRole("menuitem", { name: /move to doing/i }),
    );
    expect(onMove).toHaveBeenCalledWith(task, "doing");

    await openMenu();
    await userEvent.click(screen.getByRole("menuitem", { name: /edit task/i }));
    expect(onEdit).toHaveBeenCalledWith(task);

    await openMenu();
    await userEvent.click(
      screen.getByRole("menuitem", { name: /delete task/i }),
    );
    expect(onDelete).toHaveBeenCalledWith(task);
  });

  it("offers reorder items scoped to the card's position in its column", async () => {
    const onReorder = vi.fn();
    const task = makeTask();

    // First of three: only "Move down" is available.
    const first = render(
      <TaskCard
        task={task}
        onOpen={vi.fn()}
        position={{ index: 0, count: 3 }}
        onReorder={onReorder}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /actions for build the board view/i }),
    );
    expect(screen.queryByRole("menuitem", { name: /move up/i })).toBeNull();
    await userEvent.click(screen.getByRole("menuitem", { name: /move down/i }));
    expect(onReorder).toHaveBeenCalledWith(task, "down");
    first.unmount();

    // Last of three: only "Move up" is available.
    render(
      <TaskCard
        task={task}
        onOpen={vi.fn()}
        position={{ index: 2, count: 3 }}
        onReorder={onReorder}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /actions for build the board view/i }),
    );
    expect(screen.queryByRole("menuitem", { name: /move down/i })).toBeNull();
    await userEvent.click(screen.getByRole("menuitem", { name: /move up/i }));
    expect(onReorder).toHaveBeenCalledWith(task, "up");
  });
});
