import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { projects, personalInfo } from "@/data/portfolioData";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { RollingText } from "@/components/ui/rolling-text";
import { PpobLiveSimulator } from "@/components/projects/ppob/PpobLiveSimulator";
import { PpobCaseStudyContent } from "@/components/projects/ppob/PpobCaseStudyContent";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Calendar,
  Layers,
  Sparkles,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);

  if (!project) {
    return {
      title: "Project Not Found | Abel Thareq",
    };
  }

  return {
    title: `${project.title} — Case Study & Interactive Demo | Abel Thareq`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Abel Thareq`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((p) => p.id === slug);

  if (projectIndex === -1) {
    notFound();
  }

  const project = projects[projectIndex];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const isPpob = project.id === "ppob";

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0C0C0E] text-zinc-900 dark:text-zinc-100 transition-colors selection:bg-[#832841] selection:text-white pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-[#FAFAF9]/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-maroon-700 dark:hover:text-maroon-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <RollingText>Back to Selected Work</RollingText>
          </Link>

          <div className="flex items-center gap-3">
            {isPpob && (
              <a
                href="https://github.com/Abel-Thareq/PPOB-FIX-Latest-13Oct"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5 text-[#ED1C24]" />
                <span>GitHub Repo</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            )}

            <div className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-900">
              <ThemeToggleButton className="w-full h-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 pt-12">
        {/* Project Header & Metadata */}
        <section className="space-y-6 pb-12 border-b border-zinc-200/80 dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              PROJECT {project.number}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {project.category}
            </span>
            {isPpob && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Zero-Backend Interactive Demo
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.12]">
            {project.title}
            <span className="block font-serif italic text-2xl sm:text-4xl text-maroon-700 dark:text-maroon-400 mt-2">
              {project.subtitle}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light max-w-3xl leading-relaxed">
            {project.summary}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
            <div>
              <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                My Role
              </div>
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                {project.role}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                Stack & Tools
              </div>
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                {project.technologies.slice(0, 3).join(", ")}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                Platform
              </div>
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                {isPpob ? "Mobile (Android / iOS)" : "Web Application"}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 uppercase">
                Codebase
              </div>
              <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-1">
                {isPpob ? "Flutter / Dart" : "React / TypeScript"}
              </div>
            </div>
          </div>
        </section>

        {/* PPOB Interactive Demo & Case Study */}
        {isPpob ? (
          <div className="py-12 space-y-16">
            {/* Interactive Simulator Section */}
            <section className="space-y-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="text-xs font-mono font-medium text-[#ED1C24] uppercase tracking-wider">
                  Interactive Live Demo
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100">
                  Try the Live Mobile Application
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-light">
                  Directly interact with Abel&apos;s frontend below. Buy Pulsa, purchase PLN tokens, or top up your balance. Runs 100% in your browser with zero backend server required!
                </p>
              </div>

              {/* Centered Mobile Device Simulator */}
              <div className="flex justify-center pt-4">
                <PpobLiveSimulator />
              </div>
            </section>

            {/* In-depth Editorial Case Study Content */}
            <PpobCaseStudyContent />
          </div>
        ) : (
          /* Standard Editorial Case Study for other projects */
          <div className="py-12 space-y-12">
            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif italic text-zinc-900 dark:text-zinc-100">
                Problem & Overview
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                {project.problem}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif italic text-zinc-900 dark:text-zinc-100">
                Key Contributions
              </h2>
              <ul className="space-y-2.5 max-w-3xl">
                {project.contributions.map((c, i) => (
                  <li
                    key={i}
                    className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2.5 font-light"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-maroon-600 dark:bg-maroon-400 mt-2 flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-serif italic text-zinc-900 dark:text-zinc-100">
                Key Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                {project.keyFeatures.map((f, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center gap-2.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-maroon-600 dark:text-maroon-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Next Project Footer Bar */}
        <section className="mt-16 pt-12 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-xs font-mono text-zinc-400 uppercase">Next Case Study</div>
            <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
              {nextProject.title}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-light">
              {nextProject.subtitle}
            </div>
          </div>

          <Link
            href={`/projects/${nextProject.id}`}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <RollingText>View Next Project</RollingText>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </main>
    </div>
  );
}
