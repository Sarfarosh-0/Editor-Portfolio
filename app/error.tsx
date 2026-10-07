"use client";
// app/error.tsx
// Global error boundary with sleek dark aesthetic and recovery action.

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error Caught]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "2.5rem",
            marginBottom: "1rem",
          }}
          aria-hidden="true"
        >
          ⚠️
        </span>
        <h2
          style={{
            fontFamily: "Impact, sans-serif",
            fontSize: "2rem",
            letterSpacing: "0.04em",
            margin: "0 0 0.8rem",
            color: "#ffffff",
          }}
        >
          SOMETHING WENT WRONG
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "1.8rem",
          }}
        >
          An unexpected error occurred. Please try again or return to the main portfolio.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "rgba(66, 220, 255, 0.12)",
              border: "1px solid rgba(66, 220, 255, 0.5)",
              color: "#42dcff",
              padding: "0.75rem 1.6rem",
              borderRadius: "50px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              padding: "0.75rem 1.6rem",
              borderRadius: "50px",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: "0.9rem",
            }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
