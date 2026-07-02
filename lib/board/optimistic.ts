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
  // Append to the bottom of the destination column, matching the server, so the
  // moved card lands last instead of wherever its old column order placed it.
  // max(order)+1 (not a count) stays collision-free when the column's orders
  // have a gap from an earlier cross-column move.
  const destOrders = board.tasks
    .filter((task) => task.status.name === toColumnName && task.id !== taskId)
    .map((task) => task.order);
  const endOrder = destOrders.length ? Math.max(...destOrders) + 1 : 0;
  return {
    ...board,
    tasks: board.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            order: endOrder,
            status: {
              name: toColumnName,
              color: targetColumn?.color ?? task.status.color,
            },
          }
        : task,
    ),
  };
}

// Apply a new within-column ordering optimistically. `orderedTaskIds` is the
// target column's full desired order; each listed task is renumbered to its
// index and snapped into that column (so this covers both reordering and a
// cross-column drop), mirroring the reorder service.
export function withReorderedColumn(
  board: BoardDTO,
  columnName: string,
  orderedTaskIds: string[],
): BoardDTO {
  const targetColumn = board.columns.find(
    (column) => column.name === columnName,
  );
  const indexById = new Map(orderedTaskIds.map((id, index) => [id, index]));
  return {
    ...board,
    tasks: board.tasks.map((task) => {
      const index = indexById.get(task.id);
      if (index === undefined) return task;
      return {
        ...task,
        order: index,
        status: {
          name: columnName,
          color: targetColumn?.color ?? task.status.color,
        },
      };
    }),
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
