import type { ColumnDTO, TaskDTO } from "@/lib/dto";
import { columnAccent } from "./colors";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  column: ColumnDTO;
  index: number;
  tasks: TaskDTO[];
  onOpenTask: (task: TaskDTO) => void;
}

export function Column({ column, index, tasks, onOpenTask }: ColumnProps) {
  return (
    <section className="flex w-72 shrink-0 flex-col gap-5">
      <h2 className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[var(--color-dim)]">
        <span
          aria-hidden
          className="h-3.5 w-3.5 rounded-full"
          style={{ backgroundColor: columnAccent(column.color, index) }}
        />
        {column.name} ({tasks.length})
      </h2>
      <div className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-line)] px-4 py-6 text-center text-xs text-[var(--color-dim)]">
            No tasks yet
          </p>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpenTask} />
          ))
        )}
      </div>
    </section>
  );
}
