"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-background",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -inset-[10px] opacity-50 will-change-transform">
            <div className="aurora-surface absolute inset-0" />
            {/* Aurora gradient layers */}
            <div
              className="absolute inset-0 animate-aurora"
              style={{
                background: `
                  repeating-linear-gradient(100deg, transparent, transparent 40%, hsla(142, 70%, 55%, 0.08) 40%, hsla(142, 70%, 55%, 0.08) 42%),
                  repeating-linear-gradient(100deg, transparent, transparent 55%, hsla(191, 97%, 50%, 0.06) 55%, hsla(191, 97%, 50%, 0.06) 57%),
                  repeating-linear-gradient(100deg, transparent, transparent 70%, hsla(142, 70%, 55%, 0.04) 70%, hsla(142, 70%, 55%, 0.04) 72%)
                `,
                backgroundSize: "200% 200%",
                backgroundPosition: "0 0",
              }}
            />
          </div>
          {showRadialGradient && (
            <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          )}
        </motion.div>
      </div>
      {children}
    </div>
  );
};
