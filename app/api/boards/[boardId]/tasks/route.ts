import { NextResponse } from "next/server";
import { authed, readJson } from "@/lib/api/route";
import { taskSchema } from "@/lib/validation";
import { createTask } from "@/lib/services/tasks";

type Params = { boardId: string };

export const POST = authed<Params>(async ({ request, userId, params }) => {
  const input = taskSchema.parse(await readJson(request));
  const board = await createTask(userId, params.boardId, input);
  return NextResponse.json({ board }, { status: 201 });
});
