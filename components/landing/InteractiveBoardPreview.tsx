"use client";

import { useState } from "react";

const STAGES = [
  { name: "Later", color: "#8471f2" },
  { name: "Today", color: "#49c4e5" },
  { name: "Done", color: "#67e2ae" },
] as const;

const SUPPORTING_TASKS = [
  { title: "Choose the week’s focus", stage: 0 },
  { title: "Write the launch note", stage: 1 },
  { title: "Tell three real people", stage: 2 },
] as const;

const FOCUS_TASK = "Ship the first version";

export function InteractiveBoardPreview() {
  const [stage, setStage] = useState(1);

  function advanceTask() {
    setStage((current) => (current + 1) % STAGES.length);
  }

  const nextStage = STAGES[(stage + 1) % STAGES.length].name;

  return (
    <section
      aria-label="Interactive kboards preview"
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11141b] p-3 shadow-[0_32px_90px_rgba(0,0,0,0.45)] sm:p-5"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#49c4e5]/80 to-transparent"
      />
      <div className="mb-5 flex items-center justify-between gap-4 px-1">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--color-dim)]">
            Personal board
          </p>
          <h2 className="mt-1 text-sm font-bold text-white">
            Make this week count
          </h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-semibold text-[var(--color-dim)]">
          Try it
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {STAGES.map((column, columnIndex) => {
          const supportingTask = SUPPORTING_TASKS.find(
            (task) => task.stage === columnIndex,
          );

          return (
            <div
              key={column.name}
              className="min-h-52 rounded-xl bg-white/[0.035] p-2 sm:min-h-64 sm:p-3"
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="truncate text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--color-dim)] sm:text-[0.65rem]">
                  {column.name}
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {stage === columnIndex ? (
                  <button
                    type="button"
                    onClick={advanceTask}
                    aria-label={`Move ${FOCUS_TASK} to ${nextStage}`}
                    className="group min-h-24 rounded-lg border border-[#49c4e5]/40 bg-[#1b2430] p-2 text-left shadow-[0_10px_30px_rgba(73,196,229,0.08)] transition hover:-translate-y-0.5 hover:border-[#49c4e5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49c4e5] sm:p-3"
                  >
                    <span className="block text-[0.68rem] font-semibold leading-snug text-white sm:text-xs">
                      {FOCUS_TASK}
                    </span>
                    <span className="mt-3 flex items-center justify-between gap-1 text-[0.55rem] font-semibold text-[#77d8ee] sm:text-[0.65rem]">
                      Move to {nextStage}
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </span>
                  </button>
                ) : null}

                {supportingTask ? (
                  <div className="min-h-20 rounded-lg border border-white/[0.06] bg-[#191d26] p-2 sm:p-3">
                    <p className="text-[0.62rem] font-medium leading-snug text-[#c4cad5] sm:text-[0.7rem]">
                      {supportingTask.title}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {FOCUS_TASK} is now in {STAGES[stage].name}.
      </p>
      <p className="mt-4 px-1 text-[0.68rem] text-[var(--color-dim)]">
        Click the highlighted task to move it. Every move also has a keyboard and
        screen-reader path in the full app.
      </p>
    </section>
  );
}
