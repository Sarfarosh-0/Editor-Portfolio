// components/Footer.tsx
// Footer: tagline + copyright line. Year is dynamic.

import { content } from "@/content/content";

export default function Footer() {
  const { footer, site } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer-tagline">{footer.tagline}</p>
      <p className="footer-copy">
        <span suppressHydrationWarning>{year}</span> {site.ownerName}. {footer.signOff}
      </p>
    </footer>
  );
}
