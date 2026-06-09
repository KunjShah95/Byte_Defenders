"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface BackgroundBeamsProps {
  className?: string;
}

export const BackgroundBeams = ({ className }: BackgroundBeamsProps) => {
  const paths = [
    "M-200 200c300-100 500-200 800-100s500 200 800 100 500-200 800-100",
    "M-200 400c300-100 500-200 800-100s500 200 800 100 500-200 800-100", 
    "M-200 600c300-100 500-200 800-100s500 200 800 100 500-200 800-100",
    "M500 0c100 200 200 400 300 600s200 400 300 600",
    "M700 0c100 200 200 400 300 600s200 400 300 600",
    "M900 0c100 200 200 400 300 600s200 400 300 600",
  ];

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
            <stop offset="60%" stopColor="hsl(var(--accent))" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="url(#beamGrad)"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
