"use client";

import * as React from "react";

/* ----------------------------------------------------------------
 * ScrollReelTestimonials
 *
 * Counter-rotating scroll reel + per-character text rise.
 * The middle column is a real vertical list of portraits that
 * translates by one "pitch" per step; the outer columns counter-
 * rotate the opposite way. Text animates in character-by-character
 * with a stagger; the old block exits as a whole before the new
 * characters rise in sequence.
 * ---------------------------------------------------------------- */

export interface ScrollReelTestimonial {
  /** The quote text */
  quote: string;
  /** Author name shown below the quote */
  author: string;
  /** Role, title, or organization (optional) */
  role?: string;
  /** Portrait image URL for the featured tile (optional) */
  image?: string;
  /** Initial letter/alphabet avatar to display when portrait photo is not provided */
  initial?: string;
  /** Optional alt text for the portrait */
  alt?: string;
}

export interface ScrollReelTestimonialsProps {
  /** Testimonials to cycle through (one featured tile is generated per entry) */
  testimonials: ScrollReelTestimonial[];
  /** Per-character stagger in ms (default 6) */
  charStaggerMs?: number;
  /** Extra classes for the outer container */
  className?: string;
}

/* Geometry — middle column pitch between portrait centers:
 * 3 * (cell 121.33px + gap 8px) = 388px */
const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240; // old text removed / new text mounted
const SLIDE_MS = 800; // column slide duration + interaction lock

const EASE_INOUT = "cubic-bezier(0.65,0,0.35,1)";

const QUOTE_CLASSES =
  "m-0 text-base sm:text-lg lg:text-[20px] font-medium leading-[1.35] tracking-[-0.015em] text-foreground";
const AUTHOR_CLASSES =
  "m-0 text-sm font-semibold leading-[1.3] text-foreground";
const ROLE_CLASSES =
  "m-0 text-xs text-maroon-700 dark:text-maroon-400 font-medium leading-[1.3]";

const FEATURED_SHADOW =
  "0 1.008px 0.705px -0.563px rgba(0,0,0,0.18), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.17), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.17), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.16), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.15), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.13), 0 32.972px 23.08px -3.938px rgba(0,0,0,0.09), 0 60px 42px -4.5px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.6)";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/* Blurred placeholder cell */
function Cell({ initial }: { initial?: string }) {
  return (
    <div
      aria-hidden="true"
      className="shrink-0 rounded-xl border border-border bg-gradient-to-b from-secondary to-card blur-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_2px_0_rgba(255,255,255,1)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center"
      style={{ width: CELL, height: CELL }}
    >
      {initial && (
        <span className="text-2xl font-serif italic text-muted-foreground/20 font-bold select-none">
          {initial}
        </span>
      )}
    </div>
  );
}

