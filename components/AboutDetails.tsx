"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import { content } from "@/content/content";

export default function AboutDetails() {
  const { about } = content;

  return (
    <div className="about-grid">
      {/* Left: about image — slides in from left */}
      <Reveal x={-60} once={false}>
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
      <Reveal x={60} once={false}>
        <div className="about-text">
          <p>{about.paragraph}</p>

          {/* Skills grid with staggered viewport reveal */}
          {about.skills.length > 0 && (
            <motion.div
              className="skills-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.09,
                    delayChildren: 0.12,
                  },
                },
              }}
            >
              {about.skills.map((skill, si) => (
                <motion.div
                  key={skill.name}
                  className="skill-card"
                  variants={{
                    hidden: { opacity: 0, y: 24, scale: 0.93 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  {/* Logo with pop-in reveal */}
                  <motion.div
                    variants={{
                      hidden: { scale: 0.75, opacity: 0 },
                      visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
                    }}
                  >
                    <Image
                      src={skill.logo}
                      alt={skill.name}
                      width={50}
                      height={50}
                      className="skill-logo"
                    />
                  </motion.div>

                  <span className="skill-name">{skill.name}</span>

                  {/* Dots with sequential progressive loading wave */}
                  <div className="skill-dots" aria-label={`${skill.level} out of 5`}>
                    {Array.from({ length: 5 }, (_, di) => {
                      const isFilled = di < skill.level;
                      return (
                        <motion.span
                          key={di}
                          className={`skill-dot${isFilled ? " filled" : ""}`}
                          variants={{
                            hidden: { opacity: 0, scale: 0.4, y: 4 },
                            visible: {
                              opacity: isFilled ? 1 : 0.35,
                              scale: isFilled ? [0.4, 1.3, 1] : 1,
                              y: 0,
                              transition: {
                                duration: 0.4,
                                ease: [0.34, 1.56, 0.64, 1],
                                delay: si * 0.08 + di * 0.065,
                              },
                            },
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
