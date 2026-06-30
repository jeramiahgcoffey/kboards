import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { subtaskUpdateSchema } from "@/lib/validation";
import { updateSubtask } from "@/lib/services/tasks";
import { toBoard } from "@/lib/dto";

type Params = { boardId: string; taskId: string; subtaskId: string };

export const PATCH = authed<Params>(async ({ request, userId, params }) => {
  const input = subtaskUpdateSchema.parse(await readJson(request));
  const board = await updateSubtask(
    userId,
    params.boardId,
    params.taskId,
    params.subtaskId,
    input,
  );
  return NextResponse.json({ board: toBoard(board) });
});
