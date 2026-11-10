import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

const ACCENT = "#00fc35";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "48px",
          background: "#050505",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          color: "#f2f2f0",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid rgba(255,255,255,0.18)",
            padding: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: ACCENT,
                fontSize: 18,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              <div style={{ width: 9, height: 9, background: ACCENT }} />
              Physical AI Researcher
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 500,
                lineHeight: 0.95,
                letterSpacing: "-0.05em",
              }}
            >
              <span>Pranav Prashant Shewale</span>
            </div>
            <div style={{ maxWidth: 780, color: "#8f8f8a", fontSize: 26, lineHeight: 1.4 }}>
              Tactile sensing, sim-to-real reinforcement learning, and perception systems for robots that have to act in the real world.
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {["Projects", "Experience", "Skills", "Contact"].map((item, i) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  border: "1px solid rgba(255,255,255,0.18)",
                  padding: "8px 14px",
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ color: "#55555a" }}>0{i + 1}.</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
