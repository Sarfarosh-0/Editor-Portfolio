# PRD / Build Prompt: Photographer & Cinematographer Portfolio (Pixel-Faithful Recreation)

> **Give this whole document to an AI coding agent or developer.**
> Goal: rebuild an existing one-page portfolio website as faithfully as possible. All personal content lives in **one data file** with clearly marked placeholders, so the owner can swap in real content without touching layout or components.

---

## 0. Ground rules (read first)

1. **Reproduce, don't redesign.** Layout, colors, type, spacing, animations and copy structure must match this spec. Appendix A holds the **exact CSS extracted from the reference site**. Use it as the stylesheet.
2. **Do not invent** sections, features, copy, pages, or UI that are not listed here. Specifically **do NOT add**: Experience, Education, Certifications, a standalone Projects grid, blog, dark/light toggle, cursor effects, preloader, lightbox, or modals.
3. **All personal content is placeholder data.** Never hardcode names, links, copy, images, or video IDs in components. Everything comes from `content.ts` (section 8).
4. **Anything not recoverable from the reference is listed in section 12** with a default. Implement the default, mark it with a `// TODO(confirm):` comment, and do not expand it.
5. **Single page.** One route (`/`). Sections: Nav, Hero, About, Projects (Reels + Gallery + Featured Videography), Contact, Footer.

---

## 1. Tech stack (defaults)

| Concern | Choice |
|---|---|
| Framework | **Next.js (App Router)**, TypeScript |
| Styling | **Plain global CSS** (`app/globals.css`) using the semantic class names in Appendix A. No Tailwind or CSS-in-JS needed |
| Scroll/entrance animation | **Framer Motion** (`motion`, `whileInView`, `AnimatePresence`). The reference uses inline `opacity:0` and `transform` start states, which is the Framer Motion signature |
| Images | `next/image` (fill mode, `sizes` per section below) |
| Fonts | `next/font`: **Geist** + **Geist Mono** (variable), **Instrument Serif** (italic accent). **Impact** is a system font: `font-family: "Impact", sans-serif` |
| Hosting | Vercel-ready, static where possible |

> Section 12 explains the stack defaults and what to confirm.

### Suggested structure
```
app/
  layout.tsx          # fonts, <html lang="en" class="h-full antialiased">, metadata, JSON-LD
  page.tsx            # composes sections
  globals.css         # Appendix A + base reset
components/
  Nav.tsx  Hero.tsx  AboutIntro.tsx  AboutDetails.tsx
  Reels.tsx  GalleryTabs.tsx  Videography.tsx  Contact.tsx  Footer.tsx
  Reveal.tsx          # reusable Framer Motion wrapper (section 6)
content/
  content.ts          # THE ONLY FILE THE OWNER EDITS (section 8)
public/
  placeholders/       # neutral placeholder images (section 9)
  assets/reels/       # placeholder reel videos, kebab-case names
```

---

## 2. Design tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `--bg` | `#000000` | Page, sections, footer base |
| `--fg` | `#ffffff` | Primary text |
| `--accent` | `rgb(66, 220, 255)` (cyan) | Glows, borders, active states, shimmer. Used at many alphas: `0.03 · 0.05 · 0.1 · 0.12 · 0.15 · 0.2 · 0.3 · 0.35 · 0.4 · 0.55 · 0.6 · 0.7 · 0.8 · 0.85 · 0.9 · 1` |
| `--accent-2` | `rgba(120, 255, 215, 0.1)` (mint) | Tab hover sweep gradient end |
| `--success` | `#4caf50` | "Available" dot/badge, valid input border (alpha 0.08–0.35) |
| Glass fill | `rgba(255,255,255,0.03)` (inputs/tiles `0.04–0.05`) | Nav, tabs, cards, form |
| Borders | `rgba(255,255,255, 0.05 / 0.06 / 0.08 / 0.1 / 0.12 / 0.15)` | Hairlines |
| Text opacities | `0.4 · 0.45 · 0.5 · 0.55 · 0.7 · 0.78 · 0.9 · 0.94` | Muted copy tiers |
| Theme color | `#000000` | `<meta name="theme-color">` |

The site is **dark only**. There is no light theme. 
thank you

### Typography
| Role | Family | Details |
|---|---|---|
| Display / headings | `"Impact", sans-serif` | Hero first name, "More about", "Reels", "Get in" |
| Accent words | `"Instrument Serif", serif`, **italic**, weight 400 | Last name, "myself", "touch". Gradient shimmer on hero last name and "myself" |
| Body / UI | Geist (fallback system sans) | Everything else (nav, paragraphs, labels, buttons) |

Key sizes (all `clamp`, see Appendix A for the rest): hero title `clamp(2.5rem, 6vw, 4rem)` (mobile `clamp(2rem, 12vw, 2.8rem)`) · tagline `clamp(0.9rem, 2vw, 1.05rem)` · About title `clamp(1.7rem, 5vw, 4rem)` · Reels title `clamp(1.4rem, 3vw, 2rem)` · Videography title `clamp(1.4rem, 3.4vw, 2.4rem)` · Contact title `clamp(2rem, 5vw, 3.5rem)`.

### Radii, shadows, blur
- Radii: pills `50px` · nav-link/tab `25px` · about image `20px` · gallery container `20px` · gallery tile `15px` · reel `16px` · skill card `14px` · video card `14px` / frame `10px` · form `24px` (mobile `16px`) · inputs `10px` · skill logo `12px` · skill dot `4px`
- Glass blur: nav/tabs `blur(10px)` · form `blur(12px)` · footer `blur(5px)` · video card `blur(4px)`
- Glow shadows: all cyan glows follow the pattern `0 0 Npx rgba(66,220,255,α)` (values in Appendix A)

---

## 3. Page layout and DOM order

```
<div class="page">                       // black, padding 1rem clamp(1rem,3vw,7rem), fixed gradient overlay
  <div class="nav-wrap"><nav class="nav"> …3 items… </nav></div>   // position: fixed
  <div style="height:80px"></div>        // spacer under the fixed nav
  <div class="hero"> avatar-ring, status-badge, hero-title, hero-tagline, socials </div>
  <section id="about" class="about-hero"> about-bg (GIF), about-title, about-intro </section>
  <div class="about-grid"> about-image | about-text (paragraph + skills-grid) </div>
  <section id="projects" class="projects">
      <section class="reels"> reels-title, reels-track (items rendered TWICE) </section>
      <div> tabs + gallery-grid </div>
      <section class="videography"> videography-title + list of video cards </section>
  </section>
  <section id="contact" class="contact"> heading + subtext + form </section>
  <footer class="footer"> footer-tagline, footer-copy </footer>
</div>
```
- `#projects` and `#contact` are **lazy / below the fold** in the original (fallback `min-height: 60vh` / `40vh`). Lazy-load them with `next/dynamic` or `Suspense`.
- The `.page::before` is a **fixed** full-screen gradient (`transparent → rgba(0,0,0,.95)`), `pointer-events:none`, `z-index:0`; all children are `position:relative; z-index:1`.

