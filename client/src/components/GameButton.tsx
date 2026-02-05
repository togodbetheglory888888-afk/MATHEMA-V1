import { motion, HTMLMotionProps } from "framer-motion";

interface GameButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "success" | "danger";
}

export function GameButton({ children, className = "", variant = "primary", ...props }: GameButtonProps) {
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-primary/30",
    secondary: "bg-secondary text-secondary-foreground shadow-secondary/30",
    success: "bg-[hsl(142,76%,36%)] text-white shadow-green-500/30",
    danger: "bg-destructive text-destructive-foreground shadow-destructive/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95, y: 0 }}
      className={`
        px-8 py-4 rounded-2xl font-display text-2xl
        shadow-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
