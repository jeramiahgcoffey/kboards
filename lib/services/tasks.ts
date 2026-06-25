import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import type { IStatus } from "@/lib/db/models/Board";
import { badRequest, notFound } from "./errors";
import { findOwnedBoard, type BoardDocument } from "./access";

// A task's status must name one of the board's columns (case-insensitive).
function assertStatusIsAColumn(board: BoardDocument, status: IStatus): void {
  const exists = board.columns.some(
    (column) => column.name.toLowerCase() === status.name.toLowerCase(),
  );
  if (!exists) throw badRequest(`Column "${status.name}" does not exist`);
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
  assertStatusIsAColumn(board, input.status);

  const task = board.tasks.create({
    title: input.title,
    status: input.status,
    description: input.description,
    subtasks: input.subtasks.map((title) => ({ title, completed: false })),
  });
  board.tasks.push(task);

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

  if (input.status) assertStatusIsAColumn(board, input.status);

  if (input.title !== undefined) task.title = input.title;
  if (input.description !== undefined) task.description = input.description;
  if (input.status !== undefined) task.status = input.status;

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
