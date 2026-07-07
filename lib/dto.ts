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
  // Position within the task's column, ascending. The UI sorts each column by
  // this so reordering survives a round-trip.
  order: number;
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
    // Omit the key entirely when absent so the DTO honors its optional contract
    // instead of materializing `description: undefined`.
    ...(board.description != null ? { description: board.description } : {}),
    columns: board.columns.map((column) => ({
      id: String(column._id),
      name: column.name,
      color: column.color,
    })),
    // Emit tasks pre-sorted by their in-column position. The sort is stable, so
    // legacy tasks that share order 0 keep their stored array order.
    tasks: [...board.tasks]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((task) => ({
        id: String(task._id),
        title: task.title,
        ...(task.description != null ? { description: task.description } : {}),
        status: { name: task.status.name, color: task.status.color ?? "" },
        order: task.order ?? 0,
        subtasks: task.subtasks.map((subtask) => ({
          id: String(subtask._id),
          title: subtask.title,
          completed: subtask.completed,
        })),
      })),
  };
}
