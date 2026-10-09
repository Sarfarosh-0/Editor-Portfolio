"use client";
// components/GalleryTabs.tsx
// Category tabs + image gallery grid. Tab switch animates with AnimatePresence fade + tile restagger.
// TODO(confirm): tab-switch animation: fade out/in (AnimatePresence), tiles re-stagger.
// TODO(confirm): gallery tile click = no lightbox; cursor:pointer only.

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { content } from "@/content/content";

import Reveal from "./Reveal";
import ImageViewer from "./ImageViewer";

export default function GalleryTabs() {
  const { galleryCategories } = content.projects;
  const [activeId, setActiveId] = useState(galleryCategories?.[0]?.id ?? "");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  if (!galleryCategories || galleryCategories.length === 0) {
    return null;
  }

  const activeCategory = galleryCategories.find((c) => c.id === activeId) || galleryCategories[0];

  // B7.2 & B5.14: Accessible keyboard arrow navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % galleryCategories.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + galleryCategories.length) % galleryCategories.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = galleryCategories.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextCat = galleryCategories[nextIndex];
    if (nextCat) {
      setActiveId(nextCat.id);
      setViewerIndex(null);
      document.getElementById(`tab-${nextCat.id}`)?.focus();
    }
  };

  const handleTabChange = (id: string) => {
    setActiveId(id);
    setViewerIndex(null);
  };

  return (
    <div style={{ marginTop: "3rem" }}>
      {/* Tabs pill with scroll-triggered entrance */}
      <Reveal y={20} once={false}>
        <div className="tabs" role="tablist" aria-label="Gallery categories">
          {galleryCategories.map((cat, idx) => (
            <button
              key={cat.id}
              id={`tab-${cat.id}`}
              role="tab"
              aria-selected={cat.id === (activeCategory?.id ?? activeId)}
              tabIndex={cat.id === (activeCategory?.id ?? activeId) ? 0 : -1}
              aria-controls="tabpanel-gallery"
              className={cat.id === (activeCategory?.id ?? activeId) ? "tab--active" : "tab"}
              onClick={() => handleTabChange(cat.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Gallery grid — fades between tabs */}
      <div
        id="tabpanel-gallery"
        role="tabpanel"
        aria-labelledby={`tab-${activeId}`}
      >
        <AnimatePresence mode="wait">
          {activeCategory && (
            <motion.div
              key={activeId}
              className="gallery-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeCategory.images.map((img, i) => (
                <motion.button
                  key={`${activeId}-${img.src}-${i}`}
                  type="button"
                  className="gallery-tile"
                  onClick={() => setViewerIndex(i)}
                  aria-label={`View full size: ${img.alt || activeCategory.label}`}
                  initial={{ opacity: 0, y: 22, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: (i % 6) * 0.08,
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 280px"
                    style={{ objectFit: "cover" }}
                  />

                  {/* Expand icon hover overlay */}
                  <div className="gallery-tile-overlay" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-screen lightbox viewer */}
      {viewerIndex !== null && activeCategory && (
        <ImageViewer
          images={activeCategory.images}
          currentIndex={viewerIndex}
          categoryLabel={activeCategory.label}
          onClose={() => setViewerIndex(null)}
          onNavigate={(index) => setViewerIndex(index)}
        />
      )}
    </div>
  );
}
