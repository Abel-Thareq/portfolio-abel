"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote, Sparkles } from "lucide-react";
import { ScrollReelTestimonials, ScrollReelTestimonial } from "@/components/ui/scroll-reel-testimonials";

const TESTIMONIALS_DATA: ScrollReelTestimonial[] = [
  {
    quote:
      "Web yang dikerjakan mantap banget, tampilannya bersih, fiturnya responsif, dan eksekusinya cepat. Awesome job, Bel! Kehadiranmu bener-bener bikin progres tim web jadi makin solid.",
    author: "Dr. Ir. Muhammad Joko Umbaran Haris Baharudin S. Kom., M. Kom",
    role: "Director of PT Inovasi Teknomedia Bangsa",
    initial: "J",
  },
  {
    quote:
      "Abel adalah seorang kolaborator yang sangat bisa diandalkan dalam tim teknis. Ia memiliki komunikasi yang transparan, terutama saat berkoordinasi dengan UI/UX Designer maupun tim backend untuk memastikan integrasi data dan tampilan berjalan mulus. Abel tidak ragu untuk berdiskusi guna mencari solusi terbaik demi kelancaran proyek Sistem Informasi Aset.",
    author: "Ir. Andriyatna Agung Kurniawan, S.T., M.Eng.",
    role: "Chief of UPA TIK UNTIDAR",
    initial: "A",
  },
  {
    quote:
      "Kerja bareng Abel selama magang seru dan terarah banget. Dia orangnya cepet tanggap kalau ada kendala logic atau slicing frontend, selalu teliti pada detail komponen, dan solutif setiap kita diskusi task bareng.",
    author: "Kurnadi",
    role: "Partner Internship",
    initial: "K",
  },
  {
    quote:
      "Abel punya etos kerja tinggi dan komitmen kuat buat hasil yang rapi. Koordinasi kode di repository dan eksekusi fitur frontend-nya selalu terstruktur, bikin ritme kerja tim jadi jauh lebih efisien dan seamless.",
    author: "Muhammad Nur Alfin Huda",
    role: "Partner Internship",
    initial: "M",
  },
  {
    quote:
      "Portofolio Abel bener-bener nunjukin standar developer modern: visualnya clean dan berkelas, performa webnya silky smooth, serta setiap micro-interaction dan arsitektur kodenya dipikirkan dengan sangat matang.",
    author: "Abiyu Baharudin",
    role: "Industry Colleague & Visitor",
    initial: "A",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 border-t border-zinc-200/60 dark:border-zinc-800/80 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareQuote className="w-4 h-4 text-maroon-700 dark:text-maroon-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Endorsements & Feedback
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-zinc-900 dark:text-zinc-100">
              Words from <span className="font-serif italic text-maroon-800 dark:text-maroon-300">Leaders & Peers</span>
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-maroon-600 dark:text-maroon-400 animate-pulse" />
            <span>05 Verified Testimonials</span>
          </div>
        </motion.div>

        {/* Scroll Reel Component Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="flex justify-center"
        >
          <ScrollReelTestimonials
            testimonials={TESTIMONIALS_DATA}
            charStaggerMs={5}
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
