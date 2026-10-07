// content/content.ts
// =====================================================================
// EDIT THIS FILE ONLY. Every value marked PLACEHOLDER is sample data.
// Layout, styles and components must NOT need changes to swap content.
// =====================================================================

export type Social = {
  label: string; // accessible name, e.g. "Instagram"
  href: string; // https:// | mailto: | path to CV pdf
  icon: "instagram" | "github" | "email" | "cv" | { src: string }; // { src } = custom svg/img url
  external?: boolean; // opens in new tab (rel="noopener noreferrer")
};

export type Skill = { name: string; logo: string; level: 1 | 2 | 3 | 4 | 5 }; // level -> filled dots (see section 12)
export type Reel = { src: string; poster?: string; label: string };
export type GalleryImage = { src: string; alt: string };
export type GalleryCategory = {
  id: string;
  label: string;
  images: GalleryImage[];
};
export type Film = { title: string; youtubeId: string; description: string };

export const content = {
  site: {
    ownerName: "PLACEHOLDER Full Name",
    ownerShort: "PLACEHOLDER", // used in <meta apple-mobile-web-app-title>
    url: "https://PLACEHOLDER-DOMAIN.example",
    locale: "en_IN",
    themeColor: "#000000",
    twitterHandle: "@PLACEHOLDER",
    title: "PLACEHOLDER Name | Professional Photographer & Cinematographer",
    description: "PLACEHOLDER: one-sentence site description for SEO.",
    keywords: ["PLACEHOLDER keyword 1", "PLACEHOLDER keyword 2"],
    ogImage: "/placeholders/og-image.svg", // 1200x630
    ogImageAlt: "PLACEHOLDER alt text",
  },

  nav: [
    { label: "About", target: "about" },
    { label: "Projects", target: "projects" },
    { label: "Contact", target: "contact" },
  ],

  hero: {
    photo: { src: "/Fahyan.jpeg", alt: "PLACEHOLDER profile photo" },
    showAvailability: true,
    availabilityText: "available for work",
    firstName: "FAHYAN", // Impact, white
    lastName: "🦅", // Instrument Serif italic, shimmer
    roleLine: "Photographer - Videographer - Editor",
    locationLine: "Based from India",
    socials: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/the_fahyan",
        icon: "instagram",
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/9984-fahyan",
        icon: "github",
        external: true,
      },
      { label: "Email", href: "mailto:fahyan399@gmail.com", icon: "email" },
      { label: "View CV", href: "#", icon: "cv" }, // PLACEHOLDER: link to a PDF
    ] as Social[],
  },

  about: {
    titleLead: "More about",
    titleAccent: "myself",
    backgroundGif: "/placeholders/about-bg.gif", // animated background (full-bleed)
    intro: "Hi, I'm Fahyan, a passionate photographer, videographer, and editor with a mission to bring creative ideas to life through exceptional designs and content.",
    image: { src: "/about.jpg", alt: "about photo" },
    paragraph:
      "I'm a driven and passionate creative with a keen eye for detail and a passion for visual storytelling. With 3 years of experience in photography, cinematography, and graphic design, I've been able to work on a diverse variety of projects that not only showcase my abilities but also my dedication to creating meaningful and impactful work. What gets me going is the power of storytelling that resonates. I thrive in a space where I can work with others, learn, and build something greater, always striving to produce work that not only looks good but also feels thoughtful. Software Skills in",
    skills: [
      { name: "capcut", logo: "/tools-icons/capcut.jpg", level: 5 },
      { name: "picsart", logo: "/tools-icons/canva.jpg", level: 4 },
      { name: "Davinchi Resolve", logo: "/tools-icons/DaVinci_Resolve_Studio.png", level: 3 },
      { name: "Canva", logo: "/tools-icons/canva.jpg", level: 5 },
      { name: "Gemmni", logo: "/tools-icons/gemmni.jpg", level: 4 },
    ] as Skill[],
  },

  projects: {
    reelsTitle: "Reels",
    reels: [
      { src: "/assets/reels/reel-1.mp4", label: "reel 1" },
      { src: "/assets/reels/reel-2.mp4", label: "reel 2" },
      { src: "/assets/reels/reel-3.mp4", label: "reel 3" },
      { src: "/assets/reels/reel-4.mp4", label: "reel 4" },
      { src: "/assets/reels/reel-5.mp4", label: "reel 5" },
      { src: "/assets/reels/reel-6.mp4", label: "reel 6" },
    ] as Reel[],

    galleryCategories: [
      {
        id: "wildlife",
        label: "Wildlife",
        images: placeholderImages("wildlife", 6),
      },
      {
        id: "portraits",
        label: "Portraits",
        images: placeholderImages("portraits", 6),
      },
      {
        id: "fashion",
        label: "Fashion",
        images: placeholderImages("fashion", 6),
      },
      {
        id: "concerts",
        label: "Concerts",
        images: placeholderImages("concerts", 6),
      },
    ] as GalleryCategory[],

    videographyTitle: "Featured Videography",
    films: [
      // reference has 4 films
      {
        title: "PLACEHOLDER Film 1",
        youtubeId: "PLACEHOLDER_ID",
        description: "PLACEHOLDER description. Line breaks are preserved.",
      },
      {
        title: "PLACEHOLDER Film 2",
        youtubeId: "PLACEHOLDER_ID",
        description: "PLACEHOLDER description.",
      },
      {
        title: "PLACEHOLDER Film 3",
        youtubeId: "PLACEHOLDER_ID",
        description: "PLACEHOLDER description.",
      },
      {
        title: "PLACEHOLDER Film 4",
        youtubeId: "PLACEHOLDER_ID",
        description: "PLACEHOLDER description.",
      },
    ] as Film[],
  },

  contact: {
    headingLead: "Get in",
    headingAccent: "touch",
    subtext: "PLACEHOLDER: short invitation to get in touch.",
    submitLabel: "Send Message",
    fields: {
      name: { label: "Name", placeholder: "Your name" },
      email: { label: "Email", placeholder: "you@example.com" },
      subject: {
        label: "Subject",
        placeholder: "Photography booking - Collaboration - ...",
      },
      message: {
        label: "Message",
        placeholder: "Tell me about your project or idea...",
      },
    },
    recipientEmail: "placeholder@example.com",
    // Submission handling: see section 12 (default is a stubbed handler). // TODO(confirm):
  },

  footer: {
    tagline: "PLACEHOLDER: short footer tagline.",
    signOff: "PLACEHOLDER sign-off line.", // rendered as "<year> <ownerName>. <signOff>"
  },
};

// Helper that returns neutral placeholder tiles so the gallery works before real photos exist.
function placeholderImages(prefix: string, n: number): GalleryImage[] {
  return Array.from({ length: n }, (_, i) => ({
    src: `/placeholders/${prefix}-${i + 1}.svg`,
    alt: `PLACEHOLDER ${prefix} photograph ${i + 1}`,
  }));
}
