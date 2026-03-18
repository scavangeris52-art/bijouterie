import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export default function SectionTitle({ title, subtitle, center = true, className }: SectionTitleProps) {
  return (
    <div className={cn("mb-10", center && "text-center", className)}>
      <h2 className="font-luxury text-3xl md:text-4xl font-light text-gray-800 mb-3">{title}</h2>
      {subtitle && <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
      <div className={cn("mt-4 h-0.5 w-12 bg-gradient-rose rounded-full", center && "mx-auto")} />
    </div>
  );
}
