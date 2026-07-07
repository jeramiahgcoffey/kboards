import { describe, it, expect } from "vitest";
import { taskReorderSchema } from "./validation";

describe("taskReorderSchema", () => {
  it("accepts a column name and a list of unique task ids", () => {
    const result = taskReorderSchema.safeParse({
      columnName: "todo",
      orderedTaskIds: ["a", "b", "c"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects duplicate ids, which would collide orders in the service", () => {
    const result = taskReorderSchema.safeParse({
      columnName: "todo",
      orderedTaskIds: ["a", "b", "a"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty order list", () => {
    const result = taskReorderSchema.safeParse({
      columnName: "todo",
      orderedTaskIds: [],
    });
    expect(result.success).toBe(false);
  });
});
