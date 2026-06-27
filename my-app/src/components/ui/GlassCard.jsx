import React from "react";

export default function GlassCard({ children, className = "", as: Component = "div", ...props }) {
  return (
    <Component
      className={`glass rounded-3xl shadow-xl shadow-black/30 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
