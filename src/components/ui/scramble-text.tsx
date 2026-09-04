"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@*&%$§";

interface ScrambleTextProps {
  text: string;
  duration?: number; // total duration in seconds
  speed?: number; // ms per frame
  scrambleOnHover?: boolean;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}

export function ScrambleText({
  text,
  duration = 0.8,
  speed = 30,
  scrambleOnHover = true,
  className,
  as: Component = "span",
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const hasAnimatedRef = useRef(false);

  const startScramble = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const length = text.length;
    const totalFrames = Math.max(12, Math.round((duration * 1000) / speed));
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const revealIndex = Math.floor(progress * length);

      let scrambled = "";
      for (let i = 0; i < length; i++) {
        if (text[i] === " " || text[i] === "\n" || text[i] === "/" || text[i] === "·" || text[i] === "—") {
          scrambled += text[i];
        } else if (i < revealIndex) {
          scrambled += text[i];
        } else {
          scrambled += DEFAULT_CHARS[Math.floor(Math.random() * DEFAULT_CHARS.length)];
        }
      }

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
        setIsAnimating(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (isInView && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      startScramble();
    }
  }, [isInView]);

  return (
    <Component
      ref={ref as any}
      onMouseEnter={() => {
        if (scrambleOnHover && !isAnimating) {
          startScramble();
        }
      }}
      className={cn("font-mono cursor-default inline-block tracking-tight", className)}
    >
      {displayText}
    </Component>
  );
}

export default ScrambleText;
