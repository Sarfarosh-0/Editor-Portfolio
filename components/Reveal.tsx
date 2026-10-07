"use client";
// components/Reveal.tsx
// Reusable Framer Motion entrance animation wrapper.
// TODO(confirm): duration 0.6s, cubic-bezier(0.22,1,0.36,1), once:true, stagger 0.08s

import { motion, MotionProps, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** translateX offset (for about image/text slide) */
  x?: number;
  /** translateY offset */
  y?: number;
  /** initial scale */
  scale?: number;
}

export default function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 0,
  scale = 1,
  ...rest
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y, scale }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
