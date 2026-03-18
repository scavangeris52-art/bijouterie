"use client";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-right" toastOptions={{ style: { background: "#1a1230", color: "#c4b8d4", border: "1px solid #2d2250" } }} />
    </SessionProvider>
  );
}
