import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { boardSchema } from "@/lib/validation";
import { listBoards, createBoard } from "@/lib/services/boards";

export const GET = authed(async ({ userId }) => {
  const boards = await listBoards(userId);
  return NextResponse.json({ boards });
});

export const POST = authed(async ({ request, userId }) => {
  const input = boardSchema.parse(await readJson(request));
  const board = await createBoard(userId, input);
  return NextResponse.json({ board }, { status: 201 });
});
