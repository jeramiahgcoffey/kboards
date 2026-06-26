import { describe, it, expect } from "vitest";
import { Types } from "mongoose";
import { Board } from "@/lib/db/models/Board";
import { toBoard, toBoardSummary } from "./dto";

// A document built in memory is enough to exercise serialization: Mongoose
// assigns subdocument _ids on construction, so no database round trip is needed.
function buildBoard() {
  return new Board({
    createdBy: new Types.ObjectId(),
    name: "Platform Launch",
    columns: [
      { name: "todo", color: "default" },
      { name: "doing", color: "#8471f2" },
    ],
    tasks: [
      {
        title: "Wire the board view",
        description: "Render columns and cards",
        status: { name: "todo" },
        subtasks: [
          { title: "Columns", completed: true },
          { title: "Cards", completed: false },
        ],
      },
    ],
  });
}

describe("toBoardSummary", () => {
  it("reduces a board to a string id and name", () => {
    const board = buildBoard();
    expect(toBoardSummary(board)).toEqual({
      id: String(board._id),
      name: "Platform Launch",
    });
  });
});

describe("toBoard", () => {
  it("serializes columns, tasks, and subtasks with string ids", () => {
    const dto = toBoard(buildBoard());

    expect(typeof dto.id).toBe("string");
    expect(dto.columns.map((column) => column.name)).toEqual(["todo", "doing"]);
    expect(dto.columns.every((column) => typeof column.id === "string")).toBe(true);

    expect(dto.tasks).toHaveLength(1);
    const [task] = dto.tasks;
    expect(typeof task.id).toBe("string");
    expect(task.status).toEqual({ name: "todo", color: "" });
    expect(task.subtasks).toEqual([
      { id: expect.any(String), title: "Columns", completed: true },
      { id: expect.any(String), title: "Cards", completed: false },
    ]);
  });

  it("omits an absent description rather than emitting null", () => {
    const board = new Board({
      createdBy: new Types.ObjectId(),
      name: "Bare",
      columns: [],
      tasks: [],
    });
    expect(toBoard(board)).not.toHaveProperty("description");
  });
});
