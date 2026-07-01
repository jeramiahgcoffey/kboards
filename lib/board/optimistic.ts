import type { BoardDTO } from "@/lib/dto";

// Pure, immutable transforms the board UI applies before a mutation's response
// returns, so drag-and-drop and subtask toggles feel instant. Each returns a
// new board (new arrays/objects) so React sees the change; the server's
// authoritative DTO replaces this once the request resolves, and the previous
// board is restored on failure.

// Move a task into another column by re-snapshotting its status name. Mirrors
// the server, which keys a task to its column by the canonical status name.
export function withMovedTask(
  board: BoardDTO,
  taskId: string,
  toColumnName: string,
): BoardDTO {
  // Carry the target column's color too, so the optimistic status never shows
  // the previous column's color while the PATCH is in flight.
  const targetColumn = board.columns.find(
    (column) => column.name === toColumnName,
  );
  return {
    ...board,
    tasks: board.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: {
              name: toColumnName,
              color: targetColumn?.color ?? task.status.color,
            },
          }
        : task,
    ),
  };
}

// Flip a single subtask's completion within a task.
export function withToggledSubtask(
  board: BoardDTO,
  taskId: string,
  subtaskId: string,
): BoardDTO {
  return {
    ...board,
    tasks: board.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask) =>
              subtask.id === subtaskId
                ? { ...subtask, completed: !subtask.completed }
                : subtask,
            ),
          }
        : task,
    ),
  };
}
