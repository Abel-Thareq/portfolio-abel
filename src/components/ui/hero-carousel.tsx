"use client";

// A full-bleed editorial hero driven by a filmstrip.
//
// Every card shares one top edge. The focused card unfurls to full height while
// its neighbours stay clipped to half, so the strip reads as a row of cropped
// heads with one complete portrait standing in the middle of it. Changing the
// focus re-grades the whole background to that image.
import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { FileDown, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroCarouselItem {
  /** Stable key; falls back to the index. @default undefined */
  id?: string | number;
  /** Full official title of the certificate. Moves horizontally if long. */
  title: string;
  /** Image URL, used both in the card and as the graded background. */
  image: string;
  /** Byline printed beside the headline, e.g. "BY AURELIA STUDIO." @default undefined */
  credit?: string;
  /** Right-aligned facts, e.g. ["SAT NOV 15", "5-10 PM", "MIAMI"]. @default undefined */
  meta?: string[];
  /**
   * CSS colour the background is graded to.
   * @default "#832841"
   */
  accent?: string;
  /** URL for downloading certificate as PDF */
  pdfUrl?: string;
}

export interface HeroCarouselProps {
  /** Slides, in strip order. */
  items: HeroCarouselItem[];
  /** Focused slide when controlled. Leave unset for internal state. @default undefined */
  index?: number;
  /** Focused slide on mount when uncontrolled. @default 0 */
  defaultIndex?: number;
  /** Fires on every focus change, from any input. @default undefined */
  onIndexChange?: (index: number) => void;
  /** Wordmark in the middle of the top bar. @default undefined */
  brand?: React.ReactNode;
  /** Renders the "Back" control when provided. @default undefined */
  onBack?: () => void;
  /** Renders the "Menu" control when provided. @default undefined */
  onMenu?: () => void;
  /** Advance on a timer. Pauses on hover, drag and focus. @default false */
  autoplay?: boolean;
  /** Milliseconds between autoplay steps. @default 4500 */
  autoplayDelay?: number;
  /** Extra classes for the stage. @default undefined */
  className?: string;
}

/* Ratios relative to the stage box - tailored for A4 landscape credentials */
const CARD_H = 0.30; // active card height ÷ stage height
const CARD_AR = 1.38; // active card aspect ratio (landscape certificate proportion)
const GAP = 0.038; // gap ÷ card width
const STRIP_TOP = 0.50; // strip's shared top edge, down the stage
const TITLE = 0.052; // headline cap size ÷ stage height
const LABEL = 0.012; // small mono label ÷ stage height
const PAD = 0.024; // page gutter ÷ stage width
const RAIL = 0.22; // progress rail width ÷ stage width

/** Wheel distance that commits to a step, and the lockout after one. */
const WHEEL_THRESHOLD = 80;
const WHEEL_COOLDOWN = 420;

/* Film grain, self-contained SVG */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/* Horizontal moving title for long certificate names (ping-pong marquee) */
function MarqueeTitle({
  text,
  fontSize,
}: {
  text: string;
  fontSize: number;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLHeadingElement>(null);
  const [overflow, setOverflow] = React.useState(0);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (!containerRef.current || !textRef.current) return;
      const diff = textRef.current.scrollWidth - containerRef.current.clientWidth;
      setOverflow(diff > 6 ? diff : 0);
    };

    const id = setTimeout(checkOverflow, 60);
    window.addEventListener("resize", checkOverflow);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [text, fontSize]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-lg sm:max-w-xl md:max-w-2xl min-w-0 overflow-hidden relative py-1"
      style={{
        maskImage:
          overflow > 0
            ? "linear-gradient(to right, black 0%, black 86%, transparent 100%)"
            : "none",
        WebkitMaskImage:
          overflow > 0
            ? "linear-gradient(to right, black 0%, black 86%, transparent 100%)"
            : "none",
      }}
    >
      <motion.div
        key={`${text}-${overflow}`}
        className="inline-block whitespace-nowrap will-change-transform"
        animate={overflow > 0 ? { x: [0, -overflow - 20] } : { x: 0 }}
        transition={
          overflow > 0
            ? {
                duration: Math.max(5.5, (overflow + 20) / 25),
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2.2,
              }
            : { duration: 0 }
        }
      >
        <h2
          ref={textRef}
          className="font-serif italic font-normal leading-[1.15] tracking-tight text-white pr-6 inline-block select-text"
          style={{ fontSize }}
          title={text}
        >
          {text}
        </h2>
      </motion.div>
    </div>
  );
}

