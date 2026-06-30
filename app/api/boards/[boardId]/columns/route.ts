import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { columnSchema } from "@/lib/validation";
import { addColumn } from "@/lib/services/boards";
import { toBoard } from "@/lib/dto";

type Params = { boardId: string };

export const POST = authed<Params>(async ({ request, userId, params }) => {
  const input = columnSchema.parse(await readJson(request));
  const board = await addColumn(userId, params.boardId, input);
  return NextResponse.json({ board: toBoard(board) }, { status: 201 });
});
