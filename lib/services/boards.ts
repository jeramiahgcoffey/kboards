import { isValidObjectId } from "mongoose";
import { dbConnect } from "@/lib/db/mongoose";
import { Board } from "@/lib/db/models/Board";
import { conflict, notFound } from "./errors";
import { findOwnedBoard, type BoardDocument } from "./access";

export type { BoardDocument };

export async function listBoards(userId: string): Promise<BoardDocument[]> {
  await dbConnect();
  return Board.find({ createdBy: userId }).sort({ createdAt: 1 });
}

// The landing redirect only needs the oldest board's id, so project to `_id`
// and return a lean document rather than hydrating every board's columns,
// tasks, and subtasks just to compute a target.
export async function findFirstBoardId(userId: string): Promise<string | null> {
  await dbConnect();
  const board = await Board.findOne({ createdBy: userId })
    .sort({ createdAt: 1 })
    .select("_id")
    .lean();
  return board ? String(board._id) : null;
}

export async function getBoard(
  userId: string,
  boardId: string,
): Promise<BoardDocument> {
  await dbConnect();
  return findOwnedBoard(userId, boardId);
}

export async function createBoard(
  userId: string,
  input: { name: string; description?: string },
): Promise<BoardDocument> {
  await dbConnect();
  return Board.create({
    createdBy: userId,
    name: input.name,
    description: input.description,
  });
}

export async function updateBoard(
  userId: string,
  boardId: string,
  input: { name?: string; description?: string },
): Promise<BoardDocument> {
  await dbConnect();
  const board = await findOwnedBoard(userId, boardId);
  if (input.name !== undefined) board.name = input.name;
  if (input.description !== undefined) board.description = input.description;
  await board.save();
  return board;
}

export async function deleteBoard(
  userId: string,
  boardId: string,
): Promise<void> {
  await dbConnect();
  if (!isValidObjectId(boardId)) throw notFound("Board not found");
  const board = await Board.findOneAndDelete({
    _id: boardId,
    createdBy: userId,
  });
  if (!board) throw notFound("Board not found");
}

// Column names are stored lowercase and must be unique within a board.
export async function addColumn(
  userId: string,
  boardId: string,
  input: { name: string; color?: string },
): Promise<BoardDocument> {
  await dbConnect();
  const board = await findOwnedBoard(userId, boardId);

  const name = input.name.toLowerCase();
  if (board.columns.some((column) => column.name.toLowerCase() === name)) {
    throw conflict(`Column "${input.name}" already exists`);
  }

  board.columns.push({ name, color: input.color || "default" });
  await board.save();
  return board;
}

export async function updateColumn(
  userId: string,
  boardId: string,
  columnId: string,
  input: { name?: string; color?: string },
): Promise<BoardDocument> {
  await dbConnect();
  if (!isValidObjectId(columnId)) throw notFound("Column not found");
  const board = await findOwnedBoard(userId, boardId);

  const column = board.columns.id(columnId);
  if (!column) throw notFound("Column not found");

  if (input.name !== undefined) {
    const name = input.name.toLowerCase();
    const clashes = board.columns.some(
      (other) =>
        String(other._id) !== String(column._id) &&
        other.name.toLowerCase() === name,
    );
    if (clashes) throw conflict(`Column "${input.name}" already exists`);

    // Tasks snapshot their column name, so a rename has to follow through to
    // every task in this column or those tasks would point at a stale status.
    const previousName = column.name;
    if (previousName !== name) {
      for (const task of board.tasks) {
        if (task.status.name === previousName) {
          task.status = { name, color: task.status.color };
        }
      }
    }
    column.name = name;
  }

  if (input.color !== undefined) column.color = input.color;

  await board.save();
  return board;
}

export async function deleteColumn(
  userId: string,
  boardId: string,
  columnId: string,
): Promise<BoardDocument> {
  await dbConnect();
  if (!isValidObjectId(columnId)) throw notFound("Column not found");
  const board = await findOwnedBoard(userId, boardId);

  const column = board.columns.id(columnId);
  if (!column) throw notFound("Column not found");

  // A task lives in exactly one column; deleting the column deletes its tasks
  // rather than leaving them with a status that no longer exists.
  const orphanedTaskIds = board.tasks
    .filter((task) => task.status.name === column.name)
    .map((task) => task._id);
  for (const taskId of orphanedTaskIds) board.tasks.pull(taskId);

  board.columns.pull(columnId);
  await board.save();
  return board;
}
