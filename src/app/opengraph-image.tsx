import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const ACCENT = "#00fc35";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "56px",
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
            padding: "48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: ACCENT,
                fontSize: 20,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              <div style={{ width: 10, height: 10, background: ACCENT }} />
              Physical AI Researcher &amp; Student
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 84,
                fontWeight: 500,
                lineHeight: 0.92,
                letterSpacing: "-0.05em",
              }}
            >
              <span>Pranav Prashant</span>
              <span style={{ color: "#8f8f8a", fontWeight: 300 }}>Shewale</span>
            </div>
            <div style={{ maxWidth: 820, color: "#8f8f8a", fontSize: 28, lineHeight: 1.4 }}>
              Physical AI researcher working on tactile sensing, sim-to-real reinforcement learning, and perception systems for robots.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {["Physical AI", "Reinforcement Learning", "PyTorch", "Computer Vision"].map((item) => (
                <div
                  key={item}
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    padding: "8px 14px",
                    fontSize: 18,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#f2f2f0",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, color: "#55555a", fontSize: 18, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              <span>SIM_TO_REAL:</span>
              <span style={{ color: ACCENT }}>ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
