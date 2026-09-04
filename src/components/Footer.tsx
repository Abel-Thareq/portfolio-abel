"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Copy, Check, ArrowUpRight, Mail } from "lucide-react";
import { personalInfo } from "@/data/portfolioData";
import { RollingText } from "./ui/rolling-text";

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
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contact" className="py-24 border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0C0C0E]">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-8"
        >
          {/* Top Logo & Headline */}
          <motion.div variants={slideUp}>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logos/portfolio-logo.png"
                alt="Abel Thareq Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain brightness-0 dark:brightness-100 transition-all"
              />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Get in Touch
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-zinc-900 dark:text-zinc-100 tracking-tight mt-2">
              Let&apos;s build thoughtful{" "}
              <span className="text-maroon-700 dark:text-maroon-400">digital systems.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light max-w-xl mt-3 leading-relaxed">
              Open for software engineering opportunities, information system developments, and data-driven initiatives.
            </p>
            {/* Accent line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="h-[2px] w-20 bg-maroon-500/50 dark:bg-maroon-400/40 mt-5 origin-left rounded-full"
            />
          </motion.div>

          {/* Contact Interaction Bar */}
          <motion.div variants={slideUp} className="flex flex-wrap items-center gap-4 pt-2">
            {/* Direct Mail Link */}
            <motion.a
              href={`mailto:${personalInfo.email}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 text-sm font-medium bg-maroon-800 dark:bg-maroon-400 text-white dark:text-zinc-950 hover:bg-maroon-900 dark:hover:bg-maroon-300 px-5 py-3 rounded-full transition-all shadow-[0_2px_8px_rgba(131,40,65,0.18)] dark:shadow-[0_2px_8px_rgba(237,122,148,0.2)] cursor-pointer"
            >
              <Mail className="w-4 h-4 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform flex-shrink-0" />
              <RollingText>Send an Email</RollingText>
            </motion.a>

            {/* Quick Copy Button */}
            <motion.button
              onClick={handleCopyEmail}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-5 py-3 rounded-full transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-maroon-600 dark:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform flex-shrink-0" />
                  <span className="text-maroon-700 dark:text-maroon-400">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform flex-shrink-0" />
                  <RollingText>{personalInfo.email}</RollingText>
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Secondary Links & Colophon */}
          <motion.div
            variants={slideUp}
            className="pt-12 mt-12 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400 font-light"
          >
            <div className="flex flex-wrap items-center gap-6">
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 hover:text-maroon-700 dark:hover:text-maroon-400 transition-colors cursor-pointer"
              >
                <RollingText>LinkedIn</RollingText>
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform" />
              </a>

              <a
                href={personalInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 hover:text-maroon-700 dark:hover:text-maroon-400 transition-colors cursor-pointer"
              >
                <RollingText>Instagram</RollingText>
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform" />
              </a>

              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 hover:text-maroon-700 dark:hover:text-maroon-400 transition-colors cursor-pointer"
              >
                <RollingText>GitHub</RollingText>
                <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform" />
              </a>
            </div>

            <div className="text-zinc-400 dark:text-zinc-500 font-mono text-[11px]">
              © {new Date().getFullYear()} {personalInfo.name} · Magelang, ID
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
