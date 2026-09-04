"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";
import { personalInfo } from "@/data/portfolioData";
import { ScrambleText } from "./ui/scramble-text";

const slideUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 border-t border-zinc-200/60 dark:border-zinc-800/80">
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
              About & Philosophy
            </h2>
            <ScrambleText
              text="ENGINEERING FOUNDATION & STORY"
              speed={25}
              className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="h-[2px] w-16 bg-maroon-500/60 dark:bg-maroon-400/50 mt-3 origin-left rounded-full"
            />
          </motion.div>
          <motion.span
            variants={slideUp}
            className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-200/50 dark:border-zinc-700/50"
          >
            Profile
          </motion.span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Story (2 cols) */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="md:col-span-2 space-y-5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed"
          >
            {personalInfo.aboutStory.map((paragraph, idx) => (
              <motion.p key={idx} variants={slideUp}>{paragraph}</motion.p>
            ))}

            {/* Philosophy formula callout */}
            <motion.div
              variants={slideUp}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="mt-8 p-5 rounded-xl bg-white dark:bg-[#121215] border border-maroon-100/60 dark:border-maroon-900/30 shadow-[0_1px_3px_rgba(131,40,65,0.03)]"
            >
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-maroon-600/80 dark:text-maroon-400/80 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-maroon-600 dark:text-maroon-400" />
                <span>Working Philosophy</span>
              </div>
              <p className="text-base sm:text-lg font-serif italic text-zinc-900 dark:text-zinc-100">
                Technology × Information × Problem Solving
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light mt-1">
                Grounded in tangible engineering outcomes rather than abstract novelty.
              </p>
            </motion.div>
          </motion.div>

          {/* Location & Status Sidebar (1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-6"
          >
            <motion.div
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-white dark:bg-[#121215] border border-zinc-200/80 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(131,40,65,0.04)] dark:hover:shadow-[0_8px_24px_rgba(237,122,148,0.03)] transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-maroon-700 dark:text-maroon-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Engineering Base
                </span>
              </div>

              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {personalInfo.location}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Timezone: {personalInfo.timezone}
              </p>

              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 font-light">
                Open to remote software engineering roles, contract collaborations, and high-impact information system initiatives.
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
