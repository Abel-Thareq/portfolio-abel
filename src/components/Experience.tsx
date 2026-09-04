"use client";

import React, { useRef } from "react";
import { motion, useScroll, type Variants } from "framer-motion";
import { Briefcase, CheckCircle2 } from "lucide-react";
import { experiences } from "@/data/portfolioData";
import { SpotlightCard } from "./SpotlightCard";
import { NumberTicker } from "./ui/number-ticker";
import { ScrambleText } from "./ui/scramble-text";

const sectionHeaderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

export const Experience: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Real-time GPU-accelerated scroll tracking for the laser timeline beam
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 55%"],
  });

  return (
    <section id="experience" className="py-20 border-t border-zinc-200/60 dark:border-zinc-800/80 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header with Animated Line */}
        <motion.div
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 sm:mb-14"
        >
          <motion.div variants={slideUp}>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 tracking-tight">
              Work Experience
            </h2>
            <ScrambleText
              text="ENGINEERING ROLES & CONTRIBUTIONS"
              speed={25}
              className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1"
            />
            {/* Maroon accent underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] as const }}
              className="h-[2px] w-16 bg-maroon-500/60 dark:bg-maroon-400/50 mt-3 origin-left rounded-full"
            />
          </motion.div>
          <motion.span
            variants={slideUp}
            className="self-start sm:self-auto text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
          >
            <NumberTicker value={experiences.length} padZero />
            <span>Key Track Roles</span>
          </motion.span>
        </motion.div>

        {/* Connected Timeline Container that tracks real scroll position */}
        <div ref={timelineRef} className="relative md:pl-10 space-y-10">
          {/* Timeline Background Track Line */}
          <div className="hidden md:block absolute left-3 top-4 bottom-4 w-[2px] bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full" />

          {/* Glowing Animated Laser Spine (Tracks scroll real-time with 0 lag GPU transforms) */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="hidden md:block absolute left-3 top-4 bottom-4 w-[2px] bg-gradient-to-b from-maroon-800 via-maroon-500 to-rose-400 origin-top rounded-full shadow-[0_0_12px_rgba(224,77,110,0.85)] transform-gpu will-change-transform"
          />

          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative">
              {/* Timeline Node Orb on Track (Pulsing node) */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="hidden md:flex absolute -left-10 top-7 w-7 h-7 rounded-full bg-white dark:bg-[#121215] border-2 border-maroon-600 dark:border-maroon-400 items-center justify-center shadow-md z-20"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-maroon-600 dark:bg-maroon-400 animate-pulse shadow-[0_0_8px_rgba(224,77,110,0.8)]" />
              </motion.div>

              {/* Card Container with Spotlight Hover & In-View Entrance */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 14 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.25, 0.1, 0.25, 1.0] as const }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <SpotlightCard className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(131,40,65,0.06)] dark:hover:shadow-[0_12px_32px_rgba(237,122,148,0.04)] hover:border-maroon-300/50 dark:hover:border-maroon-800/50 transition-all duration-300">
                  {/* Header: Role & Period */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-zinc-100 dark:border-zinc-800/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-maroon-600 dark:text-maroon-400" />
                        <h3 className="text-lg sm:text-xl font-medium text-zinc-900 dark:text-zinc-100">
                          {exp.role}
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mt-1">
                        {exp.company}{" "}
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
                          · {exp.location}
                        </span>
                      </p>
                    </div>

                    <span className="self-start sm:self-auto text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100/80 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
                      {exp.period}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed pt-5">
                    {exp.description}
                  </p>

                  {/* Contributions */}
                  <div className="pt-4 space-y-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                      Key Achievements & Responsibilities
                    </p>
                    <ul className="space-y-2">
                      {exp.contributions.map((c, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: i * 0.06 }}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-maroon-500/70 dark:text-maroon-400/70 flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/60 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">Stack:</span>
                    {exp.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-100/90 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md hover:bg-maroon-50 dark:hover:bg-maroon-950/40 hover:text-maroon-700 dark:hover:text-maroon-300 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
