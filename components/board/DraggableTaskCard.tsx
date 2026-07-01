"use client";

import { useDraggable } from "@dnd-kit/core";
import type { ColumnDTO, TaskDTO } from "@/lib/dto";
import { TaskCard } from "./TaskCard";

// Wraps a task card with pointer-drag wiring. Only `listeners` (pointer events)
// are spread onto the card, not dnd-kit's keyboard `attributes`: the card stays
// a plain button whose keyboard/screen-reader move path is the card's "..."
// actions menu ("Move to <column>"), while pointer users can additionally drag
// it between columns.
export function DraggableTaskCard({
  task,
  onOpen,
  columns,
  onMove,
  onEdit,
  onDelete,
}: {
  task: TaskDTO;
  onOpen: (task: TaskDTO) => void;
  columns: ColumnDTO[];
  onMove: (task: TaskDTO, toColumnName: string) => void;
  onEdit: (task: TaskDTO) => void;
  onDelete: (task: TaskDTO) => void;
}) {
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: task.id,
    data: { fromColumn: task.status.name },
  });

  return (
    <TaskCard
      task={task}
      onOpen={onOpen}
      dragRef={setNodeRef}
      dragListeners={listeners}
      dragging={isDragging}
      columns={columns}
      onMove={onMove}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
