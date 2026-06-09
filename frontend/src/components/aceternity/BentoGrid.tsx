"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

interface BentoCardProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "wide" | "tall" | "featured";
  gradient?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  index?: number;
}

export const BentoGrid = ({ className, children }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  children,
  variant = "default",
  gradient,
  icon,
  title,
  description,
  index = 0,
}: BentoCardProps) => {
  const colSpan = variant === "featured" ? "md:col-span-3 lg:col-span-4" 
    : variant === "wide" ? "md:col-span-3"
    : variant === "tall" ? "md:col-span-2 lg:col-span-2"
    : "md:col-span-2";

  const rowSpan = variant === "tall" || variant === "featured" ? "md:row-span-2" : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "bento-card group relative flex flex-col",
        colSpan,
        rowSpan,
        className
      )}
    >
      {gradient && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: gradient }}
        />
      )}
      <div className="relative z-10 flex h-full flex-col p-6 lg:p-8">
        {icon && (
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="mb-2 text-xl font-semibold text-foreground tracking-tight">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {children}
      </div>
    </motion.div>
  );
};
