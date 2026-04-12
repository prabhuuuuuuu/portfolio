import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "48px",
          background: "#0f0f0f",
          color: "#f5f5f5",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            border: "1px solid #333333",
            borderRadius: "28px",
            padding: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                color: "#2563eb",
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              AI Engineer
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 60,
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
              }}
            >
              <span>Pranav Prashant Shewale</span>
            </div>
            <div style={{ maxWidth: 760, color: "#c8c8c8", fontSize: 28, lineHeight: 1.35 }}>
              Multi-agent workflows, computer vision systems, and edge-ready deployment paths that move from prototype to measurable outcomes.
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {["Projects", "Experience", "Skills", "Contact"].map((item) => (
              <div
                key={item}
                style={{
                  border: "1px solid #333333",
                  borderRadius: 999,
                  padding: "10px 18px",
                  fontSize: 20,
                }}
              >
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
