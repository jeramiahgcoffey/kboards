// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "./TaskCard";
import type { TaskDTO } from "@/lib/dto";

function makeTask(overrides: Partial<TaskDTO> = {}): TaskDTO {
  return {
    id: "t1",
    title: "Build the board view",
    status: { name: "todo", color: "" },
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

    await userEvent.click(screen.getByRole("button"));

    expect(onOpen).toHaveBeenCalledWith(task);
  });
});
