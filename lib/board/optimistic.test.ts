import { describe, it, expect } from "vitest";
import type { BoardDTO } from "@/lib/dto";
import {
  withMovedTask,
  withReorderedColumn,
  withToggledSubtask,
} from "./optimistic";

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
        order: 0,
        subtasks: [
          { id: "s1", title: "Plan", completed: false },
          { id: "s2", title: "Ship", completed: true },
        ],
      },
      {
        id: "t2",
        title: "Test it",
        status: { name: "doing", color: "" },
        order: 0,
        subtasks: [],
      },
      {
        id: "t3",
        title: "Refine it",
        status: { name: "todo", color: "" },
        order: 1,
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
    // The moved task lands at the bottom of the destination column (after t2).
    expect(moved?.order).toBe(1);
  });

  it("does not mutate the input board", () => {
    const board = makeBoard();
    withMovedTask(board, "t1", "doing");

    expect(board.tasks[0].status.name).toBe("todo");
  });
});

describe("withReorderedColumn", () => {
  it("renumbers the listed tasks to their index in the new order", () => {
    const board = makeBoard();
    // Put t3 before t1 within "todo".
    const next = withReorderedColumn(board, "todo", ["t3", "t1"]);

    expect(next.tasks.find((task) => task.id === "t3")?.order).toBe(0);
    expect(next.tasks.find((task) => task.id === "t1")?.order).toBe(1);
    // A task in another column is left alone.
    expect(next.tasks.find((task) => task.id === "t2")?.order).toBe(0);
  });

  it("snaps a task from another column into the target column with its color", () => {
    const board = makeBoard();
    board.columns[0].color = "#67e2ae"; // the "todo" column we drop into
    // Drop t2 (from "doing") between t1 and t3 in "todo".
    const next = withReorderedColumn(board, "todo", ["t1", "t2", "t3"]);

    const moved = next.tasks.find((task) => task.id === "t2");
    expect(moved?.status.name).toBe("todo");
    expect(moved?.status.color).toBe("#67e2ae");
    expect(moved?.order).toBe(1);
  });

  it("does not mutate the input board", () => {
    const board = makeBoard();
    withReorderedColumn(board, "todo", ["t3", "t1"]);

    expect(board.tasks.find((task) => task.id === "t1")?.order).toBe(0);
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
