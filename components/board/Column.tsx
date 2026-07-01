"use client";

import { useDroppable } from "@dnd-kit/core";
import type { ColumnDTO, TaskDTO } from "@/lib/dto";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { columnAccent } from "./colors";
import { DraggableTaskCard } from "./DraggableTaskCard";

interface ColumnProps {
  column: ColumnDTO;
  index: number;
  tasks: TaskDTO[];
  // All board columns, so each card's "Move to" menu can list the others.
  columns: ColumnDTO[];
  onOpenTask: (task: TaskDTO) => void;
  onMoveTask: (task: TaskDTO, toColumnName: string) => void;
  onEditTask: (task: TaskDTO) => void;
  onDeleteTask: (task: TaskDTO) => void;
  onEditColumn: (column: ColumnDTO) => void;
  onDeleteColumn: (column: ColumnDTO) => void;
}

export function Column({
  column,
  index,
  tasks,
  columns,
  onOpenTask,
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onEditColumn,
  onDeleteColumn,
}: ColumnProps) {
  // Drop target keyed by the column's canonical name, which is exactly the
  // status a dropped task is moved to.
  const { setNodeRef, isOver } = useDroppable({
    id: `col:${column.name}`,
    data: { columnName: column.name },
  });

  return (
    <section className="flex w-72 shrink-0 flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex min-w-0 items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--color-dim)]">
          <span
            aria-hidden
            className="h-3.5 w-3.5 shrink-0 rounded-full"
            style={{ backgroundColor: columnAccent(column.color, index) }}
          />
          <span className="truncate">
            {column.name} ({tasks.length})
          </span>
        </h2>
        <Menu
          label={`Actions for ${column.name} column`}
          triggerClassName="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-dim)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <MenuItem onSelect={() => onEditColumn(column)}>Edit Column</MenuItem>
          <MenuItem onSelect={() => onDeleteColumn(column)} destructive>
            Delete Column
          </MenuItem>
        </Menu>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-col gap-3 rounded-lg transition-colors ${
          isOver ? "bg-[var(--color-accent)]/10 ring-2 ring-[var(--color-accent)]/40" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-line)] px-4 py-6 text-center text-xs text-[var(--color-dim)]">
            No tasks yet
          </p>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              columns={columns}
              onOpen={onOpenTask}
              onMove={onMoveTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </section>
  );
}