/* Featured portrait tile with alphabet initial or image + sheen overlays */
function Featured({
  src,
  alt,
  initial,
}: {
  src?: string;
  alt?: string;
  initial?: string;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-xl bg-muted dark:ring-1 dark:ring-white/10 flex items-center justify-center"
      style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-[#18181B] border border-border/80 select-none">
          <span className="font-serif italic text-4xl sm:text-5xl font-bold text-maroon-800 dark:text-maroon-300 drop-shadow-sm">
            {initial}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 dark:text-zinc-400 uppercase mt-0.5 font-medium">
            ENDORSED
          </span>
        </div>
      )}

      {/* desaturate via saturation blend */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-white mix-blend-saturation opacity-25"
      />
      {/* diagonal gradient sheen with refined editorial maroon hue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] blur-[6px] mix-blend-overlay"
        style={{
          background:
            "linear-gradient(220.99deg, rgba(131,40,65,0) 32%, rgba(168,40,71,0.5) 41%, rgba(237,122,148,0.45) 47%, rgba(130,189,237,0.3) 54%, rgba(130,189,237,0) 65%)",
        }}
      />
    </div>
  );
}

/* Per-character split */
function Chars({
  text,
  startIndex,
  staggerMs,
}: {
  text: string;
  startIndex: number;
  staggerMs: number;
}) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const wordSpan = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span
                  key={ci}
                  className="scroll-reel-char"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </>
  );
}

export function ScrollReelTestimonials({
  testimonials,
  charStaggerMs = 6,
  className,
}: ScrollReelTestimonialsProps) {
  const [index, setIndex] = React.useState(0);
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [exiting, setExiting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const animating = React.useRef(false);
  const timeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const count = testimonials.length;

  React.useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setMounted(true))
    );
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const paginate = React.useCallback(
    (dir: 1 | -1) => {
      if (animating.current) return;
      const next = index + dir;
      if (next < 0 || next >= count) return;
      animating.current = true;

      setIndex(next);
      setExiting(true);

      timeouts.current.push(
        setTimeout(() => {
          setDisplayIndex(next);
          setExiting(false);
        }, EXIT_MS)
      );
      timeouts.current.push(
        setTimeout(() => {
          animating.current = false;
        }, SLIDE_MS)
      );
    },
    [index, count]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  };

  /* Middle column: 3 leading cells, then featured + 2 cells between each testimonial, then 3 trailing cells */
  const middleItems = React.useMemo(() => {
    const items: Array<{ type: "cell" } | { type: "featured"; i: number }> = [];
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    testimonials.forEach((_, i) => {
      items.push({ type: "featured", i });
      if (i < count - 1) {
        items.push({ type: "cell" }, { type: "cell" });
      }
    });
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): React.CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE_INOUT}` : "none",
  });

  const current = testimonials[displayIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={cn(
        "relative flex w-full max-w-[1060px] flex-col items-stretch gap-2.5 overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.03),inset_0_2px_0_rgba(255,255,255,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-[340px] md:flex-row",
        "dark:shadow-[0_4px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]",
        className
      )}
    >
      {/* Reel section */}
      <div
        aria-hidden="true"
        className="relative h-64 w-full shrink-0 self-stretch overflow-hidden md:h-auto md:w-[380px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          {/* Left column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell
                key={i}
                initial={
                  testimonials[i % count]?.initial ||
                  testimonials[i % count]?.author.trim().charAt(0).toUpperCase()
                }
              />
            ))}
          </div>

          {/* Middle column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(middleY)}
          >
            {middleItems.map((item, i) =>
              item.type === "featured" ? (
                <Featured
                  key={i}
                  src={testimonials[item.i].image}
                  alt={testimonials[item.i].alt}
                  initial={
                    testimonials[item.i].initial ||
                    testimonials[item.i].author.trim().charAt(0).toUpperCase()
                  }
                />
              ) : (
                <Cell key={i} />
              )
            )}
          </div>

          {/* Right column */}
          <div
            className="flex shrink-0 flex-col gap-2 will-change-transform motion-reduce:[transition:none!important]"
            style={colStyle(sideY)}
          >
            {Array.from({ length: sideCellCount }).map((_, i) => (
              <Cell
                key={i}
                initial={
                  testimonials[(i + 1) % count]?.initial ||
                  testimonials[(i + 1) % count]?.author.trim().charAt(0).toUpperCase()
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch p-6 sm:p-8 md:py-10 md:pr-10">
        <div className="flex flex-col gap-4">
          <svg
            className="block h-10 w-10 text-maroon-700/30 dark:text-maroon-400/30"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
          </svg>

          {/* Text stage */}
          <div
            className="relative w-full max-w-[480px] overflow-hidden"
            aria-live="polite"
          >
            {/* Invisible in-flow copy sizes the stage to the current
              * quote at any viewport width, so wrapped text never clips. */}
            <div
              aria-hidden="true"
              className="invisible flex min-h-[140px] flex-col gap-3.5"
            >
              <p className={QUOTE_CLASSES}>{current.quote}</p>
              <div>
                <p className={AUTHOR_CLASSES}>{current.author}</p>
                {current.role && <p className={ROLE_CLASSES}>{current.role}</p>}
              </div>
            </div>
            <div
              key={displayIndex}
              className={cn(
                "absolute inset-x-0 top-0 flex flex-col gap-3.5 will-change-[transform,opacity]",
                exiting && "scroll-reel-exit"
              )}
            >
              <p className={QUOTE_CLASSES}>
                <Chars
                  text={current.quote}
                  startIndex={0}
                  staggerMs={charStaggerMs}
                />
              </p>
              <div>
                <p className={AUTHOR_CLASSES}>
                  <Chars
                    text={current.author}
                    startIndex={current.quote.length + 4}
                    staggerMs={charStaggerMs}
                  />
                </p>
                {current.role && (
                  <p className={ROLE_CLASSES}>
                    <Chars
                      text={current.role}
                      startIndex={current.quote.length + current.author.length + 8}
                      staggerMs={charStaggerMs}
                    />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Pagination Indicator */}
        <div className="mt-8 flex items-center justify-between border-t border-zinc-200/60 dark:border-zinc-800/80 pt-4 md:mt-0">
          <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {String(displayIndex + 1).padStart(2, "0")}
            </span>
            <span>/</span>
            <span>{String(count).padStart(2, "0")}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => paginate(-1)}
              disabled={index === 0}
              aria-label="Previous testimonial"
              className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 hover:enabled:scale-[1.08] hover:enabled:border-maroon-500 hover:enabled:text-maroon-700 dark:hover:enabled:text-maroon-400 active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7.5 2.5 3.5 6l4 3.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              disabled={index === count - 1}
              aria-label="Next testimonial"
              className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-all duration-200 hover:enabled:scale-[1.08] hover:enabled:border-maroon-500 hover:enabled:text-maroon-700 dark:hover:enabled:text-maroon-400 active:enabled:scale-[0.94] disabled:cursor-default disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-sm"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m4.5 2.5 4 3.5-4 3.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScrollReelTestimonials;
