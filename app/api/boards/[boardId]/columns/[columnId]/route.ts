import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { columnUpdateSchema } from "@/lib/validation";
import { updateColumn, deleteColumn } from "@/lib/services/boards";

type Params = { boardId: string; columnId: string };

export const PATCH = authed<Params>(async ({ request, userId, params }) => {
  const input = columnUpdateSchema.parse(await readJson(request));
  const board = await updateColumn(
    userId,
    params.boardId,
    params.columnId,
    input,
  );
  return NextResponse.json({ board });
});

export const DELETE = authed<Params>(async ({ userId, params }) => {
  const board = await deleteColumn(userId, params.boardId, params.columnId);
  return NextResponse.json({ board });
});
