"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none">
      <motion.div
        style={{ scaleX }}
        className="h-full w-full bg-gradient-to-r from-maroon-800 via-maroon-500 to-rose-400 dark:from-maroon-600 dark:via-maroon-400 dark:to-rose-300 origin-left shadow-[0_0_12px_rgba(224,77,110,0.7)]"
      />
    </div>
  );
};
