"use client";
import { MotionConfig } from "framer-motion";

// Visitors who ask their OS for reduced motion get fades only: no sliding or scaling.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}