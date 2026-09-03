import React from "react";
import { Navigation } from "@/components/Navigation";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Experience } from "@/components/Experience";
import { CoreCapabilities } from "@/components/CoreCapabilities";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0C0C0E] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-maroon-800 selection:text-white dark:selection:bg-maroon-400 dark:selection:text-zinc-950 relative">
      {/* Top Global Scroll Progress Bar */}
      <ScrollProgress />

      {/* Ambient Scroll-Reactive Gradient Background Orbs */}
      <AmbientBackground />

      <Navigation />

      <main>
        <Hero />
        <SelectedWork />
        <Experience />
        <CoreCapabilities />
        <Education />
        <Certifications />
        <TestimonialsSection />
        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
