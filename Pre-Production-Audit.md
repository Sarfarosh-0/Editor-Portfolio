# Pre-Production Audit: Portfolio Website

Two parts. **Part A** is a prompt for your AI coding agent. **Part B** is the checklist the agent runs (and you can run by hand). Part C is the report format.

Use it after the build passes the PRD verification and **before** you deploy.

---

## Part A: Audit prompt (give this to the agent)

You are the release auditor for a Next.js (App Router, TypeScript, plain CSS, Framer Motion) one-page portfolio. The site was built from `Portfolio-PRD.md`. **Your job is to find and fix production defects. It is not to redesign.**

### Rules
1. **Do not change the design.** Layout, colors, type, spacing, animations and content structure stay exactly as the PRD specifies. If a fix would change anything visible, **stop and ask** first.
2. **Pre-approved hardening** (invisible to visitors): security headers, CSP, input validation, honeypot field (hidden), rate limiting, error boundaries, `noindex` while placeholders remain, accessibility attributes, performance fixes that don't alter the look.
3. **Do not add** features, sections, third-party services, or dependencies. Run audit tools with `npx` or globally; **do not add them to `package.json`**. If a fix needs a new service (for example a mail provider or a rate-limit store), name the options and ask.
4. **Evidence over opinion.** For every checklist item record the command or steps you ran and the actual result. No "looks fine". A check you could not run is **NOT RUN**, not PASS.
5. **Never print or commit secrets.** Do not paste `.env` values into the report.
6. **Ask a targeted question** (one sentence, section/file, options) when something is ambiguous or a fix needs a decision.

### Process
1. **Recon:** read `package.json`, `next.config.*`, `app/layout.tsx`, `app/api/**`, `content/content.ts`, `app/globals.css`, `.env*`, `.gitignore`. List every route, API handler, external origin (YouTube, image CDN, fonts), and env var.
2. **Build and static checks:** `npm ci`, `npx tsc --noEmit`, lint, `npm run build`, then `npm run start` and test against the **production build**, not `next dev`.
3. **Run Part B** section by section. Use a headless browser (Playwright or Chrome DevTools via `npx`) for responsive, loading, error, and no-JS tests.
4. **Fix** every Blocker and High finding that doesn't change the design. Re-run the failing checks after each fix.
5. **Report** using Part C. Do not say "ready to deploy" while any Blocker is open.

### Severity
- **Blocker:** must be fixed before production (security hole, broken page, data leak, placeholder content live, build fails).
- **High:** fix before launch unless the owner accepts the risk in writing.
- **Medium / Low:** log and schedule.

---

## Part B: Checklist

Mark each item **PASS / FAIL / N/A / NOT RUN** and attach evidence.

### B1. Build, code health, and release hygiene
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 1.1 | Clean install and build | `npm ci && npm run build` succeeds with no errors | Blocker |
| 1.2 | Types and lint | `tsc --noEmit` and the linter report 0 errors | High |
| 1.3 | No `console.log`/`debugger`/leftover `TODO` that isn't a PRD `TODO(confirm)` | Search the repo; only intended ones remain | Medium |
| 1.4 | Production runtime errors | Load every section on the production build; browser console shows 0 errors and 0 hydration warnings | High |
| 1.5 | **Placeholder leakage** | `grep -ri "PLACEHOLDER\|example\.com\|lorem\|Aashish"` returns nothing in the shipped content **or** the site is `noindex` (see 7.4) | Blocker |
| 1.6 | **Original-owner data removed** | Search for the reference site's owner name, handles, email, Cloudinary URLs, YouTube IDs, file names: 0 matches | Blocker |
| 1.7 | Single source of content | Components contain no literal copy, links, IDs; editing only `content/content.ts` updates the whole site | High |
| 1.8 | Environment config | Every env var documented in `.env.example` (no real values); production vars set in the host | High |
| 1.9 | Git hygiene | `.env*` ignored; no secrets in history (`git log -p` scan or `gitleaks` via `npx`) | Blocker |
| 1.10 | Bundle sanity | Check the build output size; no unexpectedly large client chunk (Framer Motion only where needed) | Medium |

### B2. Security
**Dependencies**
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 2.1 | `npm audit --omit=dev` | 0 critical/high, or each is documented as not exploitable | High |
| 2.2 | Lockfile committed; Next.js/React on a supported, patched version | Verified against the current release notes | High |

