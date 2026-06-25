import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { taskUpdateSchema } from "@/lib/validation";
import { updateTask, deleteTask } from "@/lib/services/tasks";

type Params = { boardId: string; taskId: string };

export const PATCH = authed<Params>(async ({ request, userId, params }) => {
  const input = taskUpdateSchema.parse(await readJson(request));
  const board = await updateTask(userId, params.boardId, params.taskId, input);
  return NextResponse.json({ board });
});

export const DELETE = authed<Params>(async ({ userId, params }) => {
  const board = await deleteTask(userId, params.boardId, params.taskId);
  return NextResponse.json({ board });
});
