import { ImageResponse } from "next/og";

// Apple touch icon (home-screen bookmark on iOS). Generated from code so the
// brand mark stays the single source of truth — no separate binary to keep in
// sync. Rendered at 180×180, Apple's recommended size.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 12,
          padding: "44px 30px",
          background: "#0f1115",
        }}
      >
        <div style={{ width: 34, height: 92, borderRadius: 12, background: "#635fc7" }} />
        <div style={{ width: 34, height: 60, borderRadius: 12, background: "#49c4e5" }} />
        <div style={{ width: 34, height: 76, borderRadius: 12, background: "#67e2ae" }} />
      </div>
    ),
    size,
  );
}
