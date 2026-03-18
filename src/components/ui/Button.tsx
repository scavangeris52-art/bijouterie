"use client";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "rose" | "outline" | "ghost" | "salmon" | "dark";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "rose", size = "md", loading, disabled, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2";

    const variants = {
      rose:    "bg-gradient-rose text-white shadow-rose hover:shadow-luxury hover:scale-[1.02] active:scale-[0.98]",
      outline: "border-2 border-rose-500 text-rose-500 hover:bg-rose-50 active:bg-rose-100",
      ghost:   "text-rose-500 hover:bg-rose-50 active:bg-rose-100",
      salmon:  "bg-salmon-100 text-rose-600 hover:bg-salmon-200 active:bg-salmon-300",
      dark:    "bg-admin-card border border-admin-border text-admin-text hover:border-rose-500 hover:text-white",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
