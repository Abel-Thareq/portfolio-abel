"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Award } from "lucide-react";
import { HeroCarousel, type HeroCarouselItem } from "@/components/ui/hero-carousel";
import { NumberTicker } from "./ui/number-ticker";
import { ScrambleText } from "./ui/scramble-text";

const CERTIFICATES_DATA: HeroCarouselItem[] = [
  {
    id: "ip-wsn-kemenkumham",
    title: "Properti Implementasi Struktur Data Berbasis Bahasa Python pada Sistem Manajemen Data Sensor Jaringan Nirkabel (WSN)",
    image: "/assets/certif/Properti Implementasi Struktur Data Berbasis Bahasa Python pada Sistem Manajemen Data Sensor Jaringan Nirkabel (WSN).webp",
    credit: "KEMENKUMHAM RI — SURAT PENCATATAN CIPTAAN",
    meta: ["NO: 000806412", "RESMI RI 2025", "HAK CIPTA RESMI"],
    accent: "#832841",
    pdfUrl: "/assets/certif/Properti Implementasi Struktur Data Berbasis Bahasa Python pada Sistem Manajemen Data Sensor Jaringan Nirkabel (WSN).webp",
  },
  {
    id: "fundamental-data-engineering-komdigi",
    title: "Fundamental of Data Engineering (KOMDIGI)",
    image: "/assets/certif/Fundamental of Data Engineering (KOMDIGI).webp",
    credit: "KEMENTERIAN KOMUNIKASI DAN DIGITAL (KOMDIGI)",
    meta: ["DIGITAL TALENT SCHOLARSHIP", "DATA ENGINEERING", "2025"],
    accent: "#1e3a8a",
    pdfUrl: "/assets/certif/Fundamental of Data Engineering (KOMDIGI).webp",
  },
  {
    id: "data-science-komdigi-2025",
    title: "Pengenalan Data Science dan Pemanfaatannya di Berbagai Sektor Micro Skill DTS 2025 (KOMDIGI)",
    image: "/assets/certif/Pengenalan Data Science dan Pemanfaatannya di Berbagai Sektor Micro Skill DTS 2025 (KOMDIGI).webp",
    credit: "KOMDIGI — MICRO SKILL DTS 2025",
    meta: ["DATA SCIENCE", "KOMDIGI DTS", "2025"],
    accent: "#0f766e",
    pdfUrl: "/assets/certif/Pengenalan Data Science dan Pemanfaatannya di Berbagai Sektor Micro Skill DTS 2025 (KOMDIGI).webp",
  },
  {
    id: "career-data-analytics-komdigi",
    title: "Wawasan Karir dalam Bidang Data Analytics Micro Skill DTS 2025 (KOMDIGI)",
    image: "/assets/certif/Wawasan Karir dalam Bidang Data Analytics Micro Skill DTS 2025 (KOMDIGI).webp",
    credit: "KOMDIGI — MICRO SKILL DTS 2025",
    meta: ["DATA ANALYTICS", "CAREER PATH", "2025"],
    accent: "#0369a1",
    pdfUrl: "/assets/certif/Wawasan Karir dalam Bidang Data Analytics Micro Skill DTS 2025 (KOMDIGI).webp",
  },
  {
    id: "prompt-engineering-dicoding",
    title: "Prompt Engineering untuk Software Developer (Dicoding)",
    image: "/assets/certif/Prompt Engineering untuk Software Developer (Dicoding).webp",
    credit: "DICODING ACADEMY INDONESIA",
    meta: ["GENERATIVE AI", "DEVELOPER SKILL", "2025"],
    accent: "#7c2d12",
    pdfUrl: "/assets/certif/Prompt Engineering untuk Software Developer (Dicoding).webp",
  },
  {
    id: "visualisasi-data-dicoding",
    title: "Belajar Dasar Visualisasi Data (Dicoding)",
    image: "/assets/certif/Belajar Dasar Visualisasi Data (Dicoding).webp",
    credit: "DICODING ACADEMY INDONESIA",
    meta: ["DATA VISUALIZATION", "FRONTEND & BI", "2024"],
    accent: "#4338ca",
    pdfUrl: "/assets/certif/Belajar Dasar Visualisasi Data (Dicoding).webp",
  },
  {
    id: "c-programming-dicoding",
    title: "Memulai Pemrograman Dengan C (Dicoding)",
    image: "/assets/certif/Memulai Pemrograman Dengan C (Dicoding).webp",
    credit: "DICODING ACADEMY INDONESIA",
    meta: ["SYSTEM PROGRAMMING", "ALGORITHMS", "2024"],
    accent: "#374151",
    pdfUrl: "/assets/certif/Memulai Pemrograman Dengan C (Dicoding).webp",
  },
  {
    id: "sql-simplilearn",
    title: "Introduction to SQL (Simplilearn)",
    image: "/assets/certif/Introduction to SQL (Simplilearn).webp",
    credit: "SIMPLILEARN SKILLUP",
    meta: ["RELATIONAL DATABASE", "SQL QUERIES", "2024"],
    accent: "#15803d",
    pdfUrl: "/assets/certif/Introduction to SQL (Simplilearn).webp",
  },
  {
    id: "career-skills-linkedin",
    title: "Introduction to Career Skills in Data Analytics (LinkedIn)",
    image: "/assets/certif/Introduction to Career Skills in Data Analytics (LinkedIn).webp",
    credit: "LINKEDIN LEARNING & MICROSOFT",
    meta: ["BUSINESS ANALYTICS", "DATA WRANGLING", "2024"],
    accent: "#0284c7",
    pdfUrl: "/assets/certif/Introduction to Career Skills in Data Analytics (LinkedIn).webp",
  },
  {
    id: "intro-data-analytics-revou",
    title: "Intro to Data Analytics (RevoU)",
    image: "/assets/certif/Intro to Data Analytics (RevoU).webp",
    credit: "REVOU MINI BOOTCAMP",
    meta: ["EXPLORATORY DATA", "STATISTICS", "2024"],
    accent: "#b45309",
    pdfUrl: "/assets/certif/Intro to Data Analytics (RevoU).webp",
  },
  {
    id: "python-ai-dqlab",
    title: "Guide to Learn Python with AI at DQLab (DQLab)",
    image: "/assets/certif/Guide to Learn Python with AI at DQLab (DQLab).webp",
    credit: "DQLAB INDONESIA",
    meta: ["PYTHON AI", "DATA ANALYSIS", "2024"],
    accent: "#4d7c0f",
    pdfUrl: "/assets/certif/Guide to Learn Python with AI at DQLab (DQLab).webp",
  },
  {
    id: "python-data-myskill",
    title: "Python Introduction for Data Analysis (MySkill)",
    image: "/assets/certif/Python Introduction for Data Analysis (MySkill).webp",
    credit: "MYSKILL ACCELERATED LEARNING",
    meta: ["PANDAS & NUMPY", "DATA PROCESSING", "2024"],
    accent: "#0e7490",
    pdfUrl: "/assets/certif/Python Introduction for Data Analysis (MySkill).webp",
  },
  {
    id: "power-bi-xquisiteai",
    title: "START YOUR DATA JOURNEY WITH POWER BI (XquisiteAI)",
    image: "/assets/certif/START YOUR DATA JOURNEY WITH POWER BI (XquisiteAI).webp",
    credit: "XQUISITE.AI GLOBAL WORKSHOP",
    meta: ["POWER BI DASHBOARD", "BUSINESS INTEL", "2024"],
    accent: "#c2410c",
    pdfUrl: "/assets/certif/START YOUR DATA JOURNEY WITH POWER BI (XquisiteAI).webp",
  },
  {
    id: "systematic-review-ppi",
    title: "From Literature to Publication Practical Guidelines for Systematic Review and Bibliometric Analysis (PPI Australia)",
    image: "/assets/certif/From Literature to Publication Practical Guidelines for Systematic Review and Bibliometric Analysis (PPI Australia).webp",
    credit: "PPI AUSTRALIA & RESEARCH WORKSHOP",
    meta: ["ACADEMIC RESEARCH", "BIBLIOMETRICS", "2024"],
    accent: "#6b21a8",
    pdfUrl: "/assets/certif/From Literature to Publication Practical Guidelines for Systematic Review and Bibliometric Analysis (PPI Australia).webp",
  },
  {
    id: "cip-opswat",
    title: "Introduction to CIP (OPSWAT Academy)",
    image: "/assets/certif/Introduction to CIP (OPSWAT Academy).webp",
    credit: "OPSWAT ACADEMY CYBERSECURITY",
    meta: ["CYBERSECURITY", "CIP FUNDAMENTALS", "2024"],
    accent: "#9f1239",
    pdfUrl: "/assets/certif/Introduction to CIP (OPSWAT Academy).webp",
  },
  {
    id: "plc-hmte",
    title: "Workshop PLC (HMTE UNTIDAR)",
    image: "/assets/certif/Workshop PLC (HMTE UNTIDAR).webp",
    credit: "HMTE UNIVERSITAS TIDAR",
    meta: ["HARDWARE CONTROL", "AUTOMATION", "2024"],
    accent: "#1e293b",
    pdfUrl: "/assets/certif/Workshop PLC (HMTE UNTIDAR).webp",
  },
  {
    id: "mini-bootcamp-edspert",
    title: "Mini Bootcamp (Edspert.id)",
    image: "/assets/certif/Mini Bootcamp (Edspert.id).webp",
    credit: "EDSPERT.ID PROFESSIONAL PROGRAM",
    meta: ["SYSTEM WORKFLOWS", "COLLABORATION", "2024"],
    accent: "#a16207",
    pdfUrl: "/assets/certif/Mini Bootcamp (Edspert.id).png",
  },
  {
    id: "digital-writing-digitalskola",
    title: "Skola Talk #61 Digital Writing Camp (DigitalSkola)",
    image: "/assets/certif/Skola Talk 61 Digital Writing Camp (DigitalSkola).webp",
    credit: "DIGITAL SKOLA INDONESIA",
    meta: ["TECH DOCUMENTATION", "DIGITAL WRITING", "2024"],
    accent: "#475569",
    pdfUrl: "/assets/certif/Skola Talk 61 Digital Writing Camp (DigitalSkola).webp",
  },
  {
    id: "strategi-pembelajaran-untidar",
    title: "Perbedaan Individual dan Strategi Pembelajaran (Universitas Tidar)",
    image: "/assets/certif/Perbedaan Individual dan Strategi Pembelajaran (Universitas Tidar).webp",
    credit: "UNIVERSITAS TIDAR",
    meta: ["PEDAGOGY & LEADERSHIP", "CAMPUS", "2024"],
    accent: "#52525b",
    pdfUrl: "/assets/certif/Perbedaan Individual dan Strategi Pembelajaran (Universitas Tidar).webp",
  },
  {
    id: "lkmm-untidar",
    title: "Latihan Keterampilan Manajemen Mahasiswa Pra-Dasar (HMTE UNTIDAR)",
    image: "/assets/certif/Latihan Keterampilan Manajemen Mahasiswa Pra-Dasar (HMTE UNTIDAR).webp",
    credit: "HMTE UNIVERSITAS TIDAR",
    meta: ["LEADERSHIP", "PROJECT MANAGEMENT", "2024"],
    accent: "#64748b",
    pdfUrl: "/assets/certif/Latihan Keterampilan Manajemen Mahasiswa Pra-Dasar (HMTE UNTIDAR).webp",
  },
];

export const Certifications: React.FC = () => {
  return (
    <section id="credentials" className="py-24 border-t border-zinc-200/60 dark:border-zinc-800/80 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-maroon-700 dark:text-maroon-400" />
              <ScrambleText
                text="OFFICIAL VALIDATION & TRAINING"
                speed={25}
                className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
              Intellectual Property & <span className="font-serif italic text-maroon-800 dark:text-maroon-300">Credentials</span>
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/90 px-3 py-1.5 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
            <Award className="w-3.5 h-3.5 text-maroon-600 dark:text-maroon-400" />
            <span className="flex items-center gap-1">
              <NumberTicker value={20} />
              <span>Verified Credentials & IP</span>
            </span>
          </div>
        </motion.div>

        {/* Hero Carousel Container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="w-full"
        >
          <HeroCarousel
            items={CERTIFICATES_DATA}
            defaultIndex={0}
            brand="ABEL THAREQ • CREDENTIALS"
            autoplay={false}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
