import { useRef, useImperativeHandle, forwardRef } from "react";

export const ScrollContainer = forwardRef(function ScrollContainer(
  { children, className = "", visible = true, ...restProps },
  ref,
) {
  const scrollRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    },
  }));

  return (
    <div
      ref={scrollRef}
      {...restProps}
      className={`overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-brand/50 scrollbar-track-transparent transition-all duration-500 ease-in-out ${visible ? "flex-1 min-h-0 opacity-100" : "max-h-0 opacity-0 overflow-hidden"} ${className}`}
    >
      {children}
    </div>
  );
});
