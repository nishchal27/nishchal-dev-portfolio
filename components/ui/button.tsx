import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
}

const buttonClasses = (
  variant: "primary" | "secondary" | "ghost",
  size: "sm" | "md" | "lg"
) =>
  cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-accent text-white hover:bg-accent-hover": variant === "primary",
      "bg-surface border border-border text-text-primary hover:bg-surface/80":
        variant === "secondary",
      "text-text-primary hover:bg-surface": variant === "ghost",
      "h-9 px-4 text-sm": size === "sm",
      "h-11 px-6 text-base": size === "md",
      "h-13 px-8 text-lg": size === "lg",
    }
  );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, href, children, ...props }, ref) => {
    const classes = cn(buttonClasses(variant, size), className);

    if (asChild && href) {
      return (
        <Link href={href} className={classes} {...(props as any)}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
