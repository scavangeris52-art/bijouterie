"use client";
import { useState } from "react";
import { X } from "lucide-react";

interface PromoBannerProps {
  message: string;
}

export default function PromoBanner({ message }: PromoBannerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-gradient-rose text-white text-sm py-2.5 px-4 text-center relative">
      <span className="font-medium">{message}</span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
