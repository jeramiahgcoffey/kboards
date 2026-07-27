import { describe, it, expect } from "vitest";
import { boardSchema, taskReorderSchema } from "./validation";

describe("boardSchema", () => {
  it("defaults to a blank template for existing API clients", () => {
    expect(boardSchema.parse({ name: "Roadmap" }).template).toBe("blank");
  });

  it("accepts the personal starter template", () => {
    expect(
      boardSchema.parse({ name: "My week", template: "personal" }).template,
    ).toBe("personal");
  });

  it("rejects unknown templates", () => {
    expect(() =>
      boardSchema.parse({ name: "Roadmap", template: "company-secret" }),
    ).toThrow();
  });
});

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
