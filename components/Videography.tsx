"use client";
// components/InstagramPages.tsx
// "Instagram Pages Managed" section — card grid of managed IG accounts.
// Edit content in: content/content.ts → projects.instagramPages
// Place page images in: public/assets/ig/

import Image from "next/image";
import Reveal from "./Reveal";
import { content } from "@/content/content";

// Instagram gradient matching the real brand colours
const IG_GRADIENT =
  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

export default function InstagramPages() {
  const { instagramPagesTitle, instagramPages } = content.projects;

  if (!instagramPages || instagramPages.length === 0) {
    return null;
  }

  return (
    <section className="ig-section" aria-label={instagramPagesTitle}>
      {/* Section heading */}
      <Reveal y={20} once={false}>
        <div className="ig-heading">
          <span className="ig-heading-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="url(#ig-grad)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4.5" />
              <circle cx="17.5" cy="6.5" r="1" fill="url(#ig-grad)" stroke="none" />
            </svg>
          </span>
          <h2 className="ig-title">{instagramPagesTitle}</h2>
        </div>
      </Reveal>

      {/* Card grid */}
      <div className="ig-grid">
        {instagramPages.map((page, i) => (
          <Reveal key={`${page.handle}-${i}`} y={32} delay={i * 0.1} once={false}>
            <article className="ig-card">
              {/* Profile image */}
              <div className="ig-card-img-wrap">
                <div className="ig-card-img-ring" aria-hidden="true" />
                <div className="ig-card-img">
                  <Image
                    src={page.image}
                    alt={`${page.handle} Instagram page`}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      // Gracefully hide if image is missing
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
              </div>

              {/* Card body */}
              <div className="ig-card-body">
                {/* Handle + external link */}
                <a
                  href={page.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-handle-link"
                  aria-label={`Visit ${page.handle} on Instagram`}
                >
                  <span className="ig-handle">{page.handle}</span>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true" className="ig-ext-icon">
                    <path d="M6.5 1.5h-5v13h13v-5M9 1.5h5.5v5.5M5.5 10.5l9.5-9.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                  </svg>
                </a>

                {/* Role badge */}
                <span className="ig-role-badge">{page.role}</span>

                {/* Followers stat */}
                {page.followers && (
                  <p className="ig-followers">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" fill="none" strokeWidth="1.8" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {page.followers}
                  </p>
                )}

                {/* Description */}
                <p className="ig-description">{page.description}</p>

                {/* CTA */}
                <a
                  href={page.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-cta"
                  aria-label={`View ${page.handle} on Instagram`}
                >
                  <span
                    className="ig-cta-icon"
                    aria-hidden="true"
                    style={{ background: IG_GRADIENT }}
                  />
                  View on Instagram
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

