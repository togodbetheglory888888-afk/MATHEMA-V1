import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MathCardProps {
  children: ReactNode;
  className?: string;
}

export function MathCard({ children, className = "" }: MathCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-3xl p-8 
        shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] 
        border-4 border-white
        ring-4 ring-primary/10
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
