// app/page.tsx
// Main page: composes all sections in DOM order per PRD §3.
// Projects and Contact are lazy-loaded (below the fold).

import dynamic from "next/dynamic";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/AboutIntro";
import AboutDetails from "@/components/AboutDetails";

// Lazy-load below-the-fold sections per PRD §3
const Reels = dynamic(() => import("@/components/Reels"), {
  loading: () => <div style={{ minHeight: "60vh" }} />,
});
const GalleryTabs = dynamic(() => import("@/components/GalleryTabs"), {
  loading: () => <div style={{ minHeight: "30vh" }} />,
});
const Videography = dynamic(() => import("@/components/Videography"), {
  loading: () => <div style={{ minHeight: "30vh" }} />,
});
const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div style={{ minHeight: "40vh" }} />,
});
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="page">
      {/* Fixed nav */}
      <Nav />

      {/* Spacer under fixed nav (errata) */}
      <div style={{ height: "80px" }} aria-hidden="true" />

      {/* Hero */}
      <main id="main-content">
        <Hero />

        {/* About: banner (#about) + details grid */}
        <AboutIntro />
        <AboutDetails />

        {/* Projects (#projects): Reels + Gallery + Videography */}
        <section id="projects" className="projects">
          <Reels />
          <GalleryTabs />
          <Videography />
        </section>

        {/* Contact (#contact) */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
