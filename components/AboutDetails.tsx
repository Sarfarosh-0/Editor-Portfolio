"use client";
// components/AboutDetails.tsx
// About details grid: left = photo (slides from left), right = paragraph + skills grid (slides from right).
// Skill dots fill per level, staggered reveal. TODO(confirm): dots filled cyan per level.

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { content } from "@/content/content";

export default function AboutDetails() {
  const { about } = content;

  return (
    <div className="about-grid">
      {/* Left: about image — slides in from left */}
      <Reveal x={-100}>
        <div className="about-image">
          <Image
            src={about.image.src}
            alt={about.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Reveal>

      {/* Right: text + skills — slides in from right */}
      <Reveal x={100}>
        <div className="about-text">
          <p>{about.paragraph}</p>

          {/* Skills grid */}
          {about.skills.length > 0 && (
            <div className="skills-grid">
              {about.skills.map((skill, si) => (
                <motion.div
                  key={skill.name}
                  className="skill-card"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: si * 0.08,
                  }}
                >
                  {/* Logo */}
                  <Image
                    src={skill.logo}
                    alt={skill.name}
                    width={50}
                    height={50}
                    className="skill-logo"
                  />

                  {/* Dots — TODO(confirm): fill `level` dots cyan, rest at .08 opacity */}
                  <div className="skill-dots" aria-label={`${skill.level} out of 5`}>
                    {Array.from({ length: 5 }, (_, di) => (
                      <motion.span
                        key={di}
                        className={`skill-dot${di < skill.level ? " filled" : ""}`}
                        initial={{ opacity: 0, y: 6, scale: 0.75 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          ease: [0.22, 1, 0.36, 1],
                          delay: si * 0.08 + di * 0.05,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
