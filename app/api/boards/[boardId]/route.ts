import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { boardUpdateSchema } from "@/lib/validation";
import { getBoard, updateBoard, deleteBoard } from "@/lib/services/boards";

type Params = { boardId: string };

export const GET = authed<Params>(async ({ userId, params }) => {
  const board = await getBoard(userId, params.boardId);
  return NextResponse.json({ board });
});

export const PATCH = authed<Params>(async ({ request, userId, params }) => {
  const input = boardUpdateSchema.parse(await readJson(request));
  const board = await updateBoard(userId, params.boardId, input);
  return NextResponse.json({ board });
});

export const DELETE = authed<Params>(async ({ userId, params }) => {
  await deleteBoard(userId, params.boardId);
  return new NextResponse(null, { status: 204 });
});
