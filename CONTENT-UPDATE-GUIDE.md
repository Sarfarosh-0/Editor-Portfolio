# Production Content & Asset Management Guide

This guide details how to update your personal information, upload media assets, and transition the portfolio into a production-ready state based directly on the app's current implementation.

---

## 1. How to Edit and Update Your Details

In this application, **all text, links, metadata, and data arrays are controlled by a single file**:
👉 **`content/content.ts`**

You do not need to modify any React components or styles to update your content.

### Overview of `content/content.ts` Structure:

```ts
export const content = {
  site: { ... },      // Global metadata, SEO, domain, title, OG image
  nav: [ ... ],       // Navigation pill items and scroll targets
  hero: { ... },      // Profile avatar, name, role, location, social links
  about: { ... },     // About intro, background GIF, bio, software skills
  projects: {
    reels: [ ... ],             // Marquee vertical short videos
    galleryCategories: [ ... ], // Photography categories & gallery photos
    films: [ ... ],             // Featured YouTube films & descriptions
  },
  contact: { ... },   // Contact form labels, subtext, recipient email
  footer: { ... },    // Tagline and copyright sign-off line
};
```

---

## 2. Asset Storage Locations

All public assets are served directly from the `public/` directory:

| Asset Type | Storage Directory | Recommended Format & Sizing |
|---|---|---|
| **Profile Photo (Hero)** | `public/assets/images/` or `public/placeholders/` | `profile.jpg` or `.webp`, square 1:1 (min. 600×600 px). Displayed in the circular floating ring. |
| **About Section Photo** | `public/assets/images/` | `about.jpg` or `.webp`, 4:3 or 16:9 (approx. 800×600 px). Slides in from the left on scroll. |
| **About Animated Background** | `public/placeholders/about-bg.gif` | Animated `.gif` (target size ≤ 1.5–2 MB to preserve fast page loading). Full-bleed background under dark overlay. |
| **Software Skill Logos** | `public/placeholders/` or `public/icons/` | Vector `.svg` or transparent `.png` (50×50 px). |
| **Reels (Vertical Videos)** | `public/assets/reels/` | `.mp4` format (H.264), **9:16 vertical aspect ratio** (e.g., 720×1280 or 1080×1920), muted, web-optimized (1–2 MB each). |
| **Gallery Photographs** | `public/assets/gallery/` | `.jpg` or `.webp`, square 1:1 or centered crop (approx. 800×800 px). Displayed in 3-column interactive grid. |
| **Social / Custom Icons** | `public/icons/` | Vector `.svg` (30×30 px). Built-in icons exist for Instagram, Facebook, Email, and CV. |
| **Open Graph (Social Share)** | `public/placeholders/og-image.svg` | `og-image.jpg` or `.png`, exactly **1200×630 px**. |
| **Favicons** | `public/favicon.ico`, `public/favicon.svg` | Browser favicon & bookmark icons. |

---

## 3. How to Upload and Manage Media Assets

### A. Reels / Video Optimization
The Reels marquee displays 6 unique videos (duplicated in DOM to produce an infinite continuous loop, totaling 12 playing nodes). To maintain 60 FPS and avoid memory stalls on mobile devices:
1. **Compress Videos:** Use HandBrake, FFmpeg, or an online compressor to compress `.mp4` files to **≤ 1–2 MB** each.
2. **Remove Audio Track:** Reels autoplay in `muted` mode. Stripping unnecessary audio tracks saves ~30% file size:
   ```bash
   ffmpeg -i input.mp4 -an -vcodec libx264 -crf 26 -pix_fmt yuv420p output.mp4
   ```
3. **Save Location:** Place your 6 reels in `public/assets/reels/`:
   - `reel-1.mp4`, `reel-2.mp4`, `reel-3.mp4`, `reel-4.mp4`, `reel-5.mp4`, `reel-6.mp4`

### B. Gallery Photos
1. Create a folder: `public/assets/gallery/`
2. Group files logically by category (e.g., `wildlife-1.jpg`, `portrait-1.jpg`, `fashion-1.jpg`, `concert-1.jpg`).
3. Maintain high quality at modest file size by exporting in **WebP** or **JPEG (quality 80–85%)**. Next.js `Image` automatically handles responsive sizing and lazy decoding.

### C. Featured YouTube Films
You do not upload video files for the Featured Videography section. The app embeds them via standard YouTube iframes using valid 11-character YouTube video IDs (e.g. `dQw4w9WgXcQ` from `https://www.youtube.com/watch?v=dQw4w9WgXcQ`).

---

