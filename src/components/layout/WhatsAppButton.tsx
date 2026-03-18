"use client";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const number  = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212600000000";
  const message = encodeURIComponent("Bonjour, je suis intéressé(e) par vos bijoux.");
  const url     = `https://wa.me/${number}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  );
}
