"use client";

import { useDraggable } from "@dnd-kit/core";
import type { TaskDTO } from "@/lib/dto";
import { TaskCard } from "./TaskCard";

// Wraps a task card with pointer-drag wiring. Only `listeners` (pointer events)
// are spread onto the card, not dnd-kit's keyboard `attributes`: the card stays
// a plain button whose keyboard path is "open the task, change its status",
// while pointer users can additionally drag it between columns.
export function DraggableTaskCard({
  task,
  onOpen,
}: {
  task: TaskDTO;
  onOpen: (task: TaskDTO) => void;
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
    />
  );
}
