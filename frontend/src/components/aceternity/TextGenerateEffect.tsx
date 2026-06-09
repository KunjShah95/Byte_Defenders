"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) => {
  const wordsArray = words.split(" ");

  return (
    <div className={cn("font-bold", className)}>
      <motion.div
        className="overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.04 }}
      >
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="inline-block mr-1"
            variants={{
              hidden: {
                opacity: filter ? 0 : 1,
                y: filter ? 20 : 0,
                filter: filter ? "blur(10px)" : "none",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration,
              ease: "easeOut",
              delay: idx * 0.04,
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
