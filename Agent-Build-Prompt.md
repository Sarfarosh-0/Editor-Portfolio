# Build Prompt: Portfolio Website (for AI coding agent)

You are building a one-page portfolio website from a written specification. **Your job is faithful implementation, not design.** Read this prompt fully, then read the attached spec fully, before writing any code.

## 1. Inputs

- **`Portfolio-PRD.md`** (attached): the PRD / specification. It contains sections 0–13 and **Appendix A (the exact reference CSS)**.
- If the user supplies a second document describing the same website, treat both as the spec. If they conflict, **stop and ask** (see section 5).

**Source of truth, in order:** (1) this prompt's section 2 and section 6 (errata and pre-approved decisions), (2) the PRD, (3) Appendix A CSS. Nothing outside these may override them.

## 2. Pre-approved decisions (do NOT ask about these)

PRD **section 12** lists 14 items that the reference could not reveal (gallery tabs, skill dots, hover on the hero photo, nav tracking, contact form handling, fonts, entrance timing, stack, and so on). **The user has approved every default in that table.** Implement each default exactly as written, tag it with `// TODO(confirm):`, and move on. Do not expand any of them.

Also pre-approved:
- The `prefers-reduced-motion` rule in PRD section 6.
- Loading Instrument Serif through `next/font/google` (PRD section 12, item 12).
- Dev tooling that ships with the stack (TypeScript, ESLint, Next.js scaffolding).

## 3. Non-negotiables

1. **Read everything first.** Read the whole PRD, including Appendix A, before starting.
2. **The PRD is the source of truth.** Build exactly what it specifies: pages and sections, layouts, components, typography, colors, spacing and sizing, visual elements, interactions, animations and transitions, responsive behavior, content/data structure, and every other requirement it states.
3. **Do not redesign, simplify, reinterpret, remove, or replace** any requirement.
4. **Do not add** features, sections, technologies, dependencies, or design elements the PRD doesn't specify. The PRD's exclusion list in section 0 (Experience, Education, Certifications, blog, theme toggle, cursor effects, preloader, lightbox, modals) is binding.
5. **Use Appendix A as the stylesheet.** Do not rewrite it from memory or "clean it up". Keep `-webkit-text-fill-color: transparent` and `-webkit-background-clip: text` exactly as they are.
6. **Personal info = placeholders.** Everything personal lives in `content/content.ts` (PRD section 8) using its exact structure. Components contain no literal copy, names, links, IDs, or image paths. The user must be able to replace the placeholders later **without changing structure or components**.
7. **Follow the PRD's technical requirements:** Next.js (App Router) + TypeScript, plain global CSS, Framer Motion, `next/image`, `next/font`, and the suggested file structure in section 1.
8. **Keep the code modular and maintainable:** one component per section, a reusable `Reveal` wrapper, data-driven rendering, brief meaningful comments.

## 4. Work plan

Do these in order. Track them with a task list.

1. **Read & checklist.** Read the PRD. Build a numbered checklist of every requirement (sections 2–11 plus section 12 defaults). You will verify against it at the end.
2. **Scaffold.** Next.js App Router + TypeScript, install only `framer-motion` beyond the defaults. Create the folder structure from PRD section 1.
3. **Content layer.** Write `content/content.ts` verbatim from PRD section 8 (including types and `placeholderImages`).
4. **Assets.** Create the neutral placeholder files from PRD section 9: flat grey labelled SVGs ("PLACEHOLDER N"), a dark animated or static `about-bg.gif`, favicon, manifest, and reel placeholders at `public/assets/reels/reel-N.mp4`. Generate the `.mp4` files with `ffmpeg` if it is available. If not, rely on the PRD's `poster` fallback and tell the user.
5. **Global CSS.** Put Appendix A in `app/globals.css`, then add the base styles from the errata (section 6 below).
6. **Layout & metadata.** `app/layout.tsx`: fonts, `<html>` classes, all metadata, and JSON-LD generated from data (PRD section 11).
7. **Components, in DOM order:** `Nav` → `Hero` → `AboutIntro` → `AboutDetails` → `Reels` → `GalleryTabs` → `Videography` → `Contact` → `Footer`, plus `Reveal`. Lazy-load Projects and Contact as the PRD says.
8. **Behavior.** Entrance animations, marquee (list rendered twice), moving nav pill, tab switching, form validation and submit stub, per PRD sections 4, 6 and 12.
9. **Responsive pass** at the breakpoints in PRD section 7.
10. **Verify** (section 7 below). Fix every deviation, then re-verify.

## 5. Ambiguity protocol

**Do not assume.** If the PRD is unclear, incomplete, or contradicts itself in a way that affects the implementation, **stop and ask one targeted question** before continuing. Format:

> **Question:** one sentence.
> **Where:** PRD section and line.
> **Options:** A / B (and what each would change).

Rules:
- Ask only about **real** ambiguity not already covered by section 2 (pre-approved) or section 6 (errata).
- Batch related questions, but do not stop work that doesn't depend on the answer.
- Never "fix" the PRD silently. If you notice an error, say so and ask.

