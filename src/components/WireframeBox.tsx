import { ReactNode } from "react";

export function WireframeBox({
  children,
  className = "",
  as: Component = "div",
  ...props
}: {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={`wireframe-box ${className}`}
      style={{
        border: "1.5px solid #1a1a1a",
        borderRadius: "2px 4px 1px 3px",
        boxShadow: "3px 3px 0px rgba(0,0,0,0.1)",
        background: "#ffffff",
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
