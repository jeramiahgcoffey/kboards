import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { taskReorderSchema } from "@/lib/validation";
import { reorderColumn } from "@/lib/services/tasks";
import { toBoard } from "@/lib/dto";

// A static sibling of `tasks/[taskId]`; Next matches this exact path first, so
// "reorder" is never treated as a task id.
type Params = { boardId: string };

export const PATCH = authed<Params>(async ({ request, userId, params }) => {
  const input = taskReorderSchema.parse(await readJson(request));
  const board = await reorderColumn(userId, params.boardId, input);
  return NextResponse.json({ board: toBoard(board) });
});
