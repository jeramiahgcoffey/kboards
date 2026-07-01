// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { useOverlayEscape, overlayStackSize } from "./overlayStack";

// A bare overlay whose only job is to register an Escape handler while active.
function Overlay({ active, onEscape }: { active: boolean; onEscape: () => void }) {
  useOverlayEscape(active, onEscape);
  return null;
}

describe("overlay stack", () => {
  it("routes Escape to only the topmost active overlay", () => {
    const outer = vi.fn();
    const inner = vi.fn();

    const { rerender } = render(
      <>
        <Overlay active onEscape={outer} />
        <Overlay active={false} onEscape={inner} />
      </>,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(outer).toHaveBeenCalledTimes(1);
    expect(inner).not.toHaveBeenCalled();

    // Open the inner overlay: pushed last, so it is now topmost.
    rerender(
      <>
        <Overlay active onEscape={outer} />
        <Overlay active onEscape={inner} />
      </>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(inner).toHaveBeenCalledTimes(1);
    expect(outer).toHaveBeenCalledTimes(1); // unchanged: no longer topmost

    // Close the inner overlay: Escape falls back to the outer one.
    rerender(
      <>
        <Overlay active onEscape={outer} />
        <Overlay active={false} onEscape={inner} />
      </>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(outer).toHaveBeenCalledTimes(2);
    expect(inner).toHaveBeenCalledTimes(1);
  });

  it("ignores non-Escape keys and drains the stack on unmount", () => {
    const onEscape = vi.fn();
    const { unmount } = render(<Overlay active onEscape={onEscape} />);

    fireEvent.keyDown(document, { key: "Enter" });
    expect(onEscape).not.toHaveBeenCalled();
    expect(overlayStackSize()).toBe(1);

    unmount();
    expect(overlayStackSize()).toBe(0);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEscape).not.toHaveBeenCalled();
  });
});
