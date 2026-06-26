export default function BoardLoading() {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <div className="hidden w-64 shrink-0 border-r border-[var(--color-line)] lg:block" />
      <div className="flex flex-1 flex-col">
        <div className="h-[73px] border-b border-[var(--color-line)]" />
        <div
          className="flex gap-6 overflow-hidden px-4 py-6 sm:px-6"
          aria-hidden
        >
          {[0, 1, 2].map((column) => (
            <div key={column} className="flex w-72 shrink-0 flex-col gap-5">
              <div className="h-3 w-24 rounded bg-[var(--color-surface-2)]" />
              <div className="flex flex-col gap-3">
                {[0, 1, 2].map((card) => (
                  <div
                    key={card}
                    className="h-20 animate-pulse rounded-lg bg-[var(--color-surface)]"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <span className="sr-only">Loading board</span>
      </div>
    </div>
  );
}
