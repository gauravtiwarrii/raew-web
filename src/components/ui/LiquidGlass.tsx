import type { ElementType, HTMLAttributes, ReactNode } from "react";

interface LiquidGlassProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

export default function LiquidGlass({
  as: Component = "div",
  className = "",
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <Component
      {...props}
      className={[
        "liquid-glass",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Component>
  );
}
