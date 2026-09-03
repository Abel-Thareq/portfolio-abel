"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleButtonProps {
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  className = "",
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center opacity-0 ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  // Fast, lag-free theme toggle without heavy full-screen View Transition GPU rasterization
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleTheme}
      className={`relative flex items-center justify-center overflow-hidden transition-colors ${className}`}
      aria-label="Toggle Theme"
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -70, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 70, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Sun className="w-3.5 h-3.5 text-amber-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 70, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -70, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Moon className="w-3.5 h-3.5 text-zinc-700" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
