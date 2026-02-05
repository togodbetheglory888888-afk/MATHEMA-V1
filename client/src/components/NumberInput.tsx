import React from "react";

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add specific props if needed
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="number"
        pattern="[0-9]*"
        inputMode="numeric"
        className={`
          w-full text-center text-5xl font-bold
          bg-muted/30 border-b-4 border-primary/30
          rounded-xl py-6 px-4
          focus:outline-none focus:border-primary focus:bg-primary/5
          transition-all duration-300
          placeholder:text-muted-foreground/30
          ${className}
        `}
        {...props}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";
