"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const DynamicLanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => null,
});

export const LanyardWrapper: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    // Only mount 3D physics lanyard on desktop screens (>= 1024px)
    // Small devices & smartphones hide it completely for pure performance & zero text occlusion
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport, { passive: true });
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (!isDesktop) return null;

  return (
    <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10">
      <DynamicLanyard position={[0, 0, 16]} fov={28} />
    </div>
  );
};

export default LanyardWrapper;
