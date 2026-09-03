"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, ShieldCheck, Layers, Terminal } from "lucide-react";
import { Project } from "@/data/portfolioData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!mounted || !project) return null;

  // Render directly into document.body using Portal to escape parent section transforms
  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
        {/* Full Screen Backdrop (Covers 100% of viewport including navbar) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#121215] border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-10 flex flex-col max-h-[82vh] sm:max-h-[85vh] overflow-hidden my-auto"
        >
          {/* 1. PINNED HEADER */}
          <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#121215] flex-shrink-0 z-20">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500">
                  PROJECT {project.number}
                </span>
                {project.isAcademic && (
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 px-2 py-0.5 rounded-full">
                    Academic Research
                  </span>
                )}
                {project.intellectualProperty && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Copyright 2025
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                {project.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-serif italic mt-0.5">
                {project.subtitle}
              </p>
            </div>

            {/* Prominent Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0 ml-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. SCROLLABLE BODY CONTENT */}
          <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6 overscroll-contain">
            {/* Metadata Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase font-mono tracking-wider">
                  Role
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {project.role}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 uppercase font-mono tracking-wider">
                  Focus Domain
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {project.category}
                </p>
              </div>
            </div>

            {/* Problem & Context */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-semibold">
                Context & Problem
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-light">
                {project.problem}
              </p>
            </div>

            {/* Engineering Contributions */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-semibold">
                Engineering Contributions
              </h3>
              <ul className="space-y-2.5">
                {project.contributions.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-light">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key System Capabilities */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-semibold">
                Key System Capabilities
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {project.keyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50/90 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 px-3.5 py-2.5 rounded-lg font-mono"
                  >
                    <Layers className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 font-semibold">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md"
                  >
                    <Terminal className="w-3 h-3 text-zinc-400" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 3. PINNED FOOTER */}
          <div className="p-4 px-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/90 dark:bg-[#151518] flex items-center justify-between flex-shrink-0 z-20">
            <span className="text-xs text-zinc-400 font-mono">
              Press <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-[10px]">ESC</kbd> or click backdrop to close
            </span>
            <button
              onClick={onClose}
              className="text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white px-4 py-2 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
