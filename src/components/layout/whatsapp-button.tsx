"use client";

import Link from "next/link";
import { ImWhatsapp } from "react-icons/im";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center py-2 px-2 md:px-4 gap-2 h-12 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
    >
      <p className="capitalize hidden md:flex font-sans text-white font-semibold">
        Chat with us
      </p>
      <ImWhatsapp className="text-white text-3xl" />
    </Link>
  );
}
