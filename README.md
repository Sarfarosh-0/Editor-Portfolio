# 🎬 Editor & Photographer Portfolio

A modern, high-performance portfolio website built with **Next.js**, **React 19**, **TypeScript**, and **Framer Motion**. Designed specifically for video editors, photographers, and videographers to showcase their visual work with a sleek dark aesthetic and fluid animations.

---

## ✨ Features

- **🎯 Dynamic Hero Section**: Profile avatar with subtle floating rings, live availability indicator, and quick-access social links.
- **🎞️ Infinite Reels Marquee**: Smooth, auto-scrolling loop of vertical 9:16 video reels with hover-pause and playback optimizations.
- **📸 Photography Gallery**: Filterable photo showcase categorized by style and shoot type with interactive views.
- **🎥 Featured Videography**: Highlight reel and client video showcase with modal video player / embedded views.
- **💻 About & Skills**: Interactive software stack matrix (Premiere Pro, After Effects, DaVinci Resolve, Lightroom, Photoshop, etc.).
- **📬 Interactive Contact Section**: Integrated contact form and inquiry system connected to Next.js API routes.
- **⚡ Centralized Content Management**: All personal details, project lists, copy, and media paths are configured in a single file (`content/content.ts`).
- **📱 Fully Responsive**: Optimized for ultra-smooth 60 FPS performance on both mobile screens and desktop displays.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS (Global Design System & Tokens)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Linting**: ESLint

---

## 📁 Project Structure

```text
Editor-Portfolio/
├── app/                  # Next.js App Router (pages, layout, global styles, API)
│   ├── api/contact/      # Contact form endpoint
│   ├── globals.css       # Design tokens, typography & CSS variables
│   ├── layout.tsx        # Root layout & SEO metadata
│   └── page.tsx          # Main single-page portfolio layout
├── components/           # Reusable UI sections & components
│   ├── Hero.tsx          # Hero header & social links
│   ├── Reels.tsx         # Vertical reels continuous marquee
│   ├── GalleryTabs.tsx   # Photography category tabs & grid
│   ├── Videography.tsx   # Featured film showcase & video players
│   ├── AboutIntro.tsx    # Bio & background
│   ├── AboutDetails.tsx  # Software skill indicators
│   ├── Contact.tsx       # Contact form & call-to-action
│   ├── Nav.tsx           # Floating navigation pill
│   └── Footer.tsx        # Bottom footer & copyright
├── content/
│   └── content.ts        # Central configuration for all portfolio content
├── public/               # Static assets (images, reels, icons, logos)
│   ├── assets/           # Video reels, photo gallery, images
│   └── icons/            # SVG icons
└── CONTENT-UPDATE-GUIDE.md # Detailed guide for asset compression & updates
```

---

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have **Node.js** (v18.18+ or later) installed on your machine.

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/Editor-Portfolio.git
cd Editor-Portfolio
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory by copying the example:

```bash
cp .env.example .env.local
```

Configure your contact form recipient email:

```env
CONTACT_RECIPIENT_EMAIL=your-email@example.com
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to preview the site.

---

## 📝 Updating Your Content

All content can be updated without touching layout code:

1. Open **`content/content.ts`** to update:
   - Personal bio, name, and role title
   - Social media links (Instagram, Email, GitHub, etc.)
   - Reels video sources and titles
   - Photography categories and gallery images
   - Videography / YouTube video links
   - Software skill proficiency levels
2. Place your media files inside the **`public/assets/`** directory:
   - `public/assets/reels/` for vertical MP4 clips
   - `public/assets/gallery/` for photos
   - `public/assets/images/` for profile and about images

> 💡 **Tip**: For guidelines on video compression (FFmpeg) and optimal image dimensions, refer to [CONTENT-UPDATE-GUIDE.md](./CONTENT-UPDATE-GUIDE.md).

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
