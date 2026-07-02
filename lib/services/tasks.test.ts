import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { Board } from "@/lib/db/models/Board";
import { ServiceError } from "@/lib/services/errors";
import { createBoard, addColumn } from "@/lib/services/boards";
import type { BoardDocument } from "@/lib/services/boards";
import {
  createTask,
  updateTask,
  updateSubtask,
  deleteTask,
  reorderColumn,
} from "@/lib/services/tasks";

const newId = () => new mongoose.Types.ObjectId().toString();

async function rejectionStatus(promise: Promise<unknown>): Promise<number> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ServiceError) return error.status;
    throw error;
  }
  throw new Error("Expected the call to reject, but it resolved");
}

// A board with two columns ("todo", "doing") for the requesting user.
async function boardWithColumns(
  userId: string,
): Promise<{ board: BoardDocument; boardId: string }> {
  let board = await createBoard(userId, { name: "Board" });
  board = await addColumn(userId, String(board._id), { name: "todo" });
  board = await addColumn(userId, String(board._id), { name: "doing" });
  return { board, boardId: String(board._id) };
}

const lastTask = (board: BoardDocument) => board.tasks[board.tasks.length - 1];

beforeAll(async () => {
  await dbConnect();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Board.deleteMany({});
});

describe("createTask", () => {
  it("adds a task with subtasks derived from titles", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);

    const board = await createTask(userId, boardId, {
      title: "Ship it",
      status: { name: "todo" },
      description: "soon",
      subtasks: ["write tests", "open PR"],
    });

    const task = lastTask(board);
    expect(task.title).toBe("Ship it");
    expect(task.subtasks).toHaveLength(2);
    expect(task.subtasks.map((s) => s.title)).toEqual([
      "write tests",
      "open PR",
    ]);
    expect(task.subtasks.every((s) => s.completed === false)).toBe(true);
  });

  it("assigns each new task the next order within its column", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);

    let board = await createTask(userId, boardId, {
      title: "First",
      status: { name: "todo" },
      subtasks: [],
    });
    expect(lastTask(board).order).toBe(0);

    board = await createTask(userId, boardId, {
      title: "Second",
      status: { name: "todo" },
      subtasks: [],
    });
    expect(lastTask(board).order).toBe(1);

    // A different column starts its own numbering.
    board = await createTask(userId, boardId, {
      title: "Elsewhere",
      status: { name: "doing" },
      subtasks: [],
    });
    expect(lastTask(board).order).toBe(0);
  });

  it("stores the column's canonical name regardless of input casing", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);

    const board = await createTask(userId, boardId, {
      title: "Cased",
      status: { name: "TODO" },
      subtasks: [],
    });

    expect(lastTask(board).status.name).toBe("todo");
  });

  it("rejects a status that is not one of the board's columns", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);

    expect(
      await rejectionStatus(
        createTask(userId, boardId, {
          title: "Orphan",
          status: { name: "nope" },
          subtasks: [],
        }),
      ),
    ).toBe(400);
  });

  it("404s when the board does not belong to the user", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);

    expect(
      await rejectionStatus(
        createTask(newId(), boardId, {
          title: "Hijack",
          status: { name: "todo" },
          subtasks: [],
        }),
      ),
    ).toBe(404);
  });
});

describe("updateTask", () => {
  it("moves a task to another column and replaces its subtasks", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    let board = await createTask(userId, boardId, {
      title: "Task",
      status: { name: "todo" },
      subtasks: ["a"],
    });
    const taskId = String(lastTask(board)._id);

    board = await updateTask(userId, boardId, taskId, {
      status: { name: "doing" },
      subtasks: ["x", "y"],
    });

    const task = board.tasks.id(taskId)!;
    expect(task.status.name).toBe("doing");
    expect(task.subtasks.map((s) => s.title)).toEqual(["x", "y"]);
  });

  it("rejects a status outside the board's columns", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const board = await createTask(userId, boardId, {
      title: "Task",
      status: { name: "todo" },
      subtasks: [],
    });
    const taskId = String(lastTask(board)._id);

    expect(
      await rejectionStatus(
        updateTask(userId, boardId, taskId, { status: { name: "ghost" } }),
      ),
    ).toBe(400);
  });

  it("appends the task to the bottom of the destination column when moved", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    // Two tasks already sit in "doing" (orders 0 and 1).
    await createTask(userId, boardId, {
      title: "Doing A",
      status: { name: "doing" },
      subtasks: [],
    });
    await createTask(userId, boardId, {
      title: "Doing B",
      status: { name: "doing" },
      subtasks: [],
    });
    let board = await createTask(userId, boardId, {
      title: "Mover",
      status: { name: "todo" },
      subtasks: [],
    });
    const taskId = String(lastTask(board)._id);

    board = await updateTask(userId, boardId, taskId, {
      status: { name: "doing" },
    });

    // Lands after the two existing "doing" tasks rather than keeping order 0.
    expect(board.tasks.id(taskId)!.order).toBe(2);
  });

  it("404s a missing task", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);

    expect(
      await rejectionStatus(
        updateTask(userId, boardId, newId(), { title: "x" }),
      ),
    ).toBe(404);
  });
});

