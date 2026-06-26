import type { BoardDocument } from "@/lib/services/access";

// Plain, JSON-serializable views of a board. Server Components map Mongoose
// documents into these before handing data to Client Components, since
// hydrated documents are not safe to pass across the server/client boundary.

export interface SubtaskDTO {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: { name: string; color: string };
  subtasks: SubtaskDTO[];
}

export interface ColumnDTO {
  id: string;
  name: string;
  color: string;
}

export interface BoardSummaryDTO {
  id: string;
  name: string;
}

export interface BoardDTO {
  id: string;
  name: string;
  description?: string;
  columns: ColumnDTO[];
  tasks: TaskDTO[];
}

// The sidebar only needs each board's id and name, so the full columns/tasks
// payload never has to be serialized for the board list.
export function toBoardSummary(board: BoardDocument): BoardSummaryDTO {
  return { id: String(board._id), name: board.name };
}

export function toBoard(board: BoardDocument): BoardDTO {
  return {
    id: String(board._id),
    name: board.name,
    description: board.description ?? undefined,
    columns: board.columns.map((column) => ({
      id: String(column._id),
      name: column.name,
      color: column.color,
    })),
    tasks: board.tasks.map((task) => ({
      id: String(task._id),
      title: task.title,
      description: task.description ?? undefined,
      status: { name: task.status.name, color: task.status.color ?? "" },
      subtasks: task.subtasks.map((subtask) => ({
        id: String(subtask._id),
        title: subtask.title,
        completed: subtask.completed,
      })),
    })),
  };
}
