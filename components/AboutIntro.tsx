"use client";
// components/AboutIntro.tsx
// Full-width #about banner: animated GIF bg, overlay, title "More about myself", intro text.

import Image from "next/image";
import Reveal from "./Reveal";
import { content } from "@/content/content";

export default function AboutIntro() {
  const { about } = content;

  return (
    <section id="about" className="about-hero">
      {/* Background GIF */}
      <div className="about-bg" aria-hidden="true">
        <Image
          src={about.backgroundGif}
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          unoptimized // GIFs need unoptimized to animate
        />
      </div>

      {/* Content over overlay (z-index 2) */}
      <Reveal style={{ position: "relative", zIndex: 2, width: "100%", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <h2 className="about-title">
          {about.titleLead}&nbsp;
          <span>{about.titleAccent}</span>
        </h2>
        <p className="about-intro">{about.intro}</p>
      </Reveal>
    </section>
  );
}
