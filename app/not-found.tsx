// app/not-found.tsx
// Custom 404 page matching portfolio dark aesthetic.

import Link from "next/link";

export default function NotFound() {
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
          padding: "3rem 2rem",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          style={{
            fontFamily: "Impact, sans-serif",
            fontSize: "4.5rem",
            color: "#42dcff",
            lineHeight: 1,
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          404
        </span>
        <h2
          style={{
            fontFamily: "Impact, sans-serif",
            fontSize: "1.8rem",
            letterSpacing: "0.04em",
            margin: "0 0 0.8rem",
            color: "#ffffff",
          }}
        >
          PAGE NOT FOUND
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "rgba(66, 220, 255, 0.15)",
            border: "1px solid rgba(66, 220, 255, 0.5)",
            color: "#ffffff",
            padding: "0.75rem 2rem",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: 500,
            fontSize: "0.9rem",
            transition: "all 0.3s ease",
          }}
        >
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
}
