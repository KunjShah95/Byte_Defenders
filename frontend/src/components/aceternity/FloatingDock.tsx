"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import React from "react";

interface DockItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

export const FloatingDock = ({ items, className }: FloatingDockProps) => {
  const location = useLocation();

  return (
    <div className={cn("dock", className)}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
        className="dock-inner"
      >
        {items.map((item) => {
          const isActive = item.href === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "dock-item group",
                isActive && "active"
              )}
              title={item.label}
            >
              {item.icon}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-card border border-white/10 px-2 py-1 text-[10px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