export function HeroCarousel({
  items,
  index: controlled,
  defaultIndex = 0,
  onIndexChange,
  brand,
  onBack,
  onMenu,
  autoplay = false,
  autoplayDelay = 4500,
  className,
}: HeroCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex);
  const [dragging, setDragging] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();

  const last = items.length - 1;
  const index = clamp(controlled ?? uncontrolled, 0, Math.max(0, last));

  const go = React.useCallback(
    (next: number) => {
      const clamped = clamp(next, 0, Math.max(0, last));
      if (controlled === undefined) setUncontrolled(clamped);
      if (clamped !== index) onIndexChange?.(clamped);
    },
    [controlled, index, last, onIndexChange]
  );

  // ResizeObserver for dynamic, responsive geometry
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const read = () =>
      setBox({ w: stage.clientWidth, h: stage.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const fullH = clamp(box.h * CARD_H, 120, 360);
  const halfH = fullH * 0.54;
  const cardW = fullH * CARD_AR;
  const gap = Math.max(8, Math.round(cardW * GAP));
  const step = cardW + gap;
  const pad = Math.max(16, Math.round(box.w * PAD));
  const label = Math.max(9, Math.round(box.h * LABEL));

  // Centre the focused card
  const xFor = React.useCallback(
    (i: number) => box.w / 2 - (i * step + cardW / 2),
    [box.w, step, cardW]
  );
  const x = useMotionValue(0);
  const target = xFor(index);

  const swing = reduced
    ? { duration: 0 }
    : { duration: 0.5, ease: "easeOut" as const };
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.85 };

  React.useEffect(() => {
    if (dragging) return;
    const run = animate(x, target, spring);
    return () => run.stop();
  }, [target, dragging, reduced, x]); // eslint-disable-line react-hooks/exhaustive-deps

  // Horizontal wheel / trackpad support
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let acc = 0;
    let until = 0;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) + 4) {
        e.preventDefault();
        const now = e.timeStamp;
        if (now < until) return;
        acc += e.deltaX;
        if (Math.abs(acc) < WHEEL_THRESHOLD) return;
        go(index + Math.sign(acc));
        acc = 0;
        until = now + WHEEL_COOLDOWN;
      }
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [go, index]);

  React.useEffect(() => {
    if (!autoplay || paused || dragging || items.length < 2) return;
    const id = window.setTimeout(
      () => go(index === last ? 0 : index + 1),
      autoplayDelay
    );
    return () => window.clearTimeout(id);
  }, [autoplay, autoplayDelay, dragging, go, index, items.length, last, paused]);

  const active = items[index];
  if (!active) return null;

  const accent = active.accent ?? "#832841";

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label="Credentials and Certifications"
      onKeyDown={(e) => {
        const keys: Record<string, number> = {
          ArrowLeft: index - 1,
          ArrowRight: index + 1,
          Home: 0,
          End: last,
        };
        if (!(e.key in keys)) return;
        e.preventDefault();
        go(keys[e.key]!);
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative h-full min-h-[34rem] sm:min-h-[38rem] lg:min-h-[42rem] w-full overflow-hidden bg-[#0A0A0C] text-white select-none rounded-3xl border border-zinc-800/80 shadow-2xl transform-gpu will-change-transform",
        "outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-inset",
        className
      )}
    >
      {/* ── Background: Hardware-accelerated smooth backdrop ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 will-change-transform"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={swing}
        >
          <img
            src={active.image}
            alt=""
            aria-hidden
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover opacity-20 transform-gpu"
          />
          {/* Hardware-accelerated color tint */}
          <div
            className="absolute inset-0 transition-colors duration-500 opacity-25"
            style={{ backgroundColor: accent }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/85 to-[#0A0A0C]/60" />
        </motion.div>
      </AnimatePresence>

      {/* Legibility wash + subtle grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 pointer-events-none" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />

      {/* ── Top bar: branding and controls ── */}
      <div
        className="absolute inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10"
        style={{ top: Math.max(20, box.h * 0.04) }}
      >
        <div className="flex items-center gap-2 font-mono uppercase tracking-[0.16em] text-xs text-zinc-400">
          <Award className="w-4 h-4 text-maroon-400" />
          <span>{brand ?? "VERIFIED CREDENTIALS"}</span>
        </div>

        {/* Previous / Next interactive button controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous certificate"
            className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === last}
            aria-label="Next certificate"
            className="w-8 h-8 rounded-full border border-white/20 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white/50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Headline & Details Block ── */}
      <div
        className="absolute inset-x-0 top-0 flex flex-col justify-end z-10 pointer-events-none"
        style={{
          height: `${STRIP_TOP * 100}%`,
          paddingLeft: pad,
          paddingRight: pad,
          paddingBottom: Math.round(box.h * 0.035),
        }}
      >
        <div className="flex w-full flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div className="w-full max-w-xl sm:max-w-2xl min-w-0">
            {active.credit && (
              <motion.p
                key={`credit-${index}`}
                className="font-mono text-xs uppercase tracking-[0.14em] text-maroon-300 font-semibold mb-2"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {active.credit}
              </motion.p>
            )}

            {/* Horizontal Moving Marquee Title for Complete Certificate Names */}
            <MarqueeTitle
              text={active.title}
              fontSize={Math.max(22, Math.round(box.h * TITLE))}
            />

            {/* Interactive "Download as PDF" button */}
            <div className="mt-4 pointer-events-auto">
              <a
                href={active.pdfUrl || active.image}
                download={`${active.title}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                title="Download Certificate as PDF"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wider uppercase transition-all duration-200 bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95 shadow-lg border border-white/40"
              >
                <FileDown className="w-3.5 h-3.5 text-maroon-700" />
                <span>Download as PDF</span>
              </a>
            </div>
          </div>

          {active.meta?.length ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-4 pb-1">
              {active.meta.map((fact, i) => (
                <motion.span
                  key={`${index}-${fact}`}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 + i * 0.04 }}
                >
                  {fact}
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Filmstrip: Landscape Certificate Ratio ── */}
      <div
        className="absolute inset-x-0 z-20"
        style={{ top: `${STRIP_TOP * 100}%`, height: fullH }}
      >
        <motion.div
          className="flex items-start will-change-transform transform-gpu"
          style={{ gap, x, cursor: dragging ? "grabbing" : "grab" }}
          drag="x"
          dragMomentum={false}
          dragElastic={0.08}
          dragConstraints={{ left: xFor(last), right: xFor(0) }}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            const thrown = x.get() + info.velocity.x * 0.12;
            go(Math.round((box.w / 2 - thrown - cardW / 2) / step));
          }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id ?? i}
              type="button"
              aria-label={item.title}
              aria-current={i === index}
              onClick={() => go(i)}
              className="relative shrink-0 overflow-hidden rounded-xl bg-zinc-900 border border-white/10 shadow-lg group focus-visible:ring-2 focus-visible:ring-white will-change-transform transform-gpu"
              style={{ width: cardW }}
              animate={{
                height: i === index ? fullH : halfH,
                scale: i === index ? 1.02 : 0.98,
              }}
              transition={spring}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
              />
              {/* Overlay on unfocused cards */}
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"
                animate={{ opacity: i === index ? 0 : 1 }}
                transition={spring}
              />
              {/* Highlight border on focused card */}
              {i === index && (
                <div className="absolute inset-0 border-2 border-white/80 rounded-xl pointer-events-none shadow-md" />
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ── Position Rail & Navigation Indicator ── */}
      <div
        className="absolute z-20"
        style={{ left: pad, bottom: Math.max(16, box.h * 0.035), width: box.w * RAIL }}
      >
        <div
          className="flex justify-between font-mono tabular-nums text-xs text-zinc-400"
        >
          <span className="text-white font-semibold">{String(index + 1).padStart(2, "0")}</span>
          <span>{String(items.length).padStart(2, "0")} CREDENTIALS</span>
        </div>
        <div className="relative mt-2 h-1 w-full rounded-full bg-white/15 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 bg-gradient-to-r from-maroon-400 to-white rounded-full"
            style={{ width: `${100 / items.length}%` }}
            animate={{ left: `${(index / items.length) * 100}%` }}
            transition={spring}
          />
        </div>
      </div>
    </div>
  );
}

export default HeroCarousel;