---

## 4. Section specifications

### 4.1 Navigation (fixed pill)
- **Container**: `.nav-wrap` is `position:fixed; top:1rem; left:0; right:0; z-index:9999; display:flex; justify-content:center; pointer-events:none`. The `.nav` pill re-enables `pointer-events:auto`.
- **Pill**: glass (`rgba(255,255,255,.03)`, `blur(10px)`, 1px `rgba(255,255,255,.12)` border), `border-radius:50px`, `fit-content` width, gap `0.3rem`, padding `0.6rem 0.8rem`.
- **Items (3, from data)**: **About · Projects · Contact**. Plain `<button>`s (no icons, no logo).
- **Active state**: active label is white at weight 500; inactive labels are `rgba(255,255,255,.55)` at 400 and turn white on hover. The active item has a **highlight pill** behind it: `inset:0; border-radius:25px; background rgba(66,220,255,.12); border 1px rgba(66,220,255,.3); box-shadow 0 0 12px rgba(66,220,255,.15)`. The pill **moves between items** (use Framer Motion `layoutId`).
- **Behavior**: clicking an item smooth-scrolls to `#about`, `#projects` or `#contact`. The active item follows the section in view (default; see section 12).
- **Entrance**: fades in from `opacity:0, translateY(-20px)`.
- **Mobile (≤768px)**: pill becomes `width:min(100%,24rem)`, wraps, radius `24px`, tighter padding/gap, smaller labels.

### 4.2 Hero
Vertical stack, centered, `padding-top:3rem`, with a soft radial cyan glow (`600×600` circle, `rgba(66,220,255,.05)`) behind it.
1. **Avatar**: circle `min(300px,80vw)` (mobile `190px`). Outer ring = `conic-gradient` cyan with `3px` padding. Inner circle clips the photo (`object-fit:cover`, **`filter: grayscale(100%)`**, `transition: filter .6s, transform .6s`). The ring **floats** (5s) and **pulses a glow** (3s). `tabindex=0`, `cursor:pointer`. Image is eager-loaded and preloaded (LCP). `sizes="(max-width: 768px) 200px, 300px"`.
2. **Status badge**: pill reading "available for work" with a **7px green dot** that pulses (`2s`). Background `rgba(76,175,80,.08)`, border `rgba(76,175,80,.25)`, text `rgba(255,255,255,.7)`, `letter-spacing:.04em`. Toggleable from data.
3. **Title (h1)**: two spans: first name in **Impact, white**; last name in **Instrument Serif italic** with a moving cyan→white gradient (shimmer, 4s) and a **blinking cyan caret** (`2px × 1em`) after it.
4. **Tagline**: line 1 `Role - Role - Role` in `rgba(255,255,255,.55)`; line 2 (after `<br>`) in **cyan `rgba(66,220,255,.6)` at `0.9em`** (e.g. "Based from [Country]"). `max-width:520px`.
5. **Social row** (`gap:2rem`, mobile `1rem`, wraps): icons are **30px** (mobile 26px), white via `filter: invert(1)`, scale `1.1` on hover. Items in the reference: **Instagram, Facebook, Email (mailto), View CV**. The data file must allow any list of `{label, href, icon}`; email and CV icons are inline SVG (stroke white, 1.2).
6. **Entrance**: avatar → badge → title → tagline → socials, each from `opacity:0, translateY(24px)`, staggered.

### 4.3 About
**(a) Intro banner (`#about`)**: full-width, `min-height:80vh` (mobile `auto`), margin `4rem auto`. Background is an **animated GIF** (`about-bg`, `object-fit:cover`) under a **`rgba(0,0,0,.6)` overlay**. Content is left-aligned: h2 "**More about** *myself*" (Impact + shimmering italic serif span), then a one-sentence intro (`max-width:600px`, `padding-left:2rem`; mobile `1rem`). Section fades in from `opacity:0`.

**(b) Details grid**: `grid-template-columns: 1fr 1fr`, `gap:4rem` (≤1024: `2rem`; ≤768: single column, `2rem`).
- **Left**: image, height `min(400px,50vh)` (mobile `300px`), radius `20px`, 1px hairline border, shadow `0 8px 32px rgba(0,0,0,.3)`. Image filter `brightness(1.5) contrast(.9) saturate(1.1)`. On hover: image scales `1.04`, shadow deepens with a faint cyan glow, border turns cyan `.2`. Slides in from **left** (`translateX(-100px)`).
- **Right**: paragraph (`line-height:1.8`, margin-bottom `1.5rem`; mobile centered) that ends with the lead-in **"Software Skills in"**, followed by the **skills grid**. Slides in from **right** (`translateX(100px)`).
- **Skills grid**: `repeat(3, minmax(120px,1fr))`, `gap:1rem` (mobile: 1 column). Each **skill card**: glass, radius `14px`, padding `.85rem .75rem`, centered column, gap `.7rem`, containing a **50×50 logo** (radius `12px`) and a row of **5 small dots** (`12×12`, radius `4px`, 1px `rgba(255,255,255,.2)` border). Cards reveal from `translateY(12px)`, dots from `translateY(6px) scale(.75)`, both staggered. The reference lists 5 tools: Photoshop, Premiere Pro, After Effects, Illustrator, Lightroom (placeholders in data).

### 4.4 Projects (`#projects`)
Wrapper: `max-width:1200px`, margin `6rem auto 0` (mobile `4rem auto 0`), padding `0 2rem` (mobile `0 1rem`). Fades in.

**(a) Reels marquee**
- Title "**Reels**" (Impact, `letter-spacing:.05em`, centered).
- **Full-bleed** band (`width:100vw`, escape the container with `left:50%; margin-left:-50vw`), `padding:2.5rem 0`, background `rgba(0,0,0,.3)`, with **left/right edge fades** (`120px`; mobile `48px`, `#000 → transparent`).
- **Track**: `display:flex; gap:var(--reel-gap)` (`1rem`; mobile `.75rem`); `width:max-content`. **Render the reel list twice** back to back. Animation `marquee`: `translateX(0) → translateX(calc(-50% - var(--reel-gap)/2))`, **36s linear infinite** (mobile **46s**) for a seamless loop.
- **Reel card**: `aspect-ratio:9/16`, width `clamp(124px,42vw,200px)` (mobile `clamp(120px,44vw,160px)`), radius `16px`, 1px `rgba(255,255,255,.1)` border, bg `#0a0a0a`. Contains `<video autoplay loop muted playsinline preload="metadata">` filling the card, plus a **centered play-icon overlay** (`rgba(0,0,0,.35)`, 48px white triangle with cyan drop-shadow, `pointer-events:none`).
- **Hover**: border cyan `.4`, glow `0 0 24px rgba(66,220,255,.2)` + `0 8px 30px rgba(0,0,0,.5)`, `scale(1.04)`.
- The reference has **6 unique reels** (12 DOM nodes, since the list is duplicated).

