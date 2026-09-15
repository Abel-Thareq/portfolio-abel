"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ExternalLink,
  GitBranch,
  Layers,
  Smartphone,
  Cpu,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { RollingText } from "@/components/ui/rolling-text";

export const PpobCaseStudyContent: React.FC = () => {
  return (
    <div className="space-y-16 py-8 text-zinc-800 dark:text-zinc-200">
      {/* 1. Executive Summary & Problem Framing */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-maroon-700 dark:text-maroon-400 uppercase tracking-wider">
            01 · Context & Problem Statement
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 leading-snug">
          Unifying Fragmented Digital Bills & Financial Services into a Resilient Mobile Experience.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          <div className="space-y-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            <p>
              In the Indonesian digital payment ecosystem, Payment Point Online Bank (PPOB) services are vital infrastructure. End consumers and micro-merchants (warung / loket agen) rely on these platforms daily to purchase prepaid electricity tokens, pay regional water bills (PDAM), settle BPJS health insurance, and top up diverse e-wallets.
            </p>
            <p>
              However, traditional interfaces often suffered from fragmented billing protocols, complex multi-step forms with latency bottlenecks, and abrupt network dropouts during payment handshakes, resulting in failed transactions and customer friction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-maroon-600 dark:text-maroon-400" />
              Core Engineering Objectives
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-600 dark:bg-maroon-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Fluid 60fps Mobile Performance</strong>: Engineering custom widget trees in Flutter with zero external layout lag.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-600 dark:bg-maroon-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Instant Bill Inquiry Feedback</strong>: Reactive breakdown of nominal amounts, dynamic admin fees, and customer verification.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-600 dark:bg-maroon-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Automated Digital Receipts</strong>: Instant Struk Transaksi generation with copyable 20-digit PLN tokens and PDF export.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-maroon-600 dark:bg-maroon-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Clean Architecture</strong>: Feature-first folder modularity, provider state management, and separation of UI from API services.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 2. Abel's Frontend Contributions & Architecture */}
      <section className="space-y-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-maroon-700 dark:text-maroon-400 uppercase tracking-wider">
            02 · Architecture & Engineering Role
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 leading-snug">
          Technical Highlights & Custom Mobile Widget Engineering
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#ED1C24] dark:text-red-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Custom Bezier Notched Navigation
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Crafted a custom <code className="font-mono text-zinc-700 dark:text-zinc-300">NavBarPainter</code> using Flutter Canvas Bezier curves (<code className="font-mono text-zinc-700 dark:text-zinc-300">CustomPainter</code>), providing an active floating indicator with smooth position transitions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#ED1C24] dark:text-red-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Multi-Level Security & PIN Verification
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Engineered a dedicated 6-digit PIN verification modal with biometric integration support, auto-locking state after inactivity, and tokenized authorization headers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#ED1C24] dark:text-red-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
              Dynamic Real-Time Inquiries
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
              Built asynchronous bill inquiry handlers that validate customer numbers on the fly, compute tiered admin fees, and handle billing status exceptions gracefully.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Transaction Lifecycle Pipeline */}
      <section className="space-y-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-maroon-700 dark:text-maroon-400 uppercase tracking-wider">
            03 · Transaction Lifecycle
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif italic text-zinc-900 dark:text-zinc-100 leading-snug">
          End-to-End In-App Payment Sequence
        </h2>

        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Product Selection",
                desc: "User selects bill category (Pulsa, PLN, PDAM, BPJS) and inputs destination ID.",
              },
              {
                step: "02",
                title: "Real-Time Inquiry",
                desc: "Client initiates inquiry endpoint, validates customer name & retrieves billing nominal.",
              },
              {
                step: "03",
                title: "PIN & Auth Handshake",
                desc: "User confirms breakdown, enters 6-digit transaction PIN for cryptographic verification.",
              },
              {
                step: "04",
                title: "Struk & Ledger Update",
                desc: "Balance is deducted, instant digital receipt is dispatched with copyable token & audit trail.",
              },
            ].map((item, idx) => (
              <div key={item.step} className="space-y-2 relative">
                <div className="font-mono text-xs text-maroon-600 dark:text-maroon-400 font-bold">
                  STEP {item.step}
                </div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Project Metrics & GitHub Colophon */}
      <section className="space-y-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-maroon-700 dark:text-maroon-400 uppercase tracking-wider">
            04 · Project Stats & Deliverables
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">145+</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Git Commits</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">30+</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Service Categories</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">60 FPS</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Native UI Target</div>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
            <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">&lt; 1s</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Inquiry Response</div>
          </div>
        </div>

        {/* GitHub Repository CTA Box */}
        <div className="p-6 rounded-2xl bg-zinc-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-[#ED1C24]" />
              <span>Abel-Thareq / PPOB-FIX-Latest-13Oct</span>
            </div>
            <h4 className="text-base font-medium text-white">
              Explore the Original Flutter & Dart Source Code
            </h4>
            <p className="text-xs text-zinc-400 font-light max-w-xl">
              Contains complete feature packages, custom widget painters, and state provider implementations.
            </p>
          </div>

          <a
            href="https://github.com/Abel-Thareq/PPOB-FIX-Latest-13Oct"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ED1C24] hover:bg-[#D3151D] text-white text-xs font-semibold transition-all flex-shrink-0 cursor-pointer shadow-md"
          >
            <RollingText>View on GitHub</RollingText>
            <ExternalLink className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default PpobCaseStudyContent;
