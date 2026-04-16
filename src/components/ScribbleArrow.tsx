"use client";
import React, { useEffect, useRef } from "react";
import rough from "roughjs";

export function ScribbleArrow({
  width = 100,
  height = 50,
  direction = "right",
  className = "",
}: {
  width?: number;
  height?: number;
  direction?: "right" | "down" | "right-down";
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const rc = rough.svg(svgRef.current);

    // clear previous
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // path generator
    let path = "";
    if (direction === "right") {
      path = `M 10 ${height / 2} Q ${width / 2} ${height / 2 - 20} ${width - 15} ${height / 2} M ${width - 25} ${height / 2 - 10} L ${width - 10} ${height / 2 + 2} L ${width - 25} ${height / 2 + 10}`;
    } else if (direction === "down") {
      path = `M ${width / 2} 10 Q ${width / 2 + 10} ${height / 2} ${width / 2} ${height - 15} M ${width / 2 - 10} ${height - 25} L ${width / 2} ${height - 10} L ${width / 2 + 10} ${height - 25}`;
    } else if (direction === "right-down") {
      path = `M 10 10 Q ${width - 15} 15 ${width - 15} ${height - 20} M ${width - 25} ${height - 30} L ${width - 15} ${height - 10} L ${width - 5} ${height - 30}`;
    }

    if (path) {
      const node = rc.path(path, {
        stroke: "#1a1a1a",
        strokeWidth: 2,
        roughness: 1.5,
        bowing: 1,
      });
      svgRef.current.appendChild(node);
    }
  }, [width, height, direction]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={`scribble-arrow ${className}`}
      aria-hidden="true"
    />
  );
}