**(b) Category tabs + image gallery**
- **Tabs pill**: glass pill, centered, `gap:3rem` (mobile `.5rem`, full width, wraps). Reference tabs: **Wildlife · Portraits · Fashion · Concerts**. The active tab has a cyan tint (`rgba(66,220,255,.15)`, cyan border, glow); inactive tabs are transparent at `opacity:.7`. Hover on any tab: lift `translateY(-5px) scale(1.05)`, glow, `letter-spacing:.5px`, and a mint-cyan gradient sweeps in from the left (`.6s`). Transition `.4s cubic-bezier(.175,.885,.32,1.275)`.
- **Gallery container**: `repeat(3,1fr)`, `gap:2rem`, padding `2rem`, glass bg `rgba(255,255,255,.03)`, border `rgba(255,255,255,.08)`, radius `20px`. ≤1024: 2 columns (`gap:1.25rem`); ≤768: 1 column (`padding:1rem .75rem`, `gap:1rem`).
- **Tile**: square (`aspect-ratio:1`), `max-width:280px` (none on mobile), radius `15px`, centered. Images are **grayscale** by default. On hover: **color returns** (`grayscale(0) brightness(1.05)`), the image scales `1.05`, and the tile lifts (`translateY(-8px) scale(1.02)`, shadow `0 16px 40px rgba(0,0,0,.5)`, border `.2`). **No hover transform on mobile.** Tiles reveal from `translateY(15px)`. `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 280px"`.
- The reference shows **6 images** in the default (first) tab.

**(c) Featured Videography**
- Title "**Featured Videography**" (centered, weight 600, `letter-spacing:.04em`, `rgba(255,255,255,.94)`).
- A vertical list (`gap:1rem`) of **video cards**. Each card: dark glass (`rgba(0,0,0,.68)`, `blur(4px)`, 1px `rgba(255,255,255,.12)`, radius `14px`, padding `clamp(.7rem,1.8vw,1rem)`) containing a **16:9 YouTube iframe** (radius `10px`, black bg, lazy-loaded, `enablejsapi=1`) and a **description paragraph** (`rgba(255,255,255,.78)`, `line-height:1.7`, **`white-space:pre-line`** so line breaks in data are preserved). The reference has **4 cards**: iframe `title` equals the film title; **the title is not rendered as visible text**.

### 4.5 Contact (`#contact`)
- Section: black, `padding:6rem 2rem` (mobile `4rem 1rem`), with a **1px top accent line** (`min(600px,80%)`, `transparent → cyan .4 → transparent`).
- **Heading**: "Get in *touch*": Impact `clamp(2rem,5vw,3.5rem)`, with "touch" in Instrument Serif italic, cyan `.85`. **Subtext**: `rgba(255,255,255,.45)`, `max-width:420px`, one or two lines.
- **Form** (`max-width:680px`, glass, radius `24px`, padding `3rem` (mobile `1.5rem`, radius `16px`), gap `1.5rem`):
  - Row 1 (2 columns, 1 column ≤560px): **Name** (`autocomplete=name`), **Email** (`type=email`, `autocomplete=email`).
  - **Subject** (full width).
  - **Message** (`textarea`, `min-height:160px`, `resize:vertical`).
  - All 4 fields **required**. Labels: `0.75rem`, uppercase, `letter-spacing:.1em`, `rgba(255,255,255,.4)`. Ids: `cf-name`, `cf-email`, `cf-subject`, `cf-message`.
  - **Input states**: focus → cyan border `.55`, `3px` cyan ring `.1` + soft glow, bg tint `.03`; placeholder dims to `.4` opacity on focus; **valid and non-empty → green border `rgba(76,175,80,.35)`**.
  - **Submit button** "Send Message": full width, pill, cyan tint, `letter-spacing:.06em`, with a continuous **ring pulse** (2.5s). Hover: brighter bg, glow, letter-spacing widens to `.1em`. Disabled: `opacity:.6`.
- Placeholder texts in the reference: name `"Aashish"` (**treat as sample data**), email `you@example.com`, subject `Photography booking - Collaboration - ...`, message `Tell me about your project or idea...`.

### 4.6 Footer
Full width, padding `1.5rem 1rem`, top border `rgba(255,255,255,.05)`, bg `rgba(0,0,0,.3)` with `blur(5px)`, centered. Line 1: a short tagline (`rgba(255,255,255,.78)`, `.95rem`, `letter-spacing:.03em`). Line 2: `"<year> <Owner Name>. <sign-off line>"` (`rgba(255,255,255,.5)`, `.8rem`). Year is dynamic. No © symbol in the reference.

---

## 5. Hover/focus micro-interactions (summary)
Avatar photo filter/scale transitions · social icons scale `1.1` · about image scale + glow · skill cards (none beyond reveal) · reels scale `1.04` + glow · tabs lift + sweep · gallery tiles lift + color · inputs focus glow · submit letter-spacing + glow. All values are in Appendix A.

---

## 6. Animations

| Name | Where | Spec |
|---|---|---|
| Entrance (`Reveal`) | nav, hero items, sections, about image/text, skill cards/dots, gallery tiles, contact heading + form | Start `opacity:0` plus offset; animate to `opacity:1` and zero offset on **entering the viewport (once)**. Offsets: nav `y:-20` · hero items `y:24` · about image `x:-100` · about text `x:100` · skill cards `y:12` · dots `y:6, scale:.75` · gallery tiles `y:15` · contact heading `y:20` · contact form `y:30` · sections: opacity only. Use **stagger** for hero items, skill cards/dots and tiles |
| `float` | avatar ring | 5s ease-in-out infinite: `translateY 0 → -10px (33%) → -6px (66%)` with tiny rotation `±0.5deg` |
| `ring-pulse` | avatar ring | 3s ease-in-out infinite expanding glow `0 0 0 0 → 0 0 0 16px` |
| `pulse` | status dot | 2s infinite, scale `1 → 1.3`, glow intensifies |
| `shimmer-hero` | hero last name | 4s linear infinite, `background-position -300% → 300%` (`background-size:200% auto`) |
| `shimmer` | About "myself" | 4s linear infinite, `-200% → 200%` |
| `blink` | hero caret | 1s `step-end` infinite |
| `marquee` | reels track | 36s (mobile 46s) linear infinite |
| `submit-pulse` | submit button | 2.5s ease-in-out infinite |

