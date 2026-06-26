// Columns store a color, but seeded/default columns use the sentinel "default".
// Map a stored value to a CSS color for the decorative column dot: honor an
// explicit hex, otherwise spread columns across a fixed palette by position so
// adjacent columns stay visually distinct.
const PALETTE = [
  "#49c4e5",
  "#8471f2",
  "#67e2ae",
  "#e5a449",
  "#e54949",
  "#9c6ade",
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function columnAccent(color: string, index: number): string {
  if (HEX.test(color)) return color;
  return PALETTE[index % PALETTE.length];
}
