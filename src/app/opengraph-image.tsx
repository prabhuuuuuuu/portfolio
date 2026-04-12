import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "#ffffff",
          color: "#111111",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid #e5e5e5",
            borderRadius: "32px",
            padding: "48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                color: "#2563eb",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Edge-minimal portfolio
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
              }}
            >
              <span>Pranav Prashant</span>
              <span>Shewale</span>
            </div>
            <div style={{ maxWidth: 820, color: "#525252", fontSize: 30, lineHeight: 1.35 }}>
              AI engineer building multi-agent systems, computer vision products, and edge-ready deployments.
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "14px" }}>
              {["LangGraph", "FastAPI", "Ollama", "Computer Vision"].map((item) => (
                <div
                  key={item}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 999,
                    padding: "10px 18px",
                    fontSize: 22,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
            <div style={{ color: "#2563eb", fontSize: 24, fontWeight: 700 }}>Portfolio preview</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
