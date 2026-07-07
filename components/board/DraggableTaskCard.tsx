"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ColumnDTO, TaskDTO } from "@/lib/dto";
import { TaskCard } from "./TaskCard";

// Wraps a task card with pointer drag-and-sort wiring. Only `listeners` (pointer
// events) are spread onto the card, not dnd-kit's keyboard `attributes`: the
// card stays a plain button whose keyboard/screen-reader move path is the card's
// "..." menu ("Move to <column>", "Move up/down"), while pointer users can drag
// it to another column or to a new position within its column.
export function DraggableTaskCard({
  task,
  onOpen,
  columns,
  position,
  onMove,
  onReorder,
  onEdit,
  onDelete,
}: {
  task: TaskDTO;
  onOpen: (task: TaskDTO) => void;
  columns: ColumnDTO[];
  // The card's index and count within its column, so the menu can offer/limit
  // "Move up"/"Move down" at the column ends.
  position: { index: number; count: number };
  onMove: (task: TaskDTO, toColumnName: string) => void;
  onReorder: (task: TaskDTO, direction: "up" | "down") => void;
  onEdit: (task: TaskDTO) => void;
  onDelete: (task: TaskDTO) => void;
}) {
  const {
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { fromColumn: task.status.name } });

  // The sortable node (this wrapper) is what dnd-kit measures and transforms as
  // siblings shift to make room; the transform must apply here, not to the inner
  // button, so the card's absolutely-positioned actions menu travels with it.
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      <TaskCard
        task={task}
        onOpen={onOpen}
        dragListeners={listeners}
        dragging={isDragging}
        columns={columns}
        position={position}
        onMove={onMove}
        onReorder={onReorder}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