**HTTP headers** (test with `curl -sI <prod-url>` on the deployed or `next start` build)
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 2.3 | `Content-Security-Policy` | Present. Allows only needed origins: self, YouTube embeds (`frame-src https://www.youtube.com`), the image CDN, Google Fonts (if used), and the Next.js inline script nonce/hash. No `unsafe-eval` in production. Page still renders and animates with CSP enforced | High |
| 2.4 | `Strict-Transport-Security` | `max-age` ≥ 31536000 (HTTPS only) | High |
| 2.5 | `X-Content-Type-Options: nosniff` | Present | Medium |
| 2.6 | Clickjacking protection | `frame-ancestors 'none'` in CSP (or `X-Frame-Options: DENY`) | Medium |
| 2.7 | `Referrer-Policy` | `strict-origin-when-cross-origin` or stricter | Medium |
| 2.8 | `Permissions-Policy` | Camera, microphone, geolocation disabled unless used | Low |
| 2.9 | No `X-Powered-By` | Disabled (`poweredByHeader: false`) | Low |

**Contact form and API route** (`POST /api/contact`)
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 2.10 | **Server-side validation** | Rejects missing/empty fields, wrong types, invalid email, over-length input (set sane max lengths, e.g. name 100, email 254, subject 150, message 5000) with `400`. Client validation is not trusted | Blocker |
| 2.11 | **Header/email injection** | Newlines (`\r\n`) in name/email/subject cannot add mail headers or recipients | Blocker |
| 2.12 | **Output encoding / XSS** | Submitted text is never rendered unescaped (page, email HTML, logs). Try `<script>alert(1)</script>` and `"><img src=x onerror=alert(1)>` | Blocker |
| 2.13 | **Spam and abuse** | Hidden honeypot field; per-IP rate limit (returns `429`); body size limit; method allow-list (`GET` returns `405`) | High |
| 2.14 | Origin check | Rejects cross-site POSTs (check `Origin`/`Host`); no wildcard CORS | High |
| 2.15 | Secrets stay server-side | Mail/API keys are not `NEXT_PUBLIC_*`, not in the client bundle (`grep` the `.next/static` output) | Blocker |
| 2.16 | Error responses | Generic messages to the client; no stack traces, file paths, or provider errors leaked | High |
| 2.17 | Recipient address | Taken from server env, not from the request body | Blocker |
| 2.18 | Logging | No personal data or secrets written to logs beyond what is needed | Medium |

**Content and injection surfaces**
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 2.19 | JSON-LD injection | Built with `JSON.stringify` and `<` escaped (`<`) before `dangerouslySetInnerHTML`; try a title containing `</script><script>alert(1)` | Blocker |
| 2.20 | `dangerouslySetInnerHTML` | Only the JSON-LD use exists, or each other use is justified | High |
| 2.21 | `youtubeId` handling | Validated against `^[\w-]{11}$` before building the embed URL; bad values don't render an iframe | High |
| 2.22 | External links | `target="_blank"` links have `rel="noopener noreferrer"`; `href` schemes limited to `https:`, `mailto:`, relative (no `javascript:`) | High |
| 2.23 | Iframes | YouTube iframes keep the `allow` list from the PRD, `referrerPolicy`, and lazy loading; consider `youtube-nocookie.com` only if the owner approves | Medium |
| 2.24 | `next/image` remote patterns | `remotePatterns` lists only the real image host(s); no `**` wildcard hosts | High |
| 2.25 | Public folder | `public/` contains no source files, `.env`, notes, or the original owner's assets | High |
| 2.26 | Source maps | Production source maps are not publicly served unless intended | Low |
| 2.27 | Privacy | If analytics/cookies/trackers exist, a notice is shown. If none, confirm none are loaded (Network tab) | Medium |

### B3. Responsiveness and cross-device
Test the **production build** at **360, 390, 768, 820, 1024, 1280, 1440 and 1920 px**, in portrait and landscape for phones and tablets.

| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 3.1 | No horizontal scroll | `document.documentElement.scrollWidth <= innerWidth` at every width. **Watch the full-bleed reels band (`100vw`) and the scrollbar width** | High |
| 3.2 | Breakpoint behavior matches PRD section 7 | Column counts, paddings, nav wrap, hover rules off on touch | High |
| 3.3 | Nav at 360px | Pill wraps cleanly, all 3 items tappable, not covered by content or the notch | High |
| 3.4 | Touch targets | Interactive elements ≥ 44×44 px effective (nav, tabs, socials, submit) | Medium |
| 3.5 | Mobile browser chrome | `min-height:100vh` doesn't cause jumpy layout with the address bar. Check iOS Safari and Android Chrome; if it jumps, use `dvh` only with the owner's OK since it touches specified CSS | Medium |
| 3.6 | Safe areas / notch | Fixed nav is not hidden under the notch in landscape | Medium |
| 3.7 | Zoom | Pinch zoom works (viewport allows up to 5×); 200% browser zoom has no overlap or clipped content | High |
| 3.8 | Browsers | Latest Chrome, Safari (macOS + iOS), Firefox, Edge. Check `backdrop-filter` (needs `-webkit-` prefix on older Safari), gradient text, `aspect-ratio`, `clamp()` | High |
| 3.9 | Fonts | With **Impact absent** (macOS, Android) and with Instrument Serif failing to load, layout doesn't break or overflow; no flash of invisible text | Medium |
| 3.10 | Long content | Very long name, tagline, film description, 10+ socials, 20+ gallery images, 3-line tab labels: no overflow or overlap | High |
| 3.11 | Print / high contrast / forced colors | Not required by the PRD; note only | Low |

