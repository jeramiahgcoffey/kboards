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
  input: { name: string; color: string },
): Promise<BoardDocument> {
  await dbConnect();
  if (!isValidObjectId(columnId)) throw notFound("Column not found");
  const board = await findOwnedBoard(userId, boardId);

  const column = board.columns.id(columnId);
  if (!column) throw notFound("Column not found");

  const name = input.name.toLowerCase();
  const clashes = board.columns.some(
    (other) =>
      String(other._id) !== String(column._id) &&
      other.name.toLowerCase() === name,
  );
  if (clashes) throw conflict(`Column "${input.name}" already exists`);

  column.name = name;
  column.color = input.color;
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

  if (!board.columns.id(columnId)) throw notFound("Column not found");

  board.columns.pull(columnId);
  await board.save();
  return board;
}
