// components/Footer.tsx
// Footer: tagline + copyright line. Year is dynamic.

import Reveal from "./Reveal";
import { content } from "@/content/content";

export default function Footer() {
  const { footer, site } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Reveal y={16} once={false}>
        <p className="footer-tagline">{footer.tagline}</p>
        <p className="footer-copy">
          <span suppressHydrationWarning>{year}</span> {site.ownerName}. {footer.signOff}
        </p>
      </Reveal>
    </footer>
  );
}
