"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-white text-zinc-950 hover:bg-white/95 shadow-[0_10px_30px_rgba(255,255,255,0.15)] border border-white/20",
        gold: "bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-zinc-950 hover:from-gold-300 hover:via-gold-400 hover:to-gold-500 shadow-[0_10px_30px_rgba(212,163,89,0.25)] border border-gold-300/30",
        destructive: "bg-red-600/90 text-white hover:bg-red-500 shadow-[0_10px_30px_rgba(239,68,68,0.2)] border border-red-500/20",
        outline: "border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/12 hover:border-white/20 text-white",
        secondary: "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800/80 shadow-lg",
        ghost: "hover:bg-white/8 hover:text-white text-white/80",
        link: "text-gold-400 underline-offset-4 hover:underline",
        glass: "glass-button text-white",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-14 rounded-xl px-8 text-base font-bold tracking-wide",
        xl: "h-16 rounded-xl px-10 text-lg font-bold tracking-wider",
        icon: "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const CinematicButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // We wrap the button inside a framer motion element for premium animations
    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="inline-flex"
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
CinematicButton.displayName = "CinematicButton"

export { CinematicButton, buttonVariants }
