"use client";

import { SELECT_SERVICE_EVENT } from "./OrderForm";
import { track } from "./analytics";

// Mygtukas, kuris nuveda į užsakymo formą ir (pasirinktinai) iš anksto pažymi paslaugą.
export default function OrderButton({
  serviceId,
  className,
  children,
  trackAs = "CTA paspaudimas",
}: {
  serviceId?: string;
  className?: string;
  children: React.ReactNode;
  trackAs?: string;
}) {
  return (
    <a
      href="#uzsakymas"
      className={className}
      onClick={() => {
        track(trackAs, serviceId ? { paslauga: serviceId } : undefined);
        if (serviceId) window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: serviceId }));
      }}
    >
      {children}
    </a>
  );
}