### B4. Loading and performance
Run Lighthouse (`npx lighthouse <url> --preset=desktop` and mobile) on the **production** URL, 3 runs each, and use throttled "Slow 4G" + 4× CPU for mobile.

| # | Check | Target | Sev |
|---|---|---|---|
| 4.1 | Lighthouse mobile | Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 | High |
| 4.2 | Core Web Vitals (lab) | LCP ≤ 2.5s, CLS ≤ 0.1, TBT ≤ 200ms (INP ≤ 200ms in manual test) | High |
| 4.3 | LCP element | The hero photo is `priority`/preloaded and sized (`sizes` per PRD) | High |
| 4.4 | Layout shift | Every image/video/iframe reserves space (explicit dimensions, `aspect-ratio`, `fill` in a sized parent); lazy sections keep their fallback `min-height` | High |
| 4.5 | Reels | 12 autoplaying videos (6 × 2) don't tank the page: `preload="metadata"`, small files (aim ≤ 1–2 MB each), offscreen reels paused or cheap to decode. Check CPU and memory on a mid-range phone | High |
| 4.6 | About GIF | File size reasonable (aim ≤ 2 MB). If large, ask the owner before converting to video (visual change risk) | Medium |
| 4.7 | Images | Served as AVIF/WebP via `next/image`; no image served far larger than displayed | Medium |
| 4.8 | Fonts | Loaded with `next/font` (self-hosted, `display: swap`); no layout shift on swap | Medium |
| 4.9 | Third parties | YouTube iframes are `loading="lazy"` and don't load until near the viewport | Medium |
| 4.10 | Caching | Static assets served with long-lived immutable cache headers; HTML revalidated | Medium |
| 4.11 | Throttled and offline | On Slow 3G, text and layout appear first, media fills in later; offline shows the browser's error, not a broken half-page | Medium |

### B5. Errors, resilience, and failure states
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 5.1 | **JavaScript disabled / slow to load** | **Entrance animations start at `opacity:0`.** With JS off or before hydration, the page must not be a blank black screen. Confirm content is readable (for example via a `<noscript>` style that resets the start states, or SSR-safe initial state). Fix without changing the animated look | Blocker |
| 5.2 | Error boundary | `app/error.tsx` and `app/not-found.tsx` exist, match the dark theme, and offer a way back. A thrown error in one section doesn't blank the page | High |
| 5.3 | 404 | `/does-not-exist` returns HTTP 404 with the custom page | Medium |
| 5.4 | Broken image | A missing/404 image shows the neutral dark background, not a broken-image icon or collapsed layout (use `onError` fallback, or background color) | Medium |
| 5.5 | Broken video | A video that fails to load shows the card (`#0a0a0a`) with the overlay; the marquee still loops | Medium |
| 5.6 | YouTube blocked/offline | Iframe area stays 16:9 and the description still shows | Medium |
| 5.7 | **Form states** | Submit: disabled + `opacity:.6` while sending; success message announced; failure message shown; the user's text is **kept** after a failure; double-click doesn't send twice | High |
| 5.8 | Form failure modes | Test: server `500`, `429`, network offline, request timeout (client has a timeout), invalid JSON | High |
| 5.9 | API route resilience | Malformed body, huge body, wrong content-type: returns a clean 4xx, never crashes the server | High |
| 5.10 | Empty data | Empty arrays for reels, films, socials, gallery category, skills: the block hides or renders cleanly, no crash, no empty frame | High |
| 5.11 | Missing optional fields | Missing `poster`, `external`, social icon type, or `showAvailability: false`: no crash | Medium |
| 5.12 | Hydration | No hydration mismatch from dynamic values (the footer year, `window` access, random values) | High |
| 5.13 | Reduced motion | With `prefers-reduced-motion: reduce`, marquee, float, shimmer, pulses, and entrance offsets are off and all content is still visible | High |
| 5.14 | Tab switching | Rapidly clicking tabs doesn't glitch, stack, or lose images; keyboard arrows/Enter work | Medium |

