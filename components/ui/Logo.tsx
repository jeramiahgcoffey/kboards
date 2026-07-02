// The kboards brand mark: three rounded columns of varying height, evoking a
// kanban board's columns at different fill levels. Kept as inline SVG (not an
// <img>) so it inherits crisp rendering at any size and needs no network fetch.
// The same three-column glyph is reused for the favicon, apple-touch icon, and
// social image so the brand reads consistently across surfaces.
export function LogoMark({
  className,
  title,
}: {
  className?: string;
  // When set, the mark is announced to assistive tech; omit it where an adjacent
  // "kboards" wordmark already names the brand, so it stays decorative.
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect x="4" y="6" width="7" height="20" rx="2.5" fill="#635fc7" />
      <rect x="12.5" y="6" width="7" height="13" rx="2.5" fill="#49c4e5" />
      <rect x="21" y="6" width="7" height="16" rx="2.5" fill="#67e2ae" />
    </svg>
  );
}

// The mark paired with the wordmark, used in the landing hero and app header.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-7 w-7" />
      <span className="text-xl font-bold tracking-tight text-[var(--color-fg)]">
        kboards
      </span>
    </span>
  );
}
