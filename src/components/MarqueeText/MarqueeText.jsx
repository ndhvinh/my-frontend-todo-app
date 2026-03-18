import { useEffect, useRef, useState } from "react";

export function MarqueeText({ text }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      setIsOverflow(
        textRef.current.scrollWidth > containerRef.current.clientWidth,
      );
    }
  }, [text]);

  return (
    <span
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap block flex-1 min-w-0"
    >
      <span
        ref={textRef}
        className={`inline-block ${isOverflow ? "hover:animate-[marquee_3s_linear_infinite]" : ""}`}
        style={
          isOverflow
            ? { "--container-width": `${containerRef.current?.clientWidth}px` }
            : {}
        }
      >
        {text}
      </span>
    </span>
  );
}
