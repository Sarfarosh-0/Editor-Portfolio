// app/layout.tsx
import type { Viewport } from "next";
// Root layout: fonts, metadata, JSON-LD — all generated from content.ts.

import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { content } from "@/content/content";

// TODO(confirm): Geist body font via next/font/google
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO(confirm): Instrument Serif via next/font/google
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const { site, projects } = content;

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url.startsWith("https") ? site.url : "https://localhost:3000"),
  title: site.title,
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.ownerName }],
  creator: site.ownerName,
  // B1.5 / B7.4: Production indexing enabled
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: site.url },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.ownerName,
    locale: site.locale,
    type: "website",
    images: [
      { url: site.ogImage, width: 1200, height: 630, alt: site.ogImageAlt },
      { url: site.ogImage, width: 800, height: 800, alt: site.ogImageAlt },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  // themeColor moved to viewport export above
  manifest: "/site.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  appleWebApp: { title: site.ownerShort },
};

// JSON-LD graph — generated entirely from content.ts
function buildJsonLd() {
  const instagramList = projects.instagramPages.map((page, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: page.handle,
    url: page.href,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: site.ownerName,
        url: site.url,
        sameAs: [
          "https://www.instagram.com/the_fahyan",
          "https://github.com/9984-fahyan",
        ],
      },
      {
        "@type": "ProfessionalService",
        name: site.ownerName,
        url: site.url,
        description: site.description,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Photography & Cinematography Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photography" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cinematography" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video Editing" } },
          ],
        },
      },
      {
        "@type": "WebSite",
        name: site.ownerName,
        url: site.url,
      },
      {
        "@type": "ItemList",
        name: "Instagram Pages Managed",
        itemListElement: instagramList,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What services does ${site.ownerName} offer?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: "Professional photography, cinematography, and video editing services.",
            },
          },
          {
            "@type": "Question",
            name: `How can I contact ${site.ownerName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `You can reach out through the contact form on this website or email directly at ${content.hero.socials.find((s) => s.icon === "email")?.href.replace("mailto:", "") || "contact"}.`,
            },
          },
        ],
      },
    ],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="alternate" type="text/plain" href="/llms.txt" />
        {/* B2.19: JSON-LD injection protection — escape '<' */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        {/* B5.1: No-JS / pre-hydration fallback so content is never blank if JS is disabled */}
        <noscript>
          <style>{`
            [style*="opacity: 0"],
            [style*="opacity:0"],
            .hero-inner > *,
            .about-grid > *,
            .contact-heading,
            .contact-form,
            .reels-track > *,
            .gallery-grid > * {
              opacity: 1 !important;
              transform: none !important;
            }
          `}</style>
        </noscript>
      </head>
      <body style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
