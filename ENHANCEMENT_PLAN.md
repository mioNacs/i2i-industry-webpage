# 🚀 i2i Industries Website — Enhancement Plan

> Based on MoM (Feb 5, 2026), codebase audit, and PPT recommendations
> **Target:** `improved-i2i/` folder | **Stack:** Next.js 16 + Tailwind v4 + React 19

---

## 📋 Table of Contents

1. [Bugs & Technical Debt (from current codebase)](#1-bugs--technical-debt)
2. [UI/UX Enhancements (from MoM)](#2-uiux-enhancements)
3. [Architecture Improvements](#3-architecture-improvements)
4. [Milestone Breakdown](#4-milestone-breakdown)
5. [File-by-File Migration Map](#5-file-by-file-migration-map)

---

## 1. 🐛 Bugs & Technical Debt

### Critical Bugs

| # | Bug | File | Details |
|---|-----|------|---------|
| B1 | **Navbar NOT sticky** | `navbar.tsx` | Navbar has no `sticky top-0` or `fixed` positioning. Users lose navigation when scrolling. |
| B2 | **Phone field accepts non-numeric input** | `contact_us_button.tsx`, `apply_course_button.tsx` | Phone `<input type="tel">` allows any characters. Validation only fires on submit, not on keypress. Needs `inputMode="numeric"` + pattern restriction or live masking. |
| B3 | **FAQ accordion items don't collapse** | `faq.tsx` | Uses DaisyUI `collapse` with `<input type="radio">` — clicking the same item again doesn't collapse it (radio buttons can't be unchecked). Should use `type="checkbox"` or custom toggle logic. |
| B4 | **Exposed API credentials** | `client.tsx` | Contentful `space` and `accessToken` are hardcoded as plain strings in source code (line 23-24). Must move to environment variables. |
| B5 | **Marquee animation only scrolls one direction, then gaps** | `job_partners.tsx`, `placements.tsx` | Marquee animations (`animate-marquee`) translate from 0% to -100% but don't clone the items for seamless infinite scroll — causes visible gap. |
| B6 | **Direct DOM manipulation in React** | `navbar.tsx` | Uses `document.getElementById()` and `classList.replace()` for toggling mobile menu — anti-pattern in React. Should use `useState`. |
| B7 | **Missing `key` prop warning potential** | `job_card.tsx` | `MarkdownComponents` object defines component overrides without proper typing — `children` prop is implicitly `any`. |
| B8 | **`className` in HTML string (hero.tsx)** | `hero.tsx` L76 | `highlightWords()` returns `<span className=...>` but `html-react-parser` may not convert `className` → will render as literal HTML attribute in some cases. Should return JSX or use `class` in the raw HTML string. |
| B9 | **Duplicate form logic** | `contact_us_button.tsx` + `apply_course_button.tsx` | Nearly identical form validation/state/submission logic duplicated across ~300 lines each. Should extract shared form hook/component. |
| B10 | **No error boundaries** | All pages | No error boundaries exist. A Contentful API failure will crash the entire page. |
| B11 | **No loading states for client components** | `navbar.tsx`, `testimonials.tsx` | Components fetch data in `useEffect` but show nothing while loading. No skeleton/spinner. |
| B12 | **Course page single dialog ID conflict** | `apply_course_button.tsx` | Uses `document.getElementById("apply_modal")` — if multiple `ApplyButton` instances render, they share the same DOM ID. |
| B13 | **`opacity-6` typo** | `tech_partners.tsx` L38 | `opacity-6` is not a valid Tailwind class. Should be `opacity-60`. |

### Code Quality Issues

| # | Issue | Details |
|---|-------|---------|
| Q1 | **No TypeScript strict mode** | `tsconfig.json` doesn't enforce strict null checks |
| Q2 | **No SEO meta tags per page** | Only root layout has metadata; individual pages (About, Jobs, Course) lack `<title>` and `<description>` |
| Q3 | **No `alt` text with student names** | `placements.tsx` — all student images have generic `"student icon"` alt text |
| Q4 | **Images not using `sizes` prop** | Many `<Image>` components missing `sizes` for responsive optimization |
| Q5 | **No 404 page** | Missing custom `not-found.tsx` |
| Q6 | **Unused `geistMono` font loaded** | Loaded in `layout.tsx` but barely used |
| Q7 | **`getContentfulData` wrapper is unused indirection** | `client.tsx` defines `getContentfulData` which just calls `fetchGraphQL` — unnecessary layer |

---

## 2. 🎨 UI/UX Enhancements (from MoM + PPT)

### 2A. Layout Modernization

| # | Enhancement | Current State | Target |
|---|-------------|--------------|--------|
| U1 | **Bulleted text for course cards** | Course cards show paragraphs | Convert to concise bullet points with icons |
| U2 | **Bulleted text for "Preferred Choice"** | `why_choose_us.tsx` shows long paragraphs | Break into scannable bullet points |
| U3 | **Visual elements over text-heavy sections** | Text walls throughout | Add icons, illustrations, progress bars, metrics |
| U4 | **Clearer course breakdowns** | Basic list of learning points | Add module count badges, duration pills, difficulty tags |

### 2B. Enhanced Interactivity

| # | Enhancement | Current State | Target |
|---|-------------|--------------|--------|
| I1 | **Hover effects on cards** | Cards are static (`courses.tsx`, `why_choose_us.tsx`, `mentors.tsx`) | Add `hover:scale-105`, `hover:shadow-xl`, smooth transitions, border color changes |
| I2 | **Scroll-triggered animations** | No scroll animations anywhere | Add fade-in, slide-up animations using Intersection Observer or `framer-motion` |
| I3 | **Image/card popups** | Photos section (`photos.tsx`) shows flat grid | Add lightbox/modal popup on image click |
| I4 | **Strong CTA buttons replacing links** | "Learn More" on course cards is a plain `btn-link` | Replace with prominent `btn-primary` with arrow icons |
| I5 | **Animated stats counters** | Stats are static text | Add count-up animation when stats section enters viewport |
| I6 | **Testimonial auto-play** | Testimonial slider is manual only | Add auto-play with pause-on-hover |

### 2C. Modern Design (Glassmorphism + Aesthetics)

| # | Enhancement | Target |
|---|-------------|--------|
| D1 | **Glassmorphism navbar** | Semi-transparent backdrop-blur navbar with subtle border: `bg-white/70 backdrop-blur-xl border-b border-white/20` |
| D2 | **Gradient accents** | Replace flat primary color headers with subtle gradient text/backgrounds |
| D3 | **Rounded, softer card design** | Increase border-radius, add subtle shadows, use softer borders |
| D4 | **Better section spacing** | Standardize vertical rhythm: `py-20` → `py-24` with consistent gaps |
| D5 | **Modern typography scale** | Use clamp() for responsive font sizes; add letter-spacing to headings |

### 2D. Credibility Improvements

| # | Enhancement | Current State | Target |
|---|-------------|--------------|--------|
| C1 | **Company names in placements** | `placements.tsx` shows photos only, no company names | Add company name + role under each student photo |
| C2 | **Mentor experience details** | `mentors.tsx` shows name + short description | Add years of experience, company name, designation badges |
| C3 | **Student success metrics** | Basic "1000+ students" text | Add specific metrics: avg salary hike %, companies hired from, etc. |

### 2E. Functional Improvements

| # | Enhancement | Current State | Target |
|---|-------------|--------------|--------|
| F1 | **Sticky navbar** | Non-sticky | Fixed/sticky with scroll-aware shrink effect |
| F2 | **Phone field numeric restriction** | Accepts all characters | `inputMode="numeric"` + live validation |
| F3 | **Collapsible FAQ (proper toggle)** | Radio-based (can't un-collapse) | Checkbox-based or custom state toggle |
| F4 | **Direct "Apply" link in job cards** | Jobs say "email your resume" | Add direct apply button/link within each job description |
| F5 | **Mobile responsive polish** | Basic responsive but rough | Fine-tune breakpoints, touch targets, swipe gestures |
| F6 | **Back to top button** | None | Floating "back to top" button on scroll |

---

## 3. 🏗️ Architecture Improvements

### New Dependencies to Add
```
framer-motion          → Scroll animations, page transitions
@headlessui/react      → Accessible modals, dropdowns, transitions (replace raw DaisyUI)
clsx                   → Cleaner conditional classNames (alongside tailwind-merge)
react-intersection-observer → Scroll-triggered animations
lucide-react           → Modern, consistent icon set
```

### Folder Structure (improved-i2i)
```
improved-i2i/
├── app/
│   ├── layout.tsx                   # Root layout (glassmorphism navbar, footer)
│   ├── page.tsx                     # Home page
│   ├── not-found.tsx                # Custom 404
│   ├── error.tsx                    # Error boundary
│   ├── loading.tsx                  # Global loading
│   ├── globals.css                  # Tailwind v4 + custom utilities
│   ├── about/page.tsx
│   ├── course/
│   │   ├── page.tsx                 # All courses
│   │   └── [id]/
│   │       ├── page.tsx             # Single course
│   │       └── loading.tsx
│   ├── jobs/page.tsx
│   ├── privacy/page.tsx
│   └── terms/page.tsx
├── components/
│   ├── ui/                          # NEW: Reusable primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── section-header.tsx
│   │   ├── animated-counter.tsx
│   │   ├── lightbox.tsx
│   │   ├── skeleton.tsx
│   │   └── back-to-top.tsx
│   ├── forms/                       # NEW: Extracted shared form logic
│   │   ├── contact-form.tsx
│   │   ├── apply-form.tsx
│   │   └── form-field.tsx
│   ├── sections/                    # Page sections
│   │   ├── hero.tsx
│   │   ├── stats.tsx
│   │   ├── courses.tsx
│   │   ├── why-choose-us.tsx
│   │   ├── job-partners.tsx
│   │   ├── tech-partners.tsx
│   │   ├── mentors.tsx
│   │   ├── testimonials.tsx
│   │   ├── photos.tsx
│   │   ├── faq.tsx
│   │   ├── placements.tsx
│   │   └── cta-section.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-menu.tsx
│   │   └── whatsapp-button.tsx
│   └── job/
│       ├── job-card.tsx
│       └── job-description.tsx
├── lib/
│   ├── contentful/
│   │   ├── client.ts                # API client (env vars!)
│   │   ├── queries.ts               # GraphQL queries
│   │   └── types/                   # Type definitions
│   ├── utils.ts                     # cn(), formatDate, etc.
│   └── constants.ts                 # Social links, etc.
├── hooks/                           # NEW: Custom hooks
│   ├── use-intersection.ts
│   ├── use-scroll-direction.ts
│   └── use-form.ts
├── public/                          # Static assets
│   ├── icons/
│   ├── certificates/
│   └── students/
├── .env.local                       # Contentful keys (NEVER committed)
└── .env.example                     # Template for env vars
```

### Key Architectural Changes

1. **Environment Variables** — Move Contentful credentials to `.env.local`
2. **Separate GraphQL queries** — Extract from client into `queries.ts`
3. **Shared form hook** — `useForm()` hook to eliminate duplication
4. **Component decomposition** — Split large components into smaller, testable units
5. **UI primitives** — Reusable `SectionHeader`, `Card`, `Button` components
6. **Error boundaries** — Per-route and global error handling
7. **Loading states** — Skeleton components for async sections
8. **Proper React state** — Replace all `document.getElementById` with React state

---

## 4. 📅 Milestone Breakdown

### Milestone 1: Foundation & Bug Fixes (Priority: HIGH)
> **Goal:** Set up improved-i2i project structure, fix all critical bugs

- [ ] Project scaffolding (folder structure, dependencies, Tailwind v4 config)
- [ ] Environment variables setup (`.env.local` + `.env.example`)
- [ ] Contentful client with env vars + error handling
- [ ] Sticky glassmorphism navbar with React state (no DOM manipulation)
- [ ] Fix phone input numeric restriction
- [ ] Fix FAQ collapse/expand behavior
- [ ] Fix marquee infinite scroll (clone items)
- [ ] Fix `className` vs `class` in hero highlight function
- [ ] Fix `opacity-6` typo
- [ ] Add error boundaries + loading states
- [ ] Add custom 404 page
- [ ] Per-page SEO metadata

### Milestone 2: UI/UX Overhaul (Priority: HIGH)
> **Goal:** Implement all visual/interaction improvements from MoM

- [ ] Glassmorphism navbar design
- [ ] Hover effects on all cards (courses, mentors, why-choose-us)
- [ ] Scroll-triggered fade-in/slide-up animations
- [ ] Animated stats counter (count-up on viewport entry)
- [ ] Course cards redesign (bullet points, badges, strong CTAs)
- [ ] "Why Choose Us" section with icons + bullet points
- [ ] Photo lightbox/modal popup
- [ ] Testimonial auto-play with pause-on-hover
- [ ] Back-to-top floating button
- [ ] Modern typography + gradient accents
- [ ] Standardized spacing and section rhythm

### Milestone 3: Credibility & Content (Priority: MEDIUM)
> **Goal:** Fill credibility gaps identified in MoM

- [ ] Placements section: Add company names + roles under student photos
- [ ] Mentors section: Add experience years, company, designation badges
- [ ] Job cards: Add direct "Apply" button/link
- [ ] Student success metrics (avg salary hike, etc.)
- [ ] Better alt text for all images

### Milestone 4: Mobile & Performance (Priority: MEDIUM)
> **Goal:** Polish mobile experience and optimize performance

- [ ] Mobile menu as slide-in drawer (not raw classList toggle)
- [ ] Touch-friendly swipe for testimonial slider
- [ ] Responsive font sizes with `clamp()`
- [ ] Image optimization (proper `sizes` on all `<Image>`)
- [ ] Remove unused font imports
- [ ] Lazy load below-fold sections
- [ ] Lighthouse audit & fixes

### Milestone 5: Code Quality (Priority: LOW-MEDIUM)
> **Goal:** Long-term maintainability

- [ ] Extract shared form logic into `useForm` hook
- [ ] Extract reusable UI primitives (Button, Card, SectionHeader)
- [ ] TypeScript strict mode
- [ ] Separate GraphQL queries file
- [ ] Add JSDoc comments to utility functions
- [ ] Component unit tests (optional)

---

## 5. 📁 File-by-File Migration Map

| Original File | → New Location | Key Changes |
|---------------|---------------|-------------|
| `src/app/layout.tsx` | `app/layout.tsx` | Glassmorphism navbar, env vars, Poppins font, error boundary |
| `src/app/page.tsx` | `app/page.tsx` | Import from new paths, add scroll animations wrapper |
| `src/app/globals.css` | `app/globals.css` | Tailwind v4 syntax, custom scrollbar, animation utilities |
| `src/components/navbar/navbar.tsx` | `components/layout/navbar.tsx` | Sticky, glassmorphism, React state (no DOM), scroll-aware |
| `src/components/navbar/dropdown.tsx` | `components/layout/navbar.tsx` (merged) | Headless UI dropdown |
| `src/components/navbar/cta_section.tsx` | `components/sections/cta-section.tsx` | Better CTA design |
| `src/components/hero.tsx` | `components/sections/hero.tsx` | Fix highlight function, add animations |
| `src/components/stats.tsx` | `components/sections/stats.tsx` | Animated counter |
| `src/components/courses.tsx` | `components/sections/courses.tsx` | Bullet points, hover, strong CTA |
| `src/components/why_choose_us.tsx` | `components/sections/why-choose-us.tsx` | Bullet points, icons, hover |
| `src/components/job_partners.tsx` | `components/sections/job-partners.tsx` | Fix marquee seamless loop |
| `src/components/tech_partners.tsx` | `components/sections/tech-partners.tsx` | Fix opacity typo |
| `src/components/mentors.tsx` | `components/sections/mentors.tsx` | Add experience details, hover |
| `src/components/testimonials.tsx` | `components/sections/testimonials.tsx` | Auto-play, loading state |
| `src/components/photos.tsx` | `components/sections/photos.tsx` | Lightbox popup |
| `src/components/faq.tsx` | `components/sections/faq.tsx` | Fix collapse, animations |
| `src/components/placements.tsx` | `components/sections/placements.tsx` | Add company names, fix marquee |
| `src/components/contact_us_button.tsx` | `components/forms/contact-form.tsx` | Extract hook, fix phone |
| `src/components/apply_course_button.tsx` | `components/forms/apply-form.tsx` | Extract hook, fix phone, unique IDs |
| `src/components/job_card.tsx` | `components/job/job-card.tsx` | Add apply link, fix types |
| `src/components/footer.tsx` | `components/layout/footer.tsx` | Minor style updates |
| `src/components/Container.tsx` | `components/ui/container.tsx` | Keep as-is |
| `src/contentful/client.tsx` | `lib/contentful/client.ts` | Env vars, error handling |
| `src/contentful/types/*` | `lib/contentful/types/*` | Keep as-is |
| `src/constants/social_media.ts` | `lib/constants.ts` | Merge into single constants file |
| `src/company_assets.ts` | `lib/company-assets.ts` | Keep, rename |
| `src/student_assets.ts` | `lib/student-assets.ts` | Keep, rename |

---

## 6. 🎯 Priority Summary

```
🔴 CRITICAL (Do First)
   → Sticky navbar, Phone validation, FAQ collapse, API key exposure

🟠 HIGH (Milestone 1-2)
   → Glassmorphism, Hover effects, Scroll animations, Course card redesign

🟡 MEDIUM (Milestone 3-4)
   → Credibility data, Mobile polish, Performance optimization

🟢 LOW (Milestone 5)
   → Code quality, Testing, Documentation
```

---

*Plan created: February 6, 2026*
*Based on: MoM (Feb 5, 2026) + Full Codebase Audit*
