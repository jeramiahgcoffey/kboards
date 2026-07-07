import { isValidObjectId, type Types } from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import type { IStatus } from "@/lib/db/models/Board";
import { badRequest, notFound } from "./errors";
import { findOwnedBoard, type BoardDocument } from "./access";

// A task's status must name one of the board's columns (case-insensitive).
// Returns the column's canonical (stored) name so the snapshot on the task
// always matches its column exactly, which keeps column rename/delete and any
// status comparisons consistent.
function resolveStatusName(board: BoardDocument, status: IStatus): string {
  const column = board.columns.find(
    (col) => col.name.toLowerCase() === status.name.toLowerCase(),
  );
  if (!column) throw badRequest(`Column "${status.name}" does not exist`);
  return column.name;
}

// The order to give a task appended to the bottom of `columnName`: one past the
// current maximum, or 0 for an empty column. Optionally ignore one task (used
// when moving a task into a column it should be placed after).
function nextOrder(
  board: BoardDocument,
  columnName: string,
  ignoreTaskId?: Types.ObjectId,
): number {
  const orders = board.tasks
    .filter(
      (task) =>
        task.status.name === columnName &&
        !(ignoreTaskId && task._id?.equals(ignoreTaskId)),
    )
    .map((task) => task.order ?? 0);
  return orders.length ? Math.max(...orders) + 1 : 0;
}

export async function createTask(
  userId: string,
  boardId: string,
  input: {
    title: string;
    status: IStatus;
    description?: string;
    subtasks: string[];
  },
): Promise<BoardDocument> {
  await dbConnect();
  const board = await findOwnedBoard(userId, boardId);
  const statusName = resolveStatusName(board, input.status);

  // New tasks land at the bottom of their column. Use max(order)+1 rather than a
  // count so a column with non-contiguous orders (a gap left by a cross-column
  // move) never reuses an order value already present.
  const order = nextOrder(board, statusName);

  const task = board.tasks.create({
    title: input.title,
    status: { name: statusName, color: input.status.color },
    order,
    description: input.description,
    subtasks: input.subtasks.map((title) => ({ title, completed: false })),
  });
  board.tasks.push(task);

  await board.save();
  return board;
}

// Applies a new within-column order. `orderedTaskIds` is the target column's
// full desired ordering; each listed task is renumbered to its index and, if it
// lived in another column, moved into this one. This one operation covers both
// reordering within a column and dropping a card into a column at a position.
export async function reorderColumn(
  userId: string,
  boardId: string,
  input: { columnName: string; orderedTaskIds: string[] },
): Promise<BoardDocument> {
  await dbConnect();
  const board = await findOwnedBoard(userId, boardId);

  // Canonical column name (and its color) so the moved tasks' status snapshots
  // match the column exactly, as elsewhere in the service.
  const columnName = resolveStatusName(board, { name: input.columnName });
  const column = board.columns.find((col) => col.name === columnName);

  input.orderedTaskIds.forEach((taskId, index) => {
    if (!isValidObjectId(taskId)) throw badRequest("Unknown task in reorder");
    const task = board.tasks.id(taskId);
    if (!task) throw badRequest("Unknown task in reorder");
    task.order = index;
    task.status = { name: columnName, color: column?.color };
  });

  await board.save();
  return board;
}

export async function updateTask(
  userId: string,
  boardId: string,
  taskId: string,
  input: {
    title?: string;
    description?: string;
    status?: IStatus;
    subtasks?: string[];
  },
): Promise<BoardDocument> {
  await dbConnect();
  if (!isValidObjectId(taskId)) throw notFound("Task not found");
  const board = await findOwnedBoard(userId, boardId);

  const task = board.tasks.id(taskId);
  if (!task) throw notFound("Task not found");

  // Resolve up front so an invalid status rejects before any mutation.
  const statusName =
    input.status !== undefined ? resolveStatusName(board, input.status) : null;

  if (input.title !== undefined) task.title = input.title;
  if (input.description !== undefined) task.description = input.description;
  if (input.status !== undefined && statusName !== null) {
    // Moving to a different column appends the task to the bottom of that
    // column (matching new-task placement), so it never inherits a stale order
    // from its old column and sort into the middle of the destination.
    if (statusName !== task.status.name) {
      task.order = nextOrder(board, statusName, task._id);
    }
    task.status = { name: statusName, color: input.status.color };
  }

  // Replacing the subtask list resets completion state, matching the task-edit
  // modal where subtasks are entered as plain titles.
  if (input.subtasks !== undefined) {
    task.subtasks.splice(0, task.subtasks.length);
    for (const title of input.subtasks) {
      task.subtasks.push({ title, completed: false });
    }
  }

  await board.save();
  return board;
}

export async function updateSubtask(
  userId: string,
  boardId: string,
  taskId: string,
  subtaskId: string,
  input: { title?: string; completed?: boolean },
): Promise<BoardDocument> {
  await dbConnect();
  if (!isValidObjectId(taskId)) throw notFound("Task not found");
  if (!isValidObjectId(subtaskId)) throw notFound("Subtask not found");
  const board = await findOwnedBoard(userId, boardId);

  const task = board.tasks.id(taskId);
  if (!task) throw notFound("Task not found");

  const subtask = task.subtasks.id(subtaskId);
  if (!subtask) throw notFound("Subtask not found");

  if (input.title !== undefined) subtask.title = input.title;
  if (input.completed !== undefined) subtask.completed = input.completed;

  await board.save();
  return board;
}

export async function deleteTask(
  userId: string,
  boardId: string,
  taskId: string,
): Promise<BoardDocument> {
  await dbConnect();
  if (!isValidObjectId(taskId)) throw notFound("Task not found");
  const board = await findOwnedBoard(userId, boardId);

  if (!board.tasks.id(taskId)) throw notFound("Task not found");

  board.tasks.pull(taskId);
  await board.save();
  return board;
}
