"use client";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, max = 5, size = "md", interactive, onChange }: StarRatingProps) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

  return (
    <div className={cn("flex gap-0.5 stars", sizes[size])}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            i < rating ? "text-yellow-400" : "text-gray-300",
            interactive && "cursor-pointer hover:text-yellow-400 transition-colors"
          )}
          onClick={() => interactive && onChange?.(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
