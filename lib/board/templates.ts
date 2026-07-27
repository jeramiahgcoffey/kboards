export const BOARD_TEMPLATE_IDS = ["blank", "personal"] as const;
export type BoardTemplateId = (typeof BOARD_TEMPLATE_IDS)[number];

const PERSONAL_COLUMNS = [
  { name: "backlog", color: "#8471f2" },
  { name: "this week", color: "#49c4e5" },
  { name: "done", color: "#67e2ae" },
] as const;

const PERSONAL_TASKS = [
  {
    title: "Choose one meaningful outcome",
    description:
      "Keep the week small enough to finish. Edit this task with the outcome that matters most.",
    status: { name: "this week", color: "#49c4e5" },
    order: 0,
    subtasks: [
      { title: "Name the outcome", completed: false },
      { title: "Define what done means", completed: false },
    ],
  },
  {
    title: "Capture the rest without committing",
    description:
      "Use the backlog for ideas that matter, but do not need your attention today.",
    status: { name: "backlog", color: "#8471f2" },
    order: 0,
    subtasks: [],
  },
  {
    title: "Move this when you finish",
    description:
      "Drag this card to Done, or use its actions menu for the same accessible move.",
    status: { name: "this week", color: "#49c4e5" },
    order: 1,
    subtasks: [],
  },
] as const;

export function fieldsForBoardTemplate(template: BoardTemplateId) {
  if (template === "blank") return {};

  // Return fresh plain objects. Mongoose mutates input arrays as it casts them
  // into subdocuments, so shared template objects must never be passed through.
  return {
    columns: PERSONAL_COLUMNS.map((column) => ({ ...column })),
    tasks: PERSONAL_TASKS.map((task) => ({
      ...task,
      status: { ...task.status },
      subtasks: task.subtasks.map((subtask) => ({ ...subtask })),
    })),
  };
}
