"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, Mail, ArrowUpRight, MapPin } from "lucide-react";
import { personalInfo } from "@/data/portfolioData";
import { LanyardWrapper } from "./LanyardWrapper";
import { NumberTicker } from "./ui/number-ticker";
import { ScrambleText } from "./ui/scramble-text";
import { RollingText } from "./ui/rolling-text";

// Dynamic rotating roles requested by user
const dynamicRoles = [
  "a Software Engineer.",
  "a Frontend Developer.",
  "a Data Enthusiast.",
  "a Problem Solver.",
  "a Tech Enthusiast.",
];

// Stagger orchestration variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

const fadeSlideRight: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

export const Hero: React.FC = () => {
  // Snappy responsive typewriter effect
  const [roleIndex, setRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("a Software Engineer.");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const targetRole = dynamicRoles[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && currentText === targetRole) {
      // Completed typing, pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1600);
    } else if (isDeleting && currentText === "") {
      // Completed deleting, move to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % dynamicRoles.length);
    } else {
      // Snappy typing: 55ms, snappy erasing: 28ms
      const speed = isDeleting ? 28 : 55;
      timer = setTimeout(() => {
        setCurrentText((prev) =>
          isDeleting
            ? targetRole.substring(0, prev.length - 1)
            : targetRole.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, isMounted]);

  // Smooth scroll helper for action buttons with navbar offset
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[660px] pt-28 pb-16 md:pt-32 md:pb-20 overflow-visible">
      {/* Full-Screen 3D Interactive Lanyard Layer */}
      <LanyardWrapper />

      <div className="max-w-5xl mx-auto px-6 relative z-20 pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Headline, Bio, Actions (7 Cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 pt-2 pointer-events-auto"
          >
            {/* Availability & Location Badge */}
            <motion.div variants={fadeSlideRight} className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-normal text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 px-3.5 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-500 animate-pulse" />
                <ScrambleText text="Available for work / Collaboration" speed={28} />
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                {personalInfo.location}
              </span>
            </motion.div>

            {/* Main Editorial Headline with Snappy Typewriter Morphing Text */}
            <motion.div variants={fadeSlideUp}>
              <h1 className="text-3xl sm:text-5xl md:text-[54px] font-normal tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.14]">
                Hi, I&apos;m{" "}
                <span className="font-serif italic font-normal text-zinc-950 dark:text-white">
                  {personalInfo.name}
                </span>
                , <br />
                <span className="inline-flex items-baseline font-serif italic font-normal text-maroon-700 dark:text-maroon-400 min-h-[1.22em]">
                  <span>{currentText}</span>
                  <span className="inline-block w-[3px] h-[0.82em] bg-maroon-600 dark:bg-maroon-400 ml-1.5 translate-y-[2px] rounded-full animate-pulse shadow-[0_0_8px_rgba(224,77,110,0.6)]" />
                </span>
              </h1>
            </motion.div>

            {/* Core Grounded Statement */}
            <motion.p
              variants={fadeSlideUp}
              className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-light max-w-xl leading-relaxed"
            >
              {personalInfo.heroStatement}
            </motion.p>

            {/* Domains / Focus Areas */}
            <motion.div
              variants={fadeSlideUp}
              className="pt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono"
            >
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300">
                Frontend Engineering
              </span>
              <span className="text-maroon-300 dark:text-maroon-600">/</span>
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300">
                Information Systems
              </span>
              <span className="text-maroon-300 dark:text-maroon-600">/</span>
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-zinc-700 dark:text-zinc-300">
                Data & Workflows
              </span>
            </motion.div>

            {/* Action CTAs with Interactive Rolling Icons & Rolling Text */}
            <motion.div
              variants={fadeSlideUp}
              className="pt-2 flex flex-wrap items-center gap-3.5 relative z-20 pointer-events-auto"
            >
              <motion.a
                href="#work"
                onClick={(e) => handleScrollTo(e, "work")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 text-sm font-medium bg-maroon-800 dark:bg-maroon-400 text-white dark:text-zinc-950 hover:bg-maroon-900 dark:hover:bg-maroon-300 px-5 py-2.5 rounded-full transition-all shadow-[0_2px_8px_rgba(131,40,65,0.18)] dark:shadow-[0_2px_8px_rgba(237,122,148,0.2)] pointer-events-auto cursor-pointer"
              >
                <RollingText>View Selected Work</RollingText>
                <ArrowDown className="w-3.5 h-3.5 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform flex-shrink-0" />
              </motion.a>

              <motion.a
                href="#contact"
                onClick={(e) => handleScrollTo(e, "contact")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 rounded-full transition-all pointer-events-auto cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform flex-shrink-0" />
                <RollingText>Get in Touch</RollingText>
              </motion.a>

              <a
                href={personalInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-maroon-400 px-3 py-2 transition-colors ml-auto sm:ml-0 pointer-events-auto cursor-pointer"
              >
                <RollingText>Instagram</RollingText>
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform" />
              </a>
            </motion.div>

            {/* Quick Metrics Strip with Rolling Number Counters (3 Authentic Cards) */}
            <motion.div
              variants={fadeSlideUp}
              className="pt-4 grid grid-cols-3 gap-3 max-w-lg"
            >
              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xs shadow-xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 flex items-center">
                  <NumberTicker value={4} padZero suffix="+" delay={0.2} />
                </div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Key Projects
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xs shadow-xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 flex items-center">
                  <NumberTicker value={20} delay={0.3} />
                </div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Certif & IP
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 backdrop-blur-xs shadow-xs">
                <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 flex items-center">
                  <NumberTicker value={3.55} decimalPlaces={2} delay={0.4} />
                </div>
                <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Scholastic GPA
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Spacer to reserve natural visual width (5 Cols) */}
          <div className="hidden lg:block lg:col-span-5 h-[420px] pointer-events-none" />
        </div>
      </div>
    </section>
  );
};