## 4. Production Readiness Checklist: What Needs to be Configured

Before deploying to production, complete the following configurations:

### 1. Enable Search Engine Indexing (Flip `noindex`)
While using placeholder content, search engine crawlers are blocked. Once your real information is in place:
1. In `app/layout.tsx` (around lines 46–48), change:
   ```ts
   // Change from false to true:
   robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
   ```
2. In `public/robots.txt`, change:
   ```txt
   User-agent: *
   Allow: /
   ```

### 2. Configure Environment Variables
Create a `.env.local` file (or set variables in your hosting provider such as Vercel/Netlify):
```env
# Email where contact form submissions will be routed:
CONTACT_RECIPIENT_EMAIL=yourname@yourdomain.com
```

### 3. Update Supplementary SEO & Manifest Files
- **`public/site.webmanifest`**: Update `name` and `short_name`.
- **`public/llms.txt`**: Update your name, summary, and service offerings for AI indexing agents.

---

## 5. Complete Data & Content Checklist

Use this checklist to gather all required text and assets before updating `content/content.ts`:

### Section 1: Global Site & SEO (`site`)
- [ ] **Full Name** (`ownerName`, e.g., `"Jane Doe"`)
- [ ] **Short Name** (`ownerShort`, e.g., `"Jane"`)
- [ ] **Production Domain URL** (`url`, e.g., `"https://janedoe.com"`)
- [ ] **Site Title** (`title`, e.g., `"Jane Doe | Photographer & Cinematographer"`)
- [ ] **Meta Description** (`description`, 1–2 sentence summary)
- [ ] **SEO Keywords** (`keywords`, array of relevant search tags)
- [ ] **Social Media Handle** (`twitterHandle`, e.g., `"@janedoe"`)
- [ ] **OG Share Image** (`ogImage`, 1200×630 image file path)

### Section 2: Hero Section (`hero`)
- [ ] **Profile Photo** (square photo file path and accessible `alt` text)
- [ ] **Availability Status** (`showAvailability: true/false`, e.g., `"available for work"`)
- [ ] **First Name** (`firstName`, styled in bold Impact font)
- [ ] **Last Name** (`lastName`, styled in shimmering italic Instrument Serif font)
- [ ] **Primary Role Line** (`roleLine`, e.g., `"Photographer • Cinematographer • Colorist"`)
- [ ] **Location Line** (`locationLine`, e.g., `"Based in Mumbai, India"`)
- [ ] **Social Links** (URLs and labels for Instagram, Facebook, Email, and CV PDF)

### Section 3: About Section (`about`)
- [ ] **Banner Heading Lead** (`titleLead`, default `"More about"`)
- [ ] **Banner Accent Word** (`titleAccent`, default `"myself"`)
- [ ] **Short Tagline / Intro** (`intro`, 1 concise statement)
- [ ] **About Profile Image** (high-res photo file path and `alt` text)
- [ ] **Background GIF** (cinematic loop file path)
- [ ] **Bio Paragraph** (`paragraph`, ending with `"Software Skills in"`)
- [ ] **Software Skills** (list of up to 5–6 applications, their logos, and proficiency rating from 1 to 5)

### Section 4: Projects - Reels (`projects.reels`)
- [ ] **6 Vertical Video Files** (`.mp4`, 9:16 aspect ratio, stored in `public/assets/reels/`)
- [ ] **Accessible Labels** for each reel (e.g., `"Monsoon in the Western Ghats"`)

### Section 5: Projects - Gallery (`projects.galleryCategories`)
- [ ] **Category Names** (e.g., `"Wildlife"`, `"Portraits"`, `"Fashion"`, `"Commercial"`)
- [ ] **Photos per Category** (recommended 6 photos per tab, with square aspect ratio and descriptive `alt` tags)

### Section 6: Projects - Featured Videography (`projects.films`)
- [ ] **4 Film Entries**:
  - [ ] YouTube Video ID (11-character ID from the video URL)
  - [ ] Film Title (used for accessibility and screen readers)
  - [ ] Film Description (multi-line summary; line breaks are preserved)

### Section 7: Contact Section (`contact`)
- [ ] **Heading Lead & Accent** (default `"Get in"`, `"touch"`)
- [ ] **Invitation Subtext** (e.g., `"Let's collaborate on your next visual story."`)
- [ ] **Destination Email** (`recipientEmail` where client inquiries should arrive)

### Section 8: Footer (`footer`)
- [ ] **Footer Tagline** (short motto or quote)
- [ ] **Sign-Off Statement** (e.g., `"All rights reserved. Crafted with care."`)
