import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF9] dark:bg-[#0C0C0E] text-zinc-900 dark:text-zinc-100 p-6 text-center">
      <h1 className="text-4xl font-serif italic mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 rounded-full transition-all"
      >
        Return Home
      </Link>
    </div>
  );
}
