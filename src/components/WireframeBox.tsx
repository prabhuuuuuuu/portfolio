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
        border: "1.5px solid var(--ink)",
        borderRadius: "2px 4px 1px 3px",
        boxShadow: "3px 3px 0px rgba(var(--shadow-rgb),0.12)",
        background: "var(--surface)",
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
