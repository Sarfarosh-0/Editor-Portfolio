"use client";
// components/ImageViewer.tsx
// Full-screen lightbox viewer for gallery images with top-right close button,
// prev/next navigation, keyboard shortcuts, swipe support, and body-scroll lock.

import { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { GalleryImage } from "@/content/content";

interface ImageViewerProps {
  images: GalleryImage[];
  currentIndex: number;
  categoryLabel?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function ImageViewer({
  images,
  currentIndex,
  categoryLabel,
  onClose,
  onNavigate,
}: ImageViewerProps) {
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const currentImage = images[currentIndex] || images[0];
  const hasMultiple = images.length > 1;

  // Navigate next / prev with wrap-around
  const handleNext = useCallback(() => {
    if (!hasMultiple) return;
    setLoading(true);
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  const handlePrev = useCallback(() => {
    if (!hasMultiple) return;
    setLoading(true);
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  // Lock body scroll while open
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Keyboard navigation: Escape closes, ArrowLeft/ArrowRight navigates
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  // Click on dark backdrop (not content) closes viewer
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Mobile touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe (greater than 45px and more horizontal than vertical)
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!currentImage) return null;

  return createPortal(
    <div
      className="image-viewer-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.alt || `${categoryLabel || "Gallery"} image viewer`}
      onClick={handleBackdropClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top bar with meta info (category & counter) and Close button */}
      <div className="image-viewer-header">
        <div className="image-viewer-meta">
          {categoryLabel && (
            <span className="image-viewer-category">{categoryLabel}</span>
          )}
          {hasMultiple && (
            <span className="image-viewer-counter">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Top-right close button */}
        <button
          className="image-viewer-close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Prev Navigation Arrow */}
      {hasMultiple && (
        <button
          className="image-viewer-nav image-viewer-prev"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous image"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Image frame and caption */}
      <div
        className="image-viewer-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-viewer-frame">
          {loading && (
            <div className="image-viewer-spinner" aria-label="Loading image…">
              <div className="image-spinner-ring" />
            </div>
          )}
          <Image
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || `${categoryLabel || "Gallery"} image`}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: "contain" }}
            className={`image-viewer-img ${loading ? "image-viewer-img--loading" : "image-viewer-img--loaded"}`}
            onLoad={() => setLoading(false)}
          />
        </div>

        {currentImage.alt && (
          <p className="image-viewer-caption">{currentImage.alt}</p>
        )}
      </div>

      {/* Next Navigation Arrow */}
      {hasMultiple && (
        <button
          className="image-viewer-nav image-viewer-next"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next image"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  );
}