### B6. Edge cases and input abuse
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 6.1 | Form inputs | Test: empty, whitespace-only, 1 char, max length +1, emoji, non-Latin scripts (Hindi, Arabic), RTL text, pasted HTML, SQL-like strings, very long unbroken string, leading/trailing spaces | High |
| 6.2 | Email validation | Accepts `a+tag@sub.example.co.in`; rejects `a@b`, `a b@c.com`, `a@b..com` | Medium |
| 6.3 | Autofill and password managers | Autofill fills name/email without breaking styles (`autocomplete` values per PRD) | Low |
| 6.4 | Hash navigation | Loading `/#projects` and `/#contact` scrolls to the right section even though Projects/Contact are lazy-loaded; nav highlight is correct on load | High |
| 6.5 | Fixed nav overlap | After a nav click or hash load, the section heading isn't hidden under the fixed nav | Medium |
| 6.6 | Back/forward, refresh mid-scroll | Scroll restoration works; no replayed-animation glitch | Low |
| 6.7 | Autoplay restrictions | On iOS Low Power Mode or with autoplay blocked, reels show a poster/dark card gracefully | Medium |
| 6.8 | Rapid resize / rotate | No broken layout after resizing across breakpoints without reload | Medium |
| 6.9 | Date and locale | Footer year is correct (also across New Year, server vs client time zone) | Low |
| 6.10 | Slow device | Marquee stays smooth (no jank) on a throttled CPU | Medium |

### B7. Accessibility, SEO, and metadata
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 7.1 | Automated a11y | `axe` (via Playwright/`npx`) reports 0 serious/critical issues | High |
| 7.2 | Keyboard | Every control reachable by Tab in a logical order; visible focus ring; no keyboard trap; tabs/nav operable with the keyboard | High |
| 7.3 | Screen reader pass | Landmarks, one `h1`, heading order, `alt` text, form labels, `aria-live` form status, iframe titles, social-link names, `aria-current` on nav | High |
| 7.4 | **Indexing control** | If any placeholder remains: `noindex` (`robots` meta + `X-Robots-Tag`) and a blocking `robots.txt`. When real content is live, flip to indexable | Blocker |
| 7.5 | Core metadata | Unique `<title>`, description, canonical URL = the real domain, `lang="en"`, theme-color | High |
| 7.6 | Social previews | OG/Twitter tags valid, image URLs absolute and reachable, 1200×630 image; check with a share debugger | Medium |
| 7.7 | Structured data | JSON-LD parses and validates (Rich Results / schema.org validator) and contains no original-owner data | Medium |
| 7.8 | `robots.txt`, `sitemap.xml`, favicon, `site.webmanifest`, `llms.txt` (if linked) | Each URL returns 200 and valid content; no dead `<link>` | Medium |
| 7.9 | Contrast | Body copy meets WCAG AA. The muted tiers specified by the PRD (`.4–.55` white) are **reported**, not silently changed; the owner decides | Medium |
| 7.10 | Link check | Every internal and external link returns 200 (or the expected `mailto:`/placeholder) | Medium |

### B8. Deployment readiness
| # | Check | Pass criteria | Sev |
|---|---|---|---|
| 8.1 | Production env | Env vars set; mail provider verified; test message actually arrives at the **owner's** inbox and isn't marked spam | Blocker |
| 8.2 | HTTPS and domain | Valid certificate, `www`/apex redirect to one canonical host, HTTP → HTTPS | High |
| 8.3 | Preview vs production | Preview deploys are `noindex` and don't send real email to the owner | Medium |
| 8.4 | Rollback | Previous deployment can be restored in one step; the owner knows how | Medium |
| 8.5 | Monitoring | Error tracking or at least host logs reviewed; uptime check optional | Low |
| 8.6 | Handover | README explains: edit `content/content.ts`, replace `public/placeholders` and `public/assets/reels`, set env vars, deploy | Medium |
| 8.7 | Final smoke test on the live URL | Home loads, all sections visible, each nav item works, a reel plays, a tab switches, a film plays, the form sends | Blocker |

---

## Part C: Report format (the agent returns this)

1. **Verdict:** `READY` / `READY WITH ACCEPTED RISKS` / `NOT READY`, with a one-line reason.
2. **Open Blockers and Highs:** table of ID, finding, evidence, fix status.
3. **Full results:** the Part B tables with PASS / FAIL / N/A / NOT RUN and evidence (command, output excerpt, screenshot path).
4. **Fixes made:** file and change, and confirmation that no visual design changed.
5. **Questions for the owner:** every decision you need (new services, visual-impacting fixes, risk acceptance).
6. **Not run:** list of checks that could not be run and why.

**Definition of done:** zero open Blockers, zero open Highs (or each accepted in writing), the production build re-tested after the last fix, and the live-URL smoke test (8.7) passed.
