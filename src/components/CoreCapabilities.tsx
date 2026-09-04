"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Layout, GitBranch, Database, Check } from "lucide-react";
import { personalInfo } from "@/data/portfolioData";
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

export const CoreCapabilities: React.FC = () => {
  const pillarIcons = [
    <Layout key="fe" className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />,
    <GitBranch key="wf" className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />,
    <Database key="data" className="w-5 h-5 text-maroon-700 dark:text-maroon-400" />,
  ];

  return (
    <section id="capabilities" className="py-20 border-t border-zinc-200/60 dark:border-zinc-800/80">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex items-center justify-between mb-12"
        >
          <motion.div variants={slideUp}>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 tracking-tight">
              Technical Capabilities
            </h2>
            <ScrambleText
              text="CORE PILLARS & ARCHITECTURAL FOCUS"
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
            <span>Core Pillars</span>
          </motion.span>
        </motion.div>

        {/* 3 Pillars Grid with SpotlightCards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalInfo.pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.25, 0.1, 0.25, 1.0] as const }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="h-full"
            >
              <SpotlightCard className="bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between h-full shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(131,40,65,0.06)] dark:hover:shadow-[0_12px_28px_rgba(237,122,148,0.04)] hover:border-maroon-300/50 dark:hover:border-maroon-800/50 transition-all duration-300">
                <div>
                  {/* Icon with maroon-tinted background */}
                  <div className="w-10 h-10 rounded-xl bg-maroon-50 dark:bg-maroon-950/40 border border-maroon-100 dark:border-maroon-900/40 flex items-center justify-center mb-5">
                    {pillarIcons[idx]}
                  </div>

                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed mt-3">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/60">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
                    Applied Competencies
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 px-2 py-0.5 rounded hover:border-maroon-300 dark:hover:border-maroon-700 transition-colors"
                      >
                        <Check className="w-2.5 h-2.5 text-maroon-500/60 dark:text-maroon-400/60" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
};
