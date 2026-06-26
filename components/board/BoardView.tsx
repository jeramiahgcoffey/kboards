"use client";

import { useState } from "react";
import type { BoardDTO, TaskDTO } from "@/lib/dto";
import { Column } from "./Column";
import { TaskModal } from "./TaskModal";

export function BoardView({ board }: { board: BoardDTO }) {
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);

  if (board.columns.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <p className="max-w-sm text-[var(--color-dim)]">
          This board has no columns yet. Columns and tasks are managed in the next
          update.
        </p>
      </div>
    );
  }

  // Tasks snapshot their column name (canonical lowercase), so grouping is a
  // direct match against each column name.
  const tasksByColumn = (name: string) =>
    board.tasks.filter((task) => task.status.name === name);

  return (
    <>
      <div className="flex h-full gap-6 overflow-x-auto px-4 py-6 sm:px-6">
        {board.columns.map((column, index) => (
          <Column
            key={column.id}
            column={column}
            index={index}
            tasks={tasksByColumn(column.name)}
            onOpenTask={setSelectedTask}
          />
        ))}
      </div>
      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
    </>
  );
}
