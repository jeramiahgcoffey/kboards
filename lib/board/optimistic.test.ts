import { describe, it, expect } from "vitest";
import type { BoardDTO } from "@/lib/dto";
import { withMovedTask, withToggledSubtask } from "./optimistic";

function makeBoard(): BoardDTO {
  return {
    id: "b1",
    name: "Platform Launch",
    columns: [
      { id: "c1", name: "todo", color: "default" },
      { id: "c2", name: "doing", color: "default" },
    ],
    tasks: [
      {
        id: "t1",
        title: "Build it",
        status: { name: "todo", color: "" },
        subtasks: [
          { id: "s1", title: "Plan", completed: false },
          { id: "s2", title: "Ship", completed: true },
        ],
      },
      {
        id: "t2",
        title: "Test it",
        status: { name: "doing", color: "" },
        subtasks: [],
      },
    ],
  };
}

describe("withMovedTask", () => {
  it("re-snapshots the task's status name and color to the target column", () => {
    const board = makeBoard();
    board.columns[1].color = "#67e2ae";
    const next = withMovedTask(board, "t1", "doing");

    const moved = next.tasks.find((task) => task.id === "t1");
    expect(moved?.status.name).toBe("doing");
    // The status color follows the target column, not the old one.
    expect(moved?.status.color).toBe("#67e2ae");
    // Other tasks are untouched.
    expect(next.tasks.find((task) => task.id === "t2")?.status.name).toBe(
      "doing",
    );
  });

  it("does not mutate the input board", () => {
    const board = makeBoard();
    withMovedTask(board, "t1", "doing");

    expect(board.tasks[0].status.name).toBe("todo");
  });
});

describe("withToggledSubtask", () => {
  it("flips only the targeted subtask's completion", () => {
    const board = makeBoard();
    const next = withToggledSubtask(board, "t1", "s1");

    const task = next.tasks.find((item) => item.id === "t1");
    expect(task?.subtasks.find((sub) => sub.id === "s1")?.completed).toBe(true);
    expect(task?.subtasks.find((sub) => sub.id === "s2")?.completed).toBe(true);
  });

  it("does not mutate the input board", () => {
    const board = makeBoard();
    withToggledSubtask(board, "t1", "s1");

    expect(board.tasks[0].subtasks[0].completed).toBe(false);
  });
});
