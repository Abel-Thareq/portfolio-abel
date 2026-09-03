"use client";

import React from "react";

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Top Right Maroon Ambient Glow (Static pure CSS layer - 0% CPU on scroll) */}
      <div className="absolute -top-[120px] right-[-60px] sm:right-[5%] w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full bg-gradient-to-br from-maroon-400/20 via-maroon-600/10 to-transparent dark:from-maroon-700/20 dark:via-maroon-950/15 dark:to-transparent blur-3xl transform-gpu" />

      {/* Bottom Left Subtle Rose Ambient Glow */}
      <div className="absolute top-[48%] -left-[120px] sm:left-[2%] w-[400px] sm:w-[520px] h-[400px] sm:h-[520px] rounded-full bg-gradient-to-tr from-rose-400/15 via-maroon-500/10 to-transparent dark:from-maroon-800/15 dark:via-zinc-900/20 dark:to-transparent blur-3xl transform-gpu" />
    </div>
  );
};
