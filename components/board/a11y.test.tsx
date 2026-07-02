// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { Menu, MenuItem } from "@/components/ui/Menu";
import type { ColumnDTO, TaskDTO } from "@/lib/dto";

// color-contrast can't be evaluated in jsdom (no layout/paint), so disable that
// one rule and assert on everything else axe checks.
async function expectNoViolations(node: Element) {
  const { violations } = await axe.run(node, {
    rules: { "color-contrast": { enabled: false } },
  });
  if (violations.length > 0) {
    const detail = violations
      .map((v) => `${v.id} (${v.impact}): ${v.help} [${v.nodes.length} node(s)]`)
      .join("\n");
    throw new Error(`Accessibility violations found:\n${detail}`);
  }
  expect(violations).toEqual([]);
}

const columns: ColumnDTO[] = [
  { id: "c1", name: "todo", color: "" },
  { id: "c2", name: "doing", color: "" },
  { id: "c3", name: "done", color: "" },
];

const task: TaskDTO = {
  id: "t1",
  title: "Ship the accessibility pass",
  description: "Make the board usable by keyboard and screen readers.",
  status: { name: "todo", color: "" },
  order: 0,
  subtasks: [
    { id: "s1", title: "Overlay stack", completed: true },
    { id: "s2", title: "Card actions menu", completed: false },
  ],
};

function renderCard() {
  return render(
    <TaskCard
      task={task}
      onOpen={() => {}}
      columns={columns}
      position={{ index: 1, count: 3 }}
      onMove={() => {}}
      onReorder={() => {}}
      onEdit={() => {}}
      onDelete={() => {}}
    />,
  );
}

describe("accessibility smoke tests", () => {
  it("task card with an actions menu has no violations", async () => {
    const { container } = renderCard();
    await expectNoViolations(container);
  });

  it("task card with its actions menu open has no violations", async () => {
    const { container } = renderCard();
    await userEvent.click(
      screen.getByRole("button", { name: /actions for/i }),
    );
    await expectNoViolations(container);
  });

  it("task modal has no violations", async () => {
    // The modal renders through a portal, so assert against document.body.
    const { baseElement } = render(
      <TaskModal
        task={task}
        columns={columns}
        onClose={() => {}}
        onToggleSubtask={() => {}}
        onChangeStatus={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  it("standalone menu has no violations", async () => {
    const { container } = render(
      <Menu label="Row actions">
        <MenuItem onSelect={() => {}}>Edit</MenuItem>
        <MenuItem onSelect={() => {}} destructive>
          Delete
        </MenuItem>
      </Menu>,
    );
    await expectNoViolations(container);
  });
});
