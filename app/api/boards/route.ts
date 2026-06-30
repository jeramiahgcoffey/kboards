import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { boardSchema } from "@/lib/validation";
import { listBoards, createBoard } from "@/lib/services/boards";
import { toBoard, toBoardSummary } from "@/lib/dto";

export const GET = authed(async ({ userId }) => {
  const boards = await listBoards(userId);
  return NextResponse.json({ boards: boards.map(toBoardSummary) });
});

export const POST = authed(async ({ request, userId }) => {
  const input = boardSchema.parse(await readJson(request));
  const board = await createBoard(userId, input);
  return NextResponse.json({ board: toBoard(board) }, { status: 201 });
});
