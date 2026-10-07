"use client";
// components/Videography.tsx
// Featured Videography section: list of YouTube video cards.
// errata: film titles NOT rendered as visible text, only as iframe title.
// errata: iframe src uses ?enablejsapi=1, loading="lazy".
// B2.21: Validate youtubeId against /^[\w-]{11}$/; bad/placeholder values render graceful dark frame.

import Reveal from "./Reveal";
import { content } from "@/content/content";

const YOUTUBE_ID_REGEX = /^[\w-]{11}$/;

export default function Videography() {
  const { videographyTitle, films } = content.projects;

  if (!films || films.length === 0) {
    return null;
  }

  return (
    <section className="videography" aria-label={videographyTitle}>
      <Reveal y={20} once={false}>
        <h2 className="videography-title">{videographyTitle}</h2>
      </Reveal>

      <div className="videography-list">
        {films.map((film, i) => {
          const isValidYoutubeId = YOUTUBE_ID_REGEX.test(film.youtubeId);

          return (
            <Reveal key={`${film.youtubeId}-${i}`} y={28} delay={i * 0.08} once={false} className="videography-item">
              <article className="video-card">
                <div className="video-frame">
                  {isValidYoutubeId ? (
                    <iframe
                      className="video-iframe"
                      src={`https://www.youtube.com/embed/${film.youtubeId}?enablejsapi=1`}
                      title={film.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "#0d0d0d",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255, 255, 255, 0.4)",
                        fontSize: "0.85rem",
                        gap: "0.5rem",
                      }}
                      aria-label={film.title}
                    >
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                      <span>{film.title}</span>
                    </div>
                  )}
                </div>
                {/* Description with pre-line to preserve line breaks */}
                <p className="video-desc">{film.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
