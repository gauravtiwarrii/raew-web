import type { HTMLAttributes, ReactNode } from "react";

export default function LiquidGlassPanel({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={`liquid-panel ${className}`} {...props}><span className="liquid-highlight" aria-hidden="true" />{children}</div>;
}
