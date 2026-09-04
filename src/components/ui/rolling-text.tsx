"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RollingTextProps {
  children: string;
  className?: string;
  containerClassName?: string;
}

/**
 * Editorial Rolling Text component.
 * On parent group hover, the text smoothly rolls upward and is replaced by a twin copy.
 */
export function RollingText({
  children,
  className,
  containerClassName,
}: RollingTextProps) {
  return (
    <span
      className={cn(
        "relative inline-flex flex-col overflow-hidden h-[1.28em] leading-[1.28em] select-none",
        containerClassName
      )}
    >
      <span
        className={cn(
          "inline-block transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full will-change-transform",
          className
        )}
      >
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute top-full left-0 inline-block transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-full will-change-transform",
          className
        )}
      >
        {children}
      </span>
    </span>
  );
}

export default RollingText;
