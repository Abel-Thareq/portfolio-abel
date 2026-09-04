"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowUpRight } from "lucide-react";
import { personalInfo } from "@/data/portfolioData";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { RollingText } from "./ui/rolling-text";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "capabilities", label: "Capabilities" },
  { id: "education", label: "Education" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export const Navigation: React.FC = () => {
  const [isIsland, setIsIsland] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("work");

  const isClickNavigatingRef = useRef(false);
  const clickNavTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Single unified high-performance scroll listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;

          // 1. Dynamic Island visibility
          const shouldBeIsland = currentScroll > 160;
          setIsIsland(shouldBeIsland);
          if (!shouldBeIsland) {
            setIsExpanded(false);
          }

          // 2. Deterministic Section Tracking (Zero jump to Theme/Contact during transit)
          if (!isClickNavigatingRef.current) {
            const viewportMarker = currentScroll + 280; // Optical reading line
            const sections = navItems.map((item) => {
              const el = document.getElementById(item.id);
              return {
                id: item.id,
                top: el ? el.offsetTop : 0,
              };
            });

            let currentActive = sections[0].id;
            for (let i = 0; i < sections.length; i++) {
              if (viewportMarker >= sections[i].top) {
                currentActive = sections[i].id;
              }
            }

            setActiveSection((prev) => (prev !== currentActive ? currentActive : prev));
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Shared navigation click handler: cleanly glides active pill with lock on intermediate sections
  const triggerNavClick = (sectionId: string) => {
    setActiveSection(sectionId);

    // Lock scroll spy for 1.8s so smooth scroll transit doesn't glitch intermediate sections
    isClickNavigatingRef.current = true;
    if (clickNavTimeoutRef.current) {
      clearTimeout(clickNavTimeoutRef.current);
    }
    clickNavTimeoutRef.current = setTimeout(() => {
      isClickNavigatingRef.current = false;
    }, 1800);

    const targetEl = document.getElementById(sectionId);
    if (targetEl) {
      const targetTop = targetEl.offsetTop - 80;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    }
  };

  // Hero top bar nav click
  const handleHeroNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    triggerNavClick(sectionId);
  };

  // Dynamic Island nav click: smooth pill glide and stays open
  const handleIslandNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    triggerNavClick(sectionId);
  };

  return (
    <>
      {/* ================= 1. INITIAL TOP BAR (Hero Section View, !isIsland) ================= */}
      <AnimatePresence>
        {!isIsland && (
          <motion.header
            key="standard-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            className="fixed top-0 left-0 right-0 z-40 bg-transparent py-6 select-none"
          >
            <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
              {/* Brand Logo & Name */}
              <a
                href="#"
                className="group flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-medium tracking-tight text-base"
              >
                <div className="relative w-7 h-7 flex items-center justify-center -translate-y-[2px] transition-transform">
                  <Image
                    src="/logos/portfolio-logo.png"
                    alt="Abel Thareq Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain brightness-0 dark:brightness-100 transition-all"
                    priority
                  />
                </div>
                <span className="font-serif italic text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {personalInfo.name}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-maroon-500 animate-pulse" />
              </a>

              {/* Desktop Horizontal Links */}
              <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400 font-normal">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleHeroNavClick(e, item.id)}
                    className="group hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <RollingText>{item.label}</RollingText>
                  </a>
                ))}
              </nav>

              {/* Theme Switcher & LinkedIn */}
              <div className="flex items-center gap-2.5">
                <ThemeToggleButton className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)]" />

                <a
                  href={personalInfo.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
                >
                  <RollingText>LinkedIn</RollingText>
                  <ArrowUpRight className="w-3 h-3 text-zinc-400 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-transform duration-500 ease-out group-hover:rotate-[360deg] will-change-transform" />
                </a>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ================= 2. AUTHENTIC APPLE iOS 18 LIQUID GLASS DYNAMIC ISLAND ================= */}
      <AnimatePresence>
        {isIsland && (
          <motion.div
            key="dynamic-island-container"
            initial={{ x: "-50%", y: -24, scale: 0.9, opacity: 0 }}
            animate={{ x: "-50%", y: 0, scale: 1, opacity: 1 }}
            exit={{ x: "-50%", y: -20, scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            style={{ left: "50%" }}
            className="fixed top-4 z-50 transform-gpu will-change-transform select-none max-w-[95vw]"
          >
            {/* Liquid Glass Shell with Exact Dimensions & Curved Reflection */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative flex items-center h-[48px] rounded-full apple-liquid-glass-shell p-1.5"
            >
              {/* Apple Physical Glass Lens Glare (Top Curve Highlight) */}
              <div className="absolute top-[1.5px] inset-x-3 h-[45%] rounded-full bg-gradient-to-b from-white/35 dark:from-white/18 to-transparent pointer-events-none" />

              {/* STATE A: COLLAPSED DYNAMIC ISLAND */}
              {!isExpanded ? (
                <div
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center gap-2 cursor-pointer group px-0.5"
                  title="Expand menu"
                >
                  {/* Rotating Logo inside Circular Glass Orb */}
                  <motion.div
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="w-[36px] h-[36px] rounded-full apple-glass-orb flex items-center justify-center flex-shrink-0"
                  >
                    <Image
                      src="/logos/portfolio-logo.png"
                      alt="Abel Logo"
                      width={22}
                      height={22}
                      className="w-4 h-4 object-contain brightness-0 dark:brightness-100 transition-all"
                      priority
                    />
                  </motion.div>

                  {/* Active Section Capsule */}
                  <div className="apple-liquid-glass-active h-[36px] px-4 rounded-full flex items-center justify-center text-xs font-mono font-medium text-zinc-900 dark:text-white uppercase tracking-wider shadow-sm">
                    {activeSection}
                  </div>

                  {/* Right Arrow inside Circular Glass Orb */}
                  <div className="w-[36px] h-[36px] rounded-full apple-glass-orb group-hover:scale-[1.05] flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ) : (
                /* STATE B: EXPANDED DYNAMIC ISLAND */
                <div className="flex items-center gap-1.5 px-0.5">
                  {/* Left Arrow Button to Collapse (Circular Glass Orb) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="w-[36px] h-[36px] rounded-full apple-glass-orb hover:scale-[1.05] flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all flex-shrink-0"
                    aria-label="Collapse menu"
                    title="Collapse menu"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Rotating Logo (360° Spin Animation inside Glass Orb) */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                    className="w-[36px] h-[36px] rounded-full apple-glass-orb flex items-center justify-center flex-shrink-0 mr-0.5"
                  >
                    <Image
                      src="/logos/portfolio-logo.png"
                      alt="Abel Logo"
                      width={22}
                      height={22}
                      className="w-4 h-4 object-contain brightness-0 dark:brightness-100 transition-all"
                      priority
                    />
                  </motion.div>

                  {/* Horizontal Section List with Isolated LayoutGroup so Pill CANNOT project from Theme */}
                  <LayoutGroup id="dynamic-island-nav-group">
                    <nav className="flex items-center gap-1 py-0.5 overflow-x-auto no-scrollbar max-w-[calc(100vw-120px)] sm:max-w-none">
                      {navItems.map((item) => {
                        const isChosen = activeSection === item.id;
                        return (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => handleIslandNavClick(e, item.id)}
                            className={`group relative h-[36px] px-3.5 flex items-center justify-center text-xs sm:text-[13px] rounded-full transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                              isChosen
                                ? "text-maroon-800 dark:text-maroon-300 font-semibold"
                                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-medium"
                            }`}
                          >
                            {/* Inner Glass Capsule (Strictly isolated inside this LayoutGroup) */}
                            {isChosen && (
                              <motion.div
                                layoutId="appleLiquidPill"
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 32,
                                }}
                                className="absolute inset-0 rounded-full apple-liquid-glass-active -z-10"
                              >
                                {/* Inner Glass Lens Glare */}
                                <div className="absolute top-[1px] inset-x-2 h-[42%] rounded-full bg-gradient-to-b from-white/60 dark:from-white/30 to-transparent pointer-events-none" />
                              </motion.div>
                            )}
                            <RollingText>{item.label}</RollingText>
                          </a>
                        );
                      })}
                    </nav>
                  </LayoutGroup>

                  {/* Theme Switcher in Circular Glass Orb (Isolated outside LayoutGroup) */}
                  <ThemeToggleButton className="w-[36px] h-[36px] rounded-full apple-glass-orb hover:scale-[1.05] flex-shrink-0" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
