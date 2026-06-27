import React from "react";
import { motion } from "framer-motion";

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.4 + i * 0.025,
  }));

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 696 316"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke={`rgba(249,115,22,${0.04 + path.id * 0.008})`}
          strokeWidth={path.width}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{
            pathLength: 1,
            opacity: [0.3, 0.7, 0.3],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: 18 + (path.id % 7) * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPathsLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
