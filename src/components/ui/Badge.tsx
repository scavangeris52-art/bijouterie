import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "rose" | "coral" | "green" | "orange" | "blue" | "red" | "gray";
  className?: string;
}

export default function Badge({ children, variant = "rose", className }: BadgeProps) {
  const variants = {
    rose:   "bg-rose-100 text-rose-600",
    coral:  "bg-orange-100 text-orange-600",
    green:  "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-600",
    blue:   "bg-blue-100 text-blue-700",
    red:    "bg-red-100 text-red-600",
    gray:   "bg-gray-100 text-gray-600",
  };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}