- Add `@media (prefers-reduced-motion: reduce)` that disables `float`, `ring-pulse`, `shimmer*`, `marquee`, `pulse`, `blink` and entrance offsets. This is an **accessibility-only** addition and has no visual effect for other users.
- **Duration/easing for entrance animations are not in the source.** Default: `0.6s`, `cubic-bezier(0.22, 1, 0.36, 1)`.

---

## 7. Responsive behavior

| Breakpoint | Changes |
|---|---|
| **≤1024px** (tablet) | Page padding `1rem 3rem` · about grid gap `2rem` · gallery 2 columns |
| **≤768px** (mobile) | Page padding `.85rem` · nav pill wraps, radius 24px, `min(100%,24rem)` · avatar `190px` · hero title `clamp(2rem,12vw,2.8rem)` · socials gap `1rem`, icons 26px · about banner `min-height:auto`, margins `2rem` · about grid 1 column, text centered · skills 1 column · reels slower (46s), edge fades 48px, narrower cards · tabs full-width and wrapping · gallery 1 column, no hover transform · projects margin `4rem`, padding `0 1rem` · contact padding `4rem 1rem` |
| **≤640px** | Contact form padding `1.5rem`, radius `16px` |
| **≤560px** | Form name/email row becomes 1 column |
| Desktop (>1024px) | Page padding `1rem clamp(1rem,3vw,7rem)`; everything else as specified above |

Viewport meta: `width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes`. **Never** disable pinch zoom.

---

## 8. Content model: the ONLY file the owner edits

Create `content/content.ts`. Every string below is **placeholder**. Anything marked `PLACEHOLDER` must be replaced. Components must never contain literal copy.

```ts
// content/content.ts
// =====================================================================
// EDIT THIS FILE ONLY. Every value marked PLACEHOLDER is sample data.
// Layout, styles and components must NOT need changes to swap content.
// =====================================================================

export type Social = {
  label: string;                    // accessible name, e.g. "Instagram"
  href: string;                     // https:// | mailto: | path to CV pdf
  icon: "instagram" | "facebook" | "email" | "cv" | { src: string }; // { src } = custom svg/img url
  external?: boolean;               // opens in new tab (rel="noopener noreferrer")
};

export type Skill = { name: string; logo: string; level: 1 | 2 | 3 | 4 | 5 }; // level -> filled dots (see section 12)
export type Reel = { src: string; poster?: string; label: string };
export type GalleryImage = { src: string; alt: string };
export type GalleryCategory = { id: string; label: string; images: GalleryImage[] };
export type Film = { title: string; youtubeId: string; description: string };

export const content = {
  site: {
    ownerName: "PLACEHOLDER Full Name",
    ownerShort: "PLACEHOLDER",                 // used in <meta apple-mobile-web-app-title>
    url: "https://PLACEHOLDER-DOMAIN.example",
    locale: "en_IN",
    themeColor: "#000000",
    twitterHandle: "@PLACEHOLDER",
    title: "PLACEHOLDER Name | Professional Photographer & Cinematographer",
    description: "PLACEHOLDER: one-sentence site description for SEO.",
    keywords: ["PLACEHOLDER keyword 1", "PLACEHOLDER keyword 2"],
    ogImage: "/placeholders/og-image.svg",    // 1200x630
    ogImageAlt: "PLACEHOLDER alt text",
  },

  nav: [
    { label: "About", target: "about" },
    { label: "Projects", target: "projects" },
    { label: "Contact", target: "contact" },
  ],

  hero: {
    photo: { src: "/placeholders/profile.svg", alt: "PLACEHOLDER profile photo" },
    showAvailability: true,
    availabilityText: "available for work",
    firstName: "PLACEHOLDER",                  // Impact, white
    lastName: "Surname",                       // Instrument Serif italic, shimmer
    roleLine: "Photographer - Videographer - Editor",
    locationLine: "Based from PLACEHOLDER Country",
    socials: [
      { label: "Instagram", href: "https://instagram.com/PLACEHOLDER", icon: "instagram", external: true },
      { label: "Facebook",  href: "https://facebook.com/PLACEHOLDER",  icon: "facebook",  external: true },
      { label: "Email",     href: "mailto:placeholder@example.com",    icon: "email" },
      { label: "View CV",   href: "#",                                 icon: "cv" },      // PLACEHOLDER: link to a PDF
    ] as Social[],
  },

  about: {
    titleLead: "More about",
    titleAccent: "myself",
    backgroundGif: "/placeholders/about-bg.gif",         // animated background (full-bleed)
    intro: "PLACEHOLDER: one-sentence introduction.",
    image: { src: "/placeholders/about.svg", alt: "PLACEHOLDER about photo" },
    paragraph: "PLACEHOLDER: about paragraph. End with the lead-in to the skills list. Software Skills in",
    skills: [
      { name: "Photoshop",    logo: "/placeholders/skill-1.svg", level: 5 },
      { name: "Premiere Pro", logo: "/placeholders/skill-2.svg", level: 5 },
      { name: "After Effects",logo: "/placeholders/skill-3.svg", level: 5 },
      { name: "Illustrator",  logo: "/placeholders/skill-4.svg", level: 5 },
      { name: "Lightroom",    logo: "/placeholders/skill-5.svg", level: 5 },
    ] as Skill[],
  },

  projects: {
    reelsTitle: "Reels",
    reels: [                                   // reference has 6 unique reels
      { src: "/assets/reels/reel-1.mp4", label: "PLACEHOLDER reel 1" },
      { src: "/assets/reels/reel-2.mp4", label: "PLACEHOLDER reel 2" },
      { src: "/assets/reels/reel-3.mp4", label: "PLACEHOLDER reel 3" },
      { src: "/assets/reels/reel-4.mp4", label: "PLACEHOLDER reel 4" },
      { src: "/assets/reels/reel-5.mp4", label: "PLACEHOLDER reel 5" },
      { src: "/assets/reels/reel-6.mp4", label: "PLACEHOLDER reel 6" },
    ] as Reel[],

    galleryCategories: [                       // first category is the default tab
      { id: "wildlife",  label: "Wildlife",  images: placeholderImages("wildlife", 6) },
      { id: "portraits", label: "Portraits", images: placeholderImages("portraits", 6) },
      { id: "fashion",   label: "Fashion",   images: placeholderImages("fashion", 6) },
      { id: "concerts",  label: "Concerts",  images: placeholderImages("concerts", 6) },
    ] as GalleryCategory[],

    videographyTitle: "Featured Videography",
    films: [                                   // reference has 4 films
      { title: "PLACEHOLDER Film 1", youtubeId: "PLACEHOLDER_ID", description: "PLACEHOLDER description. Line breaks are preserved." },
      { title: "PLACEHOLDER Film 2", youtubeId: "PLACEHOLDER_ID", description: "PLACEHOLDER description." },
      { title: "PLACEHOLDER Film 3", youtubeId: "PLACEHOLDER_ID", description: "PLACEHOLDER description." },
      { title: "PLACEHOLDER Film 4", youtubeId: "PLACEHOLDER_ID", description: "PLACEHOLDER description." },
    ] as Film[],
  },

  contact: {
    headingLead: "Get in",
    headingAccent: "touch",
    subtext: "PLACEHOLDER: short invitation to get in touch.",
    submitLabel: "Send Message",
    fields: {
      name:    { label: "Name",    placeholder: "Your name" },
      email:   { label: "Email",   placeholder: "you@example.com" },
      subject: { label: "Subject", placeholder: "Photography booking - Collaboration - ..." },
      message: { label: "Message", placeholder: "Tell me about your project or idea..." },
    },
    recipientEmail: "placeholder@example.com",
    // Submission handling: see section 12 (default is a stubbed handler).
  },

  footer: {
    tagline: "PLACEHOLDER: short footer tagline.",
    signOff: "PLACEHOLDER sign-off line.",     // rendered as "<year> <ownerName>. <signOff>"
  },
};

// Helper that returns neutral placeholder tiles so the gallery works before real photos exist.
function placeholderImages(prefix: string, n: number) {
  return Array.from({ length: n }, (_, i) => ({
    src: `/placeholders/${prefix}-${i + 1}.svg`,
    alt: `PLACEHOLDER ${prefix} photograph ${i + 1}`,
  }));
}
```