## 6. Errata and addendum to the PRD (binding)

Appendix A was extracted from the reference's generated stylesheet. These inline styles and base rules were **not** in it, and they are required.

**Base styles (add to `globals.css`)**
```css
*, *::before, *::after { box-sizing: border-box; }
html { height: 100%; background: #000; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { margin: 0; min-height: 100%; display: flex; flex-direction: column; }
button { font: inherit; }
img, video { max-width: 100%; }
```

**Layout wrappers**
- Hero inner wrapper: `display:flex; flex-direction:column; align-items:center; width:100%`.
- Spacer between the fixed nav and hero: `height: 80px`.
- Hero social row wrapper sits inside the same reveal block as the `.socials` container.
- Lazy fallbacks: Projects `min-height: 60vh`, Contact `min-height: 40vh`.

**Hero tagline line 2:** `color: rgba(66,220,255,0.6); font-size: 0.9em`.

**About title accent span:** add `padding-right: 0.5rem` ("myself").

**Contact heading block**
- Wrapper: `text-align:center; margin-bottom:4rem` (reveal from `opacity:0, translateY(20px)`).
- `h2`: `font-family:"Impact",sans-serif; font-size:clamp(2rem,5vw,3.5rem); letter-spacing:0.04em; color:#fff; margin:0; line-height:1`.
- Accent word: `font-family:"Instrument Serif",serif; font-style:italic; font-weight:400; color:rgba(66,220,255,0.85)`.
- Subtext `p`: `margin-top:1rem; color:rgba(255,255,255,0.45); font-size:clamp(0.9rem,1.5vw,1rem); max-width:420px; margin-inline:auto; line-height:1.6`.
- Form entrance: `opacity:0, translateY(30px)`.

**Element attributes**
- Reel `<video>`: `autoPlay loop muted playsInline preload="metadata"`.
- Film `<iframe>`: `src=https://www.youtube.com/embed/<id>?enablejsapi=1`, `loading="lazy"`, `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`, `referrerPolicy="strict-origin-when-cross-origin"`, `allowFullScreen`.
- About image: `sizes="(max-width: 768px) 100vw, 50vw"`. Skill logos: `width=50 height=50`.
- Skill dot initial state: `opacity:0; background:rgba(255,255,255,0.08); transform:translateY(6px) scale(0.75)`.

**Clarifications**
- The "Aashish" name placeholder in PRD 4.5 is sample data from the reference. Use the generic `"Your name"` from `content.ts`.
- PRD 4.4(c): film titles are **not** rendered as visible text, only as the iframe `title`. Keep `title` in the data model.

## 7. Verification (required before you say "done")

Compare the finished site against the PRD **requirement by requirement**, using the checklist from step 1.

**Run:**
- `tsc --noEmit`, the linter, and `next build`. All must pass with no errors.
- A headless-browser pass (tooling outside the project's dependencies; do not add it to `package.json`) at **1440, 1024, 768 and 390 px**. Capture screenshots and inspect them.

**Verify each of these and record pass/fail:**
1. Every section exists, in this order: Nav, Hero, About (banner + details), Projects (Reels, tabs/gallery, Videography), Contact, Footer. Nothing extra.
2. Layout matches PRD sections 3, 4 and 7 at every breakpoint (column counts, paddings, nav wrap, hover rules off on mobile).
3. Visual styling matches: colors, fonts, sizes, radii, glass/blur, shadows, gradients, shimmer text visible.
4. Interactions work: nav smooth-scroll and moving pill, tab switching, tile/reel/tab/social hovers, input focus/valid states, form disabled-while-sending, `aria-live` message.
5. Animations run: entrance reveals, float, ring pulse, status pulse, shimmer, caret blink, marquee (seamless loop), submit pulse. Reduced-motion disables them.
6. **Placeholder swap test:** edit only `content/content.ts` (change text, add/remove a social, reel, category, film, skill) and confirm the whole site, including `<head>` meta and JSON-LD, updates with **zero** component edits.
7. **Leakage check:** search the project for the original owner's name, handles, email, Cloudinary URLs and YouTube IDs. There must be **no matches** outside intended placeholders.
8. **No unsupported additions:** diff against the PRD's exclusion list and confirm no extra sections, dependencies (other than `framer-motion`), or design changes.
9. Accessibility items in PRD section 10 are met.
10. Every `// TODO(confirm):` marks a PRD section 12 default and nothing else.

**Fix every deviation, then re-run the failing checks.** Do not declare completion with open deviations. If a deviation can only be resolved by changing the PRD, ask (section 5).

## 8. Final report (keep it short)

1. **Requirement matrix:** table of requirement → pass/fail → note.
2. **Deviations fixed** during verification.
3. **Open items:** anything you could not complete or had to ask about.
4. **How to customize:** one paragraph. "Edit `content/content.ts`; replace files under `public/placeholders` and `public/assets/reels`."

## 9. Definition of done

The site builds cleanly, matches the PRD at all four widths, every checklist item passes, the placeholder swap test passes with only `content.ts` edits, and nothing was added or redesigned.
