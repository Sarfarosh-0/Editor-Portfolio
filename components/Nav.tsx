"use client";
// components/Nav.tsx
// Fixed pill navigation with Framer Motion layoutId moving highlight pill.
// TODO(confirm): active section tracked via IntersectionObserver

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/content/content";

export default function Nav() {
  const [activeTarget, setActiveTarget] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && content.nav.some((n) => n.target === hash)) return hash;
    }
    return content.nav[0]?.target ?? "";
  });
  const observedElements = useRef<Set<string>>(new Set());

  // B6.4: Handle initial hash navigation & active section tracking even with lazy-loaded sections
  useEffect(() => {
    const observedSet = observedElements.current;

    // Check initial hash on mount
    const hash = window.location.hash.replace("#", "");
    if (hash && content.nav.some((n) => n.target === hash)) {
      const tryScroll = () => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return true;
        }
        return false;
      };
      if (!tryScroll()) {
        const timer = setInterval(() => {
          if (tryScroll()) clearInterval(timer);
        }, 100);
        setTimeout(() => clearInterval(timer), 3000);
      }
    }

    const observers: IntersectionObserver[] = [];

    const attachObservers = () => {
      content.nav.forEach(({ target }) => {
        if (observedSet.has(target)) return;
        const el = document.getElementById(target);
        if (!el) return;

        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveTarget(target);
          },
          { threshold: 0.25, rootMargin: "-80px 0px -20% 0px" }
        );
        obs.observe(el);
        observers.push(obs);
        observedSet.add(target);
      });
    };

    attachObservers();

    // Check periodically for lazy-loaded sections (Projects, Contact) until all are observed
    const pollInterval = setInterval(() => {
      attachObservers();
      if (observedSet.size >= content.nav.length) {
        clearInterval(pollInterval);
      }
    }, 250);

    return () => {
      clearInterval(pollInterval);
      observers.forEach((o) => o.disconnect());
      observedSet.clear();
    };
  }, []);

  const handleClick = (target: string) => {
    setActiveTarget(target);
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const timer = setInterval(() => {
        const lazyEl = document.getElementById(target);
        if (lazyEl) {
          lazyEl.scrollIntoView({ behavior: "smooth", block: "start" });
          clearInterval(timer);
        }
      }, 50);
      setTimeout(() => clearInterval(timer), 2000);
    }
  };

  return (
    <motion.div
      className="nav-wrap"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="nav" aria-label="Primary">
        {content.nav.map(({ label, target }) => {
          const isActive = activeTarget === target;
          return (
            <div key={target} className="nav-item">
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    className="nav-pill"
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <button
                id={`nav-${target}`}
                className={isActive ? "nav-link--active" : "nav-link"}
                aria-current={isActive ? "true" : undefined}
                onClick={() => handleClick(target)}
              >
                {label}
              </button>
            </div>
          );
        })}
      </nav>
    </motion.div>
  );
}