**Rules for components:** loop over arrays (never assume counts); hide a block if its data is empty (e.g. no `socials` → no row); the status badge is controlled by `showAvailability`; the nav derives from `content.nav`.

---

## 9. Image and asset requirements

| Asset | Spec | Placeholder |
|---|---|---|
| Hero profile | Square, shown as a 300px circle; use `sizes="(max-width: 768px) 200px, 300px"`; preload | `/placeholders/profile.svg` (neutral grey, "PROFILE" label) |
| About background | **Animated GIF** (or looped video) covering a full-width banner; `sizes="100vw"` | `/placeholders/about-bg.gif`: a dark animated gradient or static dark image |
| About image | ~800×800, displayed 400px tall, cover | `/placeholders/about.svg` |
| Skill logos | 50×50 displayed (source ≥128px), radius 12px | `/placeholders/skill-N.svg` |
| Gallery images | Square tiles ≤280px; source ≥1200px recommended | `/placeholders/<category>-N.svg` ×6 per category |
| Reels | **Vertical 9:16** `.mp4`, muted, short loops, small file size | `/assets/reels/reel-N.mp4` (placeholder clips; `poster` fallback) |
| Social icons | Instagram/Facebook as SVG (inverted white via CSS filter); email + CV as inline SVG | Bundled icons |
| Open Graph | 1200×630 and an 800×800 | `/placeholders/og-image.svg` |
| Favicon / manifest | `favicon.ico`, `site.webmanifest` | Generic |

- Placeholder images must be **visibly neutral** (flat grey with a small label such as "PLACEHOLDER 3") so nothing looks like final content.
- Use **kebab-case file names** with no spaces or parentheses. (The reference uses names like `Sequence 01_6.mp4`, which are fragile.)
- Remote images (e.g. a CDN) must be added to `next.config` `images.remotePatterns`.

---

## 10. Accessibility and semantic HTML

- Landmarks: `<nav aria-label="Primary">`, `<main>` wrapping hero through contact, `<section>` per major area with `id`, `<footer>`.
- Exactly **one `<h1>`** (hero name); `<h2>` for About title, Reels, Featured Videography, Contact; use `<article>` for each film card.
- Nav buttons: add `aria-current="true"` on the active item; keep visible text labels.
- **Social links need accessible names** (`aria-label` from `label`); external links get `rel="noopener noreferrer"`.
- Gallery tabs: `role="tablist"` / `role="tab"` / `aria-selected`; the grid is the `tabpanel`.
- All images need meaningful `alt` from data. Decorative images (about background, play overlay) use `alt=""`/`aria-hidden`.
- Videos are muted and autoplay: provide no sound; add `aria-label` from `reel.label`.
- Iframes: `title` = film title.
- Form: real `<label for>` for every input, `required`, correct `type`/`autocomplete`; announce submit success/error in an `aria-live="polite"` region.
- Keep a visible focus indicator for keyboard users on buttons/links/tabs (inputs already have a focus ring). Honor `prefers-reduced-motion`.
- Color contrast: muted text tiers (`.4–.55` white on black) are intentionally subdued in the reference. Keep them as specified; use data-driven brighter text only if the owner asks.

---

## 11. SEO and metadata (kept, all data-driven)

The reference ships: `<title>`, description, keywords, author/creator/publisher, robots + googlebot directives, canonical, Open Graph (title, description, url, site name, locale `en_IN`, **two** images with alts, type website), Twitter `summary_large_image` (site, creator, title, description, image), `theme-color`, manifest, favicon, `apple-mobile-web-app-title`, a link to `/llms.txt`, preconnect/dns-prefetch to the image CDN, and a **JSON-LD graph** (`Person`, `ProfessionalService` with an offer catalog, `WebSite`, `FAQPage`, and an `ItemList` of films). Reproduce each from `content.site` / `content.projects.films`; **generate the JSON-LD from data** so it never contains the original owner's details.

---

## 12. Not recoverable from the reference, defaults to apply

The saved HTML contains markup + all CSS but **not the client-side JavaScript behavior**. Implement these defaults, tag each with `// TODO(confirm):`, and **do not add anything beyond them**.

