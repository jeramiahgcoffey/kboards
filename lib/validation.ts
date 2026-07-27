import { z } from "zod";
import { BOARD_TEMPLATE_IDS } from "@/lib/board/templates";

// bcrypt only considers the first 72 bytes of a password, so cap input there.
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters");

export const registerSchema = z.object({
  email: z.email("A valid email is required").max(255),
  password,
  name: z.string().min(3).max(30).optional(),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const boardSchema = z.object({
  name: z.string().min(1).max(25),
  description: z.string().min(3).max(100).optional(),
  template: z.enum(BOARD_TEMPLATE_IDS).default("blank"),
});

// Boards can be renamed or re-described; require at least one field to change.
export const boardUpdateSchema = z
  .object({
    name: z.string().min(1).max(25).optional(),
    description: z.string().min(3).max(100).optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "Provide a name or description to update",
  });

export const columnSchema = z.object({
  name: z.string().min(3, "Column name must be more than 2 characters"),
  color: z.string().optional(),
});

export const columnUpdateSchema = z
  .object({
    name: z
      .string()
      .min(3, "Column name must be more than 2 characters")
      .optional(),
    color: z.string().min(1, "A color is required").optional(),
  })
  .refine((data) => data.name !== undefined || data.color !== undefined, {
    message: "Provide a name or color to update",
  });

const statusSchema = z.object({
  name: z.string().min(1),
  color: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: statusSchema,
  subtasks: z.array(z.string().min(1)).default([]),
});

// Editing a task can replace its subtask list (by title); completion state is
// managed through the subtask endpoint. Require at least one field to change.
export const taskUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: statusSchema.optional(),
    subtasks: z.array(z.string().min(1)).optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: "Provide at least one field to update",
  });

// Reordering sends the target column's full desired task order. The server
// renumbers those tasks and moves any into the column, so within-column
// reordering and cross-column drop-at-position share one idempotent operation.
export const taskReorderSchema = z.object({
  columnName: z.string().min(1),
  // Reject duplicate ids: the service assigns `order = index` per entry, so a
  // repeated id would silently collide orders and leave the column half-numbered.
  orderedTaskIds: z
    .array(z.string().min(1))
    .min(1)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "orderedTaskIds must not contain duplicates",
    }),
});

export const subtaskUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.completed !== undefined,
    { message: "Provide a title or completed state to update" },
  );

export const passwordResetRequestSchema = z.object({
  email: z.email(),
});

export const passwordResetSchema = z.object({
  userId: z.string(),
  token: z.string(),
  password,
});
