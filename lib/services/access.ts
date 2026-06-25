import { isValidObjectId, type HydratedDocument } from "mongoose";
import { Board, type IBoard } from "@/lib/db/models/Board";
import { notFound } from "./errors";

export type BoardDocument = HydratedDocument<IBoard>;

// Loads a board only if it belongs to the user. An invalid id is treated as
// "not found" so callers never leak the difference, and a malformed id can
// never reach Mongoose as a cast error.
export async function findOwnedBoard(
  userId: string,
  boardId: string,
): Promise<BoardDocument> {
  if (!isValidObjectId(boardId)) throw notFound("Board not found");
  const board = await Board.findOne({ _id: boardId, createdBy: userId });
  if (!board) throw notFound("Board not found");
  return board;
}
