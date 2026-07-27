import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { InteractiveBoardPreview } from "@/components/landing/InteractiveBoardPreview";
import { Logo } from "@/components/ui/Logo";

const PRINCIPLES = [
  {
    title: "Capture without clutter",
    copy: "Keep ideas in view without turning every thought into a commitment.",
  },
  {
    title: "Choose what moves",
    copy: "A small Today column makes the current promise obvious.",
  },
  {
    title: "Finish accessibly",
    copy: "Pointer, keyboard, and screen-reader users get equivalent ways to move work.",
  },
] as const;

export default async function Home() {
  if (await auth()) redirect("/boards");

  return (
    <div className="landing-shell min-h-dvh">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Logo />
        <Link
          href="/login"
          className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-dim)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          Sign in
        </Link>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-xl">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#77d8ee]">
              Your work, without the workspace
            </p>
            <h1 className="text-balance text-[clamp(3.5rem,8vw,6.8rem)] font-black leading-[0.86] tracking-[-0.075em] text-white">
              Keep the week moving.
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-lg leading-8 text-[var(--color-dim)]">
              A focused personal board for deciding what matters now, moving it
              forward, and seeing what you actually finished.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-hover)] hover:text-[#11131a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              >
                Start a personal board
              </Link>
              <a
                href="#try-the-board"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-line)] px-6 text-sm font-bold text-[var(--color-fg)] transition-colors hover:border-[var(--color-dim)] hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                Try it first
              </a>
            </div>
            <p className="mt-4 text-xs text-[var(--color-dim)]">
              Free to use · No team setup · Built for keyboard access
            </p>
          </div>

          <div id="try-the-board" className="scroll-mt-8">
            <InteractiveBoardPreview />
          </div>
        </section>

        <section className="border-y border-white/[0.07] bg-black/10">
          <div className="mx-auto grid w-full max-w-7xl divide-y divide-white/[0.07] px-5 sm:px-8 lg:grid-cols-3 lg:divide-x lg:divide-y-0 lg:px-10">
            {PRINCIPLES.map((principle, index) => (
              <article
                key={principle.title}
                className="py-8 first:lg:pr-8 lg:px-8 lg:py-10 last:lg:pr-0"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--color-dim)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 text-lg font-bold text-white">
                  {principle.title}
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--color-dim)]">
                  {principle.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#82e7b8]">
            Start with a board that already makes sense
          </p>
          <h2 className="mt-5 text-balance text-4xl font-black tracking-[-0.04em] text-white sm:text-6xl">
            Less setup. More finished.
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[var(--color-dim)]">
            Your first board can open with a calm Backlog → This week → Done
            flow and a few prompts you can edit or delete.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-[#11131a] transition hover:-translate-y-0.5 hover:bg-[#dce0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          >
            Create your board
          </Link>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-t border-white/[0.07] px-5 py-7 text-xs text-[var(--color-dim)] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <span>kboards · A calmer way to track personal work.</span>
        <a
          href="https://github.com/jeramiahgcoffey/kboards"
          className="w-fit font-semibold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          Built in the open on GitHub ↗
        </a>
      </footer>
    </div>
  );
}
