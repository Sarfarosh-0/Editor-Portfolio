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
export type InstagramPage = {
  handle: string;       // e.g. "@the_fahyan" — shown as page name
  href: string;         // full Instagram URL, e.g. "https://www.instagram.com/the_fahyan"
  image: string;        // path to profile screenshot, e.g. "/assets/ig/the_fahyan.jpg"
  role: string;         // short badge, e.g. "Content Creator" | "Social Media Manager"
  description: string;  // 1–3 sentences about what you did/managed
  followers?: string;   // optional display stat, e.g. "12k followers"
};

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
    intro:
      "Hi, I'm Fahyan, a passionate photographer, videographer, and editor with a mission to bring creative ideas to life through exceptional designs and content.",
    image: { src: "/about.jpg", alt: "about photo" },
    paragraph:
      "I'm a driven and passionate creative with a keen eye for detail and a passion for visual storytelling. With 3 years of experience in photography, cinematography, and graphic design, I've been able to work on a diverse variety of projects that not only showcase my abilities but also my dedication to creating meaningful and impactful work. What gets me going is the power of storytelling that resonates. I thrive in a space where I can work with others, learn, and build something greater, always striving to produce work that not only looks good but also feels thoughtful. Software Skills in",
    skills: [
      { name: "capcut", logo: "/tools-icons/capcut.jpg", level: 5 },
      { name: "picsart", logo: "/tools-icons/picsart.jpg", level: 4 },
      {
        name: "Davinchi Resolve",
        logo: "/tools-icons/DaVinci_Resolve_Studio.png",
        level: 3,
      },
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
        id: "posters",
        label: "Posters",
        images: [
          {
            src: "/assets/gallery/posters/poster-1.jpeg",
            alt: "poster design",
          },
          {
            src: "/assets/gallery/posters/poster-2.jpeg",
            alt: "poster design",
          },
          {
            src: "/assets/gallery/posters/poster-3.jpeg",
            alt: "poster design",
          },
          {
            src: "/assets/gallery/posters/poster-4.jpeg",
            alt: "poster design",
          },
          {
            src: "/assets/gallery/posters/poster-5.jpeg",
            alt: "poster design",
          },
          {
            src: "/assets/gallery/posters/poster-6.jpeg",
            alt: "poster design",
          },
        ],
      },
      {
        id: "nature",
        label: "Nature",
        images: [
          {
            src: "/assets/gallery/nature/nature-1.jpeg",
            alt: "nature photograph",
          },
          {
            src: "/assets/gallery/nature/nature-2.jpeg",
            alt: "nature photograph",
          },
          {
            src: "/assets/gallery/nature/nature-3.jpeg",
            alt: "nature photograph",
          },
          {
            src: "/assets/gallery/nature/nature-4.jpeg",
            alt: "nature photograph",
          },
          {
            src: "/assets/gallery/nature/nature-5.jpeg",
            alt: "nature photograph",
          },
          {
            src: "/assets/gallery/nature/nature-6.jpeg",
            alt: "nature photograph",
          },
        ],
      },
      {
        id: "movies",
        label: "Movies",
        images: [
          {
            src: "/assets/gallery/movies/movie-1.jpg",
            alt: "Perfect Days",
          },
          {
            src: "/assets/gallery/movies/movie-2.jpg",
            alt: "A Taxi Driver",
          },
          {
            src: "/assets/gallery/movies/movie-3.jpg",
            alt: "Miracle in Cell No. 7",
          },
          {
            src: "/assets/gallery/movies/movie-4.jpg",
            alt: "Past Lives",
          },
          {
            src: "/assets/gallery/movies/movie-5.jpg",
            alt: "The last 10 Years",
          },
          {
            src: "/assets/gallery/movies/movie-6.jpg",
            alt: "Soulmate",
          },
        ],
      },
    ] as GalleryCategory[],

    instagramPagesTitle: "Instagram Pages Managed",
    instagramPages: [
      // ── Add / edit your Instagram pages here ──────────────────────────────
      // image: place the file in public/assets/ig/ and set the path below.
      // ─────────────────────────────────────────────────────────────────────
      {
        handle: "@PLACEHOLDER_handle",
        href: "https://www.instagram.com/PLACEHOLDER",
        image: "/assets/ig/page-1.jpg", // place your screenshot/logo here
        role: "Content Creator",
        description: "PLACEHOLDER – describe the account, what type of content you created, campaigns you ran, or the results you achieved.",
        followers: "PLACEHOLDER k",
      },
      {
        handle: "@PLACEHOLDER_handle",
        href: "https://www.instagram.com/PLACEHOLDER",
        image: "/assets/ig/page-2.jpg",
        role: "Social Media Manager",
        description: "PLACEHOLDER – describe the account, what type of content you created, campaigns you ran, or the results you achieved.",
        followers: "PLACEHOLDER k",
      },
      {
        handle: "@PLACEHOLDER_handle",
        href: "https://www.instagram.com/PLACEHOLDER",
        image: "/assets/ig/page-3.jpg",
        role: "Photographer & Editor",
        description: "PLACEHOLDER – describe the account, what type of content you created, campaigns you ran, or the results you achieved.",
        followers: "PLACEHOLDER k",
      },
    ] as InstagramPage[],
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

