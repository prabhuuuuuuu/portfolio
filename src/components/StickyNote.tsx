import { ReactNode } from "react";

export function StickyNote({
  children,
  className = "",
  rotation = -2,
}: {
  children: ReactNode;
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      className={`sticky-note ${className}`}
      style={{
        background: "#fffcd3",
        padding: "16px",
        border: "1px solid rgba(0,0,0,0.1)",
        boxShadow: "2px 3px 5px rgba(0,0,0,0.05)",
        fontFamily: "var(--font-mono)",
        borderRadius: "1px 25px 2px 25px / 1px 2px 1px 2px",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {children}
    </div>
  );
}
