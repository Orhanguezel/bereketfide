'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

export function WhatsAppButton({ number }: { number?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const finalNumber = number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!finalNumber || !visible) return null;

  const url = `https://wa.me/${finalNumber.replace(/\D/g, '')}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fab-success motion-pulse fixed bottom-6 left-6 z-50 flex size-11 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="size-5" />
    </a>
  );
}
