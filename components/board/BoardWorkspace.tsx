"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import type { BoardDTO, ColumnDTO, TaskDTO } from "@/lib/dto";
import { apiFetch, ApiError } from "@/lib/api/client";
import { withMovedTask, withToggledSubtask } from "@/lib/board/optimistic";
import { Button } from "@/components/ui/Button";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { BoardFormModal } from "./BoardFormModal";
import { ColumnFormModal, type ColumnFormValues } from "./ColumnFormModal";
import { TaskFormModal, type TaskFormValues } from "./TaskFormModal";

// The set of dialogs the workspace can show, one at a time. The view-only task
// modal is tracked separately via `selectedTaskId`.
type Dialog =
  | { type: "none" }
  | { type: "edit-board" }
  | { type: "delete-board" }
  | { type: "add-column" }
  | { type: "edit-column"; columnId: string }
  | { type: "delete-column"; columnId: string }
  | { type: "add-task" }
  | { type: "edit-task"; taskId: string }
  | { type: "delete-task"; taskId: string };

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export function BoardWorkspace({ board: initialBoard }: { board: BoardDTO }) {
  const router = useRouter();
  const [board, setBoard] = useState(initialBoard);
  const [dialog, setDialog] = useState<Dialog>({ type: "none" });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeDragTask, setActiveDragTask] = useState<TaskDTO | null>(null);
  const [confirmPending, setConfirmPending] = useState(false);

  const boardId = board.id;
  const columns = board.columns;
  const hasColumns = columns.length > 0;
  const selectedTask =
    board.tasks.find((task) => task.id === selectedTaskId) ?? null;
  const closeDialog = () => setDialog({ type: "none" });

  const tasksFor = (name: string) =>
    board.tasks.filter((task) => task.status.name === name);

  // --- Mutations that return the updated board ---------------------------

  // Runs a board-returning mutation, reconciling local state and toasting.
  // Returns whether it succeeded so form modals can decide to close.
  async function runMutation(
    run: () => Promise<{ board: BoardDTO }>,
    success: string,
  ): Promise<boolean> {
    try {
      const { board: next } = await run();
      setBoard(next);
      toast.success(success);
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Something went wrong. Please try again."));
      return false;
    }
  }

  // --- Board ------------------------------------------------------------

  async function submitEditBoard(values: {
    name: string;
    description?: string;
  }): Promise<boolean> {
    const ok = await runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}`, { method: "PATCH", body: values }),
      "Board updated",
    );
    // Refresh so the header title and sidebar name follow the rename.
    if (ok) router.refresh();
    return ok;
  }

  async function confirmDeleteBoard() {
    setConfirmPending(true);
    try {
      await apiFetch(`/api/boards/${boardId}`, { method: "DELETE" });
      toast.success("Board deleted");
      // The boards index lands on the next board, or the empty state.
      router.push("/boards");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Could not delete the board."));
      setConfirmPending(false);
    }
  }

  // --- Columns ----------------------------------------------------------

  async function submitAddColumn(values: ColumnFormValues): Promise<boolean> {
    return runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}/columns`, {
          method: "POST",
          body: values,
        }),
      "Column created",
    );
  }

  async function submitEditColumn(
    columnId: string,
    values: ColumnFormValues,
  ): Promise<boolean> {
    return runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}/columns/${columnId}`, {
          method: "PATCH",
          body: values,
        }),
      "Column updated",
    );
  }

  async function confirmDeleteColumn(columnId: string) {
    setConfirmPending(true);
    const ok = await runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}/columns/${columnId}`, {
          method: "DELETE",
        }),
      "Column deleted",
    );
    setConfirmPending(false);
    if (ok) closeDialog();
  }

  // --- Tasks ------------------------------------------------------------

  async function submitAddTask(values: TaskFormValues): Promise<boolean> {
    return runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}/tasks`, {
          method: "POST",
          body: {
            title: values.title,
            description: values.description,
            status: { name: values.statusName },
            subtasks: values.subtasks,
          },
        }),
      "Task created",
    );
  }

  async function submitEditTask(
    taskId: string,
    values: TaskFormValues,
  ): Promise<boolean> {
    return runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}/tasks/${taskId}`, {
          method: "PATCH",
          body: {
            title: values.title,
            description: values.description,
            status: { name: values.statusName },
            subtasks: values.subtasks,
          },
        }),
      "Task updated",
    );
  }

  async function confirmDeleteTask(taskId: string) {
    setConfirmPending(true);
    const ok = await runMutation(
      () =>
        apiFetch(`/api/boards/${boardId}/tasks/${taskId}`, { method: "DELETE" }),
      "Task deleted",
    );
    setConfirmPending(false);
    if (ok) closeDialog();
  }

  // --- Optimistic interactions (no toast on success) --------------------

  async function moveTask(taskId: string, toColumnName: string) {
    const task = board.tasks.find((item) => item.id === taskId);
    if (!task || task.status.name === toColumnName) return;

    const previous = board;
    setBoard(withMovedTask(board, taskId, toColumnName));
    try {
      const { board: next } = await apiFetch<{ board: BoardDTO }>(
        `/api/boards/${boardId}/tasks/${taskId}`,
        { method: "PATCH", body: { status: { name: toColumnName } } },
      );
      setBoard(next);
    } catch (error) {
      setBoard(previous);
      toast.error(errorMessage(error, "Could not move the task."));
    }
  }

  async function toggleSubtask(taskId: string, subtaskId: string) {
    const task = board.tasks.find((item) => item.id === taskId);
    const subtask = task?.subtasks.find((item) => item.id === subtaskId);
    if (!task || !subtask) return;

    const previous = board;
    const completed = !subtask.completed;
    setBoard(withToggledSubtask(board, taskId, subtaskId));
    try {
      const { board: next } = await apiFetch<{ board: BoardDTO }>(
        `/api/boards/${boardId}/tasks/${taskId}/subtasks/${subtaskId}`,
        { method: "PATCH", body: { completed } },
      );
      setBoard(next);
    } catch (error) {
      setBoard(previous);
      toast.error(errorMessage(error, "Could not update the subtask."));
    }
  }

  // --- Drag and drop ----------------------------------------------------

  const sensors = useSensors(
    // A small activation distance lets a plain click still open the task.
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function onDragStart(event: DragStartEvent) {
    const task = board.tasks.find((item) => item.id === event.active.id);
    setActiveDragTask(task ?? null);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveDragTask(null);
    const { active, over } = event;
    if (!over) return;
    const toColumnName = String(over.id).replace(/^col:/, "");
    void moveTask(String(active.id), toColumnName);
  }

  // --- Render -----------------------------------------------------------

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-line)] px-4 py-3 sm:px-6">
        <Button
          type="button"
          onClick={() => setDialog({ type: "add-task" })}
          disabled={!hasColumns}
          title={
            hasColumns ? undefined : "Add a column before creating tasks"
          }
        >
          + Add New Task
        </Button>
        <Menu label="Board actions">
          <MenuItem onSelect={() => setDialog({ type: "edit-board" })}>
            Edit Board
          </MenuItem>
          <MenuItem onSelect={() => setDialog({ type: "add-column" })}>
            Add Column
          </MenuItem>
          <MenuItem
            onSelect={() => setDialog({ type: "delete-board" })}
            destructive
          >
            Delete Board
          </MenuItem>
        </Menu>
      </div>

      {hasColumns ? (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveDragTask(null)}
        >
          <div className="flex min-h-0 flex-1 gap-6 overflow-x-auto px-4 py-6 sm:px-6">
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                index={index}
                tasks={tasksFor(column.name)}
                onOpenTask={(task) => setSelectedTaskId(task.id)}
                onEditColumn={(col) =>
                  setDialog({ type: "edit-column", columnId: col.id })
                }
                onDeleteColumn={(col) =>
                  setDialog({ type: "delete-column", columnId: col.id })
                }
              />
            ))}
            <button
              type="button"
              onClick={() => setDialog({ type: "add-column" })}
              className="mt-9 flex h-40 w-72 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface)]/50 text-sm font-bold text-[var(--color-dim)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              + New Column
            </button>
          </div>

          <DragOverlay>
            {activeDragTask ? (
              <div className="w-72 rotate-2">
                <TaskCard task={activeDragTask} onOpen={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <p className="max-w-sm text-[var(--color-dim)]">
            This board has no columns yet. Add a column to start tracking tasks.
          </p>
          <Button type="button" onClick={() => setDialog({ type: "add-column" })}>
            + Add New Column
          </Button>
        </div>
      )}

      <TaskModal
        task={selectedTask}
        columns={columns}
        onClose={() => setSelectedTaskId(null)}
        onToggleSubtask={(subtaskId) =>
          selectedTask && toggleSubtask(selectedTask.id, subtaskId)
        }
        onChangeStatus={(statusName) =>
          selectedTask && moveTask(selectedTask.id, statusName)
        }
        onEdit={() => {
          if (!selectedTask) return;
          const taskId = selectedTask.id;
          setSelectedTaskId(null);
          setDialog({ type: "edit-task", taskId });
        }}
        onDelete={() => {
          if (!selectedTask) return;
          const taskId = selectedTask.id;
          setSelectedTaskId(null);
          setDialog({ type: "delete-task", taskId });
        }}
      />

      {dialog.type === "edit-board" ? (
        <BoardFormModal
          mode="edit"
          initial={{ name: board.name, description: board.description }}
          onSubmit={submitEditBoard}
          onClose={closeDialog}
        />
      ) : null}

      {dialog.type === "add-column" ? (
        <ColumnFormModal
          mode="create"
          onSubmit={submitAddColumn}
          onClose={closeDialog}
        />
      ) : null}

      {dialog.type === "edit-column"
        ? renderColumnEdit(columns, dialog.columnId, submitEditColumn, closeDialog)
        : null}

      {dialog.type === "add-task" ? (
        <TaskFormModal
          mode="create"
          columns={columns}
          onSubmit={submitAddTask}
          onClose={closeDialog}
        />
      ) : null}

      {dialog.type === "edit-task"
        ? renderTaskEdit(board, dialog.taskId, submitEditTask, closeDialog)
        : null}

      {dialog.type === "delete-board" ? (
        <ConfirmDialog
          open
          title="Delete this board?"
          message={
            <>
              Deleting <strong>{board.name}</strong> removes the board and all of
              its columns and tasks. This cannot be undone.
            </>
          }
          confirmLabel="Delete Board"
          pending={confirmPending}
          onConfirm={confirmDeleteBoard}
          onClose={closeDialog}
        />
      ) : null}

      {dialog.type === "delete-column"
        ? renderColumnDelete(
            columns,
            dialog.columnId,
            tasksFor,
            confirmPending,
            () => confirmDeleteColumn(dialog.columnId),
            closeDialog,
          )
        : null}

      {dialog.type === "delete-task"
        ? renderTaskDelete(
            board,
            dialog.taskId,
            confirmPending,
            () => confirmDeleteTask(dialog.taskId),
            closeDialog,
          )
        : null}
    </div>
  );
}

