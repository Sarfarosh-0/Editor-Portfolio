"use client";
// components/Reels.tsx
// Marquee of vertical 9:16 reel cards. Clicking any card opens a full-screen overlay viewer.

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Reveal from "./Reveal";
import { content } from "@/content/content";

// ---------------------------------------------------------------------------
// Full-screen reel viewer (rendered into a portal on document.body)
// ---------------------------------------------------------------------------
type ReelItem = { src: string; poster?: string; label: string };

function ReelViewer({ reel, onClose }: { reel: ReelItem; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Lock body scroll while viewer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Autoplay the video
  useEffect(() => {
    videoRef.current?.play().catch(() => { /* silent: gesture may be needed */ });
  }, []);

  // Keyboard: Escape closes viewer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Click on dark backdrop (not the container) closes viewer
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  return createPortal(
    <div
      className="reel-viewer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Viewing: ${reel.label}`}
      onClick={handleBackdropClick}
    >
      <div className="reel-viewer-container">
        {/* Close button */}
        <button className="reel-viewer-close" onClick={onClose} aria-label="Close reel viewer">
          <svg viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Video frame */}
        <div className="reel-viewer-frame">
          {loading && !videoError && (
            <div className="reel-viewer-spinner" aria-label="Loading video…">
              <div className="reel-spinner-ring" />
            </div>
          )}
          {videoError ? (
            <div className="reel-viewer-error">
              <svg viewBox="0 0 24 24" width="44" height="44" stroke="currentColor" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                <line x1="12" y1="8" x2="12" y2="13" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              <span>Unable to load this video</span>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="reel-viewer-video"
              src={reel.src}
              poster={reel.poster}
              controls
              playsInline
              preload="auto"
              aria-label={reel.label}
              onCanPlay={() => setLoading(false)}
              onError={() => { setVideoError(true); setLoading(false); }}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// Main Reels section
// ---------------------------------------------------------------------------
export default function Reels() {
  const { projects } = content;
  const [selected, setSelected] = useState<ReelItem | null>(null);

  if (!projects.reels || projects.reels.length === 0) {
    return null;
  }

  const openViewer = (reel: ReelItem) => setSelected(reel);
  const closeViewer = () => setSelected(null);

  return (
    <>
      <section className="reels" aria-label={projects.reelsTitle}>
        <Reveal y={20} once={false}>
          <h2 className="reels-title">{projects.reelsTitle}</h2>
        </Reveal>

        <Reveal y={30} delay={0.1} once={false} style={{ width: "100%", overflow: "hidden" }}>
          <div className="reels-track">
            {[...projects.reels, ...projects.reels].map((reel, i) => (
              <button
                key={`${reel.src}-${i}`}
                className="reel"
                onClick={() => openViewer(projects.reels[i % projects.reels.length])}
                aria-label={`Play reel: ${reel.label}`}
              >
                <video
                  className="reel-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  poster={reel.poster}
                  aria-hidden="true"
                  tabIndex={-1}
                  onError={(e) => { e.currentTarget.style.opacity = "0"; }}
                >
                  <source src={reel.src} type="video/mp4" />
                </video>

                {/* Play icon overlay */}
                <div className="reel-overlay" aria-hidden="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Full-screen viewer portal */}
      {selected && <ReelViewer reel={selected} onClose={closeViewer} />}
    </>
  );
}
