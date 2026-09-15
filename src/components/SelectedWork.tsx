"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Plus, ArrowUpRight, ShieldCheck } from "lucide-react";
import { projects, Project, personalInfo } from "@/data/portfolioData";
import { ProjectModal } from "./ProjectModal";
import { NumberTicker } from "./ui/number-ticker";
import { ScrambleText } from "./ui/scramble-text";
import { RollingText } from "./ui/rolling-text";

export const SelectedWork: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Mouse Parallax Physics (Optimized for 120fps smooth scrolling)
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 140, mass: 0.4 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax offsets for different layers
  const bgCardX = useTransform(smoothX, [-0.5, 0.5], [16, -16]);
  const bgCardY = useTransform(smoothY, [-0.5, 0.5], [12, -12]);

  const photoX = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const photoY = useTransform(smoothY, [-0.5, 0.5], [-5, 5]);

  const fgCardX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const fgCardY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const p1 = projects[0]; // SiBMN (Foreground Left)
  const p2 = projects[1]; // PPOB (Foreground Right)
  const p3 = projects[2]; // WSN Data (Background Bottom-Left)
  const p4 = projects[3]; // SIMKAR (Background Top-Right)

  return (
    <section id="work" className="py-24 border-t border-zinc-200/60 dark:border-zinc-800/80 relative overflow-hidden transform-gpu">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
              Selected <span className="text-maroon-700 dark:text-maroon-400">Work</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 font-light mt-1">
              by <span className="font-serif italic text-zinc-800 dark:text-zinc-200 font-medium">{personalInfo.name}</span>
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="h-[2px] w-20 bg-maroon-500/60 dark:bg-maroon-400/50 mt-3 origin-left rounded-full"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-4 sm:mt-0 flex items-center gap-2"
          >
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/90 px-3 py-1.5 rounded-full border border-zinc-200/60 dark:border-zinc-700/60 flex items-center gap-1.5">
              <NumberTicker value={4} padZero />
              <span>Production Projects</span>
            </span>
          </motion.div>
        </motion.div>

        {/* ================= DESKTOP & TABLET: SPATIAL 3D DEPTH CANVAS ================= */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="hidden lg:block relative w-full h-[780px] select-none will-change-transform"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[540px] h-[540px] rounded-full bg-zinc-200/30 dark:bg-zinc-800/20 blur-2xl" />
          </div>

          {/* LAYER 1 (z-5): BACKGROUND CARDS */}
          {/* Card 03: WSN Data Management System */}
          {p3 && (
            <motion.div
              style={{ x: bgCardX, y: bgCardY }}
              className="absolute left-[2%] bottom-[6%] w-[390px] z-[5] will-change-transform transform-gpu"
            >
              <ProjectCardComponent
                project={p3}
                isBackground={true}
                onClick={() => setSelectedProject(p3)}
              />
            </motion.div>
          )}

          {/* Card 04: SIMKAR */}
          {p4 && (
            <motion.div
              style={{ x: bgCardX, y: bgCardY }}
              className="absolute right-[4%] top-[4%] w-[390px] z-[5] will-change-transform transform-gpu"
            >
              <ProjectCardComponent
                project={p4}
                isBackground={true}
                onClick={() => setSelectedProject(p4)}
              />
            </motion.div>
          )}

          {/* LAYER 2 (z-10): CENTER PORTRAIT PHOTO (With Smooth Opacity Fade Out at Bottom) */}
          <motion.div
            style={{ x: photoX, y: photoY }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 will-change-transform transform-gpu"
          >
            <div className="relative w-[480px] h-[680px] [mask-image:linear-gradient(to_bottom,black_60%,rgba(0,0,0,0.8)_75%,transparent_96%)] [-webkit-mask-image:linear-gradient(to_bottom,black_60%,rgba(0,0,0,0.8)_75%,transparent_96%)]">
              <Image
                src="/assets/abel-cutout.webp"
                alt="Abel Thareq"
                fill
                priority
                className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_25px_45px_rgba(0,0,0,0.65)]"
                sizes="(max-width: 1200px) 440px, 480px"
              />
            </div>
          </motion.div>

          {/* LAYER 3 (z-20): FOREGROUND CARDS */}
          {/* Card 01: SiBMN */}
          {p1 && (
            <motion.div
              style={{ x: fgCardX, y: fgCardY }}
              className="absolute left-[10%] top-[12%] w-[420px] z-20 will-change-transform transform-gpu"
            >
              <ProjectCardComponent
                project={p1}
                isBackground={false}
                onClick={() => setSelectedProject(p1)}
              />
            </motion.div>
          )}

          {/* Card 02: PPOB Digital Payment Platform */}
          {p2 && (
            <motion.div
              style={{ x: fgCardX, y: fgCardY }}
              className="absolute right-[8%] bottom-[12%] w-[430px] z-20 will-change-transform transform-gpu"
            >
              <ProjectCardComponent
                project={p2}
                isBackground={false}
                onClick={() => setSelectedProject(p2)}
              />
            </motion.div>
          )}
        </div>

        {/* ================= MOBILE & SMALL TABLET VIEW (< lg) ================= */}
        <div className="block lg:hidden space-y-8">
          <div className="relative w-full max-w-[260px] sm:max-w-[320px] h-[280px] sm:h-[360px] mx-auto mb-6 [mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_65%,transparent_98%)]">
            <Image
              src="/assets/abel-cutout.webp"
              alt="Abel Thareq"
              fill
              priority
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 640px) 260px, 320px"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((proj) => (
              <ProjectCardComponent
                key={proj.id}
                project={proj}
                isBackground={false}
                onClick={() => setSelectedProject(proj)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

function ProjectCardComponent({
  project,
  isBackground,
  onClick,
}: {
  project: Project;
  isBackground: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={`group cursor-pointer rounded-2xl p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between border transform-gpu block ${
        isBackground
          ? "bg-zinc-100 dark:bg-[#141417] border-zinc-200/80 dark:border-zinc-800/90 opacity-90 hover:opacity-100 hover:scale-[1.01] shadow-md hover:shadow-xl"
          : "bg-white dark:bg-[#18181C] border-zinc-200/90 dark:border-zinc-700/80 hover:border-zinc-400 dark:hover:border-zinc-500 shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.45)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_44px_rgba(0,0,0,0.6)] hover:scale-[1.015]"
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <ScrambleText
              text={project.number}
              speed={35}
              className="text-xs font-mono font-medium text-zinc-400 dark:text-zinc-500"
            />
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">
              {project.role}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {project.intellectualProperty && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-maroon-700 dark:text-maroon-400 bg-maroon-50 dark:bg-maroon-950/40 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-2.5 h-2.5" />
                IP 2025
              </span>
            )}
            <span
              className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-maroon-800 group-hover:text-white dark:group-hover:bg-maroon-400 dark:group-hover:text-zinc-950 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition-colors"
              aria-label={`View details of ${project.title}`}
            >
              <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200" />
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="pt-4 pb-2.5">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white">
            {project.title}
          </h3>
          <p className="text-xs font-serif italic text-zinc-500 dark:text-zinc-400 mt-1">
            {project.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed line-clamp-3">
          {project.summary}
        </p>
      </div>

      {/* Technology Tags & Details */}
      <div className="pt-5 mt-5 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 px-2 py-0.5 rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 px-1">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-maroon-700 dark:group-hover:text-maroon-400 transition-colors">
          <RollingText>{project.id === "ppob" ? "Live Demo & Case Study" : "Case Study"}</RollingText>
          <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform" />
        </span>
      </div>
    </Link>
  );
}

export default SelectedWork;
