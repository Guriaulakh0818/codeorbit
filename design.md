# CodeOrbit — Design System & Platform Architecture (design.md)

## 1. Vision & Core Philosophy
CodeOrbit is a **100% Free, Eye-Friendly, SEO-First, and Google AdSense-Monetized Computer Science Learning Platform** inspired by modern developer documentation (GeeksforGeeks, Mintlify, Stripe Docs, W3Schools).

### Core Pillars:
1. **Eye-Friendly Reading (Zero Eye Strain)**: Optimized for students studying long hours for university exams and placement interviews. Replaces harsh pitch-black backgrounds with soft, comfortable slate and warm neutral tones with high legibility.
2. **100% Free Forever**: No paywalls, no paid checkout flows, no locked modules.
3. **Bilingual Learning**: English + Hinglish (conversational Hindi-English) toggle for effortless conceptual clarity.
4. **AdSense & SEO Optimized**: Pre-configured responsive ad slots, JSON-LD structured schemas (`TechArticle`, `Course`, `BreadcrumbList`), and fast Core Web Vitals.

---

## 2. Eye-Friendly Color Palette & Design Tokens

### Backgrounds & Surfaces (Eye Comfort):
| Token | Hex / Class | Description / Use Case |
|---|---|---|
| **Canvas Background** | `#F8FAFC` (`bg-slate-50`) / `#0F172A` (Eye-care dark) | Soft, glare-free background designed for long study sessions |
| **Surface Primary (Card / Reader)** | `#FFFFFF` (`bg-white`) / `#1E293B` (`bg-slate-850`) | Clean content surface with subtle border separation |
| **Surface Secondary (Sidebar / Muted)** | `#F1F5F9` (`bg-slate-100`) / `#0F172A` | Sidebar background, module tree containers |
| **Borders & Dividers** | `#E2E8F0` (`border-slate-200`) / `#334155` (`border-slate-700`) | Subtle, elegant outlines with zero visual clutter |

### Typography & Readability:
| Element | Color | Font Family | Size / Weight |
|---|---|---|---|
| **Headings (H1, H2, H3)** | `#0F172A` (`text-slate-900`) / `#F8FAFC` | Plus Jakarta Sans | 800 Bold / Tight Tracking |
| **Body / Article Text** | `#334155` (`text-slate-700`) / `#E2E8F0` | Plus Jakarta Sans | 15px-16px, Relaxed 1.75 Line Height |
| **Code Snippets & Terminal** | `#0F172A` (`bg-slate-900 text-emerald-300`) | JetBrains Mono / Fira Code | 13px, High-contrast syntax |
| **Muted Metadata** | `#64748B` (`text-slate-500`) | Plus Jakarta Sans | 12px Mono/Regular |

### Subject Track Color Accents:
- 🌿 **Data Structures & Algorithms (DSA)**: Emerald (`#059669` / `#10B981`)
- ⚙️ **Operating Systems (OS)**: Amber / Orange (`#D97706` / `#F59E0B`)
- 🗄️ **DBMS & SQL**: Teal / Cyan (`#0D9488` / `#14B8A6`)
- 🌐 **Computer Networks**: Blue / Indigo (`#2563EB` / `#4F46E5`)
- 🏗️ **System Design & Distributed Systems**: Purple / Violet (`#7C3AED` / `#8B5CF6`)
- ☕ **Programming Languages (Java/Python/C++)**: Rose / Coral (`#E11D48` / `#F43F5E`)

---

## 3. Layout Architecture & Component Hierarchy

### A. Global Navigation (Navbar)
- Sticky top header with soft blur (`backdrop-blur-md`).
- Brand Logo with emerald badge (`FREE CS`).
- Global Search Bar with keyboard shortcut indicator (`⌘K` / `Ctrl+K`).
- "Tutorials" mega dropdown menu categorized by Computer Science tracks.
- Quick action buttons: "Verify Certificate", Student Profile, Admin Portal.

### B. GeeksforGeeks-Style 3-Column Tutorial Reader (`/courses/:slug/lessons/:lessonSlug`)
1. **Left Column (280px-320px)**:
   - Sticky syllabus navigation tree.
   - Module accordions (collapsible with smooth chevron animation).
   - In-track search filter.
   - Completed topic checkmarks (Green `✓`) & Hinglish indicators (`HI`).
2. **Center Column (Max 860px)**:
   - Breadcrumb navigation (`Home / Tutorials / Track / Lesson`).
   - Article title, reading time, track pill, and bilingual switch (`English` / `Hinglish 🇮🇳`).
   - High-readability prose with clean syntax-highlighted code blocks and one-click copy button.
   - Responsive in-article Google AdSense slot.
   - "Finished reading this topic?" completion tracker.
   - Previous / Next topic navigation buttons.
3. **Right Column (260px-280px)**:
   - Interactive "On This Page" scroll-spy Table of Contents.
   - Sticky AdSense sidebar unit (`300x250` / responsive).

### C. Homepage (`/`)
- Eye-friendly Hero section with subtle gradient backdrop and clear headline.
- Global search input for instant topic lookup.
- 6 Subject Track Cards with topic counts and direct syllabus links.
- "Why CodeOrbit" feature highlights (Bilingual Hinglish, Practice Quizzes, Verifiable Certs).
- Standard leaderboard, mid-feed, and footer AdSense placements.

### D. Subject Catalog (`/courses`)
- Track category filters (All, DSA, OS, DBMS, Networks, System Design, Languages).
- Responsive grid of subject cards with estimated study hours and module counts.

---

## 4. Google AdSense Monetization Standard
All ad units follow Google AdSense compliance policies:
- Explicit uppercase label: `ADVERTISEMENT`
- Non-intrusive, responsive containers that prevent layout shift (CLS).
- Placement slots:
  - `leaderboard`: Top of pages (`728x90` on desktop, `320x50` on mobile)
  - `sidebar`: Sticky right rail on tutorial reader (`300x250` / `300x600`)
  - `in_article`: Embedded between key conceptual sections
  - `footer_banner`: Bottom of pages above the footer

---

## 5. SEO & Structured Data Checklist
- Dynamic `<title>` and `<meta name="description">` per lesson and course.
- Canonical URL generation for duplicate prevention.
- JSON-LD Schemas:
  - `Course` schema for subject tracks.
  - `TechArticle` schema for individual lessons.
  - `BreadcrumbList` schema for search engine rich snippets.