describe("reorderColumn", () => {
  // Seeds three tasks in "todo" and returns their ids in creation order.
  async function threeInTodo(userId: string, boardId: string) {
    const ids: string[] = [];
    for (const title of ["A", "B", "C"]) {
      const board = await createTask(userId, boardId, {
        title,
        status: { name: "todo" },
        subtasks: [],
      });
      ids.push(String(lastTask(board)._id));
    }
    return ids;
  }

  it("renumbers the column's tasks to the given order", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const [a, b, c] = await threeInTodo(userId, boardId);

    const board = await reorderColumn(userId, boardId, {
      columnName: "todo",
      orderedTaskIds: [c, a, b],
    });

    expect(board.tasks.id(c)!.order).toBe(0);
    expect(board.tasks.id(a)!.order).toBe(1);
    expect(board.tasks.id(b)!.order).toBe(2);
  });

  it("moves a task into the column at the requested position", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const [a, b, c] = await threeInTodo(userId, boardId);
    let board = await createTask(userId, boardId, {
      title: "FromDoing",
      status: { name: "doing" },
      subtasks: [],
    });
    const moved = String(lastTask(board)._id);

    // Drop the "doing" task between A and B.
    board = await reorderColumn(userId, boardId, {
      columnName: "todo",
      orderedTaskIds: [a, moved, b, c],
    });

    const task = board.tasks.id(moved)!;
    expect(task.status.name).toBe("todo");
    expect(task.order).toBe(1);
    expect(board.tasks.id(b)!.order).toBe(2);
  });

  it("resolves the column name case-insensitively to its canonical form", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const [a] = await threeInTodo(userId, boardId);

    const board = await reorderColumn(userId, boardId, {
      columnName: "TODO",
      orderedTaskIds: [a],
    });

    expect(board.tasks.id(a)!.status.name).toBe("todo");
  });

  it("rejects an unknown task id", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const [a] = await threeInTodo(userId, boardId);

    expect(
      await rejectionStatus(
        reorderColumn(userId, boardId, {
          columnName: "todo",
          orderedTaskIds: [a, newId()],
        }),
      ),
    ).toBe(400);
  });

  it("rejects a column that is not on the board", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const [a] = await threeInTodo(userId, boardId);

    expect(
      await rejectionStatus(
        reorderColumn(userId, boardId, {
          columnName: "ghost",
          orderedTaskIds: [a],
        }),
      ),
    ).toBe(400);
  });

  it("404s when the board does not belong to the user", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const [a] = await threeInTodo(userId, boardId);

    expect(
      await rejectionStatus(
        reorderColumn(newId(), boardId, {
          columnName: "todo",
          orderedTaskIds: [a],
        }),
      ),
    ).toBe(404);
  });
});

describe("updateSubtask", () => {
  it("toggles a subtask's completed state", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    let board = await createTask(userId, boardId, {
      title: "Task",
      status: { name: "todo" },
      subtasks: ["one"],
    });
    const taskId = String(lastTask(board)._id);
    const subtaskId = String(lastTask(board).subtasks[0]._id);

    board = await updateSubtask(userId, boardId, taskId, subtaskId, {
      completed: true,
    });

    expect(board.tasks.id(taskId)!.subtasks.id(subtaskId)!.completed).toBe(true);
  });

  it("404s a missing subtask", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const board = await createTask(userId, boardId, {
      title: "Task",
      status: { name: "todo" },
      subtasks: ["one"],
    });
    const taskId = String(lastTask(board)._id);

    expect(
      await rejectionStatus(
        updateSubtask(userId, boardId, taskId, newId(), { completed: true }),
      ),
    ).toBe(404);
  });
});

describe("deleteTask", () => {
  it("removes a task and 404s a missing one", async () => {
    const userId = newId();
    const { boardId } = await boardWithColumns(userId);
    const board = await createTask(userId, boardId, {
      title: "Task",
      status: { name: "todo" },
      subtasks: [],
    });
    const taskId = String(lastTask(board)._id);

    const updated = await deleteTask(userId, boardId, taskId);
    expect(updated.tasks).toHaveLength(0);

    expect(
      await rejectionStatus(deleteTask(userId, boardId, newId())),
    ).toBe(404);
  });
});
