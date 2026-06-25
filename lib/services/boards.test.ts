import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { Board } from "@/lib/db/models/Board";
import { ServiceError } from "@/lib/services/errors";
import {
  listBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  addColumn,
  updateColumn,
  deleteColumn,
} from "@/lib/services/boards";
import { createTask } from "@/lib/services/tasks";

const newId = () => new mongoose.Types.ObjectId().toString();

// Runs a rejecting call once and returns the ServiceError status it threw.
async function rejectionStatus(promise: Promise<unknown>): Promise<number> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ServiceError) return error.status;
    throw error;
  }
  throw new Error("Expected the call to reject, but it resolved");
}

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

describe("board CRUD", () => {
  it("creates a board owned by the user", async () => {
    const userId = newId();
    const board = await createBoard(userId, { name: "Roadmap" });
    expect(board.name).toBe("Roadmap");
    expect(String(board.createdBy)).toBe(userId);
    expect(board.columns).toHaveLength(0);
  });

  it("lists only the requesting user's boards", async () => {
    const userId = newId();
    const otherId = newId();
    await createBoard(userId, { name: "Mine" });
    await createBoard(otherId, { name: "Theirs" });

    const boards = await listBoards(userId);

    expect(boards).toHaveLength(1);
    expect(boards[0].name).toBe("Mine");
  });

  it("gets an owned board and hides others as not found", async () => {
    const userId = newId();
    const created = await createBoard(userId, { name: "Mine" });

    const fetched = await getBoard(userId, String(created._id));
    expect(fetched.name).toBe("Mine");

    expect(await rejectionStatus(getBoard(newId(), String(created._id)))).toBe(
      404,
    );
  });

  it("treats a malformed or missing board id as not found", async () => {
    expect(await rejectionStatus(getBoard(newId(), "not-an-id"))).toBe(404);
    expect(await rejectionStatus(getBoard(newId(), newId()))).toBe(404);
  });

  it("renames a board and refuses non-owners", async () => {
    const userId = newId();
    const board = await createBoard(userId, { name: "Old" });

    const updated = await updateBoard(userId, String(board._id), {
      name: "New",
    });
    expect(updated.name).toBe("New");

    expect(
      await rejectionStatus(
        updateBoard(newId(), String(board._id), { name: "Hijacked" }),
      ),
    ).toBe(404);
  });

  it("deletes an owned board and refuses non-owners", async () => {
    const userId = newId();
    const board = await createBoard(userId, { name: "Doomed" });

    expect(
      await rejectionStatus(deleteBoard(newId(), String(board._id))),
    ).toBe(404);
    expect(await Board.countDocuments()).toBe(1);

    await deleteBoard(userId, String(board._id));
    expect(await Board.countDocuments()).toBe(0);
  });
});

describe("column CRUD", () => {
  it("adds a lowercased column with a default color", async () => {
    const userId = newId();
    const board = await createBoard(userId, { name: "Board" });

    const updated = await addColumn(userId, String(board._id), { name: "Todo" });

    expect(updated.columns).toHaveLength(1);
    expect(updated.columns[0].name).toBe("todo");
    expect(updated.columns[0].color).toBe("default");
  });

  it("rejects a duplicate column name case-insensitively", async () => {
    const userId = newId();
    const board = await createBoard(userId, { name: "Board" });
    await addColumn(userId, String(board._id), { name: "todo" });

    expect(
      await rejectionStatus(
        addColumn(userId, String(board._id), { name: "TODO" }),
      ),
    ).toBe(409);
  });

  it("updates a column and blocks a name clash with another column", async () => {
    const userId = newId();
    let board = await createBoard(userId, { name: "Board" });
    board = await addColumn(userId, String(board._id), { name: "todo" });
    board = await addColumn(userId, String(board._id), { name: "doing" });

    const doingId = String(
      board.columns.find((c) => c.name === "doing")?._id,
    );

    const updated = await updateColumn(userId, String(board._id), doingId, {
      name: "Done",
      color: "#abc",
    });
    expect(updated.columns.find((c) => String(c._id) === doingId)?.name).toBe(
      "done",
    );

    expect(
      await rejectionStatus(
        updateColumn(userId, String(board._id), doingId, {
          name: "Todo",
          color: "#abc",
        }),
      ),
    ).toBe(409);
  });

  it("deletes a column and 404s a missing one", async () => {
    const userId = newId();
    let board = await createBoard(userId, { name: "Board" });
    board = await addColumn(userId, String(board._id), { name: "todo" });
    const columnId = String(board.columns[0]._id);

    const updated = await deleteColumn(userId, String(board._id), columnId);
    expect(updated.columns).toHaveLength(0);

    expect(
      await rejectionStatus(
        deleteColumn(userId, String(board._id), newId()),
      ),
    ).toBe(404);
  });

  it("updates only the color when no name is provided", async () => {
    const userId = newId();
    let board = await createBoard(userId, { name: "Board" });
    board = await addColumn(userId, String(board._id), {
      name: "todo",
      color: "#111",
    });
    const columnId = String(board.columns[0]._id);

    const updated = await updateColumn(userId, String(board._id), columnId, {
      color: "#999",
    });

    expect(updated.columns[0].name).toBe("todo");
    expect(updated.columns[0].color).toBe("#999");
  });
});

describe("column changes cascade to tasks", () => {
  it("renaming a column moves its tasks to the new name", async () => {
    const userId = newId();
    let board = await createBoard(userId, { name: "Board" });
    board = await addColumn(userId, String(board._id), { name: "todo" });
    const boardId = String(board._id);
    board = await createTask(userId, boardId, {
      title: "Task",
      status: { name: "todo" },
      subtasks: [],
    });
    const columnId = String(board.columns[0]._id);

    const updated = await updateColumn(userId, boardId, columnId, {
      name: "backlog",
    });

    expect(updated.columns[0].name).toBe("backlog");
    expect(updated.tasks[0].status.name).toBe("backlog");
  });

  it("deleting a column deletes the tasks that live in it", async () => {
    const userId = newId();
    let board = await createBoard(userId, { name: "Board" });
    board = await addColumn(userId, String(board._id), { name: "todo" });
    board = await addColumn(userId, String(board._id), { name: "doing" });
    const boardId = String(board._id);
    board = await createTask(userId, boardId, {
      title: "Keep",
      status: { name: "doing" },
      subtasks: [],
    });
    board = await createTask(userId, boardId, {
      title: "Drop",
      status: { name: "todo" },
      subtasks: [],
    });
    const todoId = String(board.columns.find((c) => c.name === "todo")?._id);

    const updated = await deleteColumn(userId, boardId, todoId);

    expect(updated.columns.map((c) => c.name)).toEqual(["doing"]);
    expect(updated.tasks.map((t) => t.title)).toEqual(["Keep"]);
  });
});
