"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeTickerProps {
  items: string[];
  speed?: number; // duration in seconds for full loop
  direction?: "left" | "right";
  className?: string;
  itemClassName?: string;
  separator?: string;
}

export function MarqueeTicker({
  items,
  speed = 35,
  direction = "left",
  className,
  itemClassName,
  separator = "✦",
}: MarqueeTickerProps) {
  // Duplicate array 4 times for seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none py-3.5 border-y border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#0E0E11]/60 backdrop-blur-sm [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
    >
      <motion.div
        className="flex items-center gap-8 whitespace-nowrap will-change-transform transform-gpu"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        whileHover={{
          transition: { duration: speed * 2, ease: "linear", repeat: Infinity },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-8 flex-shrink-0"
          >
            <span
              className={cn(
                "text-xs sm:text-sm font-mono tracking-widest text-zinc-600 dark:text-zinc-400 uppercase",
                itemClassName
              )}
            >
              {item}
            </span>
            <span className="text-[10px] text-maroon-600/70 dark:text-maroon-400/70 select-none">
              {separator}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default MarqueeTicker;
