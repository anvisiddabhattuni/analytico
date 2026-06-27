import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export function ExpandableTabs({ tabs, value, onChange, activeColor, className }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div className={cn("glass flex items-center gap-0.5 rounded-full p-1", className)}>
      {tabs.map((tab, i) => {
        if (tab.type === "separator") {
          return <div key={`sep-${i}`} className="mx-1 h-5 w-px bg-white/20" />;
        }

        const Icon = tab.icon;
        const isActive = value === tab.key || value === tab.title;
        const isHovered = hovered === i;
        const showLabel = isActive || isHovered;

        return (
          <motion.button
            key={tab.key || tab.title}
            layout
            onClick={() => onChange && onChange(tab, i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-gradient text-ink"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            <AnimatePresence>
              {showLabel && (
                <motion.span
                  key="label"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
