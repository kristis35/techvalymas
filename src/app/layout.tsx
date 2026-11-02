import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Elektronikos valymas ${site.city} – kompiuteriai, klaviatūros, konsolės | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "kompiuterio valymas",
    "nešiojamojo kompiuterio valymas",
    "klaviatūros valymas",
    "konsolės valymas",
    "PS5 valymas",
    "termopastos keitimas",
    `kompiuterio valymas ${site.city}`,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: site.name,
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    url: "/",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.js";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="lt" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-800">
        {children}
        {plausibleDomain && (
          <>
            <Script defer data-domain={plausibleDomain} src={plausibleSrc} strategy="afterInteractive" />
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
