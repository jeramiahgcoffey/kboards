import { z } from "zod";

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
  description: z.string().max(100).optional(),
});

export const columnSchema = z.object({
  name: z.string().min(3, "Column name must be more than 2 characters"),
  color: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.object({ name: z.string(), color: z.string().optional() }),
  subtasks: z.array(z.string()).default([]),
});

export const passwordResetRequestSchema = z.object({
  email: z.email(),
});

export const passwordResetSchema = z.object({
  userId: z.string(),
  token: z.string(),
  password,
});