| # | Unknown | Default to implement |
|---|---|---|
| 1 | **Gallery images for Portraits / Fashion / Concerts** (only the first tab's 6 images are in the page) | Data supports N categories × N images; ship 6 placeholders each. Tab switch re-runs the tile reveal |
| 2 | **Tab-switch animation** | Fade the grid out/in (`AnimatePresence`), tiles re-stagger |
| 3 | **Skill dot fill** (5 dots start `rgba(255,255,255,.08)`, then animate) | Fill `level` dots with cyan `rgba(66,220,255,.9)`, leave the rest at `.08`; stagger in |
| 4 | **Hero photo hover/focus** (grayscale + transition exist; the reveal rule is not in the CSS) | On hover/focus: `filter: grayscale(0)`; keep transition `.6s` |
| 5 | **Name "typing"** (a blinking caret follows the last name) | Render the full name immediately; keep the blinking caret (no typewriter) |
| 6 | **Nav active-section tracking** | Highlight follows the section in view (IntersectionObserver); click → smooth scroll |
| 7 | **Reel interactions** | No click handler (overlay has `pointer-events:none`); no pause-on-hover |
| 8 | **Gallery tile click** (`cursor:pointer`) | No lightbox/modal; keep the cursor style only |
| 9 | **Contact form submission** | Client validation + a `submit` handler calling `POST /api/contact` (stub that returns success and logs); button shows disabled state while sending; success/error text in an `aria-live` region. Wire to a real mail provider later, **configured by env var** |
| 10 | **"View CV" target** | `href` from data (`#` placeholder); icon only |
| 11 | **Body font** (Geist variables are on `<html>`, but the global stylesheet chunk was not provided) | Geist with system-sans fallback |
| 12 | **Instrument Serif** (named in CSS but **no font file is loaded** in the reference, so it probably falls back to a generic italic serif) | Load it via `next/font/google` to match design intent. Keep it in one variable so it can be swapped |
| 13 | **Entrance duration/easing** | `0.6s`, `cubic-bezier(0.22,1,0.36,1)`, `once: true`, small stagger (`0.08s`) |
| 14 | **Stack** | Next.js + plain CSS as in section 1 |

---

## 13. Acceptance checklist

- [ ] Visually matches the reference at **1440px, 1024px, 768px and 390px** widths (side-by-side check).
- [ ] Appendix A is used (not re-imagined); gradient text shows (`-webkit-text-fill-color: transparent` present).
- [ ] Sections and order exactly: Nav → Hero → About (banner + details) → Projects (Reels, tabs/gallery, Videography) → Contact → Footer. **Nothing extra.**
- [ ] Reel marquee loops seamlessly with the list rendered twice; no jump at the loop point.
- [ ] Gallery: grayscale to color on hover (desktop), 3/2/1 columns by breakpoint, no hover transforms on mobile.
- [ ] Avatar floats + pulses; status dot pulses; caret blinks; last name shimmers.
- [ ] Nav stays fixed, with a highlight pill that moves between items.
- [ ] Form: required fields, focus/valid styles, disabled-while-sending state.
- [ ] **No personal data remains in components.** A search for the original owner's name, handles, email, YouTube IDs, Cloudinary URLs, or file names returns zero results outside `content.ts` placeholders.
- [ ] Changing only `content.ts` (text, links, images, counts) updates the whole site, including meta tags and JSON-LD, with no component edits.
- [ ] Lighthouse: no layout shift from images (explicit sizes), hero image prioritized, reels `preload="metadata"`.

---

## Appendix A: Reference CSS (extracted from the reference site)

Use this as `globals.css`. Class names were made semantic (the original used generated hashes). Add a `box-sizing` reset, `html { background:#000 }`, and let Autoprefixer add `-webkit-backdrop-filter`. The two `-webkit-` text-fill lines are intentional and must stay.

```css
.page {
  background-color: #000000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem clamp(1rem, 3vw, 7rem);
  color: white;
  overflow-x: hidden;
  position: relative;
}
.page::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg,
  transparent 0%,
  rgba(0, 0, 0, 0.95) 100%);
  pointer-events: none;
  z-index: 0;
}
.page::after {
  content: none;
}
.page>* {
  position: relative;
  z-index: 1;
}
@media (max-width: 1024px) {
  .page {
    padding: 1rem 3rem;
  }
}
@media (max-width: 768px) {
  .page {
    padding: 0.85rem;
  }
}
.nav-wrap {
  position: fixed;
  top: 1rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
  padding: 0 1rem;
}
.nav {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.6rem 0.8rem;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
  width: fit-content;
  transition: background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease;
  box-shadow: none;
}
@media (max-width: 768px) {
  .nav {
    gap: 0.35rem;
    padding: 0.45rem 0.5rem;
    width: min(100%, 24rem);
    justify-content: center;
    flex-wrap: wrap;
    border-radius: 24px;
  }
}
.nav-item {
  position: relative;
}
.nav-pill {
  position: absolute;
  inset: 0;
  border-radius: 25px;
  background: rgba(66, 220, 255, 0.12);
  border: 1px solid rgba(66, 220, 255, 0.3);
  box-shadow: 0 0 12px rgba(66, 220, 255, 0.15);
  z-index: 0;
}
.nav-link--active {
  background: transparent;
  border: none;
  padding: 0.5rem 1.6rem;
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: color 0.25s ease;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}
.nav-link--active:hover {
  color: #fff;
}
@media (max-width: 768px) {
  .nav-link--active {
    padding: 0.45rem 0.85rem;
    font-size: 0.8rem;
  }
}
.nav-link {
  background: transparent;
  border: none;
  padding: 0.5rem 1.6rem;
  color: rgba(255, 255, 255, 0.55);
  border-radius: 25px;
  cursor: pointer;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 400;
  letter-spacing: 0.02em;
  transition: color 0.25s ease;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}
.nav-link:hover {
  color: #fff;
}
@media (max-width: 768px) {
  .nav-link {
    padding: 0.45rem 0.85rem;
    font-size: 0.8rem;
  }
}
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  padding-top: 3rem;
  padding-bottom: 1rem;
  padding-inline: 1rem;
}
.hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle,
  rgba(66, 220, 255, 0.05) 0%,
  transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.avatar-ring {
  position: relative;
  width: min(300px, 80vw);
  height: min(300px, 80vw);
  border-radius: 50%;
  background: conic-gradient(rgba(66, 220, 255, 0.8) 0deg,
  rgba(66, 220, 255, 0) 120deg,
  rgba(255, 255, 255, 0.1) 240deg,
  rgba(66, 220, 255, 0.8) 360deg);
  padding: 3px;
  animation: float 5s ease-in-out infinite, ring-pulse 3s ease-in-out infinite;
  cursor: pointer;
  z-index: 1;
}
@media (max-width: 768px) {
  .avatar-ring {
    width: 190px;
    height: 190px;
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-10px) rotate(0.5deg);
  }
  66% {
    transform: translateY(-6px) rotate(-0.5deg);
  }
}
@keyframes ring-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(66, 220, 255, 0.5), 0 0 24px rgba(66, 220, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 0 16px rgba(66, 220, 255, 0), 0 0 50px rgba(66, 220, 255, 0.25);
  }
}
.avatar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.6s ease, transform 0.6s ease;
}
.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(76, 175, 80, 0.08);
  border: 1px solid rgba(76, 175, 80, 0.25);
  padding: 0.4rem 1rem;
  border-radius: 50px;
  letter-spacing: 0.04em;
}
.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.8);
  animation: pulse 2s infinite;
  flex-shrink: 0;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
  }
  50% {
    transform: scale(1.3);
    box-shadow: 0 0 16px rgba(76, 175, 80, 1);
  }
}
.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin: 1.2rem 0 0;
  text-align: center;
  line-height: 1;
  z-index: 1;
}
.hero-title span.first {
  font-family: "Impact", sans-serif;
  color: #fff;
  display: inline-block;
}
.hero-title span.last {
  font-family: "Instrument Serif", serif;
  font-style: italic;
  font-weight: 400;
  background: linear-gradient(90deg,
  rgba(255, 255, 255, 0.7) 0%,
  rgba(66, 220, 255, 1) 40%,
  rgba(255, 255, 255, 1) 60%,
  rgba(66, 220, 255, 0.7) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-hero 4s linear infinite;
  display: inline-block;
}
@media (max-width: 768px) {
  .hero-title {
    font-size: clamp(2rem, 12vw, 2.8rem);
  }
}
@keyframes shimmer-hero {
  0% {
    background-position: -300% center;
  }
  100% {
    background-position: 300% center;
  }
}
.hero-caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: rgba(66, 220, 255, 0.8);
  vertical-align: middle;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.hero-tagline {
  color: rgba(255, 255, 255, 0.55);
  margin: 1rem 0 2rem;
  text-align: center;
  font-size: clamp(0.9rem, 2vw, 1.05rem);
  max-width: 520px;
  padding: 0 1rem;
  line-height: 1.5;
  z-index: 1;
}
@media (max-width: 768px) {
  .hero-tagline {
    margin-bottom: 1.5rem;
  }
}
.socials {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
@media (max-width: 768px) {
  .socials {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
}
.social-link {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.social-link img {
  width: 30px;
  height: 30px;
  filter: invert(1);
  transition: all 0.3s ease;
}
.social-link:hover {
  color: white;
}
.social-link:hover img {
  transform: scale(1.1);
}
@media (max-width: 768px) {
  .social-link img {
    width: 26px;
    height: 26px;
  }
}
.about-hero {
  width: 100%;
  margin: 4rem auto;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  background: #000000;
}
@media (max-width: 768px) {
  .about-hero {
    margin: 2rem auto;
    min-height: auto;
  }
}
.about-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
  backdrop-filter: none;
}
.about-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}
.about-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
  transform: none;
  filter: none;
}
.about-title {
  font-family: "Impact", sans-serif;
  font-weight: 80;
  position: relative;
  z-index: 2;
  font-size: clamp(1.7rem, 5vw, 4rem);
  margin-bottom: 2rem;
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
  line-height: 1.2;
  text-align: left;
  width: 100%;
  padding-left: 2rem;
  color: white;
}
.about-title span {
  display: inline-block;
  padding: 0 0.2rem 0.12em;
  line-height: 1.2;
  overflow: visible;
  font-style: italic;
  font-family: "Instrument Serif", serif;
  font-weight: 80;
  font-size: clamp(2rem, 4vw, 3rem);
  background: linear-gradient(90deg,
  rgba(255, 255, 255, 0.6) 0%,
  rgba(66, 220, 255, 0.9) 40%,
  rgba(255, 255, 255, 1) 60%,
  rgba(66, 220, 255, 0.6) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}
@media (max-width: 768px) {
  .about-title {
    margin-bottom: 1.5rem;
    gap: 0.5rem;
    padding-left: 1rem;
  }
}
.about-intro {
  position: relative;
  z-index: 2;
  color: white;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: 1.6;
  max-width: 600px;
  padding-left: 2rem;
  margin-top: 1rem;
}
@media (max-width: 768px) {
  .about-intro {
    padding-left: 1rem;
  }
}
.about-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 4rem;
}
@media (max-width: 1024px) {
  .about-grid {
    gap: 2rem;
    margin-top: 2rem;
  }
}
@media (max-width: 768px) {
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 1.5rem;
  }
}
.about-image {
  position: relative;
  width: 100%;
  height: min(400px, 50vh);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
}
.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.5) contrast(0.9) saturate(1.1);
  transition: filter 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.about-image:hover {
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(66, 220, 255, 0.1);
  border-color: rgba(66, 220, 255, 0.2);
}
.about-image:hover img {
  transform: scale(1.04);
}
@media (max-width: 768px) {
  .about-image {
    height: 300px;
    margin: 0 auto;
  }
}
.about-text {
  color: white;
  font-size: clamp(1rem, 1vw, 1.1rem);
  line-height: 1.8;
}
.about-text p {
  margin-bottom: 1.5rem;
}
.about-text p:last-child {
  margin-bottom: 0;
}
@media (max-width: 768px) {
  .about-text {
    text-align: center;
    padding: 0 1rem;
  }
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
.skill-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 0.85rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.skill-logo {
  border-radius: 12px;
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.skill-dots {
  display: flex;
  flex-direction: row;
  gap: 0.35rem;
  align-items: center;
}
.skill-dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-block;
}
.footer {
  width: 100%;
  padding: 1.5rem 1rem;
  margin-top: 0rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
}
.footer-tagline {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.95rem;
  margin-top: 0.8rem;
  letter-spacing: 0.03em;
}
@media (max-width: 768px) {
  .footer-tagline {
    font-size: 0.88rem;
    line-height: 1.5;
  }
}
.footer-copy {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  margin-top: 1.5rem;
}
@media (max-width: 768px) {
  .footer-copy {
    padding: 0 0.5rem;
  }
}
.projects {
  width: 100%;
  max-width: 1200px;
  margin: 6rem auto;
  margin-bottom: 0rem;
  padding: 0 2rem;
}
@media (max-width: 768px) {
  .projects {
    margin: 4rem auto 0;
    padding: 0 1rem;
  }
}
.reels {
  --reel-gap: 1rem;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
  padding: 2.5rem 0;
  background: rgba(0, 0, 0, 0.3);
}
.reels::before,
.reels::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}
.reels::before {
  left: 0;
  background: linear-gradient(to right, #000 0%, transparent 100%);
}
.reels::after {
  right: 0;
  background: linear-gradient(to left, #000 0%, transparent 100%);
}
@media (max-width: 768px) {
  .reels {
    --reel-gap: 0.75rem;
    padding: 2rem 0;
  }
  .reels::before,
  .reels::after {
    width: 48px;
  }
}
.reels-title {
  text-align: center;
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-family: "Impact", sans-serif;
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}
.reels-track {
  display: flex;
  gap: var(--reel-gap);
  width: max-content;
  animation: marquee 36s linear infinite;
  animation-play-state: running;
  will-change: transform;
}
@media (max-width: 768px) {
  .reels-track {
    animation-duration: 46s;
  }
}
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50% - (var(--reel-gap) / 2)));
  }
}
.reel {
  position: relative;
  width: clamp(124px, 42vw, 200px);
  aspect-ratio: 9/16;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  flex-shrink: 0;
  background: #0a0a0a;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  will-change: transform;
}
.reel:hover {
  border-color: rgba(66, 220, 255, 0.4);
  box-shadow: 0 0 24px rgba(66, 220, 255, 0.2), 0 8px 30px rgba(0, 0, 0, 0.5);
  transform: scale(1.04);
}
@media (max-width: 768px) {
  .reel {
    width: clamp(120px, 44vw, 160px);
  }
}
.reel-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.reel-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  opacity: 1;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.reel-overlay svg {
  width: 48px;
  height: 48px;
  fill: white;
  filter: drop-shadow(0 0 8px rgba(66, 220, 255, 0.7));
}
.tabs {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.7rem;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 1rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
@media (max-width: 768px) {
  .tabs {
    gap: 0.5rem;
    padding: 0.45rem;
    width: 100%;
    flex-wrap: wrap;
  }
}
.tab--active {
  background: rgba(66, 220, 255, 0.15);
  border: 1px solid rgba(66, 220, 255, 0.3);
  padding: 0.5rem 2rem;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 1;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(66, 220, 255, 0.2);
}
@media (max-width: 768px) {
  .tab--active {
    padding: 0.45rem 0.9rem;
  }
}
.tab--active::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  rgba(66, 220, 255, 0.1),
  rgba(120, 255, 215, 0.1));
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: -1;
  border-radius: 25px;
}
.tab--active:hover {
  opacity: 1;
  background: rgba(66, 220, 255, 0.2);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(66, 220, 255, 0.3);
  border: 1px solid rgba(66, 220, 255, 0.3);
  letter-spacing: 0.5px;
}
.tab--active:hover::before {
  transform: translateX(0);
}
.tab {
  background: transparent;
  border: none;
  padding: 0.5rem 2rem;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0.7;
  position: relative;
  overflow: hidden;
  box-shadow: none;
}
@media (max-width: 768px) {
  .tab {
    padding: 0.45rem 0.9rem;
  }
}
.tab::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
  rgba(66, 220, 255, 0.1),
  rgba(120, 255, 215, 0.1));
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: -1;
  border-radius: 25px;
}
.tab:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 15px rgba(66, 220, 255, 0.3);
  border: 1px solid rgba(66, 220, 255, 0.3);
  letter-spacing: 0.5px;
}
.tab:hover::before {
  transform: translateX(0);
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 0rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2rem;
  border-radius: 20px;
  width: 100%;
}
@media (max-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
  }
}
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: 1fr;
    padding: 1rem 0.75rem;
    gap: 1rem;
  }
}
.gallery-tile {
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  aspect-ratio: 1;
  background-color: rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease;
  border: 1px solid rgba(255, 255, 255, 0.06);
  will-change: transform;
}
.gallery-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: filter, transform;
}
.gallery-tile:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}
.gallery-tile:hover img {
  filter: grayscale(0%) brightness(1.05);
  transform: scale(1.05);
}
@media (max-width: 768px) {
  .gallery-tile {
    max-width: none;
    transform: none;
  }
  .gallery-tile:hover {
    transform: none;
  }
}
.videography {
  width: 100%;
  margin: 0 auto;
  padding: clamp(1rem, 2.5vw, 2rem) 0;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.videography-title {
  margin: 0;
  text-align: center;
  font-size: clamp(1.4rem, 3.4vw, 2.4rem);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.94);
  padding: 0 clamp(0.75rem, 2.5vw, 2rem);
}
.videography-list {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.videography-item {
  width: 100%;
  padding: 0 clamp(0.75rem, 2.5vw, 2rem);
}
.video-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  border-radius: 14px;
  padding: clamp(0.7rem, 1.8vw, 1rem);
  background: rgba(0, 0, 0, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
}
.video-frame {
  width: 100%;
  aspect-ratio: 16/9;
  background: black;
  border-radius: 10px;
  overflow: hidden;
}
.video-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: black;
}
.video-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  font-size: clamp(0.92rem, 1.6vw, 1rem);
  white-space: pre-line;
}
.contact {
  width: 100%;
  padding: 6rem 2rem;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.contact::before {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(600px, 80%);
  height: 1px;
  background: linear-gradient(90deg,
  transparent,
  rgba(66, 220, 255, 0.4),
  transparent);
}
@media (max-width: 768px) {
  .contact {
    padding: 4rem 1rem;
  }
}
.contact-form {
  width: 100%;
  max-width: 680px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
@media (max-width: 640px) {
  .contact-form {
    padding: 1.5rem;
    border-radius: 16px;
  }
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 560px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}
.input {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.3s ease, background 0.25s ease;
  width: 100%;
  box-sizing: border-box;
}
color: rgba(255, 255, 255, 0.18);
transition: opacity 0.2s ease;
}
color: rgba(255, 255, 255, 0.18);
transition: opacity 0.2s ease;
}
color: rgba(255, 255, 255, 0.18);
transition: opacity 0.2s ease;
}
.input::placeholder {
  color: rgba(255, 255, 255, 0.18);
  transition: opacity 0.2s ease;
}
opacity: 0.4;
}
opacity: 0.4;
}
opacity: 0.4;
}
.input:focus::placeholder {
  opacity: 0.4;
}
.input:focus {
  border-color: rgba(66, 220, 255, 0.55);
  box-shadow: 0 0 0 3px rgba(66, 220, 255, 0.1), 0 0 20px rgba(66, 220, 255, 0.07);
  background: rgba(66, 220, 255, 0.03);
}
.input:valid:not(:placeholder-shown) {
  border-color: rgba(76, 175, 80, 0.35);
}
.textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  font-size: 0.95rem;
  padding: 0.85rem 1rem;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.3s ease, background 0.25s ease;
  width: 100%;
  box-sizing: border-box;
  min-height: 160px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}
color: rgba(255, 255, 255, 0.18);
transition: opacity 0.2s ease;
}
color: rgba(255, 255, 255, 0.18);
transition: opacity 0.2s ease;
}
color: rgba(255, 255, 255, 0.18);
transition: opacity 0.2s ease;
}
.textarea::placeholder {
  color: rgba(255, 255, 255, 0.18);
  transition: opacity 0.2s ease;
}
opacity: 0.4;
}
opacity: 0.4;
}
opacity: 0.4;
}
.textarea:focus::placeholder {
  opacity: 0.4;
}
.textarea:focus {
  border-color: rgba(66, 220, 255, 0.55);
  box-shadow: 0 0 0 3px rgba(66, 220, 255, 0.1), 0 0 20px rgba(66, 220, 255, 0.07);
  background: rgba(66, 220, 255, 0.03);
}
.textarea:valid:not(:placeholder-shown) {
  border-color: rgba(76, 175, 80, 0.35);
}
.submit-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 50px;
  border: 1px solid rgba(66, 220, 255, 0.35);
  background: rgba(66, 220, 255, 0.1);
  color: #fff;
  font-size: 1rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease, letter-spacing 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: submit-pulse 2.5s ease-in-out infinite;
}
.submit-btn:hover:not(:disabled) {
  background: rgba(66, 220, 255, 0.18);
  box-shadow: 0 0 30px rgba(66, 220, 255, 0.2);
  letter-spacing: 0.1em;
}
.submit-btn:disabled {
  opacity: 0.6;
}
@keyframes submit-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(66, 220, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(66, 220, 255, 0);
  }
}



```
thank you
