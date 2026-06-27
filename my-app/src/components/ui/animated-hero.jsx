import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedHeroText() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["grow.", "go viral.", "stand out.", "engage.", "monetize."],
    []
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
    }, 2200);
    return () => clearTimeout(id);
  }, [titleNumber, titles]);

  return (
    <h1 className="max-w-3xl font-display text-5xl font-semibold leading-tight sm:text-6xl">
      Know your numbers.{" "}
      <span className="relative inline-flex h-[1.2em] w-full justify-center overflow-hidden">
        &nbsp;
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute bg-accent-gradient bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -60 }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            animate={
              titleNumber === index
                ? { y: 0, opacity: 1 }
                : { y: titleNumber > index ? -80 : 80, opacity: 0 }
            }
          >
            {title}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
