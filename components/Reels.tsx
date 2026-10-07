"use client";
// components/Reels.tsx
// Full-bleed marquee of vertical 9:16 reel videos, rendered twice for seamless loop.
// TODO(confirm): no click handler, no pause-on-hover (overlay is pointer-events:none).

import Reveal from "./Reveal";
import { content } from "@/content/content";

export default function Reels() {
  const { projects } = content;

  if (!projects.reels || projects.reels.length === 0) {
    return null;
  }

  return (
    <section className="reels" aria-label={projects.reelsTitle}>
      <Reveal y={20} once={false}>
        <h2 className="reels-title">{projects.reelsTitle}</h2>
      </Reveal>

      {/* Track: smoothly animates into view on scroll */}
      <Reveal y={30} delay={0.1} once={false} style={{ width: "100%", overflow: "hidden" }}>
        <div className="reels-track">
        {[...projects.reels, ...projects.reels].map((reel, i) => (
          <div
            key={`${reel.src}-${i}`}
            className="reel"
          >
            {/* errata: autoPlay loop muted playsInline preload="metadata" */}
            <video
              className="reel-video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={reel.poster}
              aria-label={reel.label}
              onError={(e) => {
                // If video fails to load, gracefully hide video element so clean #0a0a0a card remains
                e.currentTarget.style.opacity = "0";
              }}
            >
              <source src={reel.src} type="video/mp4" />
            </video>

            {/* Play icon overlay — pointer-events:none */}
            <div className="reel-overlay" aria-hidden="true">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>
        ))}
        </div>
      </Reveal>
    </section>
  );
}
