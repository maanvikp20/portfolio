import { ImageResponse } from "next/og";

// The default 1200x630 share card (used when a page has no cover image).
export function renderOgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0a0a0a",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", fontSize: 104, lineHeight: 1.05 }}>
        Maanvik Poddar
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 38,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        Electrical engineering · hardware + software
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 64,
          fontSize: 28,
          color: "rgba(255,255,255,0.45)",
        }}
      >
        maanvikpoddar.vercel.app
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
