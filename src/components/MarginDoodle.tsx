"use client";
import React, { useEffect, useRef } from "react";
import rough from "roughjs";

export function MarginDoodle({
  type = "circuit",
  className = "",
}: {
  type?: "circuit" | "tensor" | "abstract";
  className?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const rc = rough.svg(svgRef.current);
    while (svgRef.current.firstChild) svgRef.current.removeChild(svgRef.current.firstChild);

    if (type === "circuit") {
      // Small logic gate style doodle
      svgRef.current.appendChild(rc.circle(10, 10, 8, { stroke: "#1a1a1a", strokeWidth: 1 }));
      svgRef.current.appendChild(rc.line(18, 10, 30, 10, { stroke: "#1a1a1a" }));
      svgRef.current.appendChild(rc.rectangle(30, 5, 20, 10, { stroke: "#1a1a1a" }));
    } else if (type === "tensor") {
      // 3x3 grid style doodle
      for(let i=0; i<3; i++) {
        for(let j=0; j<3; j++) {
          svgRef.current.appendChild(rc.rectangle(i*12, j*12, 8, 8, { stroke: "#1a1a1a", strokeWidth: 1 }));
        }
      }
    } else {
       // Abstract squiggles
       svgRef.current.appendChild(rc.curve([[5,5], [15,20], [25,5], [35,20]], { stroke: "#1a1a1a", roughness: 2 }));
    }
  }, [type]);

  return <svg ref={svgRef} width="60" height="40" className={className} aria-hidden="true" />;
}
