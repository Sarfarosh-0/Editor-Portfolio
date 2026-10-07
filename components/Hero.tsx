"use client";
// components/Hero.tsx
// Hero section: avatar ring, status badge, title, tagline, socials.
// All copy from content.ts — no literal strings in this component.

import Image from "next/image";
import { motion } from "framer-motion";
import { content } from "@/content/content";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const CvIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

// Stagger delays for hero entrance (avatar → badge → title → tagline → socials)
const delays = [0, 0.12, 0.22, 0.32, 0.42];

export default function Hero() {
  const { hero } = content;

  return (
    <section className="hero" aria-label="Hero">
      <div className="hero-inner">
        {/* Avatar with floating + pulsing ring */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delays[0] }}
        >
          <div className="avatar-ring" tabIndex={0} aria-label={hero.photo.alt}>
            <div className="avatar">
              <Image
                src={hero.photo.src}
                alt={hero.photo.alt}
                fill
                priority
                sizes="(max-width: 768px) 200px, 300px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Status badge */}
        {hero.showAvailability && (
          <motion.div
            className="status-badge"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delays[1] }}
          >
            <span className="status-dot" aria-hidden="true" />
            {hero.availabilityText}
          </motion.div>
        )}

        {/* h1 title: firstName (Impact) + lastName (Instrument Serif shimmer) + caret */}
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delays[2] }}
        >
          <span className="first">{hero.firstName}&nbsp;</span>
          <span className="last">{hero.lastName}</span>
          <span className="hero-caret" aria-hidden="true" />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delays[3] }}
        >
          {hero.roleLine}
          <br />
          <span className="tagline-line2">{hero.locationLine}</span>
        </motion.p>

        {/* Socials */}
        {hero.socials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: delays[4] }}
          >
            <div className="socials">
              {hero.socials.map(({ label, href, icon, external }) => {
                const isJsScheme = href.trim().toLowerCase().startsWith("javascript:");
                const safeHref = isJsScheme ? "#" : href;
                // Cast icon type to string | { src: string } to allow "github"
                const iconName = icon as string | { src: string };

                return (
                  <a
                    key={label}
                    href={safeHref}
                    className="social-link"
                    aria-label={label}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {iconName === "instagram" && <InstagramIcon />}
                    {iconName === "github" && <GithubIcon />}
                    {iconName === "facebook" && (
                      <Image src="/icons/facebook.svg" alt="" width={30} height={30} aria-hidden="true" />
                    )}
                    {iconName === "email" && <EmailIcon />}
                    {iconName === "cv" && <CvIcon />}
                    {typeof iconName === "object" && "src" in iconName && (
                      <Image src={iconName.src} alt="" width={30} height={30} aria-hidden="true" />
                    )}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}