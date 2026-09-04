"use client";

import React, { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number; // in seconds
  decimalPlaces?: number;
  padZero?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  padZero = false,
  prefix = "",
  suffix = "",
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 35,
    stiffness: 120,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, value, direction, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        let formatted = latest.toFixed(decimalPlaces);
        if (decimalPlaces === 0 && padZero && latest < 10) {
          formatted = String(Math.floor(latest)).padStart(2, "0");
        }
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      }
    });

    return () => unsubscribe();
  }, [springValue, decimalPlaces, padZero, prefix, suffix]);

  // Initial SSR / pre-animation text fallback
  const initialValue = direction === "down" ? value : 0;
  let initialFormatted = initialValue.toFixed(decimalPlaces);
  if (decimalPlaces === 0 && padZero && initialValue < 10) {
    initialFormatted = String(Math.floor(initialValue)).padStart(2, "0");
  }

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums font-mono", className)}
    >
      {prefix}
      {initialFormatted}
      {suffix}
    </span>
  );
}

export default NumberTicker;