// Lookups that may miss (the entity was deleted) render nothing rather than a
// broken dialog, so each edit/delete case is guarded in a small helper.

function renderColumnEdit(
  columns: ColumnDTO[],
  columnId: string,
  onSubmit: (columnId: string, values: ColumnFormValues) => Promise<boolean>,
  onClose: () => void,
) {
  const column = columns.find((item) => item.id === columnId);
  if (!column) return null;
  return (
    <ColumnFormModal
      mode="edit"
      initial={{ name: column.name, color: column.color }}
      onSubmit={(values) => onSubmit(columnId, values)}
      onClose={onClose}
    />
  );
}

function renderColumnDelete(
  columns: ColumnDTO[],
  columnId: string,
  tasksFor: (name: string) => TaskDTO[],
  pending: boolean,
  onConfirm: () => void,
  onClose: () => void,
) {
  const column = columns.find((item) => item.id === columnId);
  if (!column) return null;
  const count = tasksFor(column.name).length;
  return (
    <ConfirmDialog
      open
      title="Delete this column?"
      message={
        <>
          Deleting <strong>{column.name}</strong>
          {count > 0
            ? ` also deletes its ${count} task${count === 1 ? "" : "s"}.`
            : "."}{" "}
          This cannot be undone.
        </>
      }
      confirmLabel="Delete Column"
      pending={pending}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}

function renderTaskEdit(
  board: BoardDTO,
  taskId: string,
  onSubmit: (taskId: string, values: TaskFormValues) => Promise<boolean>,
  onClose: () => void,
) {
  const task = board.tasks.find((item) => item.id === taskId);
  if (!task) return null;
  return (
    <TaskFormModal
      mode="edit"
      columns={board.columns}
      initial={{
        title: task.title,
        description: task.description,
        statusName: task.status.name,
        subtasks: task.subtasks.map((subtask) => subtask.title),
      }}
      onSubmit={(values) => onSubmit(taskId, values)}
      onClose={onClose}
    />
  );
}

function renderTaskDelete(
  board: BoardDTO,
  taskId: string,
  pending: boolean,
  onConfirm: () => void,
  onClose: () => void,
) {
  const task = board.tasks.find((item) => item.id === taskId);
  if (!task) return null;
  return (
    <ConfirmDialog
      open
      title="Delete this task?"
      message={
        <>
          Deleting <strong>{task.title}</strong> removes it and its subtasks.
          This cannot be undone.
        </>
      }
      confirmLabel="Delete Task"
      pending={pending}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
