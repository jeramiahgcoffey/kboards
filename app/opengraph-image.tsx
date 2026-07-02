import { ImageResponse } from "next/og";

// Social share image (Open Graph + Twitter). Generated from code so it never
// drifts from the brand mark and needs no committed binary. Next wires this into
// og:image / twitter:image automatically via the file convention.
export const alt = "kboards — a kanban board for tracking work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "96px",
          background:
            "linear-gradient(135deg, #0f1115 0%, #171a21 55%, #1f2430 100%)",
          color: "#e7eaf0",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
          <div style={{ width: 56, height: 150, borderRadius: 18, background: "#635fc7" }} />
          <div style={{ width: 56, height: 98, borderRadius: 18, background: "#49c4e5" }} />
          <div style={{ width: 56, height: 124, borderRadius: 18, background: "#67e2ae" }} />
        </div>
        <div
          style={{
            marginTop: 56,
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          kboards
        </div>
        <div style={{ marginTop: 12, fontSize: 40, color: "#9aa3b2" }}>
          A kanban board for tracking work.
        </div>
      </div>
    ),
    size,
  );
}
