"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, type Variants } from "framer-motion";
import { GraduationCap, CheckCircle2, Award } from "lucide-react";
import { educations } from "@/data/portfolioData";
import { SpotlightCard } from "./SpotlightCard";
import { NumberTicker } from "./ui/number-ticker";
import { ScrambleText } from "./ui/scramble-text";

const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

export const Education: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Real-time GPU-accelerated scroll tracking for the education milestone timeline
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 55%"],
  });

  return (
    <section id="education" className="py-20 border-t border-zinc-200/60 dark:border-zinc-800/80 relative">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex items-center justify-between mb-14"
        >
          <motion.div variants={slideUp}>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 tracking-tight">
              Academic Background
            </h2>
            <ScrambleText
              text="FORMAL EDUCATION & SCHOLASTIC ACHIEVEMENTS"
              speed={25}
              className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1"
            />
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
            className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50 flex items-center gap-1.5"
          >
            <NumberTicker value={3} padZero />
            <span>Academic Milestones</span>
          </motion.span>
        </motion.div>

        {/* Education Timeline with Real-Time Laser Spine */}
        <div ref={timelineRef} className="relative md:pl-10 space-y-8">
          {/* Timeline Background Track Line */}
          <div className="hidden md:block absolute left-3 top-4 bottom-4 w-[2px] bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full" />

          {/* Glowing Animated Laser Spine (Tracks scroll real-time with 0 lag GPU transforms) */}
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="hidden md:block absolute left-3 top-4 bottom-4 w-[2px] bg-gradient-to-b from-maroon-800 via-maroon-500 to-rose-400 origin-top rounded-full shadow-[0_0_12px_rgba(224,77,110,0.85)] transform-gpu will-change-transform"
          />

          {educations.map((edu, idx) => (
            <div key={edu.id} className="relative">
              {/* Timeline Node Milestone Orb */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="hidden md:flex absolute -left-10 top-7 w-7 h-7 rounded-full bg-white dark:bg-[#121215] border-2 border-maroon-600 dark:border-maroon-400 items-center justify-center shadow-md z-20"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-maroon-600 dark:bg-maroon-400 animate-pulse shadow-[0_0_8px_rgba(224,77,110,0.8)]" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: 14 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.25, 0.1, 0.25, 1.0] as const }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <SpotlightCard className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(131,40,65,0.06)] dark:hover:shadow-[0_12px_32px_rgba(237,122,148,0.04)] hover:border-maroon-300/50 dark:hover:border-maroon-800/50 transition-all duration-300">
                  {/* Top Row: Logo + Degree + Period & Grade */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center gap-3.5">
                      {/* Institution Logo */}
                      <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200/70 dark:border-zinc-700/70 flex items-center justify-center p-1.5 flex-shrink-0">
                        <Image
                          src={edu.logo}
                          alt={`${edu.institution} Logo`}
                          width={40}
                          height={40}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-medium text-zinc-900 dark:text-zinc-100">
                            {edu.institution}
                          </h3>
                          <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 font-normal">
                            ({edu.abbreviation})
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {edu.degree}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {edu.grade && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-maroon-800 dark:text-maroon-300 bg-maroon-50 dark:bg-maroon-950/40 border border-maroon-200/60 dark:border-maroon-800/60 px-2.5 py-1 rounded-full">
                          <Award className="w-3 h-3" />
                          <span>Grade:</span>
                          {edu.grade.includes("3.92") ? (
                            <span className="inline-flex items-center">
                              <NumberTicker value={3.92} decimalPlaces={2} />
                              <span>&nbsp;/ 4.00</span>
                            </span>
                          ) : (
                            <span>{edu.grade}</span>
                          )}
                        </span>
                      )}
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
                        {edu.period}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed pt-4">
                    {edu.description}
                  </p>

                  {/* Highlights */}
                  <div className="pt-4 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {edu.highlights.map((highlight, hIdx) => (
                        <motion.div
                          key={hIdx}
                          initial={{ opacity: 0, x: -6 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: hIdx * 0.05 }}
                          className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 px-3 py-2 rounded-lg"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-maroon-500/60 dark:text-maroon-400/60 flex-shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
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
