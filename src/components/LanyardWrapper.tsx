"use client";

import dynamic from "next/dynamic";
import React from "react";

const DynamicLanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => null,
});

export const LanyardWrapper: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <DynamicLanyard position={[0, 0, 16]} fov={28} />
    </div>
  );
};
