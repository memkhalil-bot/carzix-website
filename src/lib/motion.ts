import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.93, y: 18 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export const blurUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.72, ease: "easeOut" as const },
  },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export const staggerSlow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const staggerFast: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};
